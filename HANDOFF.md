# Doktor Ismati sayti — davom ettirish uchun to'liq ma'lumot

## 1. Loyiha haqida
- **Mijoz:** Ismati Odiljon Obidovich (Исмати Одилжон Обидович) — plastik jarroh va uroginekolog, PhD (tibbiyot fanlari bo'yicha falsafa doktori).
- **Klinika:** Relax Med Service, Samarqand, Shohrux ko'chasi 27 (ул. Шохрух, 27).
- **Telefonlar:** +998 90 601 71 79, +998 66 233 17 40.
- **Ish vaqti:** Du–Sha, 08:30–17:00 (yakshanba — dam olish).
- **Telegram:** https://t.me/ismatiodil
- **Instagram:** @ismatidoc, @doctorismati, @blefaroplastika.sam
- **YouTube:** https://www.youtube.com/@odilismati (10 ta short), https://www.youtube.com/@profilupakofkasi (6 ta short)
- **Sharhlar:** clinics.uz — 92 ta sharh: https://samarkand.clinics.uz/catalog/medical-centers/cosmetology/relax-med-service/doc/ismati-odilzhon-obidovich#docReview
- **Konsultatsiya:** plastik jarroh va uroginekolog birlamchi konsultatsiyasi — 150 000 so'm.
- **Ta'lim:** 2014 — SPb tibbiyot universiteti (davolash ishi, imtiyozli diplom); 2015 — umumiy jarrohlik va endojarrohlik internaturasi (SPb, Mariinskiy shifoxonasi); 2015–2017 — uroginekologiya ordinaturasi (SPbGU); 2021–2022 — plastik jarrohlik malakasi; 2025 — PhD diplomi.
- **Namuna sayt (mijoz shunga o'xshatishni so'ragan):** https://choriyev.uz/ru

## 2. Mijozning asosiy talablari
- Minimalistik, "bachkana" emas, ortiqcha ma'lumot yo'q. Faqat mijoz bergan ma'lumotlar (sohaga oid kichik qo'shimchalar mumkin).
- Ko'k-oq uslub, sokin animatsiyalar. Telefon, planshet va kompyuterda chiroyli bo'lsin.
- 3 til: rus (asosiy, `/`), o'zbek (`/uz/`), ingliz (`/en/`).
- SEO maksimal bo'lsin. Keyinchalik Google Ads reklamasi beriladi.
- Ariza formasi: faqat ism va telefon (+998 maskasi, 9 ta raqam). Arizalar Telegram'ga keladi: shaxsiy chatga ham, guruhga ham.
- Admin panel saytda ko'rinmaydi, alohida havoladan kiriladi: parol + Telegram'ga keladigan kod (kod FAQAT shaxsiy chatga keladi).

## 3. Hosting va deploy
- **Hosting:** Cloudflare Pages (bepul tarif), manzil: `ismati-odil.pages.dev`. Domen hali olinmagan.
- **Deploy:** `site/` papkasini zip qilib, Cloudflare → Workers & Pages → loyiha → Deployments → Create deployment orqali yuklanadi.
- **Zip yasash:** `cd site && zip -qr -X ../doktor-ismati-site.zip . -x '.*'`
- **Cloudflare sozlamalari:**
  - KV binding: `SITE` — kontent, rasmlar, sessiyalar, login kodlari, urinishlar cheklovi shu yerda saqlanadi.
  - Secrets: `ADMIN_PASSWORD`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` (shaxsiy chat — ariza va admin kodi), `TELEGRAM_GROUP_ID` (guruh — faqat ariza).
  - Ixtiyoriy: `SITE_URL` — domen olingach (masalan `https://drismati.uz`): canonical va sitemap uchun.
  - Sozlama o'zgarsa, zip qayta yuklanadi.

## 4. Kod tuzilmasi (GitHub: uzlokatsiya-creator/beknur, branch `claude/great-bell-qc149h`)
- `worker-src.js` — server: yo'nalishlar, API, xavfsizlik sarlavhalari (CSP, HSTS va boshqalar).
- `lib/render.js` — server tomonida HTML yasash (SEO): bosh sahifa, xizmat sahifalari, ichki sahifalar.
- `lib/util.js` — login tokenlari, rate limit, Telegram'ga yuborish.
- `lib/default.json` — boshlang'ich kontent (3 tilda). Admin saqlagan kontent KV'da turadi va shu fayl ustidan birlashtiriladi.
- `lib/sizes.json` — rasm o'lchamlari (CLS bo'lmasligi uchun).
- `site/` — yuklanadigan papka: `_worker.js` (yig'ilgan server), `app.css`, `app.js`, `favicon.svg`, `assets/` (rasmlar, `assets/dip/` diplomlar, `assets/ba/` blefaroplastika natijalari), `admin-ismati/` (admin panel).
- **Serverni yig'ish** (lib/ yoki worker-src.js o'zgarganda):
  `npx esbuild worker-src.js --bundle --format=esm --platform=neutral --minify --outfile=site/_worker.js`
