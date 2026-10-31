// Server-side page renderer: full HTML for one language, ready for search engines.
import SIZES from "./sizes.json";

export const LANGS = ["ru", "uz", "en"];
export const PATH = { ru: "/", uz: "/uz/", en: "/en/" };

const UI = {
  uz: { nav: ["Shifokor", "Xizmatlar", "Narxlar", "Sharhlar", "Aloqa"], call: "Qo‘ng‘iroq", book: "Yozilish", all: "Barchasi", items: "ta xizmat",
    addr: "Manzil", hours: "Ish vaqti", phone: "Telefon", map: "Xaritada ochish", tg: "Telegramda yozish", rights: "Barcha huquqlar himoyalangan",
    f: { n: "Ismingiz", p: "Telefon raqamingiz", s: "Qiziqtirgan xizmat", m: "Izoh (ixtiyoriy)", b: "Arizani yuborish", other: "Boshqa / bilmayman",
      sending: "Yuborilmoqda…", ok: "Rahmat! Arizangiz qabul qilindi, tez orada bog‘lanamiz.", err: "Yuborib bo‘lmadi. Iltimos, qo‘ng‘iroq qiling yoki Telegramda yozing.", req: "Ismingizni va telefon raqamini to‘liq kiriting (9 ta raqam).", wait: "Iltimos, birozdan so‘ng qayta urinib ko‘ring." },
    more: "Batafsil", close: "Yopish", menu: "Menyu", skip: "Asosiy qismga o‘tish" },
  ru: { nav: ["О враче", "Услуги", "Цены", "Отзывы", "Контакты"], call: "Позвонить", book: "Записаться", all: "Все", items: "услуг",
    addr: "Адрес", hours: "Часы работы", phone: "Телефон", map: "Открыть карту", tg: "Написать в Telegram", rights: "Все права защищены",
    f: { n: "Ваше имя", p: "Номер телефона", s: "Интересующая услуга", m: "Комментарий (необязательно)", b: "Отправить заявку", other: "Другое / не знаю",
      sending: "Отправляем…", ok: "Спасибо! Заявка принята, мы скоро свяжемся с вами.", err: "Не удалось отправить. Позвоните или напишите в Telegram.", req: "Укажите имя и полный номер телефона (9 цифр).", wait: "Пожалуйста, попробуйте чуть позже." },
    more: "Подробнее", close: "Закрыть", menu: "Меню", skip: "Перейти к содержанию" },
  en: { nav: ["Doctor", "Services", "Prices", "Reviews", "Contact"], call: "Call", book: "Book", all: "All", items: "services",
    addr: "Address", hours: "Hours", phone: "Phone", map: "Open map", tg: "Message on Telegram", rights: "All rights reserved",
    f: { n: "Your name", p: "Phone number", s: "Service of interest", m: "Comment (optional)", b: "Send request", other: "Other / not sure",
      sending: "Sending…", ok: "Thank you! We will contact you soon.", err: "Could not send. Please call or message us on Telegram.", req: "Please enter your name and full phone number (9 digits).", wait: "Please try again a little later." },
    more: "More", close: "Close", menu: "Menu", skip: "Skip to content" },
};
const IDS = ["about", "services", "prices", "reviews", "contact"];

