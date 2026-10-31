import { json } from "../lib/util.mjs";

// POST /api/lead  { name, phone, service, message, lang, company(honeypot) }
// Sends the request to Telegram: TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID (comma-separated for several chats).
const clean = (v, n) => String(v ?? "").replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c])).trim().slice(0, n);

export default async (req) => {
  if (req.method !== "POST") return json({ error: "method" }, 405);
  let b;
  try { b = await req.json(); } catch { return json({ error: "bad json" }, 400); }
  if (b.company) return json({ ok: true }); // bot filled the hidden field
  const name = clean(b.name, 80), phone = clean(b.phone, 30), service = clean(b.service, 120), message = clean(b.message, 800);
  if (!name || phone.replace(/\D/g, "").length < 7) return json({ error: "name and phone required" }, 400);

  const token = process.env.TELEGRAM_BOT_TOKEN, chats = (process.env.TELEGRAM_CHAT_ID || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!token || !chats.length) return json({ error: "Telegram is not configured" }, 500);

  const time = new Date().toLocaleString("ru-RU", { timeZone: "Asia/Samarkand" });
  const text = [
    "🩺 <b>Yangi ariza — saytdan</b>",
    "",
    `👤 <b>Ism:</b> ${name}`,
    `📞 <b>Telefon:</b> ${phone}`,
    service && `💉 <b>Xizmat:</b> ${service}`,
    message && `💬 <b>Izoh:</b> ${message}`,
    `🌐 <b>Til:</b> ${clean(b.lang, 5).toUpperCase() || "-"}`,
    `🕒 ${time}`,
  ].filter(Boolean).join("\n");

  const results = await Promise.all(chats.map((chat_id) =>
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id, text, parse_mode: "HTML", disable_web_page_preview: true }),
    }).then((r) => r.ok).catch(() => false)));

  return results.some(Boolean) ? json({ ok: true }) : json({ error: "telegram failed" }, 502);
};

export const config = { path: "/api/lead" };