- CSS/JS o'zgarganda `lib/render.js` ichidagi `app.css?v=N` va `app.js?v=N` raqamini oshirish kerak (kesh yangilanishi uchun). Hozir: v=11.

## 5. Sahifalar
- `/`, `/uz/`, `/en/` — bosh sahifa: shifokor, xizmatlar, natijalar, shifokor haqida va ta'lim, diplomlar, videolar (16 ta), ish bosqichlari, narxlar, sharhlar, galereya, ariza.
- `/xizmatlar/<slug>` — 7 ta xizmat: `blefaroplastika`, `yuz-plastikasi`, `rinoplastika-otoplastika`, `kokrak-plastikasi`, `abdominoplastika-liposaksiya`, `intim-plastika`, `uroginekologiya`. Har birida: faktlar, natijalar, operatsiya haqida, bosqichlar, turlari, FAQ, narx kartasi, videolar, boshqa xizmatlar, ariza.
- `/narxlar`, `/videolar` (filtrlar bilan), `/savol-javob`, `/aloqa` (Google xarita), `/imt` (IMT kalkulyatori).
- `/sitemap.xml` (39 sahifa), `/robots.txt`.
- `/admin-ismati/` — admin panel.
- API: `/api/lead`, `/api/login`, `/api/verify`, `/api/logout`, `/api/content` (GET/PUT, faqat admin), `/api/upload`, rasmlar `/uploads/<key>`.

## 6. Admin panel bo'limlari
Matnlar · Rasmlar · Diplomlar · Xizmatlar (har bir sahifaning to'liq kontenti) · Natijalar (oldin/keyin) · Videolar · Savol-javob · Narxlar · Sharhlar · Ta'lim va raqamlar · Aloqa (ish vaqti jadvali bilan) · SEO va reklama (title/description, GA4 ID, Google Ads ID va konversiya yorlig'i).

## 7. Xavfsizlik
- 2 bosqichli kirish: parol → 6 xonali Telegram kodi (5 daqiqa amal qiladi, faqat shaxsiy chatga keladi).
- 5 marta xato bo'lsa — 15 daqiqa blok; kod 3 marta xato bo'lsa bekor bo'ladi.
- Sessiya 12 soat amal qiladi, chiqishda o'chadi. Har saqlashda oldingi versiya zaxiraga olinadi (`content:prev`).
- CSP (nonce), X-Frame-Options, HSTS; yuklanadigan fayllar haqiqiy rasm ekani tekshiriladi.
- Ariza spamdan himoya: 10 daqiqada 5 ta ariza, yashirin maydon, yuborish vaqti tekshiruvi.

## 8. Ochiq savollar va keyingi qadamlar
- **Matnlarni tekshirish:** xizmat faktlari (davomiylik, tiklanish, anesteziya) va turlarini doktor tekshirishi kerak, ular sohadagi umumiy ko'rsatkichlar asosida yozilgan.
- **Rinoplastika narxi** berilmagan — sahifada faqat otoplastika narxi (4–6 mln) turibdi.
- **Video taqsimoti** kadrlarga qarab qilingan (videolarda sarlavha yo'q). Admin'da o'zgartirsa bo'ladi.
- **Natija rasmlari:** faqat blefaroplastika uchun bor (10 ta). Qolgan xizmatlarniki admin orqali yuklanadi.
- **Noma'lum ma'lumotlar:** bemorlar geografiyasi (raqamlar bo'lmasa blok qo'shilmaydi), WhatsApp raqami.
- **Domen:** olingach Cloudflare'ga ulash, `SITE_URL` ni o'rnatish, Google Search Console'ga sitemap qo'shish.
- **Google Ads/GA4:** ID'lar admin → "SEO va reklama" bo'limiga kiritiladi.
- **Mijozdan javob kutilmoqda:** "saytga kirganda ariza oynasi chiqsinmi?" degan savol ochiq qolgan.
