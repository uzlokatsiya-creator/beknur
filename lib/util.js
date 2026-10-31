// Shared helpers for Cloudflare Pages Functions.
// env.SITE   — KV namespace (content + uploaded images)
// env.ADMIN_PASSWORD, env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID — secrets

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

const enc = new TextEncoder();
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey("raw", enc.encode("ismati-admin:" + secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

// constant-time string compare
function same(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

// Token = "<expiry>.<hmac>", valid 7 days. Changing ADMIN_PASSWORD logs everyone out.
export async function makeToken(env) {
  const exp = String(Date.now() + 7 * 24 * 3600 * 1000);
  return exp + "." + (await hmac(env.ADMIN_PASSWORD, exp));
}

export async function checkAuth(request, env) {
  if (!env.ADMIN_PASSWORD) return false;
  const t = (request.headers.get("authorization") || "").replace(/^Bearer /, "");
  const [exp, sig] = t.split(".");
  if (!exp || !sig || Date.now() > +exp) return false;
  return same(sig, await hmac(env.ADMIN_PASSWORD, exp));
}

export async function samePassword(input, env) {
  const a = hex(await crypto.subtle.digest("SHA-256", enc.encode(String(input || ""))));
  const b = hex(await crypto.subtle.digest("SHA-256", enc.encode(env.ADMIN_PASSWORD || crypto.randomUUID())));
  return same(a, b);
}

export const noKV = () => json({ error: "KV binding SITE is not set in Cloudflare Pages settings" }, 500);
