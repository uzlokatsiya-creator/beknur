import { json, makeToken, samePassword } from "../../lib/util.js";

// POST /api/login { password } -> { token }
export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PASSWORD) return json({ error: "ADMIN_PASSWORD is not set in Cloudflare Pages settings" }, 500);
  let body = {};
  try { body = await request.json(); } catch {}
  await new Promise((r) => setTimeout(r, 600)); // slows down password guessing
  if (!(await samePassword(body.password, env))) return json({ error: "wrong password" }, 401);
  return json({ token: await makeToken(env) });
}
