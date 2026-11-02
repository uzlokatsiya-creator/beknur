// Server-side renderer: home page and one page per service, in 3 languages (SEO-ready HTML).
import SIZES from "./sizes.json";

export const LANGS = ["ru", "uz", "en"];
export const PATH = { ru: "/", uz: "/uz/", en: "/en/" };
export const SVC_BASE = "xizmatlar";
export const svcUrl = (L, slug) => PATH[L] + SVC_BASE + "/" + slug;
export const PAGES = ["narxlar", "videolar", "savol-javob", "aloqa", "imt"];
export const pageUrl = (L, k) => PATH[L] + k;
const NL = {
  uz: { doc: "Shifokor", svc: "Xizmatlar", narxlar: "Narxlar", videolar: "Videolar", "savol-javob": "Savol-javob", aloqa: "Aloqa", imt: "IMT kalkulyatori", chat: "Bog‘lanish", wd: "Ish kunlari", closed: "Yakshanba — dam olish kuni", map: "Xarita", height: "Bo‘y (sm)", weight: "Vazn (kg)", calc: "Hisoblash", your: "Sizning IMT", cats: [["< 18,5", "Vazn yetishmasligi"], ["18,5 – 24,9", "Normal vazn"], ["25 – 29,9", "Ortiqcha vazn"], ["30 – 34,9", "Semizlik I daraja"], ["≥ 35", "Semizlik II daraja va undan yuqori"]], filter: "Bo‘lim" },
  ru: { doc: "О враче", svc: "Услуги", narxlar: "Цены", videolar: "Видео", "savol-javob": "FAQ", aloqa: "Контакты", imt: "Калькулятор ИМТ", chat: "Связаться", wd: "Рабочие дни", closed: "Воскресенье — выходной", map: "Карта", height: "Рост (см)", weight: "Вес (кг)", calc: "Рассчитать", your: "Ваш ИМТ", cats: [["< 18,5", "Недостаток веса"], ["18,5 – 24,9", "Нормальный вес"], ["25 – 29,9", "Избыточный вес"], ["30 – 34,9", "Ожирение I степени"], ["≥ 35", "Ожирение II степени и выше"]], filter: "Раздел" },
  en: { doc: "Doctor", svc: "Services", narxlar: "Prices", videolar: "Videos", "savol-javob": "FAQ", aloqa: "Contact", imt: "BMI calculator", chat: "Contact us", wd: "Working days", closed: "Sunday — day off", map: "Map", height: "Height (cm)", weight: "Weight (kg)", calc: "Calculate", your: "Your BMI", cats: [["< 18.5", "Underweight"], ["18.5 – 24.9", "Normal weight"], ["25 – 29.9", "Overweight"], ["30 – 34.9", "Obesity class I"], ["≥ 35", "Obesity class II and above"]], filter: "Section" },
};