const ICON = {
  up: '<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  face: '<path d="M12 3c-4 0-6 3.5-6 8 0 5 3 9 6 9s6-4 6-9c0-4.5-2-8-6-8z"/><path d="M9.5 14.5c1.4 1 3.6 1 5 0"/>',
  nose: '<path d="M12 3c0 6-3 9-3 12a3 3 0 006 0"/><path d="M8 16a2 2 0 01-2-2M16 16a2 2 0 002-2"/>',
  body: '<path d="M8 3c0 5-2 6-2 10a6 6 0 0012 0c0-4-2-5-2-10"/><path d="M8 13c2 1 6 1 8 0"/>',
  con: '<circle cx="12" cy="12" r="9.5"/><path d="M12 7.5v9M7.5 12h9"/>',
  other: '<circle cx="12" cy="12" r="9.5"/><path d="M9.6 9.3a2.5 2.5 0 114 2c-.9.6-1.6 1.1-1.6 2.2M12 17h.01"/>',
};
const SVG = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  tg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.5 3.6L2.9 10.8c-1.3.5-1.2 1.3-.2 1.6l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.4-1.2zM8.9 13.5l8.6-5.4c.4-.3.8-.1.5.2l-7.1 6.4-.3 3.1-1.7-4.3z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  flag: '<svg viewBox="0 0 24 16" width="22" height="15" aria-hidden="true"><rect width="24" height="16" rx="2" fill="#1eb53a"/><rect width="24" height="10.6" fill="#fff"/><rect width="24" height="5.3" fill="#0099b5"/><rect y="5.1" width="24" height=".5" fill="#ce1126"/><rect y="10.4" width="24" height=".5" fill="#ce1126"/></svg>',
};

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const safeUrl = (u) => (/^(https:\/\/|\/(?!\/))/.test(String(u || "")) ? String(u) : "");
const safeImg = (u) => (/^\/(assets|uploads)\/[\w./-]+$/.test(String(u || "")) ? String(u) : "");
const tel = (p) => String(p || "").replace(/[^+\d]/g, "");

