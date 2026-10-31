const UI = {
  uz: { about: 'Shifokor haqida', services: 'Xizmatlar', prices: 'Narxlar', gallery: 'Galereya', contact: 'Aloqa',
    book: 'Konsultatsiyaga yozilish', seePrices: 'Narxlarni ko‘rish', priceNote: 'Narxlar taxminiy; aniq narx konsultatsiyadan keyin belgilanadi.',
    search: 'Xizmatni qidirish…', all: 'Barchasi', currency: 'so‘m', addressL: 'Manzil', hoursL: 'Ish vaqti', phoneL: 'Telefon',
    call: 'Qo‘ng‘iroq qilish', map: 'Xaritada ko‘rish', empty: 'Hech narsa topilmadi' },
  ru: { about: 'О докторе', services: 'Услуги', prices: 'Цены', gallery: 'Галерея', contact: 'Контакты',
    book: 'Записаться на консультацию', seePrices: 'Смотреть цены', priceNote: 'Цены ориентировочные; точная стоимость — после консультации.',
    search: 'Поиск услуги…', all: 'Все', currency: 'сум', addressL: 'Адрес', hoursL: 'Режим работы', phoneL: 'Телефон',
    call: 'Позвонить', map: 'Открыть карту', empty: 'Ничего не найдено' },
  en: { about: 'About', services: 'Services', prices: 'Prices', gallery: 'Gallery', contact: 'Contact',
    book: 'Book a consultation', seePrices: 'See prices', priceNote: 'Prices are approximate; the final cost is set after consultation.',
    search: 'Search services…', all: 'All', currency: 'UZS', addressL: 'Address', hoursL: 'Opening hours', phoneL: 'Phone',
    call: 'Call', map: 'Open map', empty: 'Nothing found' },
};

let data, lang, activeCat = -1;
try { lang = localStorage.getItem('lang'); } catch (e) {}
if (!UI[lang]) lang = (navigator.language || 'uz').slice(0, 2) === 'ru' ? 'ru' : 'uz';

const $ = (s) => document.querySelector(s);
const tr = (o) => (o && (o[lang] || o.ru || o.uz || o.en)) || '';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function render() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-t]').forEach((el) => (el.textContent = tr(data.texts[el.dataset.t])));
  document.querySelectorAll('[data-ui]').forEach((el) => (el.textContent = UI[lang][el.dataset.ui]));
  document.querySelectorAll('[data-lang]').forEach((b) => b.classList.toggle('on', b.dataset.lang === lang));
  document.title = tr(data.texts.brand) + ' — ' + tr(data.texts.role);
  $('#search').placeholder = UI[lang].search;

  $('#stats').innerHTML = (data.stats || []).map((s) => `<div><b>${esc(s.value)}</b><span>${esc(tr(s.label))}</span></div>`).join('');
  $('#servicesList').innerHTML = data.services
    .map((s, i) => `<div class="svc reveal"><i>${String(i + 1).padStart(2, '0')}</i><p>${esc(tr(s))}</p></div>`).join('');
  $('#galleryList').innerHTML = data.gallery
    .map((g) => `<figure class="reveal"><img loading="lazy" src="${esc(g.src)}" alt="${esc(tr(g.caption))}"><figcaption>${esc(tr(g.caption))}</figcaption></figure>`).join('');

  const s = data.settings;
  const tel = s.phone.replace(/[^+\d]/g, '');
  $('#phone').textContent = s.phone; $('#phone').href = 'tel:' + tel; $('#callBtn').href = 'tel:' + tel;
  $('#tgBtn').href = s.telegram; $('#mapBtn').href = s.mapUrl;
  $('#socials').innerHTML = s.instagram.filter(Boolean)
    .map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener">@${esc(u.replace(/\/$/, '').split('/').pop())}</a>`).join('');
  if (data.gallery[0]) $('#heroImg').src = data.gallery[0].src;
  $('#year').textContent = new Date().getFullYear();

  renderPrices();
  observe();
}

function renderPrices() {
  const q = $('#search').value.trim().toLowerCase();
  $('#tabs').innerHTML = [`<button data-c="-1">${UI[lang].all}</button>`]
    .concat(data.catalog.map((c, i) => `<button data-c="${i}">${esc(tr(c.title))}</button>`)).join('');
  $('#tabs').querySelectorAll('button').forEach((b) => {
    b.classList.toggle('on', +b.dataset.c === activeCat);
    b.onclick = () => { activeCat = +b.dataset.c; renderPrices(); };
  });
  const html = data.catalog.map((c, i) => {
    if (activeCat !== -1 && activeCat !== i) return '';
    const items = c.items.filter((it) => !q || tr(it.name).toLowerCase().includes(q));
    if (!items.length) return '';
    return `<div class="price-cat"><h3>${esc(tr(c.title))}</h3>` +
      items.map((it) => `<div class="row"><span>${esc(tr(it.name))}</span><span>${esc(it.price)} ${UI[lang].currency}</span></div>`).join('') + '</div>';
  }).join('');
  $('#priceList').innerHTML = html || `<p class="note">${UI[lang].empty}</p>`;
}

let io;
function observe() {
  io = io || new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))), { threshold: 0.12 });
  document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));
}

document.querySelectorAll('[data-lang]').forEach((b) => (b.onclick = () => {
  lang = b.dataset.lang; try { localStorage.setItem('lang', lang); } catch (e) {} render();
}));
$('#search').oninput = renderPrices;
$('#galleryList').onclick = (e) => {
  const f = e.target.closest('figure'); if (!f) return;
  const lb = $('#lightbox'); lb.querySelector('img').src = f.querySelector('img').src;
  lb.querySelector('p').textContent = f.querySelector('figcaption').textContent; lb.classList.add('on');
};
$('#lightbox').onclick = () => $('#lightbox').classList.remove('on');

fetch('/api/data').then((r) => r.json()).then((d) => { data = d; render(); });
