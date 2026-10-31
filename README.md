# Doktor Ismati — sayt

- Sayt: `site/index.html` (UZ / RU / EN)
- Admin panel: `/admin-ismati/` (saytda hech qayerda havolasi yo'q, parol bilan kiriladi)
- Arizalar formasi → Telegram bot
- Server qismi: `netlify/functions/` (kontent, rasm yuklash, login, ariza)

## Netlify sozlamalari (Site configuration → Environment variables)

| Nomi | Qiymati |
|---|---|
| `ADMIN_PASSWORD` | admin panel paroli |
| `TELEGRAM_BOT_TOKEN` | @BotFather bergan token |
| `TELEGRAM_CHAT_ID` | arizalar boradigan chat ID (bir nechta bo'lsa vergul bilan) |

O'zgaruvchilarni qo'shgandan keyin **Deploys → Trigger deploy** qiling.
