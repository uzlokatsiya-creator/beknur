import { json, checkAuth, noKV } from "../../lib/util.js";

// GET /api/content -> content saved from the admin panel (404 until first save)
export async function onRequestGet({ env }) {
  if (!env.SITE) return json({ error: "empty" }, 404);
  const data = await env.SITE.get("content", { type: "json" });
  return data ? json(data) : json({ error: "empty" }, 404);
}

// PUT /api/content -> save content (admin only)
export async function onRequestPut({ request, env }) {
  if (!env.SITE) return noKV();
  if (!(await checkAuth(request, env))) return json({ error: "unauthorized" }, 401);
  let data;
  try { data = await request.json(); } catch { return json({ error: "bad json" }, 400); }
  if (!data || typeof data !== "object" || !data.t || !Array.isArray(data.services) || !Array.isArray(data.prices))
    return json({ error: "invalid content" }, 400);
  const text = JSON.stringify(data);
  if (text.length > 1_000_000) return json({ error: "too large" }, 413);
  await env.SITE.put("content", text);
  return json({ ok: true });
}
