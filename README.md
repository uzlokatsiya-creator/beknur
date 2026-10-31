# Doktor Ismati — sayt (Cloudflare Pages)

- `site/` — sayt (UZ / RU / EN), `site/admin-ismati/` — parolli admin panel (saytda havolasi yo'q)
- `functions/` — server qismi: kontent, login, rasm yuklash, ariza → Telegram
- Ma'lumot va rasmlar Cloudflare KV'da saqlanadi (`SITE` binding)

## Cloudflare Pages sozlamalari
- Build command: (bo'sh) · Build output directory: `site`
- Settings → Bindings → KV namespace: variable name `SITE`
- Settings → Variables and Secrets: `ADMIN_PASSWORD`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- Sozlamalardan keyin: Deployments → Retry deployment
