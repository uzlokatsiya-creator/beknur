// Cloudflare Pages worker (built into site/_worker.js):
//   /, /uz/, /en/         server-rendered pages (SEO), content from KV merged over defaults
//   /sitemap.xml /robots.txt
//   /api/lead             booking form -> Telegram (personal chat + group)
//   /api/login, /api/verify, /api/logout   admin login: password + Telegram code (personal chat only)
//   /api/content          GET public content / PUT save (admin)
//   /api/upload           image upload (admin), served at /uploads/<key>
import DEFAULT from "./lib/default.json";
import { renderPage, renderService, LANGS, PATH, svcUrl } from "./lib/render.js";
import { json, checkAuth, makeToken, dropSession, samePassword, limited, hit, clearHits, tgSend, ids, ip, randHex, same, noKV } from "./lib/util.js";

const SEC = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "cross-origin-opener-policy": "same-origin",
};
const G = "https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.g.doubleclick.net https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net";
const csp = (nonce) => [
  "default-src 'self'",
  `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  `img-src 'self' data: blob: ${G} https://www.google.uz https://i.ytimg.com`,
  `connect-src 'self' ${G}`,
  "frame-src https://td.doubleclick.net https://www.googletagmanager.com https://www.youtube-nocookie.com",
  "frame-ancestors 'none'", "base-uri 'self'", "form-action 'self'", "object-src 'none'",
].join("; ");
const withSec = (res, extra = {}) => { const h = new Headers(res.headers); for (const [k, v] of Object.entries({ ...SEC, ...extra })) h.set(k, v); return new Response(res.body, { status: res.status, headers: h }); };

async function loadContent(env) {
  let saved = null;
  if (env.SITE) { try { saved = await env.SITE.get("content", { type: "json", cacheTtl: 60 }); } catch {} }
  if (!saved) return DEFAULT;
  // saved data wins, missing parts fall back to defaults (keeps the site working after updates)
  const out = { ...DEFAULT, ...saved, t: { ...DEFAULT.t, ...(saved.t || {}) } };
  for (const k of ["seo", "ads", "reviews", "contacts"]) out[k] = { ...(DEFAULT[k] || {}), ...(saved[k] || {}) };
  if (!Array.isArray(saved.services) || !saved.services.every((s) => s && s.slug)) out.services = DEFAULT.services; // old format -> new service pages
  if (!Array.isArray(saved.videos)) out.videos = DEFAULT.videos;
  return out;
}
const origin = (req, env) => (env.SITE_URL || new URL(req.url).origin).replace(/\/$/, "");
const clean = (v, n) => String(v ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c])).trim().slice(0, n);
const MAGIC = { "image/jpeg": [0xff, 0xd8, 0xff], "image/png": [0x89, 0x50, 0x4e, 0x47], "image/gif": [0x47, 0x49, 0x46], "image/webp": [0x52, 0x49, 0x46, 0x46] };
const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };

