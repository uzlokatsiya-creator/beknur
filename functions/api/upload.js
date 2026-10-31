import { json, checkAuth, noKV } from "../../lib/util.js";

const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };

// POST /api/upload (raw image body, admin only) -> { url: "/uploads/<key>" }
export async function onRequestPost({ request, env }) {
  if (!env.SITE) return noKV();
  if (!(await checkAuth(request, env))) return json({ error: "unauthorized" }, 401);
  const type = (request.headers.get("content-type") || "").split(";")[0];
  if (!TYPES[type]) return json({ error: "only jpg, png, webp, gif" }, 415);
  const buf = await request.arrayBuffer();
  if (!buf.byteLength) return json({ error: "empty" }, 400);
  if (buf.byteLength > 5 * 1024 * 1024) return json({ error: "max 5 MB" }, 413);
  const rnd = [...crypto.getRandomValues(new Uint8Array(5))].map((b) => b.toString(16).padStart(2, "0")).join("");
  const key = Date.now().toString(36) + "-" + rnd + "." + TYPES[type];
  await env.SITE.put("img:" + key, buf, { metadata: { type } });
  return json({ url: "/uploads/" + key });
}
