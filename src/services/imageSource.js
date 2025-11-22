export async function randomImageDataUrl({ theme, width = 720, height = 320, apiBase }) {
  const base = apiBase || "http://localhost:8787";
  const seed = Date.now() + "-" + Math.floor(Math.random() * 100000);
  const url = `${base}/api/image?theme=${encodeURIComponent(theme || "random")}&w=${width}&h=${height}&seed=${seed}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("image_fetch_failed");
  const json = await res.json();
  if (!json || json.status !== "success" || !json.dataUrl) throw new Error("image_invalid");
  return json.dataUrl;
}