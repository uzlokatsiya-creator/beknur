// Telegram bot: siz yozganingizda javob beradi (Cloudflare Worker, webhook).
// Sozlamalar (Worker → Settings → Variables and Secrets):
//   BOT_TOKEN         — @BotFather bergan token (majburiy)
//   WEBHOOK_SECRET    — o'zingiz o'ylab topgan maxfiy so'z (majburiy)
//   ALLOWED_CHAT_ID   — faqat shu chatga javob beradi (ixtiyoriy, tavsiya etiladi)
//   ANTHROPIC_API_KEY — bo'lsa, Claude aqlli javob yozadi; bo'lmasa tayyor javoblar

const SYSTEM = `Sen mehribon, g'amxo'r do'stsan. Foydalanuvchi bilan o'zbek tilida (lotin yozuvida),
qisqa (1–3 gap), iliq va samimiy gaplash. Uning ahvolini so'ra, qo'llab-quvvatla,
kerak bo'lsa dam olish, ovqatlanish, suv ichishni eslat. Rasmiy bo'lma.`;

const RULES = [
  [/salom|assalom|hayrli|xayrli/i, "Va alaykum assalom! 😊 Qalaysiz, yaxshimisiz?"],
  [/yaxshi|zo'r|zor|a'lo|alo|ok/i, "Juda xursandman! Doim shunday bo'lsin 😊"],
  [/charcha|horg|xorg|toliq/i, "Biroz dam oling, choy iching. O'zingizni qiynamang, xo'pmi? 🌿"],
  [/yomon|xafa|hafa|zerik|qiyin/i, "Voy, nima bo'ldi? Hammasi yaxshi bo'ladi, men yoningizdaman ❤️"],
  [/rahmat|raxmat|spasibo/i, "Arzimaydi! Siz uchun doim 😊"],
  [/uxla|tun|yot/i, "Yaxshi dam oling, shirin tushlar ko'ring 🌙"],
  [/ovqat|yed|tushlik|nonushta/i, "Yoqimli ishtaha! Vaqtida ovqatlanganingiz zo'r 🍽"],
  [/nima qilyapsan|nima gap|nma gap/i, "Sizni o'ylab turibman 😊 O'zingiz nima qilyapsiz?"],
];
const FALLBACK = [
  "Tushundim 😊 Yana nima gaplar?",
  "Sizni eshityapman. Kayfiyatingiz qanday?",
  "Yozganingizdan xursandman! O'zingizni ehtiyot qiling ❤️",
];

function simpleReply(text) {
  for (const [re, ans] of RULES) if (re.test(text)) return ans;
  return FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
}

async function claudeReply(env, text) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-5-5",
      max_tokens: 300,
      system: SYSTEM,
      messages: [{ role: "user", content: text }],
    }),
  });
  if (!r.ok) throw new Error(await r.text());
  const j = await r.json();
  return j.content.map((c) => c.text || "").join("").trim();
}

async function send(env, chatId, text) {
  await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

export default {
  async fetch(request, env) {
    if (request.method !== "POST") return new Response("Bot ishlayapti ✅");
    if (request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== env.WEBHOOK_SECRET)
      return new Response("forbidden", { status: 403 });

    const update = await request.json();
    const msg = update.message;
    if (!msg || !msg.text) return new Response("ok");
    const chatId = msg.chat.id;
    if (env.ALLOWED_CHAT_ID && String(chatId) !== String(env.ALLOWED_CHAT_ID))
      return new Response("ok");

    let answer;
    if (msg.text === "/start") {
      answer = `Salom! 😊 Men sizning yordamchingizman. Chat ID: ${chatId}`;
    } else if (env.ANTHROPIC_API_KEY) {
      try { answer = await claudeReply(env, msg.text); }
      catch { answer = simpleReply(msg.text); }
    } else {
      answer = simpleReply(msg.text);
    }
    await send(env, chatId, answer);
    return new Response("ok");
  },
};
