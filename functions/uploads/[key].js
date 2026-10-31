// GET /uploads/<key> -> image uploaded from the admin panel
export async function onRequestGet({ params, env }) {
  const key = String(params.key || "");
  if (!env.SITE || !/^[\w.-]+$/.test(key)) return new Response("Not found", { status: 404 });
  const r = await env.SITE.getWithMetadata("img:" + key, { type: "arrayBuffer" });
  if (!r || !r.value) return new Response("Not found", { status: 404 });
  return new Response(r.value, {
    headers: { "content-type": r.metadata?.type || "application/octet-stream", "cache-control": "public, max-age=31536000, immutable" },
  });
}
