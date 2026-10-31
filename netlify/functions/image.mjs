import { store } from "../lib/util.mjs";

// GET /uploads/<key> -> image uploaded from the admin panel
export default async (req, context) => {
  const key = context.params?.key || new URL(req.url).pathname.split("/").pop();
  if (!/^[\w.-]+$/.test(key)) return new Response("Not found", { status: 404 });
  const r = await store("images").getWithMetadata(key, { type: "arrayBuffer" });
  if (!r) return new Response("Not found", { status: 404 });
  return new Response(r.data, {
    headers: { "content-type": r.metadata?.type || "application/octet-stream", "cache-control": "public, max-age=31536000, immutable" },
  });
};

export const config = { path: "/uploads/:key" };
