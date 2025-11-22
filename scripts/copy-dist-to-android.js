const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

const dist = path.join(__dirname, '..', 'dist');
const assets = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'assets');

if (!fs.existsSync(dist)) {
  console.error('dist/ 不存在，请先运行 npm run build');
  process.exit(1);
}

if (fs.existsSync(assets)) {
  fs.rmSync(assets, { recursive: true, force: true });
}
fs.mkdirSync(assets, { recursive: true });
copyDir(dist, assets);
console.log('已复制 dist/ 到 android/app/src/main/assets/');