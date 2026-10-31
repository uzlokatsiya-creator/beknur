# Doktor Ismati — sayt (Cloudflare Pages)

- `site/` — tayyor sayt, shu papkani (yoki zip'ni) Cloudflare Pages'ga yuklang
  - `site/admin-ismati/` — parolli admin panel (saytda havolasi yo'q)
  - `site/_worker.js` — server qismi (kontent, login, rasm, ariza → Telegram). `server/` va `lib/` dan yig'iladi:
    `npx esbuild worker-src.js --bundle --format=esm --platform=neutral --outfile=site/_worker.js`
- Cloudflare sozlamalari: KV binding `SITE`; secrets `ADMIN_PASSWORD`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