const UI = {
  uz: { nav: ["Shifokor", "Xizmatlar", "Narxlar", "Sharhlar", "Aloqa"], home: "Bosh sahifa", svcs: "Xizmatlar", call: "Qo‘ng‘iroq", book: "Yozilish", all: "Barchasi", items: "ta xizmat",
    addr: "Manzil", hours: "Ish vaqti", phone: "Telefon", map: "Xaritada ochish", tg: "Telegramda yozish", rights: "Barcha huquqlar himoyalangan",
    facts: { anest: "Anesteziya", dur: "Davomiyligi", rehab: "Tiklanish", result: "Natija" }, from: "dan", exact: "Aniq narx konsultatsiyadan so‘ng belgilanadi", onConsult: "Narx konsultatsiyada aniqlanadi",
    q: { price: "{s} narxi qancha?", dur: "{s} qancha davom etadi?", rehab: "{s}dan keyin tiklanish qancha vaqt oladi?", anest: "{s}da qanday anesteziya qo‘llaniladi?" },
    a: { price: "Relax Med Service klinikasida narxi — {p}. Aniq narx konsultatsiyada belgilanadi.", dur: "Operatsiya {v} davom etadi.", rehab: "Tiklanish davri: {v}.", anest: "Anesteziya: {v}. Usul konsultatsiyada tanlanadi." },
    play: "Videoni ko‘rish", more: "Batafsil", close: "Yopish", menu: "Menyu", skip: "Asosiy qismga o‘tish", ytAll: "YouTube kanal",
    f: { n: "Ismingiz", p: "Telefon raqamingiz", s: "Qiziqtirgan xizmat", m: "Izoh (ixtiyoriy)", b: "Arizani yuborish", other: "Boshqa / bilmayman",
      sending: "Yuborilmoqda…", ok: "Rahmat! Arizangiz qabul qilindi, tez orada bog‘lanamiz.", err: "Yuborib bo‘lmadi. Iltimos, qo‘ng‘iroq qiling yoki Telegramda yozing.", req: "Ismingizni va telefon raqamini to‘liq kiriting (9 ta raqam).", wait: "Iltimos, birozdan so‘ng qayta urinib ko‘ring." } },
  ru: { nav: ["О враче", "Услуги", "Цены", "Отзывы", "Контакты"], home: "Главная", svcs: "Услуги", call: "Позвонить", book: "Записаться", all: "Все", items: "услуг",
    addr: "Адрес", hours: "Часы работы", phone: "Телефон", map: "Открыть карту", tg: "Написать в Telegram", rights: "Все права защищены",
    facts: { anest: "Анестезия", dur: "Длительность", rehab: "Реабилитация", result: "Результат" }, from: "от", exact: "Точная стоимость определяется на консультации", onConsult: "Стоимость определяется на консультации",
    q: { price: "Сколько стоит {s} в Самарканде?", dur: "{s}: сколько длится операция?", rehab: "{s}: сколько длится реабилитация?", anest: "{s}: какая анестезия используется?" },
    a: { price: "В клинике Relax Med Service стоимость — {p}. Точная цена определяется на консультации.", dur: "Операция длится {v}.", rehab: "Реабилитация: {v}.", anest: "Анестезия: {v}. Метод подбирается на консультации." },
    play: "Смотреть видео", more: "Подробнее", close: "Закрыть", menu: "Меню", skip: "Перейти к содержанию", ytAll: "YouTube-канал",
    f: { n: "Ваше имя", p: "Номер телефона", s: "Интересующая услуга", m: "Комментарий (необязательно)", b: "Отправить заявку", other: "Другое / не знаю",
      sending: "Отправляем…", ok: "Спасибо! Заявка принята, мы скоро свяжемся с вами.", err: "Не удалось отправить. Позвоните или напишите в Telegram.", req: "Укажите имя и полный номер телефона (9 цифр).", wait: "Пожалуйста, попробуйте чуть позже." } },
  en: { nav: ["Doctor", "Services", "Prices", "Reviews", "Contact"], home: "Home", svcs: "Services", call: "Call", book: "Book", all: "All", items: "services",
    addr: "Address", hours: "Hours", phone: "Phone", map: "Open map", tg: "Message on Telegram", rights: "All rights reserved",
    facts: { anest: "Anaesthesia", dur: "Duration", rehab: "Recovery", result: "Result" }, from: "from", exact: "The exact price is set at the consultation", onConsult: "Price is set at the consultation",
    q: { price: "How much does {s} cost in Samarkand?", dur: "{s}: how long does the operation take?", rehab: "{s}: how long is the recovery?", anest: "{s}: what anaesthesia is used?" },
    a: { price: "At Relax Med Service the price is {p}. The exact price is set at the consultation.", dur: "The operation takes {v}.", rehab: "Recovery: {v}.", anest: "Anaesthesia: {v}. The method is chosen at the consultation." },
    play: "Watch video", more: "More", close: "Close", menu: "Menu", skip: "Skip to content", ytAll: "YouTube channel",
    f: { n: "Your name", p: "Phone number", s: "Service of interest", m: "Comment (optional)", b: "Send request", other: "Other / not sure",
      sending: "Sending…", ok: "Thank you! We will contact you soon.", err: "Could not send. Please call or message us on Telegram.", req: "Please enter your name and full phone number (9 digits).", wait: "Please try again a little later." } },
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
const FICON = { anest: '<path d="M10 3h4M12 3v4M7 7h10l-1 13H8z"/><path d="M9 12h6"/>', dur: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M10 2h4"/>', rehab: '<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 000-7.8z"/>', result: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>' };
const SVG = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  tg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.5 3.6L2.9 10.8c-1.3.5-1.2 1.3-.2 1.6l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.4-1.2zM8.9 13.5l8.6-5.4c.4-.3.8-.1.5.2l-7.1 6.4-.3 3.1-1.7-4.3z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  yt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 7.2a3 3 0 00-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 001 7.2 31 31 0 00.5 12a31 31 0 00.5 4.8 3 3 0 002.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 002.1-2.1 31 31 0 00.5-4.8 31 31 0 00-.5-4.8zM9.7 15V9l5.8 3z"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
  flag: '<svg viewBox="0 0 24 16" width="22" height="15" aria-hidden="true"><rect width="24" height="16" rx="2" fill="#1eb53a"/><rect width="24" height="10.6" fill="#fff"/><rect width="24" height="5.3" fill="#0099b5"/><rect y="5.1" width="24" height=".5" fill="#ce1126"/><rect y="10.4" width="24" height=".5" fill="#ce1126"/></svg>',
};

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const safeUrl = (u) => (/^(https:\/\/|\/(?!\/))/.test(String(u || "")) ? String(u) : "");
const safeImg = (u) => (/^\/(assets|uploads)\/[\w./-]+$/.test(String(u || "")) ? String(u) : "");
const tel = (p) => String(p || "").replace(/[^+\d]/g, "");
export const ytId = (v) => { const m = String(v || "").match(/(?:youtu\.be\/|shorts\/|embed\/|v=|^)([\w-]{11})(?:[?&#/]|$)/); return m ? m[1] : ""; };
const paras = (s) => String(s || "").split(/\n+/).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join("");

function img(src, alt, { sizes = "100vw", cls = "", eager = false } = {}) {
  src = safeImg(src);
  if (!src) return "";
  const m = src.match(/^\/assets\/(\d)\.webp$/);
  const wh = SIZES[src];
  const srcset = m ? ` srcset="/assets/${m[1]}-480.webp 480w, /assets/${m[1]}-960.webp 960w" sizes="${sizes}"` : "";
  const dims = wh ? ` width="${wh[0]}" height="${wh[1]}"` : "";
  return `<img src="${src}"${srcset}${dims} alt="${esc(alt)}"${cls ? ` class="${cls}"` : ""} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}
const svgI = (path, sw = 1.6) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
const ytCard = (id, title, U) => `<button class="yt" type="button" data-yt="${id}" aria-label="${esc(U.play)}"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="${esc(title)}" loading="lazy" decoding="async" width="480" height="360"><span class="yplay">${SVG.play}</span></button>`;

// price "from" = lowest number in the item list, in mln sum
function fromPrice(items) {
  const n = (items || []).map((x) => parseFloat(String(x.p).replace(",", "."))).filter((v) => !isNaN(v));
  if (!n.length) return null;
  const v = Math.min(...n) * 1e6;
  return v.toLocaleString("ru-RU").replace(/\u00a0/g, " ");
}

function ctx(S, L, origin) {
  const U = UI[L];
  const tr = (o) => (o ? o[L] || o.ru || o.uz || o.en || "" : "");
  const T = (k) => esc(tr(S.t[k]));
  const c = S.contacts || {};
  const tgUrl = c.telegram ? (/^https:\/\//.test(c.telegram) ? c.telegram : "https://t.me/" + String(c.telegram).replace(/^@/, "")) : "";
  const phones = [c.phone, c.phone2].filter(Boolean);
  const ig = (S.insta || []).filter((u) => /^[\w.]+$/.test(u));
  return { U, tr, T, c, tgUrl, phones, ig, origin, mapUrl: "https://yandex.uz/maps/?text=" + encodeURIComponent(tr(c.address)) };
}

function shell(S, L, X, { title, desc, canonical, alts, ld, body, nonce, ogImage, home }) {
  const { U, T, tgUrl, phones, ig, origin } = X;
  const ads = S.ads || {};
  const gid = /^(G|AW)-[\w-]+$/.test(ads.ga4 || "") ? ads.ga4 : "";
  const awid = /^AW-[\w-]+$/.test(ads.aw || "") ? ads.aw : "";
  const tagId = gid || awid;
  const N = NL[L];
  const dd = `<div class="dd"><button type="button" class="ddb" aria-expanded="false">${N.svc}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button><div class="ddm">${(S.services || []).map((s) => `<a href="${svcUrl(L, s.slug)}"><span class="ic">${svgI(ICON[s.g] || ICON.con)}</span>${esc(X.tr(s.t))}</a>`).join("")}</div></div>`;
  const nav = `<a href="${PATH[L]}#about">${N.doc}</a>${dd}${["narxlar", "videolar", "savol-javob", "aloqa"].map((k) => `<a href="${pageUrl(L, k)}">${N[k]}</a>`).join("")}`;
  const mnav = `<a href="${PATH[L]}#about">${N.doc}</a><span class="mh">${N.svc}</span>${(S.services || []).map((s) => `<a class="sub" href="${svcUrl(L, s.slug)}">${esc(X.tr(s.t))}</a>`).join("")}${["narxlar", "videolar", "savol-javob", "aloqa", "imt"].map((k) => `<a href="${pageUrl(L, k)}">${N[k]}</a>`).join("")}`;
  const langs = LANGS.map((l) => `<a href="${alts[l]}" hreflang="${l}" lang="${l}"${l === L ? ' aria-current="true" class="on"' : ""}>${l.toUpperCase()}</a>`).join("");
  const social = (tgUrl ? `<a class="so tg" href="${esc(tgUrl)}" target="_blank" rel="noopener" data-ev="telegram">${SVG.tg}<span>Telegram</span></a>` : "") + ig.map((u) => `<a class="so ig" href="https://www.instagram.com/${esc(u)}/" target="_blank" rel="noopener" data-ev="instagram">${SVG.ig}<span>@${esc(u)}</span></a>`).join("");
  return `<!doctype html>
<html lang="${L}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${origin + canonical}">
${LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${origin + alts[l]}">`).join("\n")}
<link rel="alternate" hreflang="x-default" href="${origin + alts.ru}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${L === "ru" ? "Доктор Исмати" : "Doctor Ismati"}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${origin + canonical}">
<meta property="og:image" content="${origin + (ogImage || "/assets/4-960.webp")}">
<meta property="og:locale" content="${{ ru: "ru_RU", uz: "uz_UZ", en: "en_US" }[L]}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#2d6bff">
<meta name="format-detection" content="telephone=no">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${home ? `<link rel="preload" as="image" href="/assets/4-480.webp" imagesrcset="/assets/4-480.webp 480w, /assets/4-960.webp 960w" imagesizes="(max-width:860px) 92vw, 42vw" fetchpriority="high">` : ""}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&display=swap">
<link rel="stylesheet" href="/app.css?v=8">
${ld.map((o) => `<script type="application/ld+json" nonce="${nonce}">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`).join("\n")}
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
<div class="mnav" id="mnav" hidden><nav>${mnav}</nav><div class="lang">${langs}</div><div class="soc">${social}</div></div>
<main id="main">
${body}
</main>
<footer class="wrap foot"><span>© ${new Date().getFullYear()} ${T("fullName")}</span><nav class="fnav">${(S.services || []).map((s) => `<a href="${svcUrl(L, s.slug)}">${esc(X.tr(s.t))}</a>`).join("")}</nav><nav class="fnav">${PAGES.map((k) => `<a href="${pageUrl(L, k)}">${N[k]}</a>`).join("")}</nav><span>${U.rights}</span></footer>
<div class="chat" id="chat"><div class="chm">${phones.map((p) => `<a href="tel:${tel(p)}" data-ev="phone"><span class="ci ph">${SVG.phone}</span>${esc(p)}</a>`).join("")}${tgUrl ? `<a href="${esc(tgUrl)}" target="_blank" rel="noopener" data-ev="telegram"><span class="ci tg">${SVG.tg}</span>Telegram</a>` : ""}${ig[0] ? `<a href="https://www.instagram.com/${esc(ig[0])}/" target="_blank" rel="noopener" data-ev="instagram"><span class="ci ig">${SVG.ig}</span>Instagram</a>` : ""}</div><button type="button" class="fab" id="fab" aria-label="${N.chat}" aria-expanded="false"><span class="fo"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.5 3 2 6.9 2 11.7c0 2.6 1.3 4.9 3.4 6.5L4.5 22l4-2.1c1.1.3 2.3.5 3.5.5 5.5 0 10-3.9 10-8.7S17.5 3 12 3zm-4 10a1.3 1.3 0 110-2.6A1.3 1.3 0 018 13zm4 0a1.3 1.3 0 110-2.6 1.3 1.3 0 010 2.6zm4 0a1.3 1.3 0 110-2.6 1.3 1.3 0 010 2.6z"/></svg></span><span class="fx">${SVG.x}</span></button></div>
<div class="lb" id="lb" hidden><button type="button" class="ib lbx" aria-label="${U.close}">${SVG.x}</button><figure><img alt=""><figcaption></figcaption><div class="lbv"></div></figure></div>
<script id="i18n" type="application/json">${JSON.stringify(U.f).replace(/</g, "\\u003c")}</script>
<script src="/app.js?v=8" defer></script>
</body>
</html>`;
}

function contactBlock(S, L, X, pre) {
  const { U, T, tr, c, phones, mapUrl, tgUrl, ig } = X;
  const social = (tgUrl ? `<a class="so tg" href="${esc(tgUrl)}" target="_blank" rel="noopener" data-ev="telegram">${SVG.tg}<span>Telegram</span></a>` : "") + ig.map((u) => `<a class="so ig" href="https://www.instagram.com/${esc(u)}/" target="_blank" rel="noopener" data-ev="instagram">${SVG.ig}<span>@${esc(u)}</span></a>`).join("");
  const opts = (S.services || []).map((s, i) => { const n = tr(s.t); const on = pre ? pre === s.slug : i === 0; return `<label><input type="radio" name="service" value="${esc(n)}"${on ? " checked" : ""}><span class="ic">${svgI(ICON[s.g] || ICON.con, 1.7)}</span>${esc(n)}</label>`; }).join("") + `<label><input type="radio" name="service" value="${esc(U.f.other)}"><span class="ic">${svgI(ICON.other, 1.7)}</span>${esc(U.f.other)}</label>`;
  return `<section class="sec wrap" id="contact" aria-labelledby="h-co">
  <div class="contact rv">
    <div class="cinfo">
      <h2 id="h-co" class="h2">${T("coH")}</h2>
      <p>${T("coP")}</p>
      <ul class="clist">
        <li>${SVG.pin}<span><small>${U.addr}</small>${esc(tr(c.address))}<a class="ml" href="${esc(mapUrl)}" target="_blank" rel="noopener">${U.map} →</a></span></li>
        <li>${SVG.clock}<span><small>${U.hours}</small>${hoursTable(S, X)}</span></li>
        ${phones.length ? `<li>${SVG.phone}<span><small>${U.phone}</small>${phones.map((p) => `<a href="tel:${tel(p)}" data-ev="phone">${esc(p)}</a>`).join("")}</span></li>` : ""}
      </ul>
      <div class="soc">${social}</div>
    </div>
    <form class="lead" id="lead" novalidate>
      <input type="text" name="company" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <label class="f"><span>${U.f.n}</span><input name="name" required maxlength="80" autocomplete="name"></label>
      <label class="f"><span>${U.f.p}</span><span class="phw"><span class="cc">${SVG.flag}+998</span><input name="phone" type="tel" inputmode="numeric" required maxlength="16" autocomplete="tel-national" placeholder="90 123 45 67"></span></label>
      <fieldset class="f"><legend>${U.f.s}</legend><div class="pick">${opts}</div></fieldset>
      <label class="f"><span>${U.f.m}</span><textarea name="message" rows="2" maxlength="800"></textarea></label>
      <button class="btn wide" type="submit"><span>${U.f.b}</span><i>${SVG.arrow}</i></button>
      <p class="lmsg" id="lmsg" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>`;
}

const hoursTable = (S, X) => (S.hours || []).length ? `<span class="hrs">${S.hours.map((d) => `<span><em>${esc(X.tr(d.d))}</em><b>${esc(d.h)}</b></span>`).join("")}</span>` : esc(X.tr(S.contacts?.hours));
const galGrid = (items, X) => items.map((g) => { const u = safeImg(g.url), th = safeImg(g.thumb) || u; return u ? `<button class="ba rv" type="button" data-full="${u}" data-cap="${esc(X.tr(g.c))}">${img(th, X.tr(g.c), { sizes: "(max-width:700px) 46vw, 280px" })}</button>` : ""; }).join("");

function pageHero(L, X, title, sub, crumb) {
  return `<section class="phero wrap"><nav class="crumbs" aria-label="breadcrumb"><a href="${PATH[L]}">${X.U.home}</a>${SVG.chev}<span aria-current="page">${esc(crumb || title)}</span></nav><div class="pbox"><span class="orb" aria-hidden="true"></span><h1 class="st"><span class="ln"><span>${esc(title)}</span></span></h1>${sub ? `<p class="tagline">${esc(sub)}</p>` : ""}</div></section>`;
}

function physician(S, L, X) {
  const { tr, phones, tgUrl, ig, origin } = X;
  return {
    "@context": "https://schema.org", "@type": "Physician", "@id": origin + "/#doctor",
    name: tr(S.t.fullName), url: origin + PATH[L], image: origin + (safeImg(S.photo) || "/assets/4.webp"),
    description: tr(S.seo?.desc), medicalSpecialty: ["PlasticSurgery", "Urologic", "Gynecologic"], telephone: phones[0] || undefined,
    address: { "@type": "PostalAddress", streetAddress: L === "ru" ? "ул. Шохрух, 27" : "Shohrux ko‘chasi, 27", addressLocality: L === "ru" ? "Самарканд" : "Samarqand", addressCountry: "UZ" },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "08:30", closes: "17:00" }],
    priceRange: "150 000 UZS +", sameAs: [tgUrl, ...ig.map((u) => "https://www.instagram.com/" + u), S.reviews?.url, ...(S.youtube || [])].filter(Boolean),
    worksFor: { "@type": "MedicalClinic", name: "Relax Med Service", address: { "@type": "PostalAddress", streetAddress: "ул. Шохрух, 27", addressLocality: "Samarkand", addressCountry: "UZ" } },
  };
}

// ---------------- HOME ----------------
export function renderPage(S, L, { origin = "", nonce = "" } = {}) {
  const X = ctx(S, L, origin);
  const { U, tr, T, phones } = X;
  const stats = (S.stats || []).map((s) => `<div><b>${esc(s.v)}</b><span>${esc(tr(s.l))}</span></div>`).join("");
  const svc = (S.services || []).map((s) => `<a class="svc rv${s.gallery?.[0] ? " has" : ""}" href="${svcUrl(L, s.slug)}">${s.gallery?.[0] ? `<span class="sth">${img(safeImg(s.gallery[0].thumb) || s.gallery[0].url, tr(s.t), { sizes: "120px" })}</span>` : ""}<span class="ic">${svgI(ICON[s.g] || ICON.con)}</span><span><b>${esc(tr(s.t))}</b><small>${esc(tr(s.d))}</small></span><i class="go">${SVG.chev}</i></a>`).join("");
  const edu = (S.edu || []).map((e) => `<li><b>${esc(e.y)}</b><span><strong>${esc(tr(e.t))}</strong><small>${esc(tr(e.d))}</small></span></li>`).join("");
  const dips = (S.diplomas || []).map((d) => { const big = safeImg(d.url), th = safeImg(d.thumb) || big; return big ? `<button class="dip" type="button" data-full="${big}" data-cap="${esc(tr(d.c))}">${img(th, tr(d.c), { sizes: "260px" })}<span>${esc(tr(d.c))}</span></button>` : ""; }).join("");
  const steps = (S.steps || []).map((s, i) => `<li class="rv"><i>0${i + 1}</i><b>${esc(tr(s.t))}</b><small>${esc(tr(s.d))}</small></li>`).join("");
  const tabs = `<button type="button" class="on" data-c="-1">${U.all}</button>` + (S.prices || []).map((p, i) => `<button type="button" data-c="${i}">${esc(tr(p.cat))}</button>`).join("");
  const prices = (S.prices || []).map((p, i) => `<details class="pcat" data-c="${i}"${i === 0 ? " open" : ""}><summary><h3>${esc(tr(p.cat))}</h3><span>${p.items.length} ${U.items}</span><i aria-hidden="true">+</i></summary><div class="rows">${p.items.map((x) => `<div class="prow"><span>${esc(tr(x.t))}</span><b>${esc(x.p)} <small>${T("prcU")}</small></b></div>`).join("")}</div></details>`).join("");
  const rv = S.reviews || {};
  const revs = (rv.list || []).map((r) => `<figure class="rev"><div class="stars" aria-label="${esc(r.rating || 5)}/5">${SVG.star.repeat(Math.max(1, Math.min(5, +r.rating || 5)))}</div><blockquote>${esc(r.text)}</blockquote><figcaption><b>${esc(r.name)}</b><small>${esc(r.date)}</small></figcaption></figure>`).join("");
  const gal = (S.gallery || []).map((g) => { const u = safeImg(g.url); return u ? `<button class="gi" type="button" data-full="${u}" data-cap="${esc(tr(g.c))}">${img(u, tr(g.c), { sizes: "(max-width:700px) 70vw, 300px" })}</button>` : ""; }).join("");
  const vids = (S.videos || []).map((v) => ytId(v.id)).filter(Boolean).map((id) => ytCard(id, tr(S.t.vidH), U)).join("");
  const yt = (S.youtube || []).filter((u) => /^https:\/\/(www\.)?youtube\.com\//.test(u));

  const body = `<section class="hero wrap">
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
<section class="sec wrap" id="services" aria-labelledby="h-svc"><h2 id="h-svc" class="h2 rv">${T("svcH")}</h2><div class="svcs">${svc}</div></section>
<section class="sec wrap about" id="about" aria-labelledby="h-ab">
  <div class="apic rv">${img(S.aboutPhoto, tr(S.t.fullName), { sizes: "(max-width:860px) 92vw, 40vw" })}</div>
  <div class="atext"><h2 id="h-ab" class="h2 rv">${T("abH")}</h2><p class="rv">${T("abP")}</p><h3 class="h3 rv">${T("eduH")}</h3><ol class="edu rv">${edu}</ol></div>
</section>
${dips ? `<section class="sec wrap" aria-labelledby="h-dip"><h2 id="h-dip" class="h2 rv">${T("dipH")}</h2><div class="dips rail">${dips}</div></section>` : ""}
${vids ? `<section class="sec vband" aria-labelledby="h-vid"><div class="wrap"><div class="shead"><h2 id="h-vid" class="h2 rv">${T("vidH")}</h2>${yt[0] ? `<a class="revlink dark" href="${esc(yt[0])}" target="_blank" rel="noopener">${SVG.yt}<span>${U.ytAll}</span></a>` : ""}</div><div class="vids rail">${vids}</div></div></section>` : ""}
${steps ? `<section class="sec wrap" aria-labelledby="h-st"><h2 id="h-st" class="h2 rv">${T("stepsH")}</h2><ol class="steps">${steps}</ol></section>` : ""}
<section class="sec wrap" id="prices" aria-labelledby="h-pr"><h2 id="h-pr" class="h2 rv">${T("prcH")}</h2><div class="tabs rail" role="tablist">${tabs}</div><div class="plist">${prices}</div><p class="note">${T("prcN")}</p></section>
${revs ? `<section class="sec wrap" id="reviews" aria-labelledby="h-rv"><div class="shead"><h2 id="h-rv" class="h2 rv">${T("revH")}</h2>${safeUrl(rv.url) ? `<a class="revlink" href="${esc(rv.url)}" target="_blank" rel="noopener"><span class="stars">${SVG.star.repeat(5)}</span><b>${esc(rv.count)}</b> ${T("revT")} →</a>` : ""}</div><div class="revs rail">${revs}</div></section>` : ""}
${gal ? `<section class="sec wrap" aria-labelledby="h-gal"><h2 id="h-gal" class="h2 rv">${T("galH")}</h2><div class="gal rail">${gal}</div></section>` : ""}
${contactBlock(S, L, X)}`;

  const alts = { ru: PATH.ru, uz: PATH.uz, en: PATH.en };
  const ld = [physician(S, L, X), { "@context": "https://schema.org", "@type": "WebSite", name: L === "ru" ? "Доктор Исмати" : "Doctor Ismati", url: origin + "/", inLanguage: ["ru", "uz", "en"] }];
  return shell(S, L, X, { title: tr(S.seo?.title) || tr(S.t.fullName), desc: tr(S.seo?.desc) || tr(S.t.lead), canonical: PATH[L], alts, ld, body, nonce, home: true });
}

// ---------------- SERVICE PAGE ----------------
export function renderService(S, L, slug, { origin = "", nonce = "" } = {}) {
  const s = (S.services || []).find((x) => x.slug === slug);
  if (!s) return null;
  const X = ctx(S, L, origin);
  const { U, tr, T, phones, tgUrl, c } = X;
  const name = tr(s.t);
  const from = fromPrice(s.items);
  const priceTxt = from ? `${U.from} ${from} ${L === "en" ? "UZS" : L === "ru" ? "сум" : "so‘m"}` : U.onConsult;
  const facts = ["anest", "dur", "rehab", "result"].filter((k) => tr(s.facts?.[k]));
  const factHtml = facts.map((k, i) => `<div class="fact" style="--d:${i * 90}ms"><span class="fi">${svgI(FICON[k], 1.7)}</span><small>${U.facts[k]}</small><b>${esc(tr(s.facts[k]))}</b></div>`).join("");
  const steps = (S.steps || []).map((st, i) => `<li><i>${i + 1}</i><div><b>${esc(tr(st.t))}</b><p>${esc(tr(st.d))}</p></div></li>`).join("");
  const types = (s.types || []).map((t, i) => `<div class="type rv"><span class="tn">0${i + 1}</span><b>${esc(tr(t.t))}</b><p>${esc(tr(t.d))}</p></div>`).join("");
  const fill = (tpl, v) => tpl.replace("{s}", name).replace("{p}", priceTxt).replace("{v}", v);
  const faq = [["price", priceTxt], ...facts.filter((k) => k !== "result").map((k) => [k, tr(s.facts[k])])].map(([k, v]) => ({ q: fill(U.q[k], v), a: fill(U.a[k], v) }));
  const faqHtml = faq.map((f, i) => `<details class="qa"${i === 0 ? " open" : ""}><summary>${esc(f.q)}<i aria-hidden="true">+</i></summary><p>${esc(f.a)}</p></details>`).join("");
  const vids = (s.videos || []).map(ytId).filter(Boolean).map((id) => ytCard(id, name, U)).join("");
  const items = (s.items || []).map((x) => `<div class="prow"><span>${esc(tr(x.t))}</span><b>${esc(x.p)} <small>${T("prcU")}</small></b></div>`).join("");
  const others = (S.services || []).filter((x) => x.slug !== slug).map((x) => `<a class="svc rv" href="${svcUrl(L, x.slug)}"><span class="ic">${svgI(ICON[x.g] || ICON.con)}</span><span><b>${esc(tr(x.t))}</b><small>${esc(tr(x.d))}</small></span><i class="go">${SVG.chev}</i></a>`).join("");
  const url = svcUrl(L, slug);

  const body = `<section class="shero wrap">
  <nav class="crumbs" aria-label="breadcrumb"><a href="${PATH[L]}">${U.home}</a>${SVG.chev}<a href="${PATH[L]}#services">${U.svcs}</a>${SVG.chev}<span aria-current="page">${esc(name)}</span></nav>
  <div class="sh">
    <div class="shtext">
      <p class="chip"><span class="dot"></span>${T("role")} · ${T("nameB")}</p>
      <h1 class="st"><span class="ln"><span>${esc(name)}</span></span></h1>
      <p class="tagline">${esc(tr(s.tag))}</p>
      <div class="cta"><a class="btn" href="#contact" data-ev="cta_service"><span>${T("cta")}</span><i>${SVG.arrow}</i></a>${phones[0] ? `<a class="btn ghost" href="tel:${tel(phones[0])}" data-ev="phone">${SVG.phone}<span>${U.call}</span></a>` : ""}${tgUrl ? `<a class="btn ghost" href="${esc(tgUrl)}" target="_blank" rel="noopener" data-ev="telegram">${SVG.tg}<span>Telegram</span></a>` : ""}</div>
    </div>
    <div class="shart" aria-hidden="true"><span class="orb o1"></span><span class="orb o2"></span><span class="ring"></span><svg class="draw" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=".55" stroke-linecap="round" stroke-linejoin="round">${ICON[s.g] || ICON.con}</svg></div>
  </div>
  ${factHtml ? `<div class="facts">${factHtml}</div>` : ""}
</section>

<div class="wrap sgrid">
  <div class="smain">
    <section class="sblock rv"><h2 class="h2">${T("about1")}</h2><div class="prose">${paras(tr(s.about))}</div></section>
    ${steps ? `<section class="sblock"><h2 class="h2 rv">${T("stepsSvcH")}</h2><ol class="tl" id="tl"><span class="tlbar"><span></span></span>${steps}</ol></section>` : ""}
    ${types ? `<section class="sblock"><h2 class="h2 rv">${esc(name)}: ${T("typesH").toLowerCase()}</h2><div class="types">${types}</div></section>` : ""}
    ${(s.gallery || []).length ? `<section class="sblock"><h2 class="h2 rv">${T("galSvc")}</h2><div class="bag">${galGrid(s.gallery, X)}</div></section>` : ""}
    <section class="sblock"><h2 class="h2 rv">${T("faqH")}</h2><div class="faq">${faqHtml}</div></section>
  </div>
  <aside class="sside">
    <div class="pcard rv">
      <small>${T("priceH")}</small>
      <b class="pbig">${esc(priceTxt)}</b>
      <p class="pnote">* ${U.exact}</p>
      ${items ? `<div class="prows">${items}</div>` : ""}
      <a class="btn wide" href="#contact" data-ev="cta_price"><span>${U.book}</span><i>${SVG.arrow}</i></a>
      <div class="pbtns">${phones[0] ? `<a class="btn ghost" href="tel:${tel(phones[0])}" data-ev="phone">${SVG.phone}<span>${U.call}</span></a>` : ""}${tgUrl ? `<a class="btn ghost" href="${esc(tgUrl)}" target="_blank" rel="noopener" data-ev="telegram">${SVG.tg}<span>Telegram</span></a>` : ""}</div>
    </div>
    <div class="icard rv">
      <ul class="clist">
        ${phones.map((p) => `<li>${SVG.phone}<a href="tel:${tel(p)}" data-ev="phone">${esc(p)}</a></li>`).join("")}
        <li>${SVG.pin}<span>${esc(tr(c.address))}</span></li>
        <li>${SVG.clock}<span>${esc(tr(c.hours))}</span></li>
      </ul>
    </div>
  </aside>
</div>

${vids ? `<section class="sec vband" aria-labelledby="h-v"><div class="wrap"><h2 id="h-v" class="h2 rv">${T("vidH")}</h2><div class="vids rail">${vids}</div></div></section>` : ""}

<section class="sec wrap" aria-labelledby="h-rel"><h2 id="h-rel" class="h2 rv">${T("relH")}</h2><div class="svcs">${others}</div></section>
${contactBlock(S, L, X, slug)}`;

  const alts = Object.fromEntries(LANGS.map((l) => [l, svcUrl(l, slug)]));
  const title = (L === "ru" ? `${name} в Самарканде — цена, этапы | Доктор Исмати` : L === "uz" ? `${name} Samarqandda — narxi, bosqichlari | Doktor Ismati` : `${name} in Samarkand — price, stages | Dr. Ismati`);
  const desc = `${tr(s.tag)} ${tr(S.t.fullName)} — ${tr(S.t.clinic)}. ${priceTxt}.`;
  const ld = [
    { "@context": "https://schema.org", "@type": "MedicalProcedure", name, description: tr(s.about).split("\n")[0], procedureType: "https://schema.org/SurgicalProcedure", url: origin + url,
      followup: tr(s.facts?.rehab) || undefined, performer: { "@id": origin + "/#doctor" } },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: U.home, item: origin + PATH[L] }, { "@type": "ListItem", position: 2, name, item: origin + url }] },
    physician(S, L, X),
  ];
  return shell(S, L, X, { title, desc, canonical: url, alts, ld, body, nonce, home: false });
}

// ---------------- INNER PAGES: prices, videos, faq, contact, bmi ----------------
export function renderInner(S, L, key, { origin = "", nonce = "" } = {}) {
  if (!PAGES.includes(key)) return null;
  const X = ctx(S, L, origin);
  const { U, tr, T, phones, tgUrl, c, ig } = X;
  const N = NL[L];
  let body = "", title = "", desc = "", extraLd = [];
  const cta = `<section class="sec wrap"><div class="cbox rv"><div><h2 class="h2">${T("moreQ")}</h2><p>${T("moreQP")}</p></div><div class="cta"><a class="btn" href="${pageUrl(L, "aloqa")}#lead"><span>${T("cta")}</span><i>${SVG.arrow}</i></a>${tgUrl ? `<a class="btn ghost" href="${esc(tgUrl)}" target="_blank" rel="noopener" data-ev="telegram">${SVG.tg}<span>Telegram</span></a>` : ""}</div></div></section>`;

  if (key === "narxlar") {
    title = N.narxlar;
    const tabs = `<button type="button" class="on" data-c="-1">${U.all}</button>` + (S.prices || []).map((p, i) => `<button type="button" data-c="${i}">${esc(tr(p.cat))}</button>`).join("");
    const cats = (S.prices || []).map((p, i) => `<section class="ptable rv pcat" data-c="${i}"><h2 class="h3">${esc(tr(p.cat))}</h2><div class="ptbl">${p.items.map((x, j) => `<div class="tr"><span class="n">${j + 1}</span><span class="t">${esc(tr(x.t))}</span><b>${esc(x.p)} <small>${T("prcU")}</small></b></div>`).join("")}</div></section>`).join("");
    body = pageHero(L, X, title, tr(S.t.priceP)) + `<section class="sec wrap tight"><div class="tabs rail" role="tablist">${tabs}</div><div class="plist2">${cats}</div><p class="note">${T("prcN")}</p></section>` + cta;
    desc = (L === "ru" ? "Цены на пластические операции в Самарканде: блефаропластика, подтяжка лица, пластика груди, липосакция, урогинекология. " : L === "uz" ? "Samarqandda plastik operatsiyalar narxlari: blefaroplastika, yuz tortish, ko‘krak plastikasi, liposaksiya, uroginekologiya. " : "Plastic surgery prices in Samarkand: blepharoplasty, facelift, breast surgery, liposuction, urogynecology. ") + tr(S.t.fullName);
  }

  if (key === "videolar") {
    title = N.videolar;
    const groups = [{ name: U.all, ids: (S.videos || []).map((v) => ytId(v.id)) }, ...(S.services || []).map((s) => ({ name: tr(s.t), slug: s.slug, ids: (s.videos || []).map(ytId) }))].map((g) => ({ ...g, ids: g.ids.filter(Boolean) })).filter((g) => g.ids.length);
    const all = [...new Set(groups.flatMap((g) => g.ids))];
    const tag = (id) => groups.filter((g) => g.slug && g.ids.includes(id)).map((g) => g.slug).join(" ");
    const tabs = `<button type="button" class="on" data-v="*">${U.all}</button>` + groups.filter((g) => g.slug).map((g) => `<button type="button" data-v="${g.slug}">${esc(g.name)}</button>`).join("");
    const yt = (S.youtube || []).filter((u) => /^https:\/\/(www\.)?youtube\.com\//.test(u));
    body = pageHero(L, X, title, tr(S.t.vidPP)) + `<section class="sec wrap tight"><div class="tabs rail vtabs">${tabs}</div><div class="vgrid">${all.map((id) => `<div class="vi" data-tags="${tag(id)}">${ytCard(id, title, U)}</div>`).join("")}</div>${yt.length ? `<div class="soc ytl">${yt.map((u) => `<a class="so yt" href="${esc(u)}" target="_blank" rel="noopener">${SVG.yt}<span>${esc(u.replace(/^https:\/\/(www\.)?youtube\.com\//, ""))}</span></a>`).join("")}</div>` : ""}</section>` + cta;
    desc = tr(S.t.vidPP) + " " + tr(S.t.fullName);
    extraLd = all.slice(0, 12).map((id) => ({ "@context": "https://schema.org", "@type": "VideoObject", name: tr(S.t.fullName) + " — " + title, description: tr(S.t.vidPP), thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, embedUrl: `https://www.youtube-nocookie.com/embed/${id}`, contentUrl: `https://www.youtube.com/shorts/${id}`, uploadDate: "2026-10-31" }));
  }

  if (key === "savol-javob") {
    title = tr(S.t.faqPH);
    const list = S.faq || [];
    body = pageHero(L, X, title, tr(S.t.faqPP), N["savol-javob"]) + `<section class="sec wrap tight narrow"><div class="faq big">${list.map((f, i) => `<details class="qa rv"${i === 0 ? " open" : ""}><summary><span class="qn">${String(i + 1).padStart(2, "0")}</span>${esc(tr(f.q))}<i aria-hidden="true">+</i></summary><p>${esc(tr(f.a))}</p></details>`).join("")}</div></section>` + cta;
    desc = tr(S.t.faqPP) + " " + tr(S.t.fullName);
    extraLd = [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: list.map((f) => ({ "@type": "Question", name: tr(f.q), acceptedAnswer: { "@type": "Answer", text: tr(f.a) } })) }];
  }

  if (key === "aloqa") {
    title = tr(S.t.coPH);
    const q = encodeURIComponent(L === "ru" ? "Самарканд, улица Шохрух, 27" : "Samarqand, Shohrux ko‘chasi 27");
    body = pageHero(L, X, title, tr(S.t.coPP)) + `<section class="sec wrap tight"><div class="cgrid">
      <div class="icard big rv"><ul class="clist">
        ${phones.map((p) => `<li>${SVG.phone}<span><small>${U.phone}</small><a href="tel:${tel(p)}" data-ev="phone">${esc(p)}</a></span></li>`).join("")}
        ${tgUrl ? `<li>${SVG.tg}<span><small>Telegram</small><a href="${esc(tgUrl)}" target="_blank" rel="noopener" data-ev="telegram">${esc(tgUrl.replace("https://t.me/", "@"))}</a></span></li>` : ""}
        ${ig.map((u) => `<li>${SVG.ig}<span><small>Instagram</small><a href="https://www.instagram.com/${esc(u)}/" target="_blank" rel="noopener" data-ev="instagram">@${esc(u)}</a></span></li>`).join("")}
        <li>${SVG.pin}<span><small>${U.addr}</small>${esc(tr(c.address))} · Relax Med Service</span></li>
      </ul></div>
      <div class="icard big rv"><h2 class="h3" style="margin-top:0">${N.wd}</h2>${hoursTable(S, X)}<p class="note">${N.closed}</p></div>
      <div class="map rv"><iframe title="${N.map}" src="https://www.google.com/maps?q=${q}&z=16&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
    </div></section>` + contactBlock(S, L, X);
    desc = `${tr(S.t.fullName)} — ${tr(c.address)}. ${phones.join(", ")}. ${tr(c.hours)}.`;
  }

  if (key === "imt") {
    title = N.imt;
    body = pageHero(L, X, title, tr(S.t.bmiP)) + `<section class="sec wrap tight"><div class="bmi">
      <form class="icard big rv" id="bmi"><label class="f"><span>${N.height}</span><input name="h" type="number" inputmode="decimal" min="100" max="230" placeholder="170" required></label><label class="f"><span>${N.weight}</span><input name="w" type="number" inputmode="decimal" min="30" max="300" placeholder="70" required></label><button class="btn wide" type="submit"><span>${N.calc}</span><i>${SVG.arrow}</i></button><div class="bres" id="bres" hidden><small>${N.your}</small><b id="bval">—</b><span id="bcat"></span><div class="bbar"><span id="bdot"></span></div></div></form>
      <div class="icard big rv"><h2 class="h3" style="margin-top:0">${N.imt}</h2><ul class="btab">${N.cats.map((x, i) => `<li data-i="${i}"><i class="c${i}"></i><b>${esc(x[0])}</b><span>${esc(x[1])}</span></li>`).join("")}</ul></div>
    </div></section>` + cta;
    desc = tr(S.t.bmiP);
  }

  const url = pageUrl(L, key);
  const alts = Object.fromEntries(LANGS.map((l) => [l, pageUrl(l, key)]));
  const brand = L === "ru" ? "Доктор Исмати, Самарканд" : L === "uz" ? "Doktor Ismati, Samarqand" : "Dr. Ismati, Samarkand";
  const ld = [{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: U.home, item: origin + PATH[L] }, { "@type": "ListItem", position: 2, name: title, item: origin + url }] }, ...extraLd];
  return shell(S, L, X, { title: `${title} — ${brand}`, desc, canonical: url, alts, ld, body, nonce, home: false });
}
