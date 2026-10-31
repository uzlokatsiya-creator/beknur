var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/api/content.js
var content_exports = {};
__export(content_exports, {
  onRequestGet: () => onRequestGet,
  onRequestPut: () => onRequestPut
});

// lib/util.js
var json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});
var enc = new TextEncoder();
var hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
async function hmac(secret, data) {
  const key = await crypto.subtle.importKey("raw", enc.encode("ismati-admin:" + secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}
function same(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
async function makeToken(env) {
  const exp = String(Date.now() + 7 * 24 * 3600 * 1e3);
  return exp + "." + await hmac(env.ADMIN_PASSWORD, exp);
}
async function checkAuth(request, env) {
  if (!env.ADMIN_PASSWORD) return false;
  const t = (request.headers.get("authorization") || "").replace(/^Bearer /, "");
  const [exp, sig] = t.split(".");
  if (!exp || !sig || Date.now() > +exp) return false;
  return same(sig, await hmac(env.ADMIN_PASSWORD, exp));
}
async function samePassword(input, env) {
  const a = hex(await crypto.subtle.digest("SHA-256", enc.encode(String(input || ""))));
  const b = hex(await crypto.subtle.digest("SHA-256", enc.encode(env.ADMIN_PASSWORD || crypto.randomUUID())));
  return same(a, b);
}
var noKV = () => json({ error: "KV binding SITE is not set in Cloudflare Pages settings" }, 500);

// server/api/content.js
async function onRequestGet({ env }) {
  if (!env.SITE) return json({ error: "empty" }, 404);
  const data = await env.SITE.get("content", { type: "json" });
  return data ? json(data) : json({ error: "empty" }, 404);
}
async function onRequestPut({ request, env }) {
  if (!env.SITE) return noKV();
  if (!await checkAuth(request, env)) return json({ error: "unauthorized" }, 401);
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "bad json" }, 400);
  }
  if (!data || typeof data !== "object" || !data.t || !Array.isArray(data.services) || !Array.isArray(data.prices))
    return json({ error: "invalid content" }, 400);
  const text = JSON.stringify(data);
  if (text.length > 1e6) return json({ error: "too large" }, 413);
  await env.SITE.put("content", text);
  return json({ ok: true });
}

// server/api/login.js
var login_exports = {};
__export(login_exports, {
  onRequestPost: () => onRequestPost
});
async function onRequestPost({ request, env }) {
  if (!env.ADMIN_PASSWORD) return json({ error: "ADMIN_PASSWORD is not set in Cloudflare Pages settings" }, 500);
  let body = {};
  try {
    body = await request.json();
  } catch {
  }
  await new Promise((r) => setTimeout(r, 600));
  if (!await samePassword(body.password, env)) return json({ error: "wrong password" }, 401);
  return json({ token: await makeToken(env) });
}

// server/api/upload.js
var upload_exports = {};
__export(upload_exports, {
  onRequestPost: () => onRequestPost2
});
var TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
async function onRequestPost2({ request, env }) {
  if (!env.SITE) return noKV();
  if (!await checkAuth(request, env)) return json({ error: "unauthorized" }, 401);
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

// server/api/lead.js
var lead_exports = {};
__export(lead_exports, {
  onRequestPost: () => onRequestPost3
});
var clean = (v, n) => String(v ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]).trim().slice(0, n);
async function onRequestPost3({ request, env }) {
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "bad json" }, 400);
  }
  if (b.company) return json({ ok: true });
  const name = clean(b.name, 80), phone = clean(b.phone, 30), service = clean(b.service, 120), message = clean(b.message, 800);
  if (!name || phone.replace(/\D/g, "").length < 7) return json({ error: "name and phone required" }, 400);
  const token = env.TELEGRAM_BOT_TOKEN;
  const chats = String(env.TELEGRAM_CHAT_ID || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!token || !chats.length) return json({ error: "Telegram is not configured" }, 500);
  const time = (/* @__PURE__ */ new Date()).toLocaleString("ru-RU", { timeZone: "Asia/Samarkand" });
  const text = [
    "\u{1FA7A} <b>Yangi ariza \u2014 saytdan</b>",
    `\u{1F464} <b>Ism:</b> ${name}`,
    `\u{1F4DE} <b>Telefon:</b> ${phone}`,
    service && `\u{1F489} <b>Xizmat:</b> ${service}`,
    message && `\u{1F4AC} <b>Izoh:</b> ${message}`,
    `\u{1F310} <b>Til:</b> ${clean(b.lang, 5).toUpperCase() || "-"}`,
    `\u{1F552} ${time}`
  ].filter(Boolean).join("\n");
  const results = await Promise.all(chats.map((chat_id) => fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id, text, parse_mode: "HTML", disable_web_page_preview: true })
  }).then((r) => r.ok).catch(() => false)));
  return results.some(Boolean) ? json({ ok: true }) : json({ error: "telegram failed" }, 502);
}

// server/uploads/[key].js
var key_exports = {};
__export(key_exports, {
  onRequestGet: () => onRequestGet2
});
async function onRequestGet2({ params, env }) {
  const key = String(params.key || "");
  if (!env.SITE || !/^[\w.-]+$/.test(key)) return new Response("Not found", { status: 404 });
  const r = await env.SITE.getWithMetadata("img:" + key, { type: "arrayBuffer" });
  if (!r || !r.value) return new Response("Not found", { status: 404 });
  return new Response(r.value, {
    headers: { "content-type": r.metadata?.type || "application/octet-stream", "cache-control": "public, max-age=31536000, immutable" }
  });
}

// worker-src.js
var ROUTES = { "/api/content": content_exports, "/api/login": login_exports, "/api/upload": upload_exports, "/api/lead": lead_exports };
var worker_src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let mod = ROUTES[url.pathname], params = {};
    if (!mod && url.pathname.startsWith("/uploads/")) {
      mod = key_exports;
      params.key = url.pathname.slice(9);
    }
    if (mod) {
      const m = request.method.charAt(0) + request.method.slice(1).toLowerCase();
      const h = mod["onRequest" + m];
      if (!h) return new Response("Method not allowed", { status: 405 });
      try {
        return await h({ request, env, params, ctx });
      } catch (e) {
        return new Response(JSON.stringify({ error: String(e?.message || e) }), { status: 500, headers: { "content-type": "application/json" } });
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  worker_src_default as default
};
