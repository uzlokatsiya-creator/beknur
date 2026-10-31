import crypto from "node:crypto";
import { getStore } from "@netlify/blobs";

// Local test mode keeps data in memory instead of Netlify Blobs.
const mem = new Map();
export function store(name) {
  if (process.env.LOCAL_STORE) {
    return {
      async get(k, o) { const v = mem.get(name + "/" + k); if (!v) return null; return o?.type === "json" ? JSON.parse(v.data) : v.data; },
      async getWithMetadata(k) { const v = mem.get(name + "/" + k); return v ? { data: v.data, metadata: v.metadata } : null; },
      async set(k, data, o) { mem.set(name + "/" + k, { data, metadata: o?.metadata || {} }); },
      async setJSON(k, obj) { mem.set(name + "/" + k, { data: JSON.stringify(obj), metadata: {} }); },
    };
  }
  return getStore({ name, consistency: "strong" });
}

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

function secret() {
  const p = process.env.ADMIN_PASSWORD;
  if (!p) throw new Error("ADMIN_PASSWORD is not set");
  return crypto.createHash("sha256").update("ismati-admin:" + p).digest();
}

// Token = "<expiry>.<hmac>", valid for 7 days. Changing ADMIN_PASSWORD logs everyone out.
export function makeToken() {
  const exp = Date.now() + 7 * 24 * 3600 * 1000;
  const sig = crypto.createHmac("sha256", secret()).update(String(exp)).digest("hex");
  return exp + "." + sig;
}

export function checkAuth(req) {
  try {
    const t = (req.headers.get("authorization") || "").replace(/^Bearer /, "");
    const [exp, sig] = t.split(".");
    if (!exp || !sig || Date.now() > +exp) return false;
    const good = crypto.createHmac("sha256", secret()).update(exp).digest("hex");
    return sig.length === good.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good));
  } catch {
    return false;
  }
}

export function samePassword(input) {
  const a = crypto.createHash("sha256").update(String(input || "")).digest();
  const b = crypto.createHash("sha256").update(process.env.ADMIN_PASSWORD || crypto.randomUUID()).digest();
  return crypto.timingSafeEqual(a, b);
}
