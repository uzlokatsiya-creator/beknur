(() => {
const LANGS = ["uz", "ru", "en"], E = () => ({ uz: "", ru: "", en: "" });
const TABS = { main: "Matnlar", photos: "Rasmlar", diplomas: "Diplomlar", services: "Xizmatlar", videos: "Videolar", prices: "Narxlar", reviews: "Sharhlar", about: "Ta’lim va raqamlar", contacts: "Aloqa", seo: "SEO va reklama" };
const TS = { main: "Saytdagi asosiy matnlar — 3 tilda", photos: "Portret, “Shifokor haqida” rasmi va galereya", diplomas: "Diplom va sertifikat rasmlari", services: "Har bir xizmatning alohida sahifasi: matn, faktlar, turlar, narx, videolar", videos: "Bosh sahifadagi umumiy videolar (YouTube)", prices: "Narxlar katalogi", reviews: "Bemorlar sharhlari va clinics.uz havolasi", about: "Ta’lim tarixi, raqamlar, ish bosqichlari", contacts: "Telefon, Telegram, Instagram, manzil", seo: "Google sarlavhalari, Google Analytics va Google Ads" };
const TI = {
  main: '<path d="M4 6h16M4 12h16M4 18h10"/>', photos: '<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 8"/>',
  diplomas: '<rect x="3" y="4" width="18" height="13" rx="2"/><circle cx="12" cy="17" r="3"/><path d="M10.5 19.5L10 22l2-1 2 1-.5-2.5"/>', services: '<path d="M12 3c-4 0-6 3.5-6 8 0 5 3 9 6 9s6-4 6-9c0-4.5-2-8-6-8z"/>', videos: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z"/>',
  prices: '<path d="M20 12l-8 8-9-9V3h8z"/><circle cx="7.5" cy="7.5" r="1.5"/>', reviews: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  about: '<path d="M12 4l10 5-10 5L2 9z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/>', contacts: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/>',
  seo: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
};
const LBL = { role: "Mutaxassislik (ism ustida)", nameA: "Ism (1-qator)", nameB: "Familiya (2-qator)", fullName: "To‘liq ism", degree: "Ilmiy daraja", lead: "Qisqa tavsif", clinic: "Klinika va shahar", cta: "Asosiy tugma", svcH: "“Xizmatlar” sarlavhasi", abH: "“Shifokor haqida” sarlavhasi", abP: "Shifokor haqida matn", eduH: "“Ta’lim” sarlavhasi", dipH: "“Diplomlar” sarlavhasi", stepsH: "“Qanday ishlaymiz” sarlavhasi", prcH: "“Narxlar” sarlavhasi", prcU: "Narx birligi", prcN: "Narxlar izohi", revH: "“Sharhlar” sarlavhasi", revT: "Sharhlar soni yonidagi yozuv", revB: "“Barcha sharhlar” tugmasi", galH: "“Galereya” sarlavhasi", coH: "Aloqa sarlavhasi", coP: "Aloqa matni" };
const LONG = /lead|abP|coP/;
let S = null, tab = "main", token = sessionStorage.getItem("tk"), dirty = false, challenge = null;
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const get = (p) => p.split(".").reduce((o, k) => o[k], S);
const st = (t) => ($("#st").textContent = t);
const mark = () => { dirty = true; $("#bar").classList.add("dirty"); st("● Saqlanmagan o‘zgarishlar"); };
const api = (path, opt = {}) => fetch(path, { ...opt, headers: { ...(opt.headers || {}), ...(token ? { Authorization: "Bearer " + token } : {}) } });

const tri = (path, o, long) => `<div class="tri">${LANGS.map((l) => `<div><small>${l.toUpperCase()}</small>${long ? `<textarea data-p="${path}" data-l="${l}">${esc(o?.[l])}</textarea>` : `<input data-p="${path}" data-l="${l}" value="${esc(o?.[l])}">`}</div>`).join("")}</div>`;
const inp = (path, v, ph = "") => `<input data-s="${path}" value="${esc(v)}" placeholder="${esc(ph)}">`;
const del = (p) => `<button class="b sm d" data-del="${p}">O‘chirish</button>`;
const mv = (p, i) => `<button class="b sm" data-mv="${p}:${i}:-1" title="Yuqoriga">↑</button><button class="b sm" data-mv="${p}:${i}:1" title="Pastga">↓</button>`;
let openSvc = -1;
const ytId = (v) => { const m = String(v || "").match(/(?:youtu\.be\/|shorts\/|embed\/|v=|^)([\w-]{11})(?:[?&#/]|$)/); return m ? m[1] : ""; };
const vidList = (p, ids, obj) => `<div class="gal">${ids.map((id, j) => `<div class="box"><img src="https://i.ytimg.com/vi/${esc(id)}/hqdefault.jpg" alt=""><p class="hint">${esc(id)}</p><div class="row">${mv(p, j)}${del(p + "." + j)}</div></div>`).join("")}</div><label>YouTube havolasini qo‘shish (shorts yoki oddiy video)</label><div class="row"><input data-vadd="${p}" data-obj="${obj ? 1 : ""}" placeholder="https://youtube.com/shorts/..."><button class="b sm" data-vbtn="${p}">Qo‘shish</button></div>`;
const box = (inner, p, i) => `<div class="box">${inner}<div class="row">${mv(p, i)}${del(p + "." + i)}</div></div>`;

function render() {
  $("#tabs").innerHTML = Object.entries(TABS).map(([k, v]) => `<button class="${k === tab ? "on" : ""}" data-tab="${k}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round">${TI[k]}</svg>${v}</button>`).join("");
  $("#ttl").textContent = TABS[tab]; $("#tsub").textContent = TS[tab];
  S.reviews = S.reviews || { count: "", url: "", list: [] }; S.reviews.list = S.reviews.list || [];
  S.diplomas = S.diplomas || []; S.seo = S.seo || { title: E(), desc: E() }; S.ads = S.ads || { ga4: "", aw: "", awLabel: "" };
  let h = "";
  if (tab === "main") h = `<div class="card"><p class="hint">Har bir matn 3 tilda. Qisqa va aniq yozing — sayt minimalistik bo‘lishi uchun.</p>${Object.keys(LBL).filter((k) => S.t[k]).map((k) => `<label>${LBL[k]}</label>${tri("t." + k, S.t[k], LONG.test(k))}`).join("")}</div>`;
  if (tab === "photos") h = `<div class="card"><h2>Asosiy portret (bosh ekran)</h2><div class="thumbs">${S.photo ? `<img src="${esc(S.photo)}">` : ""}</div><label>Yangi rasm</label><input type="file" accept="image/*" data-up="photo"></div>
    <div class="card"><h2>“Shifokor haqida” rasmi</h2><div class="thumbs">${S.aboutPhoto ? `<img src="${esc(S.aboutPhoto)}">` : ""}</div><label>Yangi rasm</label><input type="file" accept="image/*" data-up="aboutPhoto"></div>
    <div class="card"><h2>Galereya</h2><label>Rasm qo‘shish (bir nechtasini tanlash mumkin)</label><input type="file" accept="image/*" multiple data-up="gallery"><div class="gal" style="margin-top:14px">${S.gallery.map((g, i) => box(`<img src="${esc(g.url)}"><label>Izoh</label>${tri("gallery." + i + ".c", g.c)}`, "gallery", i)).join("")}</div></div>`;
  if (tab === "diplomas") h = `<div class="card"><label>Diplom yoki sertifikat rasmini qo‘shish</label><input type="file" accept="image/*" multiple data-up="diplomas"><div class="gal" style="margin-top:14px">${S.diplomas.map((d, i) => box(`<img src="${esc(d.thumb || d.url)}"><label>Nomi</label>${tri("diplomas." + i + ".c", d.c)}`, "diplomas", i)).join("")}</div></div>`;
  if (tab === "services") h = `<div class="card"><p class="hint">Har bir xizmat saytda alohida sahifa bo‘ladi: <b>/xizmatlar/&lt;manzil&gt;</b>. Bo‘limni ochish uchun nomini bosing.</p>${S.services.map((s, i) => { s.facts = s.facts || {}; s.types = s.types || []; s.items = s.items || []; s.videos = s.videos || []; return `<details class="box" ${openSvc === i ? "open" : ""} data-svc="${i}"><summary style="cursor:pointer;font-weight:600;font-size:16px">${esc(s.t?.uz || s.t?.ru || "Yangi xizmat")} <span class="hint">/xizmatlar/${esc(s.slug || "")}</span></summary>
    <label>Sahifa manzili (lotin harflari, tire bilan)</label>${inp("services." + i + ".slug", s.slug, "blefaroplastika")}
    <label>Nomi</label>${tri("services." + i + ".t", s.t)}<label>Qisqa tavsif (karta)</label>${tri("services." + i + ".d", s.d)}
    <label>Ikonka</label><select data-s="services.${i}.g">${[["up", "Ko‘z"], ["face", "Yuz"], ["nose", "Burun"], ["body", "Tana"], ["con", "Tibbiy belgi"]].map(([v, n]) => `<option value="${v}"${s.g === v ? " selected" : ""}>${n}</option>`).join("")}</select>
    <label>Shior (sahifa tepasida)</label>${tri("services." + i + ".tag", s.tag)}
    <label>“Operatsiya haqida” matni (yangi xatboshi — yangi qatordan)</label>${tri("services." + i + ".about", s.about, 1)}
    <h2 style="margin-top:18px">Faktlar</h2>${[["anest", "Anesteziya"], ["dur", "Davomiyligi"], ["rehab", "Tiklanish"], ["result", "Natija"]].map(([k, n]) => { s.facts[k] = s.facts[k] || E(); return `<label>${n}</label>${tri(`services.${i}.facts.${k}`, s.facts[k])}`; }).join("")}
    <h2 style="margin-top:18px">Turlari</h2>${s.types.map((t, j) => box(`<label>Nomi</label>${tri(`services.${i}.types.${j}.t`, t.t)}<label>Tavsif</label>${tri(`services.${i}.types.${j}.d`, t.d)}`, `services.${i}.types`, j)).join("")}<button class="b sm" data-add="services.${i}.types">+ Tur qo‘shish</button>
    <h2 style="margin-top:18px">Narxlar (sahifadagi narx kartasi)</h2><p class="hint">“dan” narxi eng kichik raqamdan avtomatik hisoblanadi.</p>${s.items.map((x, j) => box(`<label>Xizmat</label>${tri(`services.${i}.items.${j}.t`, x.t)}<label>Narx (mln so‘m)</label>${inp(`services.${i}.items.${j}.p`, x.p)}`, `services.${i}.items`, j)).join("")}<button class="b sm" data-add="services.${i}.items">+ Narx qo‘shish</button>
    <h2 style="margin-top:18px">Videolar</h2>${vidList(`services.${i}.videos`, s.videos)}
    <div class="row" style="margin-top:16px">${s.slug ? `<a class="b sm" href="/xizmatlar/${esc(s.slug)}" target="_blank" rel="noopener">Sahifani ochish ↗</a>` : ""}${mv("services", i)}${del("services." + i)}</div></details>`; }).join("")}<button class="b p" data-add="services">+ Yangi xizmat</button></div>`;
  if (tab === "videos") { S.videos = S.videos || []; h = `<div class="card"><p class="hint">Bosh sahifadagi “Videolar” bo‘limi. Xizmatga oid videolarni “Xizmatlar” bo‘limida har bir xizmat ichiga qo‘shing.</p>${vidList("videos", S.videos.map((v) => v.id), true)}</div>`; }
  if (tab === "prices") h = S.prices.map((p, i) => `<div class="card"><label>Bo‘lim nomi</label>${tri("prices." + i + ".cat", p.cat)}${p.items.map((x, j) => `<div class="box"><label>Xizmat</label>${tri(`prices.${i}.items.${j}.t`, x.t)}<label>Narx (mln so‘m, masalan: 3–4 yoki 0,15)</label>${inp(`prices.${i}.items.${j}.p`, x.p)}<div class="row">${mv(`prices.${i}.items`, j)}${del(`prices.${i}.items.${j}`)}</div></div>`).join("")}<div class="row"><button class="b" data-add="prices.${i}.items">+ Xizmat</button>${mv("prices", i)}${del("prices." + i)}</div></div>`).join("") + `<div class="card"><button class="b p" data-add="prices">+ Yangi bo‘lim</button></div>`;
  if (tab === "reviews") h = `<div class="card"><h2>clinics.uz</h2><label>Sharhlar soni</label>${inp("reviews.count", S.reviews.count)}<label>Sharhlar sahifasi havolasi</label>${inp("reviews.url", S.reviews.url)}</div>
    <div class="card"><h2>Saytda ko‘rinadigan sharhlar</h2><p class="hint">Faqat haqiqiy bemorlar sharhlarini qo‘ying.</p>${S.reviews.list.map((r, i) => box(`<label>Ism</label>${inp(`reviews.list.${i}.name`, r.name)}<label>Sana</label>${inp(`reviews.list.${i}.date`, r.date, "01.10.2026")}<label>Baho (1–5)</label>${inp(`reviews.list.${i}.rating`, r.rating)}<label>Sharh matni</label><textarea data-s="reviews.list.${i}.text">${esc(r.text)}</textarea>`, "reviews.list", i)).join("")}<button class="b" data-add="reviews.list">+ Sharh qo‘shish</button></div>`;
  if (tab === "about") h = `<div class="card"><h2>Ta’lim</h2>${S.edu.map((e, i) => box(`<label>Yil</label>${inp(`edu.${i}.y`, e.y)}<label>Nomi</label>${tri("edu." + i + ".t", e.t)}<label>Joyi</label>${tri("edu." + i + ".d", e.d)}`, "edu", i)).join("")}<button class="b" data-add="edu">+ Qo‘shish</button></div>
    <div class="card"><h2>Raqamlar (bosh ekran)</h2>${S.stats.map((s, i) => box(`<label>Qiymat</label>${inp(`stats.${i}.v`, s.v)}<label>Yozuv</label>${tri("stats." + i + ".l", s.l)}`, "stats", i)).join("")}<button class="b" data-add="stats">+ Raqam</button></div>
    <div class="card"><h2>Ish bosqichlari</h2>${S.steps.map((s, i) => box(`<label>Nomi</label>${tri("steps." + i + ".t", s.t)}<label>Tavsif</label>${tri("steps." + i + ".d", s.d)}`, "steps", i)).join("")}<button class="b" data-add="steps">+ Bosqich</button></div>`;
  if (tab === "contacts") { const c = S.contacts; h = `<div class="card"><label>Telefon</label>${inp("contacts.phone", c.phone, "+998 90 123 45 67")}<label>Telefon 2</label>${inp("contacts.phone2", c.phone2)}<label>Telegram (havola yoki @username)</label>${inp("contacts.telegram", c.telegram)}<label>Instagram akkauntlar (vergul bilan)</label><input id="ig" value="${esc((S.insta || []).join(", "))}"><label>Manzil</label>${tri("contacts.address", c.address)}<label>Ish vaqti</label>${tri("contacts.hours", c.hours)}</div>`; }
  if (tab === "seo") h = `<div class="card"><h2>Google qidiruvi</h2><p class="hint">Sarlavha ~60 belgi, tavsif ~155 belgi. Asosiy kalit so‘zlarni (masalan “блефаропластика Самарканд”) tabiiy qilib yozing.</p><label>Sahifa sarlavhasi (title)</label>${tri("seo.title", S.seo.title)}<label>Tavsif (meta description)</label>${tri("seo.desc", S.seo.desc, 1)}</div>
    <div class="card"><h2>Google Analytics va Google Ads</h2><p class="hint">Bo‘sh qoldirilsa, kuzatuv kodi saytga qo‘yilmaydi.</p><label>Google Analytics 4 ID</label>${inp("ads.ga4", S.ads.ga4, "G-XXXXXXXXXX")}<label>Google Ads ID</label>${inp("ads.aw", S.ads.aw, "AW-123456789")}<label>Google Ads konversiya yorlig‘i (ariza yuborilganda)</label>${inp("ads.awLabel", S.ads.awLabel, "AbCdEfGhIj")}</div>`;
  $("#panel").innerHTML = h;
}

const NEW = { services: () => ({ t: E(), d: E(), g: "con" }), stats: () => ({ v: "", l: E() }), steps: () => ({ t: E(), d: E() }), prices: () => ({ cat: E(), items: [] }), edu: () => ({ y: "", t: E(), d: E() }), "reviews.list": () => ({ name: "", date: "", rating: 5, text: "" }) };
const NEWX = (p) => /\.types$/.test(p) ? { t: E(), d: E() } : /\.items$/.test(p) ? { t: E(), p: "" } : NEW[p] ? NEW[p]() : null;
function keepOpen(p) { const m = /^services\.(\d+)\./.exec(p + "."); openSvc = m && p !== "services" ? +m[1] : -1; }
document.addEventListener("toggle", (e) => { if (e.target.dataset && e.target.dataset.svc && e.target.open) openSvc = +e.target.dataset.svc; }, true);
document.addEventListener("input", (e) => {
  const el = e.target;
  if (el.dataset.p) { get(el.dataset.p)[el.dataset.l] = el.value; mark(); }
  else if (el.dataset.s) { const k = el.dataset.s.split("."); get(k.slice(0, -1).join("."))[k.at(-1)] = el.value; mark(); }
  else if (el.id === "ig") { S.insta = el.value.split(",").map((s) => s.trim().replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/.*$/, "")).filter((s) => /^[\w.]+$/.test(s)); mark(); }
});
document.addEventListener("change", (e) => { if (e.target.tagName === "SELECT" && e.target.dataset.s) { const k = e.target.dataset.s.split("."); get(k.slice(0, -1).join("."))[k.at(-1)] = e.target.value; mark(); } });
document.addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.tab) { tab = b.dataset.tab; render(); scrollTo(0, 0); return; }
  if (b.dataset.del) { if (!confirm("O‘chirilsinmi?")) return; const k = b.dataset.del.split("."); keepOpen(b.dataset.del); get(k.slice(0, -1).join(".")).splice(+k.at(-1), 1); mark(); render(); }
  if (b.dataset.add) { const p = b.dataset.add; const n = p === "services" ? { slug: "", t: E(), d: E(), g: "con", tag: E(), about: E(), facts: {}, types: [], items: [], videos: [] } : NEWX(p); if (!n) return; get(p).push(n); keepOpen(p); mark(); render(); }
  if (b.dataset.vbtn) { const p = b.dataset.vbtn, el = document.querySelector(`[data-vadd="${p}"]`), id = ytId(el.value.trim()); if (!id) { alert("YouTube havolasi noto‘g‘ri"); return; } get(p).push(el.dataset.obj ? { id } : id); keepOpen(p); mark(); render(); }
  if (b.dataset.mv) { const [p, i, d] = b.dataset.mv.split(":"), a = get(p), j = +i + +d; if (j >= 0 && j < a.length) { [a[i], a[j]] = [a[j], a[i]]; keepOpen(p); mark(); render(); } }
});
document.addEventListener("change", async (e) => {
  const el = e.target; if (!el.dataset.up) return; const k = el.dataset.up;
  for (const f of el.files) {
    st("Yuklanmoqda: " + f.name);
    try {
      const url = await upload(f, 1800);
      if (k === "gallery") S.gallery.push({ url, c: E() });
      else if (k === "diplomas") S.diplomas.push({ url, thumb: await upload(f, 560), c: E() });
      else S[k] = url;
      mark();
    } catch (err) { st("Xato: " + err.message); }
  }
  render(); st("Rasm yuklandi. Endi “Saqlash”ni bosing.");
});

// shrink photos before upload (webp)
async function shrink(file, max) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  const img = await createImageBitmap(file); const k = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement("canvas"); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
  c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
  return await new Promise((r) => c.toBlob((b) => r(b || file), "image/webp", 0.84));
}
async function upload(f, max) {
  const b = await shrink(f, max);
  const r = await api("/api/upload", { method: "POST", headers: { "Content-Type": b.type || f.type }, body: b });
  if (r.status === 401) { logout(); throw new Error("qayta kiring"); }
  const j = await r.json(); if (!r.ok) throw new Error(j.error || r.status); return j.url;
}

$("#save").onclick = async () => {
  st("Saqlanmoqda…");
  const r = await api("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(S) });
  if (r.status === 401) { st("Sessiya tugadi, qayta kiring"); logout(); return; }
  if (r.ok) { dirty = false; $("#bar").classList.remove("dirty"); st("✓ Saqlandi — saytda ko‘rinadi"); }
  else st("❌ Xato: " + ((await r.json().catch(() => ({}))).error || r.status));
};
async function logout() { try { await api("/api/logout", { method: "POST" }); } catch {} sessionStorage.removeItem("tk"); token = null; location.reload(); }
$("#out").onclick = () => { if (!dirty || confirm("Saqlanmagan o‘zgarishlar bor. Chiqasizmi?")) logout(); };
addEventListener("beforeunload", (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } });

async function start() {
  const r = await api("/api/content", { cache: "no-store" });
  if (r.status === 401) { sessionStorage.removeItem("tk"); token = null; return; }
  S = await r.json();
  $("#login").classList.add("hide"); $("#app").classList.remove("hide"); $("#bar").classList.remove("hide"); render();
}

// ---- login: step 1 password, step 2 Telegram code ----
const err = (t) => { $("#lerr").textContent = t; const c = $("#lcard"); c.classList.remove("shake"); void c.offsetWidth; c.classList.add("shake"); };
async function busy(btn, label, fn) { btn.classList.add("ld"); const old = btn.textContent; btn.textContent = label; try { return await fn(); } finally { btn.classList.remove("ld"); btn.textContent = old; } }
$("#eye").onclick = () => { const p = $("#pw"); p.type = p.type === "password" ? "text" : "password"; p.focus(); };
$("#go").onclick = () => busy($("#go"), "Tekshirilmoqda", async () => {
  $("#lerr").textContent = ""; if (!$("#pw").value) return err("Parolni kiriting");
  let r, j = {}; try { r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: $("#pw").value }) }); j = await r.json().catch(() => ({})); } catch { return err("Server bilan aloqa yo‘q"); }
  if (!r.ok) return err(j.error || "Xato");
  challenge = j.challenge; $("#pw").value = "";
  $("#step1").classList.add("hide"); $("#step2").classList.remove("hide");
  $("#lsub").textContent = "Telegram’ga yuborilgan 6 xonali kodni kiriting"; $("#code").focus();
});
$("#go2").onclick = () => busy($("#go2"), "Tekshirilmoqda", async () => {
  $("#lerr").textContent = ""; const code = $("#code").value.replace(/\D/g, ""); if (code.length !== 6) return err("6 xonali kodni kiriting");
  let r, j = {}; try { r = await fetch("/api/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ challenge, code }) }); j = await r.json().catch(() => ({})); } catch { return err("Server bilan aloqa yo‘q"); }
  if (!r.ok) { if (r.status === 410 || /Qaytadan/.test(j.error || "")) back(); return err(j.error || "Xato"); }
  token = j.token; sessionStorage.setItem("tk", token); await start();
});
function back() { challenge = null; $("#code").value = ""; $("#step2").classList.add("hide"); $("#step1").classList.remove("hide"); $("#lsub").textContent = "Doktor Ismati sayti boshqaruvi"; $("#pw").focus(); }
$("#back").onclick = back;
$("#pw").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#go").click(); });
$("#code").addEventListener("input", (e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6); if (e.target.value.length === 6) $("#go2").click(); });
$("#code").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#go2").click(); });
if (token) start();
})();
