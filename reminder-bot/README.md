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
