(() => {
  const d = document, $ = (s, r = d) => r.querySelector(s), $$ = (s, r = d) => [...r.querySelectorAll(s)];
  const root = d.documentElement;
  root.classList.add("js");
  requestAnimationFrame(() => setTimeout(() => root.classList.add("ready"), 40));
  const F = JSON.parse($("#i18n").textContent);
  const gtag = (...a) => { if (typeof window.gtag === "function") window.gtag(...a); };

  // header shadow + floating button
  const hdr = $("#hdr"), fab = $("#fab");
  const onScroll = () => { const y = scrollY; hdr.classList.toggle("sc", y > 10); fab && fab.classList.toggle("on", y > innerHeight * 0.8); };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  // mobile menu
  const burger = $("#burger"), mnav = $("#mnav");
  const setMenu = (open) => { mnav.hidden = !open; d.body.classList.toggle("menu-open", open); burger.setAttribute("aria-expanded", open); d.body.style.overflow = open ? "hidden" : ""; };
  burger.addEventListener("click", () => setMenu(mnav.hidden));
  mnav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") { setMenu(false); closeLb(); } });

  // reveal on scroll
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
    $$(".rv").forEach((el) => io.observe(el));
  } else $$(".rv").forEach((el) => el.classList.add("in"));

  // price tabs
  $$(".tabs button").forEach((b) => b.addEventListener("click", () => {
    $$(".tabs button").forEach((x) => x.classList.toggle("on", x === b));
    const c = b.dataset.c;
    $$(".pcat").forEach((p) => { const show = c === "-1" || p.dataset.c === c; p.hidden = !show; if (show && c !== "-1") p.open = true; });
  }));

  // YouTube: load the player only when clicked (fast pages)
  d.addEventListener("click", (e) => {
    const y = e.target.closest(".yt[data-yt]"); if (!y || $("iframe", y)) return;
    const f = d.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + y.dataset.yt + "?autoplay=1&playsinline=1&rel=0";
    f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen = true; f.title = "YouTube";
    y.appendChild(f); gtag("event", "video_play", { video_id: y.dataset.yt });
  });

  // procedure stages: line fills while scrolling
  const tl = $("#tl");
  if (tl) {
    const bar = $(".tlbar span", tl), lis = $$("li", tl);
    const upd = () => { const r = tl.getBoundingClientRect(), p = Math.min(1, Math.max(0, (innerHeight * 0.65 - r.top) / r.height)); bar.style.setProperty("--p", p); lis.forEach((li) => li.classList.toggle("on", li.getBoundingClientRect().top < innerHeight * 0.65)); };
    addEventListener("scroll", upd, { passive: true }); upd();
  }

  // services dropdown (touch / keyboard)
  $$(".dd").forEach((dd) => { const b = $(".ddb", dd); b.addEventListener("click", (e) => { e.stopPropagation(); const o = !dd.classList.contains("open"); dd.classList.toggle("open", o); b.setAttribute("aria-expanded", o); }); });
  d.addEventListener("click", (e) => { if (!e.target.closest(".dd")) $$(".dd.open").forEach((x) => x.classList.remove("open")); });

  // chat button
  const chat = $("#chat");
  if (chat) { const fb = $(".fab", chat); fb.addEventListener("click", () => { const o = !chat.classList.contains("open"); chat.classList.toggle("open", o); fb.setAttribute("aria-expanded", o); if (o) gtag("event", "chat_open"); }); d.addEventListener("click", (e) => { if (!e.target.closest("#chat")) chat.classList.remove("open"); }); }

  // hide the chat button while the booking form is on screen (it would cover the submit button)
  const leadEl = $("#lead");
  if (chat && leadEl && "IntersectionObserver" in window) new IntersectionObserver(([e]) => chat.classList.toggle("away", e.isIntersecting), { threshold: 0.15 }).observe(leadEl);

  // videos page filter
  $$(".vtabs button").forEach((b) => b.addEventListener("click", () => {
    $$(".vtabs button").forEach((x) => x.classList.toggle("on", x === b));
    $$(".vi").forEach((v) => { v.hidden = b.dataset.v !== "*" && !(" " + v.dataset.tags + " ").includes(" " + b.dataset.v + " "); });
  }));

  // BMI calculator
  const bmi = $("#bmi");
  if (bmi) bmi.addEventListener("submit", (e) => {
    e.preventDefault();
    const h = parseFloat(String(bmi.h.value).replace(",", ".")) / 100, w = parseFloat(String(bmi.w.value).replace(",", "."));
    if (!(h > 0.9 && h < 2.4 && w > 25 && w < 350)) return;
    const v = w / (h * h), i = v < 18.5 ? 0 : v < 25 ? 1 : v < 30 ? 2 : v < 35 ? 3 : 4;
    $("#bres").hidden = false; $("#bval").textContent = v.toFixed(1).replace(".", d.body.dataset.lang === "en" ? "." : ",");
    const li = $$(".btab li"); li.forEach((x, k) => x.classList.toggle("on", k === i)); $("#bcat").textContent = $("span", li[i]).textContent;
    $("#bdot").style.left = Math.min(100, Math.max(0, ((v - 14) / (42 - 14)) * 100)) + "%";
  });

  // reviews: tap to expand
  $$(".rev").forEach((r) => r.addEventListener("click", () => r.classList.toggle("open")));

  // lightbox (diplomas, gallery)
  const lb = $("#lb");
  function closeLb() { if (!lb.hidden) { lb.hidden = true; d.body.style.overflow = ""; } }
  d.addEventListener("click", (e) => {
    const t = e.target.closest("[data-full]");
    if (t) { $("img", lb).src = t.dataset.full; $("img", lb).alt = t.dataset.cap || ""; $("figcaption", lb).textContent = t.dataset.cap || ""; lb.hidden = false; d.body.style.overflow = "hidden"; return; }
    if (e.target.closest("#lb")) closeLb();
    const ev = e.target.closest("[data-ev]");
    if (ev) gtag("event", "contact_click", { method: ev.dataset.ev });
  });

  // ad click ids / utm for lead attribution
  try {
    const q = new URLSearchParams(location.search), keep = {};
    ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term"].forEach((k) => { if (q.get(k)) keep[k] = q.get(k).slice(0, 120); });
    if (Object.keys(keep).length) sessionStorage.setItem("src", JSON.stringify(keep));
  } catch {}

  // lead form
  const f = $("#lead"); if (!f) return;
  const t0 = Date.now();
  const fmt = (v) => { let x = v.replace(/\D/g, ""); if (x.length > 9 && x.startsWith("998")) x = x.slice(3); x = x.slice(0, 9); return [x.slice(0, 2), x.slice(2, 5), x.slice(5, 7), x.slice(7, 9)].filter(Boolean).join(" "); };
  f.phone.addEventListener("input", () => { f.phone.value = fmt(f.phone.value); f.phone.parentElement.classList.remove("bad"); });
  f.name.addEventListener("input", () => f.name.classList.remove("bad"));
  const msg = $("#lmsg"), btn = $("button[type=submit]", f);
  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(f));
    const okN = data.name.trim().length > 1, okP = data.phone.replace(/\D/g, "").length === 9;
    f.name.classList.toggle("bad", !okN); f.phone.parentElement.classList.toggle("bad", !okP);
    if (!okN || !okP) { msg.className = "lmsg err"; msg.textContent = F.req; return; }
    data.phone = "+998 " + data.phone; data.lang = d.body.dataset.lang; data.t = Date.now() - t0; data.page = location.pathname;
    try { data.src = JSON.parse(sessionStorage.getItem("src") || "null"); } catch {}
    btn.disabled = true; msg.className = "lmsg"; msg.textContent = F.sending;
    try {
      const r = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (r.status === 429) { msg.className = "lmsg err"; msg.textContent = F.wait; return; }
      if (!r.ok) throw 0;
      msg.className = "lmsg ok"; msg.textContent = F.ok; f.reset();
      gtag("event", "generate_lead", { service: data.service });
      const aw = d.body.dataset.aw, lbl = d.body.dataset.awl;
      if (aw && lbl) gtag("event", "conversion", { send_to: aw + "/" + lbl });
    } catch { msg.className = "lmsg err"; msg.textContent = F.err; }
    finally { btn.disabled = false; }
  });
})();
