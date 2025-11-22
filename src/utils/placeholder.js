export function generatePlaceholder(theme) {
  const colors = {
    电影: ["#1677ff", "#52c41a"],
    文学: ["#722ed1", "#eb2f96"],
    人生感悟: ["#fa8c16", "#f5222d"],
  };
  const [c1, c2] = colors[theme] || ["#1677ff", "#d81e06"];
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="320">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="100%" height="100%" fill="url(#g)"/>
</svg>`;
  const b64 = typeof window !== "undefined" ? window.btoa(unescape(encodeURIComponent(svg))) : Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${b64}`;
}