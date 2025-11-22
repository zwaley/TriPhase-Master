import movies from "../data/preset/movies.json";
import literature from "../data/preset/literature.json";
import quotes from "../data/preset/quotes.json";
import { getUsedIds, addUsedId, getDailyCache, setDailyCache } from "../utils/storage";

function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function stableNoise(idHash, salt) {
  const h = (idHash ^ salt) >>> 0;
  return (h % 1000) / 1000;
}

function scoreItem(it, used, salt) {
  const base = typeof it.score === "number" ? it.score : 0.5;
  const penalty = used.includes(it.id) ? 0.2 : 0;
  const noise = stableNoise(hash(it.id), salt) * 0.1;
  return base - penalty + noise;
}

export async function selectContent({ date, theme }) {
  const key = dateKey(date);
  const cached = getDailyCache(theme, key);
  if (cached) return cached;
  const map = { 电影: movies, 文学: literature, 人生感悟: quotes };
  const data = map[theme] || quotes;
  const items = data.items || [];
  if (!items.length) return null;
  const used = getUsedIds(theme);
  const salt = hash(key + theme);
  const ranked = items
    .map((it) => ({ it, s: scoreItem(it, used, salt) }))
    .sort((a, b) => b.s - a.s)
    .map((x) => x.it);
  const pick = ranked.find((it) => !used.includes(it.id)) || ranked[0];
  addUsedId(theme, pick.id);
  setDailyCache(theme, key, pick);
  return pick;
}

export function dateKeyString(date) {
  return dateKey(date);
}

export async function refreshContent({ date, theme }) {
  const key = dateKey(date);
  const map = { 电影: movies, 文学: literature, 人生感悟: quotes };
  const data = map[theme] || quotes;
  const items = data.items || [];
  if (!items.length) return null;
  const used = getUsedIds(theme);
  const salt = hash(key + theme + "|refresh");
  const ranked = items
    .map((it) => ({ it, s: scoreItem(it, used, salt) }))
    .sort((a, b) => b.s - a.s)
    .map((x) => x.it);
  const daily = getDailyCache(theme, key);
  const avoidId = daily ? daily.id : null;
  const pick = ranked.find((it) => !used.includes(it.id) && it.id !== avoidId) || ranked.find((it) => it.id !== avoidId) || ranked[0];
  addUsedId(theme, pick.id);
  return pick;
}