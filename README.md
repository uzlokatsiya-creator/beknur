# Doktor Ismati — sayt (Cloudflare Pages)

- `site/` — yuklanadigan papka (zip): statik fayllar + `_worker.js`
- `site/admin-ismati/` — admin panel (parol + Telegram kodi)
- `lib/` + `worker-src.js` — server kodi manbasi. O'zgartirgandan keyin:
  `npx esbuild worker-src.js --bundle --format=esm --platform=neutral --minify --outfile=site/_worker.js`

Sahifalar serverda tayyorlanadi (SEO): `/` (ru), `/uz/`, `/en/`, `/sitemap.xml`, `/robots.txt`.

## Cloudflare sozlamalari
- KV binding: `SITE`
- Secrets: `ADMIN_PASSWORD`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (shaxsiy — ariza + admin kodi), `TELEGRAM_GROUP_ID` (guruh — faqat ariza)
- Ixtiyoriy: `SITE_URL` (domen olingach, masalan `https://drismati.uz`)
