# Telegram eslatma boti

Soat 08:00 da ertalabki xabar, 11:00–21:00 oralig'ida har soatda bitta mehribon xabar, 22:00 da "Xayrli tun" yuboradi (Toshkent vaqti).

## Sozlash (bir marta)
1. Telegramda **@BotFather** → `/newbot` → botga nom bering → **token**ni nusxalang.
2. @amirkulvv akkauntidan yangi botga kirib **Start** bosing (bot faqat Start bosgan odamga yoza oladi).
3. Brauzerda oching: `https://api.telegram.org/bot<TOKEN>/getUpdates` → `"chat":{"id": 123456789` dagi raqam — bu **chat ID**.
4. GitHub → repo → **Settings → Secrets and variables → Actions → New repository secret**:
   - `TELEGRAM_BOT_TOKEN` = token
   - `TELEGRAM_CHAT_ID` = chat ID
5. **Actions → Telegram eslatmalar → Run workflow** (hour: `8`) — sinab ko'ring.

Xabarlarni o'zgartirish: `reminder-bot/send.py` dagi `MORNING`, `DAY`, `NIGHT`.
Eslatma: GitHub jadvali ba'zan 5–15 daqiqa kechikishi mumkin.

## Javob berish (siz yozganingizda)
`reply-worker.js` — Cloudflare Worker. Siz botga yozsangiz, darhol javob qaytaradi.

1. Cloudflare → **Workers & Pages → Create → Worker** → nom bering (masalan `amir-bot`) → **Deploy**.
2. **Edit code** → hamma narsani o'chirib, `reply-worker.js` ni joylang → **Deploy**.
3. **Settings → Variables and Secrets** ga qo'shing:
   - `BOT_TOKEN` = bot tokeni
   - `WEBHOOK_SECRET` = o'zingiz o'ylagan so'z (faqat harf/raqam, masalan `Amir2026maxfiy`)
   - `ALLOWED_CHAT_ID` = chat ID (begonalarga javob bermasligi uchun)
   - `ANTHROPIC_API_KEY` = (ixtiyoriy) console.anthropic.com dan kalit — bo'lsa, Claude jonli suhbatlashadi; bo'lmasa tayyor javoblar ishlaydi.
4. Brauzerda bir marta oching (webhookni ulash):
   `https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://amir-bot.<sizning-subdomain>.workers.dev&secret_token=<WEBHOOK_SECRET>`
   → `"ok":true` chiqsa tayyor.
5. Botga "Salom" deb yozing.

Eslatma: webhook ulangandan keyin `getUpdates` ishlamaydi — chat ID ni bilish uchun botga `/start` yozing, u ID ni o'zi aytadi.
