import { json, makeToken, samePassword } from "../lib/util.mjs";

export default async (req) => {
  if (req.method !== "POST") return json({ error: "method" }, 405);
  if (!process.env.ADMIN_PASSWORD) return json({ error: "ADMIN_PASSWORD is not set on Netlify" }, 500);
  let body = {};
  try { body = await req.json(); } catch {}
  // small delay makes password guessing slower
  await new Promise((r) => setTimeout(r, 600));
  if (!samePassword(body.password)) return json({ error: "wrong password" }, 401);
  return json({ token: makeToken() });
};

export const config = { path: "/api/login" };