// ---------- API ----------
async function api(path, req, env) {
  const m = req.method;
  if (path === "/api/lead" && m === "POST") {
    if (!env.SITE) return noKV();
    const who = "lead:" + ip(req);
    if (await limited(env, who, 5, 600)) return json({ error: "too many" }, 429);
    let b; try { b = await req.json(); } catch { return json({ error: "bad json" }, 400); }
    if (b.company || (+b.t > 0 && +b.t < 2500)) return json({ ok: true }); // bot: hidden field filled or form sent too fast
    const name = clean(b.name, 80), phone = clean(b.phone, 30), service = clean(b.service, 120), message = clean(b.message, 800);
    if (name.length < 2 || phone.replace(/\D/g, "").length !== 12) return json({ error: "name and phone required" }, 400);
    await hit(env, who, 600);
    const src = b.src && typeof b.src === "object" ? Object.entries(b.src).slice(0, 7).map(([k, v]) => `${clean(k, 20)}=${clean(v, 80)}`).join(", ") : "";
    const text = ["🩺 <b>Yangi ariza — saytdan</b>", `👤 <b>Ism:</b> ${name}`, `📞 <b>Telefon:</b> ${phone}`,
      service && `💉 <b>Xizmat:</b> ${service}`, message && `💬 <b>Izoh:</b> ${message}`,
      `🌐 <b>Til:</b> ${clean(b.lang, 5).toUpperCase() || "-"}`, src && `📈 <b>Manba:</b> ${src}`,
      `🕒 ${new Date().toLocaleString("ru-RU", { timeZone: "Asia/Samarkand" })}`].filter(Boolean).join("\n");
    const ok = await tgSend(env, ids(env.TELEGRAM_CHAT_ID || "", env.TELEGRAM_GROUP_ID || ""), text);
    return ok ? json({ ok: true }) : json({ error: "telegram failed" }, 502);
  }

  if (path === "/api/login" && m === "POST") {
    if (!env.SITE) return noKV();
    if (!env.ADMIN_PASSWORD || !env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return json({ error: "ADMIN_PASSWORD / TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID sozlanmagan" }, 500);
    const who = "login:" + ip(req);
    if (await limited(env, who, 5, 900)) return json({ error: "Juda ko‘p urinish. 15 daqiqadan so‘ng qayta urinib ko‘ring." }, 429);
    let b = {}; try { b = await req.json(); } catch {}
    await new Promise((r) => setTimeout(r, 500));
    if (!(await samePassword(b.password, env))) { await hit(env, who, 900); return json({ error: "Parol noto‘g‘ri" }, 401); }
    const code = String(100000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 900000));
    const ch = randHex(16);
    await env.SITE.put("otp:" + ch, JSON.stringify({ code, ip: ip(req), tries: 0 }), { expirationTtl: 300 });
    // code goes ONLY to the personal chat, never to the group
    const sent = await tgSend(env, ids(env.TELEGRAM_CHAT_ID), `🔐 <b>Admin panelga kirish kodi:</b> <code>${code}</code>\n\nKod 5 daqiqa amal qiladi.\nIP: ${clean(ip(req), 45)}\nAgar bu siz bo‘lmasangiz — parolni darhol almashtiring.`);
    if (!sent) return json({ error: "Telegramga kod yuborib bo‘lmadi" }, 502);
    return json({ challenge: ch });
  }

  if (path === "/api/verify" && m === "POST") {
    if (!env.SITE) return noKV();
    const who = "login:" + ip(req);
    if (await limited(env, who, 5, 900)) return json({ error: "Juda ko‘p urinish. 15 daqiqadan so‘ng qayta urinib ko‘ring." }, 429);
    let b = {}; try { b = await req.json(); } catch {}
    const key = "otp:" + String(b.challenge || "").replace(/[^a-f0-9]/g, "");
    const rec = await env.SITE.get(key, { type: "json" });
    if (!rec) return json({ error: "Kod eskirgan. Qaytadan kiring." }, 410);
    if (rec.ip !== ip(req) || !same(String(b.code || "").replace(/\D/g, ""), rec.code)) {
      await hit(env, who, 900);
      rec.tries++;
      if (rec.tries >= 3) await env.SITE.delete(key); else await env.SITE.put(key, JSON.stringify(rec), { expirationTtl: 300 });
      return json({ error: rec.tries >= 3 ? "Kod 3 marta noto‘g‘ri. Qaytadan kiring." : "Kod noto‘g‘ri" }, 401);
    }
    await env.SITE.delete(key);
    await clearHits(env, who);
    await tgSend(env, ids(env.TELEGRAM_CHAT_ID), `✅ Admin panelga kirildi.\nIP: ${clean(ip(req), 45)}`);
    return json({ token: await makeToken(env) });
  }

  if (path === "/api/logout" && m === "POST") { if (env.SITE) await dropSession(req, env); return json({ ok: true }); }

  if (path === "/api/content") {
    if (m === "GET") {
      // full content for the admin panel only
      if (!(await checkAuth(req, env))) return json({ error: "unauthorized" }, 401);
      return json(await loadContent(env));
    }
    if (m === "PUT") {
      if (!env.SITE) return noKV();
      if (!(await checkAuth(req, env))) return json({ error: "unauthorized" }, 401);
      let data; try { data = await req.json(); } catch { return json({ error: "bad json" }, 400); }
      if (!data || typeof data !== "object" || !data.t || !Array.isArray(data.services) || !Array.isArray(data.prices)) return json({ error: "invalid content" }, 400);
      const text = JSON.stringify(data);
      if (text.length > 1_000_000) return json({ error: "too large" }, 413);
      const prev = await env.SITE.get("content");
      if (prev) await env.SITE.put("content:prev", prev); // one-step backup
      await env.SITE.put("content", text);
      return json({ ok: true });
    }
  }

  if (path === "/api/upload" && m === "POST") {
    if (!env.SITE) return noKV();
    if (!(await checkAuth(req, env))) return json({ error: "unauthorized" }, 401);
    const type = (req.headers.get("content-type") || "").split(";")[0];
    if (!EXT[type]) return json({ error: "faqat jpg, png, webp, gif" }, 415);
    const buf = await req.arrayBuffer();
    if (!buf.byteLength || buf.byteLength > 5 * 1024 * 1024) return json({ error: "rasm 5 MB dan kichik bo‘lsin" }, 413);
    const head = new Uint8Array(buf.slice(0, 4));
    if (!MAGIC[type].every((v, i) => head[i] === v)) return json({ error: "fayl rasm emas" }, 415);
    const key = Date.now().toString(36) + "-" + randHex(5) + "." + EXT[type];
    await env.SITE.put("img:" + key, buf, { metadata: { type } });
    return json({ url: "/uploads/" + key });
  }
  return json({ error: "not found" }, 404);
}

