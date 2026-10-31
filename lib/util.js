// Shared helpers for the Cloudflare worker.
// env.SITE — KV namespace (content, images, login challenges, rate limits)
// env.ADMIN_PASSWORD, env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID (personal), env.TELEGRAM_GROUP_ID (group)

export const json = (body, status = 200, extra = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra },
  });

const enc = new TextEncoder();
export const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
export const randHex = (n) => hex(crypto.getRandomValues(new Uint8Array(n)));

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey("raw", enc.encode("ismati-admin:" + secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}
export const sha = async (s) => hex(await crypto.subtle.digest("SHA-256", enc.encode(String(s))));

// constant-time compare of equal-length strings
export function same(a, b) {
  a = String(a); b = String(b);
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export const ip = (req) => req.headers.get("cf-connecting-ip") || "0.0.0.0";

// Session token = "<expiry>.<sessionId>.<hmac>", valid 12 hours, also checked against KV so logout/revoke works.
export async function makeToken(env) {
  const exp = String(Date.now() + 12 * 3600 * 1000), sid = randHex(12);
  await env.SITE.put("sess:" + sid, "1", { expirationTtl: 12 * 3600 });
  return `${exp}.${sid}.${await hmac(env.ADMIN_PASSWORD, exp + "." + sid)}`;
}

export async function checkAuth(request, env) {
  if (!env.ADMIN_PASSWORD || !env.SITE) return false;
  const t = (request.headers.get("authorization") || "").replace(/^Bearer /, "");
  const [exp, sid, sig] = t.split(".");
  if (!exp || !sid || !sig || Date.now() > +exp) return false;
  if (!same(sig, await hmac(env.ADMIN_PASSWORD, exp + "." + sid))) return false;
  return (await env.SITE.get("sess:" + sid)) === "1";
}

export async function dropSession(request, env) {
  const sid = (request.headers.get("authorization") || "").split(".")[1];
  if (sid && /^[a-f0-9]+$/.test(sid)) await env.SITE.delete("sess:" + sid);
}

export async function samePassword(input, env) {
  return same(await sha(input || ""), await sha(env.ADMIN_PASSWORD || crypto.randomUUID()));
}

// Simple KV rate limit: max `limit` hits per `windowSec` for a key.
export async function limited(env, key, limit, windowSec) {
  const k = "rl:" + key;
  const cur = (await env.SITE.get(k, { type: "json" })) || { n: 0, t: Date.now() };
  return cur.n >= limit;
}
export async function hit(env, key, windowSec) {
  const k = "rl:" + key;
  const cur = (await env.SITE.get(k, { type: "json" })) || { n: 0 };
  await env.SITE.put(k, JSON.stringify({ n: cur.n + 1 }), { expirationTtl: Math.max(60, windowSec) });
}
export const clearHits = (env, key) => env.SITE.delete("rl:" + key);

export async function tgSend(env, chatIds, text) {
  const token = env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatIds.length) return false;
  const res = await Promise.all(chatIds.map((chat_id) =>
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id, text, parse_mode: "HTML", disable_web_page_preview: true }),
    }).then((r) => r.ok).catch(() => false)));
  return res.some(Boolean);
}
export const ids = (...v) => [...new Set(v.join(",").split(",").map((s) => s.trim()).filter(Boolean))];

export const noKV = () => json({ error: "KV binding SITE is not set in Cloudflare Pages settings" }, 500);
