import crypto from "node:crypto";
import { store, json, checkAuth } from "../lib/util.mjs";

const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };

// POST /api/upload  (raw image body, admin only) -> { url: "/uploads/<key>" }
export default async (req) => {
  if (req.method !== "POST") return json({ error: "method" }, 405);
  if (!checkAuth(req)) return json({ error: "unauthorized" }, 401);
  const type = (req.headers.get("content-type") || "").split(";")[0];
  if (!TYPES[type]) return json({ error: "only jpg, png, webp, gif" }, 415);
  const buf = await req.arrayBuffer();
  if (!buf.byteLength) return json({ error: "empty" }, 400);
  if (buf.byteLength > 5 * 1024 * 1024) return json({ error: "max 5 MB" }, 413);
  const key = Date.now().toString(36) + "-" + crypto.randomBytes(5).toString("hex") + "." + TYPES[type];
  await store("images").set(key, buf, { metadata: { type } });
  return json({ url: "/uploads/" + key });
};

export const config = { path: "/api/upload" };
