export async function randomImageDataUrl({ theme, query, width = 720, height = 320, apiBase }) {
  const base = apiBase || "http://localhost:8787";
  const seed = Date.now() + "-" + Math.floor(Math.random() * 100000);
  const q = query ? `&query=${encodeURIComponent(query)}` : `&theme=${encodeURIComponent(theme || "random")}`;
  const url = `${base}/api/image?w=${width}&h=${height}&seed=${seed}${q}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("image_fetch_failed");
  const json = await res.json();
  if (!json || json.status !== "success" || !json.dataUrl) throw new Error("image_invalid");
  return json.dataUrl;
}