// ---------- worker ----------
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const p = url.pathname;
    try {
      if (p.startsWith("/api/")) return withSec(await api(p, req, env));

      if (p.startsWith("/uploads/")) {
        const key = p.slice(9);
        if (!env.SITE || !/^[\w.-]+$/.test(key)) return new Response("Not found", { status: 404 });
        const r = await env.SITE.getWithMetadata("img:" + key, { type: "arrayBuffer", cacheTtl: 86400 });
        if (!r || !r.value) return new Response("Not found", { status: 404 });
        return withSec(new Response(r.value, { headers: { "content-type": r.metadata?.type || "application/octet-stream", "cache-control": "public, max-age=31536000, immutable" } }));
      }

      if (p === "/ru" || p === "/ru/" || p === "/index.html") return Response.redirect(url.origin + "/", 301);
      if (p === "/uz" || p === "/en") return Response.redirect(url.origin + p + "/", 301);
      const lang = p === "/" ? "ru" : p === "/uz/" ? "uz" : p === "/en/" ? "en" : null;
      const sm = p.match(/^\/(?:(uz|en)\/)?xizmatlar\/([a-z0-9-]+)\/?$/);
      if (sm && (req.method === "GET" || req.method === "HEAD")) {
        const L = sm[1] || "ru", nonce = randHex(16);
        if (p.endsWith("/")) return Response.redirect(url.origin + p.slice(0, -1), 301);
        const html = renderService(await loadContent(env), L, sm[2], { origin: origin(req, env), nonce });
        if (!html) return withSec(new Response("Not found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } }));
        return withSec(new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=0, must-revalidate", "content-security-policy": csp(nonce), "content-language": L } }));
      }
      if (lang && (req.method === "GET" || req.method === "HEAD")) {
        const nonce = randHex(16);
        const html = renderPage(await loadContent(env), lang, { origin: origin(req, env), nonce });
        return withSec(new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=0, must-revalidate", "content-security-policy": csp(nonce), "content-language": lang } }));
      }

      if (p === "/sitemap.xml") {
        const o = origin(req, env), day = new Date().toISOString().slice(0, 10);
        const S = await loadContent(env);
        const page = (f) => { const a = LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${o + f(l)}"/>`).join("") + `<xhtml:link rel="alternate" hreflang="x-default" href="${o + f("ru")}"/>`; return LANGS.map((l) => `<url><loc>${o + f(l)}</loc><lastmod>${day}</lastmod>${a}</url>`).join(""); };
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${page((l) => PATH[l])}${(S.services || []).filter((s) => /^[a-z0-9-]+$/.test(s.slug || "")).map((s) => page((l) => svcUrl(l, s.slug))).join("")}</urlset>`;
        return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
      }
      if (p === "/robots.txt") return new Response(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${origin(req, env)}/sitemap.xml\n`, { headers: { "content-type": "text/plain; charset=utf-8" } });

      const res = await env.ASSETS.fetch(req);
      const extra = p.startsWith("/admin-ismati")
        ? { "x-robots-tag": "noindex, nofollow", "cache-control": "no-store", "content-security-policy": csp("x").replace(" 'nonce-x'", "") }
        : /\.(webp|png|jpg|svg|woff2?)$/.test(p) ? { "cache-control": "public, max-age=2592000" }
        : /\.(css|js)$/.test(p) ? { "cache-control": "public, max-age=86400" } : {};
      return withSec(res, extra);
    } catch (e) {
      return json({ error: "server error" }, 500);
    }
  },
};