function img(src, alt, { sizes = "100vw", cls = "", eager = false } = {}) {
  src = safeImg(src);
  if (!src) return "";
  const m = src.match(/^\/assets\/(\d)\.webp$/);
  const wh = SIZES[src];
  let srcset = "";
  if (m) srcset = ` srcset="/assets/${m[1]}-480.webp 480w, /assets/${m[1]}-960.webp 960w" sizes="${sizes}"`;
  const dims = wh ? ` width="${wh[0]}" height="${wh[1]}"` : "";
  return `<img src="${src}"${srcset}${dims} alt="${esc(alt)}"${cls ? ` class="${cls}"` : ""} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

export function renderPage(S, L, { origin = "", nonce = "" } = {}) {
  const U = UI[L];
  const tr = (o) => (o ? o[L] || o.ru || o.uz || o.en || "" : "");
  const T = (k) => esc(tr(S.t[k]));
  const c = S.contacts || {};
  const tgUrl = c.telegram ? (/^https:\/\//.test(c.telegram) ? c.telegram : "https://t.me/" + String(c.telegram).replace(/^@/, "")) : "";
  const phones = [c.phone, c.phone2].filter(Boolean);
  const mapUrl = "https://yandex.uz/maps/?text=" + encodeURIComponent(tr(c.address));
  const canonical = origin + PATH[L];
  const title = esc(tr(S.seo?.title) || tr(S.t.fullName));
  const desc = esc(tr(S.seo?.desc) || tr(S.t.lead));
  const ads = S.ads || {};
  const gid = /^(G|AW)-[\w-]+$/.test(ads.ga4 || "") ? ads.ga4 : "";
  const awid = /^AW-[\w-]+$/.test(ads.aw || "") ? ads.aw : "";
  const tagId = gid || awid;
  const ig = (S.insta || []).filter((u) => /^[\w.]+$/.test(u));

  const ld = {
    "@context": "https://schema.org",
    "@type": "Physician",
    "@id": origin + "/#doctor",
    name: tr(S.t.fullName),
    url: canonical,
    image: origin + (safeImg(S.photo) || "/assets/4.webp"),
    description: tr(S.seo?.desc),
    medicalSpecialty: ["PlasticSurgery", "Urologic", "Gynecologic"],
    telephone: phones[0] || undefined,
    address: { "@type": "PostalAddress", streetAddress: L === "ru" ? "ул. Шохрух, 27" : "Shohrux ko‘chasi, 27", addressLocality: L === "ru" ? "Самарканд" : "Samarqand", addressCountry: "UZ" },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "08:30", closes: "17:00" }],
    priceRange: "150 000 UZS +",
    sameAs: [tgUrl, ...ig.map((u) => "https://www.instagram.com/" + u), S.reviews?.url].filter(Boolean),
    worksFor: { "@type": "MedicalClinic", name: "Relax Med Service", address: { "@type": "PostalAddress", streetAddress: "ул. Шохрух, 27", addressLocality: "Samarkand", addressCountry: "UZ" } },
  };

  const nav = U.nav.map((n, i) => `<a href="#${IDS[i]}">${n}</a>`).join("");
  const langs = LANGS.map((l) => `<a href="${PATH[l]}" hreflang="${l}" lang="${l}"${l === L ? ' aria-current="true" class="on"' : ""}>${l.toUpperCase()}</a>`).join("");
  const stats = (S.stats || []).map((s) => `<div><b>${esc(s.v)}</b><span>${esc(tr(s.l))}</span></div>`).join("");
  const svc = (S.services || []).map((s) => `<a class="svc rv" href="#prices"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${ICON[s.g] || ICON.con}</svg></span><span><b>${esc(tr(s.t))}</b><small>${esc(tr(s.d))}</small></span></a>`).join("");
  const edu = (S.edu || []).map((e) => `<li><b>${esc(e.y)}</b><span><strong>${esc(tr(e.t))}</strong><small>${esc(tr(e.d))}</small></span></li>`).join("");
  const dips = (S.diplomas || []).map((d, i) => { const big = safeImg(d.url); const th = safeImg(d.thumb) || big; if (!big) return ""; return `<button class="dip" type="button" data-full="${big}" data-cap="${esc(tr(d.c))}">${img(th, tr(d.c), { sizes: "260px" })}<span>${esc(tr(d.c))}</span></button>`; }).join("");
  const steps = (S.steps || []).map((s, i) => `<li class="rv"><i>0${i + 1}</i><b>${esc(tr(s.t))}</b><small>${esc(tr(s.d))}</small></li>`).join("");
  const tabs = `<button type="button" class="on" data-c="-1">${U.all}</button>` + (S.prices || []).map((p, i) => `<button type="button" data-c="${i}">${esc(tr(p.cat))}</button>`).join("");
  const prices = (S.prices || []).map((p, i) => `<details class="pcat" data-c="${i}"${i === 0 ? " open" : ""}><summary><h3>${esc(tr(p.cat))}</h3><span>${p.items.length} ${U.items}</span><i aria-hidden="true">+</i></summary><div class="rows">${p.items.map((x) => `<div class="prow"><span>${esc(tr(x.t))}</span><b>${esc(x.p)} <small>${T("prcU")}</small></b></div>`).join("")}</div></details>`).join("");
  const rv = S.reviews || {};
  const revs = (rv.list || []).map((r) => `<figure class="rev"><div class="stars" aria-label="${esc(r.rating || 5)}/5">${SVG.star.repeat(Math.max(1, Math.min(5, +r.rating || 5)))}</div><blockquote>${esc(r.text)}</blockquote><figcaption><b>${esc(r.name)}</b><small>${esc(r.date)}</small></figcaption></figure>`).join("");
  const gal = (S.gallery || []).map((g) => { const u = safeImg(g.url); return u ? `<button class="gi" type="button" data-full="${u}" data-cap="${esc(tr(g.c))}">${img(u, tr(g.c), { sizes: "(max-width:700px) 70vw, 300px" })}</button>` : ""; }).join("");
  const svcOpts = (S.services || []).map((s, i) => `<label><input type="radio" name="service" value="${esc(tr(s.t))}"${i === 0 ? " checked" : ""}><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">${ICON[s.g] || ICON.con}</svg></span>${esc(tr(s.t))}</label>`).join("") + `<label><input type="radio" name="service" value="${esc(U.f.other)}"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">${ICON.other}</svg></span>${esc(U.f.other)}</label>`;
  const social = (tgUrl ? `<a class="so tg" href="${esc(tgUrl)}" target="_blank" rel="noopener" data-ev="telegram">${SVG.tg}<span>Telegram</span></a>` : "") + ig.map((u) => `<a class="so ig" href="https://www.instagram.com/${esc(u)}/" target="_blank" rel="noopener" data-ev="instagram">${SVG.ig}<span>@${esc(u)}</span></a>`).join("");
  const phoneLinks = phones.map((p) => `<a href="tel:${tel(p)}" data-ev="phone">${esc(p)}</a>`).join("");

  return `<!doctype html>
<html lang="${L}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
${LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${origin + PATH[l]}">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${origin}/">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="profile">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${origin}/assets/4-960.webp">
<meta property="og:locale" content="${{ ru: "ru_RU", uz: "uz_UZ", en: "en_US" }[L]}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#2d6bff">
<meta name="format-detection" content="telephone=no">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" as="image" href="/assets/4-480.webp" imagesrcset="/assets/4-480.webp 480w, /assets/4-960.webp 960w" imagesizes="(max-width:860px) 92vw, 42vw" fetchpriority="high">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/app.css?v=5">
<script type="application/ld+json" nonce="${nonce}">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>
${tagId ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${tagId}" nonce="${nonce}"></script>
<script nonce="${nonce}">window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());${gid ? `gtag('config','${gid}');` : ""}${awid ? `gtag('config','${awid}');` : ""}</script>` : ""}
</head>
<body data-aw="${esc(awid)}" data-awl="${esc(/^[\w-]+$/.test(ads.awLabel || "") ? ads.awLabel : "")}" data-lang="${L}">
<a class="skip" href="#main">${U.skip}</a>
<header class="hdr" id="hdr"><div class="wrap hbar">
  <a href="${PATH[L]}" class="logo" aria-label="${T("fullName")}">${img(S.photo, "", { sizes: "40px", cls: "av" })}<span><b>${L === "ru" ? "Доктор Исмати" : L === "en" ? "Dr. Ismati" : "Doktor Ismati"}</b><small>${T("role")}</small></span></a>
  <nav class="nav" aria-label="${U.menu}">${nav}</nav>
  <div class="lang">${langs}</div>
  ${phones[0] ? `<a class="ib dk" href="tel:${tel(phones[0])}" aria-label="${U.call}" data-ev="phone">${SVG.phone}</a>` : ""}
  <button class="ib burger" id="burger" type="button" aria-label="${U.menu}" aria-expanded="false" aria-controls="mnav"><span class="bo">${SVG.menu}</span><span class="bx">${SVG.x}</span></button>
</div></header>
<div class="mnav" id="mnav" hidden><nav>${nav}</nav><div class="lang">${langs}</div><div class="soc">${social}</div></div>

<main id="main">
<section class="hero wrap">
  <div class="hphoto"><div class="hbg"><span class="orb" aria-hidden="true"></span>${img(S.photo, tr(S.t.fullName), { sizes: "(max-width:860px) 92vw, 42vw", eager: true })}</div></div>
  <div class="htext">
    <p class="chip"><span class="dot"></span>${T("role")}</p>
    <h1><span class="ln"><span>${T("nameA")}</span></span><span class="ln"><span>${T("nameB")}</span></span><span class="vh"> — ${T("role")}, ${T("clinic")}</span></h1>
    <p class="deg">${T("degree")}</p>
    <p class="intro">${T("lead")}</p>
    <p class="loc">${SVG.pin}<span>${T("clinic")}</span></p>
    <div class="cta"><a class="btn" href="#contact" data-ev="cta_hero"><span>${T("cta")}</span><i>${SVG.arrow}</i></a>${phones[0] ? `<a class="btn ghost" href="tel:${tel(phones[0])}" data-ev="phone">${SVG.phone}<span>${esc(phones[0])}</span></a>` : ""}</div>
    <div class="stats">${stats}</div>
  </div>
</section>

<section class="sec wrap" id="services" aria-labelledby="h-svc">
  <h2 id="h-svc" class="h2 rv">${T("svcH")}</h2>
  <div class="svcs">${svc}</div>
</section>

<section class="sec wrap about" id="about" aria-labelledby="h-ab">
  <div class="apic rv">${img(S.aboutPhoto, tr(S.t.fullName), { sizes: "(max-width:860px) 92vw, 40vw" })}</div>
  <div class="atext">
    <h2 id="h-ab" class="h2 rv">${T("abH")}</h2>
    <p class="rv">${T("abP")}</p>
    <h3 class="h3 rv">${T("eduH")}</h3>
    <ol class="edu rv">${edu}</ol>
  </div>
</section>

${dips ? `<section class="sec wrap" aria-labelledby="h-dip"><h2 id="h-dip" class="h2 rv">${T("dipH")}</h2><div class="dips rail">${dips}</div></section>` : ""}

${steps ? `<section class="sec wrap" aria-labelledby="h-st"><h2 id="h-st" class="h2 rv">${T("stepsH")}</h2><ol class="steps">${steps}</ol></section>` : ""}

<section class="sec wrap" id="prices" aria-labelledby="h-pr">
  <h2 id="h-pr" class="h2 rv">${T("prcH")}</h2>
  <div class="tabs rail" role="tablist">${tabs}</div>
  <div class="plist">${prices}</div>
  <p class="note">${T("prcN")}</p>
</section>

${revs ? `<section class="sec wrap" id="reviews" aria-labelledby="h-rv">
  <div class="shead"><h2 id="h-rv" class="h2 rv">${T("revH")}</h2>${safeUrl(rv.url) ? `<a class="revlink" href="${esc(rv.url)}" target="_blank" rel="noopener"><span class="stars">${SVG.star.repeat(5)}</span><b>${esc(rv.count)}</b> ${T("revT")} →</a>` : ""}</div>
  <div class="revs rail">${revs}</div>
</section>` : ""}

${gal ? `<section class="sec wrap" aria-labelledby="h-gal"><h2 id="h-gal" class="h2 rv">${T("galH")}</h2><div class="gal rail">${gal}</div></section>` : ""}

<section class="sec wrap" id="contact" aria-labelledby="h-co">
  <div class="contact">
    <div class="cinfo">
      <h2 id="h-co" class="h2">${T("coH")}</h2>
      <p>${T("coP")}</p>
      <ul class="clist">
        <li>${SVG.pin}<span><small>${U.addr}</small>${esc(tr(c.address))}<a class="ml" href="${esc(mapUrl)}" target="_blank" rel="noopener">${U.map} →</a></span></li>
        <li>${SVG.clock}<span><small>${U.hours}</small>${esc(tr(c.hours))}</span></li>
        ${phones.length ? `<li>${SVG.phone}<span><small>${U.phone}</small>${phoneLinks}</span></li>` : ""}
      </ul>
      <div class="soc">${social}</div>
    </div>
    <form class="lead" id="lead" novalidate>
      <input type="text" name="company" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <label class="f"><span>${U.f.n}</span><input name="name" required maxlength="80" autocomplete="name"></label>
      <label class="f"><span>${U.f.p}</span><span class="phw"><span class="cc">${SVG.flag}+998</span><input name="phone" type="tel" inputmode="numeric" required maxlength="16" autocomplete="tel-national" placeholder="90 123 45 67"></span></label>
      <fieldset class="f"><legend>${U.f.s}</legend><div class="pick">${svcOpts}</div></fieldset>
      <label class="f"><span>${U.f.m}</span><textarea name="message" rows="2" maxlength="800"></textarea></label>
      <button class="btn wide" type="submit"><span>${U.f.b}</span><i>${SVG.arrow}</i></button>
      <p class="lmsg" id="lmsg" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>
</main>

<footer class="wrap foot"><span>© ${new Date().getFullYear()} ${T("fullName")}</span><span>${U.rights}</span></footer>
${tgUrl || phones[0] ? `<a class="fab" id="fab" href="${esc(tgUrl || "tel:" + tel(phones[0]))}" ${tgUrl ? 'target="_blank" rel="noopener" data-ev="telegram"' : 'data-ev="phone"'} aria-label="${tgUrl ? U.tg : U.call}">${tgUrl ? SVG.tg : SVG.phone}</a>` : ""}
<div class="lb" id="lb" hidden><button type="button" class="ib lbx" aria-label="${U.close}">${SVG.x}</button><figure><img alt=""><figcaption></figcaption></figure></div>
<script id="i18n" type="application/json">${JSON.stringify(U.f).replace(/</g, "\\u003c")}</script>
<script src="/app.js?v=5" defer></script>
</body>
</html>`;
}
