const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');

const port = 8787;
const origins = ['http://localhost:5173'];

function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return null; }
}

const base = path.join(__dirname, '..', 'src', 'data', 'preset');
const movies = readJson(path.join(base, 'movies.json')) || { items: [] };
const literature = readJson(path.join(base, 'literature.json')) || { items: [] };
const quotes = readJson(path.join(base, 'quotes.json')) || { items: [] };
const themeMap = { '电影': movies, '文学': literature, '人生感悟': quotes };

function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${da}`;
}

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const cache = new Map();
const limits = new Map();
const limitWindowMs = 60 * 1000;
const limitMax = 100;

function allow(ip) {
  const now = Date.now();
  const e = limits.get(ip);
  if (!e || now - e.start > limitWindowMs) { limits.set(ip, { start: now, count: 1 }); return true; }
  if (e.count >= limitMax) return false;
  e.count += 1; return true;
}

function cors(res, origin) {
  if (origins.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  else res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function get(urlStr) {
  return new Promise((resolve, reject) => {
    const lib = urlStr.startsWith('https') ? https : http;
    const req = lib.get(urlStr, (resp) => {
      let data = '';
      resp.on('data', (chunk) => (data += chunk));
      resp.on('end', () => resolve({ status: resp.statusCode, data }));
    });
    req.on('error', reject);
    req.setTimeout(4000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function getBinary(urlStr) {
  return new Promise((resolve, reject) => {
    const lib = urlStr.startsWith('https') ? https : http;
    const doReq = (u, redirectsLeft) => {
      const req = lib.get(u, (resp) => {
        if (resp.statusCode && resp.statusCode >= 300 && resp.statusCode < 400 && resp.headers && resp.headers.location && redirectsLeft > 0) {
          doReq(resp.headers.location, redirectsLeft - 1);
          return;
        }
        const chunks = [];
        resp.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        resp.on('end', () => resolve({ status: resp.statusCode, data: Buffer.concat(chunks), headers: resp.headers }));
      });
      req.on('error', reject);
      req.setTimeout(5000, () => { req.destroy(); reject(new Error('timeout')); });
    };
    doReq(urlStr, 3);
  });
}

async function fetchExternal(theme) {
  const map = {
    '电影': 'https://v1.hitokoto.cn/?c=h',
    '文学': 'https://v1.hitokoto.cn/?c=d',
    '人生感悟': 'https://v1.hitokoto.cn/?c=k'
  };
  const urlHitokoto = map[theme] || 'https://v1.hitokoto.cn/?c=k';
  try {
    const r = await get(urlHitokoto);
    if (r.status === 200) {
      const j = JSON.parse(r.data);
      const text = j.hitokoto || '';
      const source = j.from || 'hitokoto';
      if (text) return { text, source };
    }
  } catch (e) {}
  try {
    const tag = theme === '文学' ? 'wisdom' : (theme === '人生感悟' ? 'life' : 'famous-quotes');
    const r = await get(`https://api.quotable.io/random?tags=${encodeURIComponent(tag)}`);
    if (r.status === 200) {
      const j = JSON.parse(r.data);
      const text = j.content || '';
      const source = j.author || 'quotable';
      if (text) return { text, source };
    }
  } catch (e) {}
  return null;
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || '';
  cors(res, origin);
  if (req.method === 'OPTIONS') { res.statusCode = 204; res.end(); return; }
  const ip = req.socket.remoteAddress || 'unknown';
  if (!allow(ip)) { res.statusCode = 429; res.end(JSON.stringify({ status: 'error', message: 'rate_limited' })); return; }
  const u = url.parse(req.url, true);
  if (u.pathname === '/api/content') {
    const theme = u.query.theme || '人生感悟';
    const dateStr = u.query.date || dateKey(new Date());
    const ext = u.query.ext === '1';
    const refresh = u.query.refresh === '1';
    const key = `${theme}|${dateStr}|${ext ? 'ext' : 'local'}`;
    if (!refresh && cache.has(key)) { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ status: 'success', data: cache.get(key) })); return; }
    if (ext) {
      const ex = await fetchExternal(theme);
      if (ex && ex.text) {
        const pick = { id: `ext-${hash(ex.text)}`, text: ex.text, image: '', source: ex.source, license: 'unknown', score: 0.85, tags: [], lang: 'zh' };
        if (!refresh) cache.set(key, pick);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'success', data: pick }));
        return;
      }
    }
    const data = themeMap[theme] || quotes;
    const items = (data.items || []);
    if (!items.length) { res.statusCode = 404; res.end(JSON.stringify({ status: 'error', message: 'no_data' })); return; }
    const idx = hash(`${theme}|${dateStr}`) % items.length;
    const pick = items[idx];
    if (!refresh) cache.set(key, pick);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'success', data: pick }));
    return;
  }
  if (u.pathname === '/api/image') {
    const theme = u.query.theme || 'random';
    const w = Math.max(1, Math.min(4096, parseInt(u.query.w || '720', 10)));
    const h = Math.max(1, Math.min(4096, parseInt(u.query.h || '320', 10)));
    const seed = u.query.seed || `${Date.now()}`;
    const query = (u.query.query || '').trim();
    const urlImg = query
      ? `https://source.unsplash.com/${w}x${h}/?${encodeURIComponent(query)}`
      : `https://picsum.photos/seed/${encodeURIComponent(theme + '-' + seed)}/${w}/${h}`;
    try {
      const r = await getBinary(urlImg);
      if (r.status === 200 && r.data && r.data.length > 0) {
        const mime = (r.headers && (r.headers['content-type'] || r.headers['Content-Type'])) || 'image/jpeg';
        const b64 = r.data.toString('base64');
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'success', dataUrl: `data:${mime};base64,${b64}` }));
        return;
      }
    } catch (e) {}
    res.statusCode = 502;
    res.end(JSON.stringify({ status: 'error', message: 'image_fetch_failed' }));
    return;
  }
  res.statusCode = 404;
  res.end(JSON.stringify({ status: 'error', message: 'not_found' }));
});

server.listen(port);
