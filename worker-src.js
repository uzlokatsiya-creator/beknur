// Entry for the single-file Cloudflare Pages worker (site/_worker.js).
// Routes the API, everything else is served from static files.
import * as content from "./server/api/content.js";
import * as login from "./server/api/login.js";
import * as upload from "./server/api/upload.js";
import * as lead from "./server/api/lead.js";
import * as image from "./server/uploads/[key].js";

const ROUTES = { "/api/content": content, "/api/login": login, "/api/upload": upload, "/api/lead": lead };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let mod = ROUTES[url.pathname], params = {};
    if (!mod && url.pathname.startsWith("/uploads/")) { mod = image; params.key = url.pathname.slice(9); }
    if (mod) {
      const m = request.method.charAt(0) + request.method.slice(1).toLowerCase();
      const h = mod["onRequest" + m];
      if (!h) return new Response("Method not allowed", { status: 405 });
      try { return await h({ request, env, params, ctx }); }
      catch (e) { return new Response(JSON.stringify({ error: String(e?.message || e) }), { status: 500, headers: { "content-type": "application/json" } }); }
    }
    return env.ASSETS.fetch(request);
  },
};
