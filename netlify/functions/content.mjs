import { store, json, checkAuth } from "../lib/util.mjs";

// GET  /api/content  -> saved site content (404 until the admin saves once)
// PUT  /api/content  -> save content (admin only)
export default async (req) => {
  const s = store("site");
  if (req.method === "GET") {
    const data = await s.get("content", { type: "json" });
    return data ? json(data) : json({ error: "empty" }, 404);
  }
  if (req.method === "PUT") {
    if (!checkAuth(req)) return json({ error: "unauthorized" }, 401);
    let data;
    try { data = await req.json(); } catch { return json({ error: "bad json" }, 400); }
    if (!data || typeof data !== "object" || !data.t || !Array.isArray(data.services) || !Array.isArray(data.prices))
      return json({ error: "invalid content" }, 400);
    const text = JSON.stringify(data);
    if (text.length > 1_000_000) return json({ error: "too large" }, 413);
    await s.set("content", text);
    return json({ ok: true });
  }
  return json({ error: "method" }, 405);
};

export const config = { path: "/api/content" };
