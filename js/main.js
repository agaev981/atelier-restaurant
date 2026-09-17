"use strict";

/* ================= mobile menu ================= */

const header = document.getElementById("header");
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");

function toggleMenu(force) {
  const open = typeof force === "boolean" ? force : !mobileMenu.classList.contains("is-open");
  mobileMenu.classList.toggle("is-open", open);
  burger.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  mobileMenu.setAttribute("aria-hidden", String(!open));
  document.body.classList.toggle("is-locked", open);
}

burger.addEventListener("click", () => toggleMenu());

/* ================= header on scroll ================= */

function onScrollHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 40);
}

/* ================= smooth anchors ================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    toggleMenu(false);
    const top = target.getBoundingClientRect().top + window.scrollY - (window.innerWidth > 860 ? 64 : 56);
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* ================= menu tabs ================= */

const MENU_DATA = {
  starters: [
    { name: "Тартар из говядины", desc: "Мраморная вырезка, копчёный желток, каперсы, тост из бородинского хлеба", price: "980 ₽", img: "https://images.unsplash.com/photo-1546241072-48010ad2862c?q=80&w=900&auto=format&fit=crop", tag: "хит" },
    { name: "Севиче из гребешка", desc: "Приморский гребешок, сок лайма, кокосовое молоко, чили, кинза", price: "1 150 ₽", img: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=900&auto=format&fit=crop" },
    { name: "Бурата с томатами", desc: "Бурата из Апулии, печёные томаты черри, базиликовое масло, гранола из семечек", price: "890 ₽", img: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?q=80&w=900&auto=format&fit=crop" },
    { name: "Овощи на углях", desc: "Сезонные овощи гриль, крем из копчёной паприки, фисташковый дукка", price: "740 ₽", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=900&auto=format&fit=crop" },
    { name: "Страчателла с трюфелем", desc: "Молодой сыр, трюфельная паста, медовые соты, гриссини", price: "1 050 ₽", img: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?q=80&w=900&auto=format&fit=crop" },
    { name: "Утиный паштет", desc: "Паштет из утиной печени, луковый конфитюр, вишнёвое желе, бриошь", price: "820 ₽", img: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=900&auto=format&fit=crop" }
  ],
  mains: [
    { name: "Рибай на углях", desc: "Стейк сухой выдержки 45 дней, дымное масло, копчёная соль, гриль-овощи", price: "3 900 ₽", img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=900&auto=format&fit=crop", tag: "открытый огонь" },
    { name: "Черноморский судак", desc: "Филе судака на углях, крем из зелёного горошка, молодой картофель, укропное масло", price: "1 850 ₽", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=900&auto=format&fit=crop" },
    { name: "Утиная ножка конфи", desc: "Медленное конфи, пюре из сельдерея, соус из красного апельсина", price: "1 690 ₽", img: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?q=80&w=900&auto=format&fit=crop" },
    { name: "Паста с трюфелем", desc: "Ручные тальолини, трюфельный крем, пармезан 36 месяцев, яичный желток", price: "1 450 ₽", img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=900&auto=format&fit=crop", tag: "вегетарианское" },
    { name: "Ягнёнок с дымом", desc: "Корейка на кости, харисса, баклажановый крем, гранат", price: "2 250 ₽", img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=900&auto=format&fit=crop" },
    { name: "Ризотто с белыми грибами", desc: "Карнароли, белые грибы, тимьян, выдержанный сыр, трюфельное масло", price: "1 250 ₽", img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=900&auto=format&fit=crop", tag: "вегетарианское" }
  ],
  desserts: [
    { name: "Медовик «Дым»", desc: "Тонкие коржи на мёде гречихи, крем на копчёной сметане, карамельный дым", price: "640 ₽", img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=900&auto=format&fit=crop", tag: "хит" },
    { name: "Шоколадный фондан", desc: "Тёплый фондан 70% какао, солёная карамель, мороженое из тонкого молока", price: "690 ₽", img: "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=900&auto=format&fit=crop" },
    { name: "Павлова с инжиром", desc: "Хрустящая меренга, крем маскарпоне, свежий инжир, гранатовый гель", price: "620 ₽", img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=900&auto=format&fit=crop" },
    { name: "Тарт с лимоном", desc: "Лимонный крем, обожжённая меренга, тимьяновый сироп", price: "580 ₽", img: "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?q=80&w=900&auto=format&fit=crop" },
    { name: "Сырная тарелка", desc: "Пять выдержанных сыров, мёд, орехи, виноградный чатни", price: "1 190 ₽", img: "https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=900&auto=format&fit=crop" },
    { name: "Мороженое ручной работы", desc: "Три шарика на выбор: тыква-пекан, вишня-миндаль, ваниль Мадагаскар", price: "450 ₽", img: "https://images.unsplash.com/photo-1488900128323-21503983a07e?q=80&w=900&auto=format&fit=crop" }
  ],
  cocktails: [
    { name: "Atelier Old Fashioned", desc: "Бурбон, копчёный апельсин, дубовый сироп, ангостура, дым розмарина", price: "850 ₽", img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=900&auto=format&fit=crop", tag: "signature" },
    { name: "Дымный негрони", desc: "Джин, кампари, вермут, мескитовый дым, цедра грейпфрута", price: "790 ₽", img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=900&auto=format&fit=crop" },
    { name: "Золотая греча", desc: "Водка на гречневой крупе, мёд, лимон, шампанское брют", price: "820 ₽", img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=900&auto=format&fit=crop" },
    { name: "Уголёк", desc: "Мескаль, маракуйя, чили-мёд, лайм, соль с углём", price: "780 ₽", img: "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=900&auto=format&fit=crop" },
    { name: "Фига", desc: "Инжировый сироп, джин, вермут бьянко, розмарин", price: "760 ₽", img: "https://images.unsplash.com/photo-1560512823-829485b8bf24?q=80&w=900&auto=format&fit=crop" },
    { name: "Безалкогольный сад", desc: "Облепиха, груша, ромашковый чай, тоник, тимьян", price: "490 ₽", img: "https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=900&auto=format&fit=crop", tag: "0%" }
  ]
};

const menuGrid = document.getElementById("menuGrid");
const tabsBtns = document.querySelectorAll(".tabs__btn");

function renderMenu(category) {
  const items = MENU_DATA[category] || [];
  menuGrid.innerHTML = items.map((item) => `
    <article class="dish">
      <div class="dish__media">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
      </div>
      <div class="dish__body">
        <div class="dish__head">
          <h3 class="dish__name">${item.name}</h3>
          <span class="dish__price">${item.price}</span>
        </div>
        <p class="dish__desc">${item.desc}</p>
        ${item.tag ? `<span class="dish__tag">${item.tag}</span>` : ""}
      </div>
    </article>
  `).join("");

  menuGrid.classList.remove("is-switching");
  void menuGrid.offsetWidth;
  menuGrid.classList.add("is-switching");
}

tabsBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("is-active")) return;
    tabsBtns.forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-selected", "true");
    renderMenu(btn.dataset.tab);
  });
});

renderMenu("starters");

/* ================= reveal on scroll ================= */

const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

revealEls.forEach((el) => revealObserver.observe(el));

/* animated counters */

const counters = document.querySelectorAll("[data-count]");

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const start = performance.now();
    const duration = 1600;
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach((el) => counterObserver.observe(el));

/* ================= active nav link ================= */

const sections = ["concept", "menu", "atmosphere", "booking", "contacts"]
  .map((id) => document.getElementById(id));
const navLinks = document.querySelectorAll(".nav a");

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
    });
  });
}, { rootMargin: "-40% 0px -55% 0px" });

sections.forEach((s) => s && navObserver.observe(s));

/* ================= booking form ================= */

const form = document.getElementById("bookingForm");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const guestsInput = document.getElementById("guests");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");

const today = new Date();
const iso = today.toISOString().split("T")[0];
dateInput.min = iso;
dateInput.value = iso;

/* phone mask +7 (___) ___-__-__ */
phoneInput.addEventListener("input", () => {
  let d = phoneInput.value.replace(/\D/g, "");
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (!d.startsWith("7")) d = "7" + d;
  d = d.slice(0, 11);

  let out = "";
  if (d.length > 0) out = "+7";
  if (d.length > 1) out += " (" + d.slice(1, 4);
  if (d.length >= 4) out += ") " + d.slice(4, 7);
  if (d.length >= 7) out += "-" + d.slice(7, 9);
  if (d.length >= 9) out += "-" + d.slice(9, 11);
  phoneInput.value = out;
});

function setError(input, message) {
  const field = input.closest(".field");
  field.classList.toggle("is-error", Boolean(message));
  field.querySelector(".field__error").textContent = message || "";
}

function validate() {
  let ok = true;

  if (!dateInput.value) { setError(dateInput, "Выберите дату визита"); ok = false; }
  else if (dateInput.value < dateInput.min) { setError(dateInput, "Дата не может быть в прошлом"); ok = false; }
  else setError(dateInput, "");

  if (!timeInput.value) { setError(timeInput, "Выберите время"); ok = false; }
  else setError(timeInput, "");

  if (!guestsInput.value) { setError(guestsInput, "Укажите количество гостей"); ok = false; }
  else setError(guestsInput, "");

  const name = nameInput.value.trim();
  if (name.length < 2) { setError(nameInput, "Введите имя (минимум 2 буквы)"); ok = false; }
  else if (!/^[А-Яа-яЁёA-Za-z\s-]+$/.test(name)) { setError(nameInput, "Имя может содержать только буквы"); ok = false; }
  else setError(nameInput, "");

  const digits = phoneInput.value.replace(/\D/g, "");
  if (digits.length !== 11) { setError(phoneInput, "Введите номер полностью"); ok = false; }
  else setError(phoneInput, "");

  return ok;
}

[nameInput, phoneInput].forEach((input) =>
  input.addEventListener("input", () => setError(input, ""))
);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validate()) return;

  const d = new Date(dateInput.value + "T00:00:00");
  const dateStr = d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  const guestsWord = guestsInput.value === "1" ? "гостя" : "гостей";

  openModal(`
    ${nameInput.value.trim()}, ваш столик забронирован на
    <strong>${dateStr}, ${timeInput.value}</strong> —
    <strong>${guestsInput.value} ${guestsWord}</strong>.
    Администратор перезвонит на <strong>${phoneInput.value}</strong> для подтверждения.
  `);
  form.reset();
  dateInput.value = iso;
});

/* ================= modal ================= */

const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");

function openModal(html) {
  modalText.innerHTML = html;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

modal.querySelectorAll("[data-modal-close]").forEach((el) =>
  el.addEventListener("click", closeModal)
);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
    toggleMenu(false);
  }
});

/* ================= floating CTA (mobile) ================= */

const floatCta = document.getElementById("floatCta");
const bookingSection = document.getElementById("booking");

let bookingVisible = false;

const bookingObserver = new IntersectionObserver((entries) => {
  bookingVisible = entries[0].isIntersecting;
  updateFloatCta();
}, { threshold: 0.08 });

bookingObserver.observe(bookingSection);

function updateFloatCta() {
  const show = window.innerWidth <= 640 &&
    !bookingVisible &&
    !mobileMenu.classList.contains("is-open");
  floatCta.classList.toggle("is-visible", show);
}

window.addEventListener("resize", updateFloatCta);
mobileMenu.addEventListener("transitionend", updateFloatCta);

/* ================= scroll loop ================= */

function onScroll() {
  onScrollHeader();
  updateFloatCta();
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

onScroll();
