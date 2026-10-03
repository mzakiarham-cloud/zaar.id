// ==========================================================
// SEJARAH — scrollytelling dengan panggung lengket (sticky)
// Menggantikan blok "SEJARAH" lama di script.js
// ==========================================================
(function () {
  'use strict';
  const root = document.getElementById('sjRoot');
  if (!root) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wide = matchMedia('(min-width: 900px)');

  // Ilustrasi besar per era (viewBox 120x120, diskalakan oleh CSS)
  const ART = {
    // 3 - 1960-an: saluran napas melebar (bronkodilator)
    3: `<svg viewBox="0 0 120 120">
      <circle class="art-line art-shape" cx="60" cy="60" r="46"/>
      <circle class="art-line art-thin" cx="60" cy="60" r="38" stroke-dasharray="2 5"/>
      <circle class="art-acc art-open" cx="60" cy="60" r="30" opacity=".35"/>
      <circle class="art-line art-open" cx="60" cy="60" r="30"/>
      <path class="art-line" d="M92,28 l10,-10 M94,18 h8 v8 M92,92 l10,10 M94,102 h8 v-8 M28,92 l-10,10 M26,102 h-8 v-8 M28,28 l-10,-10 M26,18 h-8 v8"/>
    </svg>`,
    // 4 - 1980-an: perisai antiperadangan, sel radang menjauh
    4: `<svg viewBox="0 0 120 120">
      <path class="art-line art-shape" d="M60,12 L98,26 V58 C98,82 82,98 60,108 C38,98 22,82 22,58 V26 Z"/>
      <path class="art-line art-thin" d="M60,22 L88,32 V58 C88,76 76,89 60,97 C44,89 32,76 32,58 V32 Z"/>
      <path class="art-line" d="M42,60 L55,73 L80,46"/>
      <g class="art-cells"><circle class="art-acc" cx="14" cy="30" r="3"/><circle class="art-acc" cx="108" cy="44" r="2.6"/><circle class="art-acc" cx="12" cy="76" r="2.2"/><circle class="art-acc" cx="106" cy="88" r="3"/></g>
    </svg>`,
    // 0 - Zaman kuno: tanaman Ephedra
    0: `<svg viewBox="0 0 120 120">
      <path class="art-line art-thin" d="M22,108 C46,101 74,101 98,108"/>
      <path class="art-line" d="M60,106 C60,80 58,52 55,20 M60,106 C64,82 74,60 86,32 M60,106 C56,84 44,66 32,40 M60,106 C70,92 90,82 102,64 M60,106 C50,94 30,88 20,72"/>
      <path class="art-line art-thin" d="M59,88 l-5,-4 M59,88 l5,-4 M58,68 l-5,-4 M58,68 l5,-4 M57,48 l-5,-4 M57,48 l5,-4 M56,32 l-4,-3 M56,32 l4,-3
        M67,84 l-5,-3 M67,84 l4,-5 M73,66 l-5,-3 M73,66 l4,-5 M80,47 l-5,-3 M80,47 l4,-5
        M53,87 l-5,-3 M53,87 l1,-6 M47,70 l-5,-3 M47,70 l1,-6 M39,53 l-5,-3 M39,53 l1,-6
        M84,84 l-1,-6 M84,84 l5,1 M38,88 l-1,-6 M38,88 l-5,1"/>
      <circle class="art-acc" cx="55" cy="19" r="3.4"/><circle class="art-acc" cx="86" cy="31" r="3.4"/><circle class="art-acc" cx="32" cy="39" r="3.4"/>
    </svg>`,

    // 1 - 1900-an: ampul epinefrin
    1: `<svg viewBox="0 0 120 120">
      <path class="art-line art-shape" d="M60,14 C60,14 56,24 56,34 L56,48 C46,52 44,60 44,68 L44,92 C44,100 50,104 60,104 C70,104 76,100 76,92 L76,68 C76,60 74,52 64,48 L64,34 C64,24 60,14 60,14 Z"/>
      <path class="art-acc" d="M45.5,76 L74.5,76 L74.5,92 C74.5,99 68,102.5 60,102.5 C52,102.5 45.5,99 45.5,92 Z" opacity=".55"/>
      <path class="art-line art-thin" d="M51,60 V70 M51,80 V84"/>
      <path class="art-line" d="M92,30 C92,30 86,38 86,42 A6,6 0 0 0 98,42 C98,38 92,30 92,30 Z"/>
      <path class="art-line art-thin" d="M24,40 v10 M19,45 h10 M100,74 v8 M96,78 h8"/>
    </svg>`,

    // 2 - 1956: inhaler dosis terukur (MDI)
    2: `<svg viewBox="0 0 120 120">
      <path class="art-line" d="M53,3 v7 M49.5,6.5 l3.5,3.5 l3.5,-3.5"/>
      <rect class="art-line art-shape" x="40" y="14" width="26" height="34" rx="6"/>
      <path class="art-line art-thin" d="M46,24 H60 M46,32 H60"/>
      <rect class="art-line art-shape" x="30" y="42" width="46" height="58" rx="9"/>
      <path class="art-line art-thin" d="M40,62 H66 M40,70 H58"/>
      <path class="art-line art-shape" d="M76,74 H96 a4,4 0 0 1 4,4 V90 a4,4 0 0 1 -4,4 H76"/>
      <g class="art-spray"><circle class="art-acc" cx="105" cy="82" r="2.6"/><circle class="art-acc" cx="111" cy="88" r="2"/><circle class="art-acc" cx="106" cy="93" r="1.8"/><circle class="art-acc" cx="113" cy="79" r="1.6"/></g>
    </svg>`,

    // 5 - 2010-sekarang: inhaler pintar + pemantauan
    5: `<svg viewBox="0 0 120 120">
      <rect class="art-line art-shape" x="34" y="14" width="44" height="90" rx="9"/>
      <path class="art-line art-thin" d="M50,22 H62"/>
      <circle class="art-line art-thin" cx="56" cy="54" r="13"/>
      <circle class="art-line" cx="56" cy="54" r="13" stroke-dasharray="52 82" transform="rotate(-90 56 54)"/>
      <path class="art-line" d="M42,86 L48,80 L53,84 L60,74 L66,81 L72,72"/>
      <circle class="art-acc" cx="72" cy="72" r="2.6"/>
      <circle class="art-acc" cx="88" cy="42" r="2.2"/>
      <g class="art-signal"><path class="art-line" d="M88,34 A8,8 0 0 1 96,42"/><path class="art-line" d="M88,27 A15,15 0 0 1 103,42"/><path class="art-line" d="M88,20 A22,22 0 0 1 110,42"/></g>
    </svg>`
  };

  // Cek ulang fakta ini ke sumber rujukan sebelum dipublikasikan
  const FACTS = [
    'Ephedra (ma huang) dipakai dalam pengobatan tradisional Tiongkok selama berabad-abad. Zat aktifnya, efedrin, baru diisolasi pada 1885. Kini efedra tidak dianjurkan sebagai obat bebas karena berisiko bagi jantung dan tekanan darah.',
    'Epinefrin (adrenalin) mulai dipakai pada awal 1900-an, umumnya lewat suntikan. Sampai sekarang epinefrin tetap menjadi obat gawat darurat untuk reaksi alergi berat (anafilaksis).',
    'Inhaler dosis terukur (MDI) pertama dikembangkan oleh Riker Laboratories pada 1956, dan kabarnya idenya datang dari pertanyaan seorang anak: mengapa obat asma tidak bisa disemprot seperti parfum?',
    'Salbutamol (albuterol) dikembangkan oleh tim Glaxo di Inggris pada 1960-an dan mulai dipasarkan sekitar 1969. Sampai kini ia menjadi reliever yang paling luas dipakai.',
    'Inhaler kortikosteroid pertama (beklometason) tersedia sejak awal 1970-an. Setelah memakainya, berkumur tetap penting untuk mencegah sariawan jamur (kandidiasis) di mulut.',
    'Omalizumab, biologik pertama untuk asma, disetujui FDA pada 2003. Sejak itu bertambah beberapa biologik lain, misalnya mepolizumab (2015), untuk asma berat yang sulit terkontrol.'
  ];

  // tone = warna mode gelap, toneL = versi lebih pekat untuk mode terang
  const ERAS = [
    { chip: 'Kuno', year: 'Zaman Kuno', ico: 'fa-leaf', title: 'Pengobatan Herbal',
      desc: 'Penggunaan tanaman seperti Ephedra dalam pengobatan tradisional untuk membantu melegakan pernapasan.',
      impact: 'Pertolongan datang dari alam, tetapi takaran sulit dipastikan dan risikonya baru dipahami belakangan.',
      tone: '74,222,128', toneL: '22,163,74' },
    { chip: '1900-an', year: '1900-an', ico: 'fa-syringe', title: 'Epinefrin',
      desc: 'Epinefrin digunakan dalam penanganan serangan asma akut.',
      impact: 'Serangan akut mulai bisa ditangani secara medis, umumnya lewat suntikan di fasilitas kesehatan.',
      tone: '251,146,60', toneL: '234,88,12' },
    { chip: '1956', year: '1956', ico: 'fa-wind', title: 'Inhaler Modern',
      desc: 'Metered-Dose Inhaler (MDI) diperkenalkan dan membantu penyampaian obat langsung ke saluran napas.',
      impact: 'Obat langsung ke sasaran, dosis lebih terukur, dan alatnya muat di saku sehingga bisa dibawa ke mana saja.',
      tone: '45,212,191', toneL: '13,148,136' },
    { chip: '1960-an', year: '1960-an', ico: 'fa-bolt', title: 'Era Salbutamol',
      desc: 'Salbutamol berkembang sebagai bronkodilator kerja cepat untuk membantu meredakan gejala penyempitan saluran napas.',
      impact: 'Serangan bisa diredakan dalam hitungan menit. Itulah sebabnya reliever wajib selalu dibawa.',
      tone: '96,165,250', toneL: '37,99,235', drug: 'reliever' },
    { chip: '1980-an', year: '1980-an', ico: 'fa-shield-halved', title: 'Kortikosteroid Inhalasi',
      desc: 'Kortikosteroid inhalasi semakin digunakan untuk mengendalikan peradangan dan membantu mencegah kekambuhan.',
      impact: 'Tidak hanya meredakan: peradangan dikendalikan setiap hari sehingga serangan makin jarang kambuh.',
      tone: '167,139,250', toneL: '124,58,237', drug: 'controller' },
    { chip: '2010+', year: '2010–Kini', ico: 'fa-microchip', title: 'Terapi Biologik & Inhaler Pintar',
      desc: 'Terapi biologik dan teknologi inhaler digital berkembang untuk mendukung pengobatan yang lebih terarah dan pemantauan penggunaan obat.',
      impact: 'Terapi lebih personal dan kepatuhan pemakaian bisa dipantau, terutama untuk asma berat yang sulit terkontrol.',
      tone: '34,211,238', toneL: '8,145,178' }
  ];
  const N = ERAS.length;
  const tn = e => `--tone:${e.tone};--tone-l:${e.toneL}`;

  // ---------- Bangun DOM ----------
  const $ = s => root.querySelector(s);
  const bar = $('.sj-bar'), chipsEl = $('.sj-chips'), stage = $('.sj-stage'), list = $('.sj-cards'), prog = $('.sj-prog i');

  chipsEl.innerHTML = ERAS.map((e, i) =>
    `<button type="button" class="sj-chip" data-i="${i}" style="${tn(e)}"><i class="fa-solid ${e.ico}" aria-hidden="true"></i><span>${e.chip}</span></button>`).join('');

  stage.innerHTML = ERAS.map((e, i) =>
    `<div class="sj-scene" data-i="${i}" style="${tn(e)}"><span class="sj-glow"></span><span class="sj-orbit"></span><span class="sj-orbit sj-orbit2"></span><div class="sj-hero">${ART[i] || ''}</div></div>`).join('') +
    '<div class="sj-count"></div>';

  list.innerHTML = ERAS.map((e, i) => `
    <article class="sj-card" data-i="${i}" style="${tn(e)}">
      <div class="sj-card-in">
        <div class="sj-year"><i class="fa-solid ${e.ico}" aria-hidden="true"></i><span>${e.year}</span>${i === N - 1 ? '<em class="sj-now">Kita di sini</em>' : ''}</div>
        <h4 class="sj-title">${e.title}</h4>
        <p class="sj-desc">${e.desc}</p>
        <div class="sj-impact"><i class="fa-solid fa-user-check" aria-hidden="true"></i><div><b>Artinya bagi pasien</b><p>${e.impact}</p></div></div>
        <div class="sj-actions">
          ${FACTS[i] ? `<button type="button" class="sj-fact-btn" aria-expanded="false" aria-controls="sjf${i}"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> Tahukah kamu?</button>` : ''}
          ${e.drug ? `<button type="button" class="sj-cta" data-drug="${e.drug}">Lihat di Klasifikasi <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>` : ''}
        </div>
        ${FACTS[i] ? `<div class="sj-fact-body" id="sjf${i}"><div><p>${FACTS[i]}</p></div></div>` : ''}
      </div>
    </article>`).join('');

  const chips = [...chipsEl.children];
  const scenes = [...stage.querySelectorAll('.sj-scene')];
  const cards = [...list.children];
  const count = $('.sj-count');
  let active = -1;

  // ---------- Ukuran sticky mengikuti tinggi header ----------
  function measure() {
    const h = document.querySelector('header');
    root.style.setProperty('--sj-top', ((h ? h.getBoundingClientRect().height : 80) + 8) + 'px');
    root.style.setProperty('--sj-bar', bar.offsetHeight + 'px');
  }

  // Garis fokus: kartu yang paling dekat dengan garis ini dianggap aktif
  function focusY() {
    const top = parseFloat(root.style.getPropertyValue('--sj-top')) + bar.offsetHeight;
    if (wide.matches) return top + (innerHeight - top) / 2;
    const base = top + stage.offsetHeight + 12;
    return base + (innerHeight - base) * 0.4;
  }

  function setActive(i) {
    active = i;
    const e = ERAS[i];
    root.style.setProperty('--tone', e.tone);
    root.style.setProperty('--tone-l', e.toneL);
    cards.forEach((c, k) => c.classList.toggle('is-active', k === i));
    scenes.forEach((s, k) => s.classList.toggle('is-on', k === i));
    chips.forEach((c, k) => {
      c.classList.toggle('is-active', k === i);
      c.classList.toggle('is-past', k < i);
      if (k === i) c.setAttribute('aria-current', 'step'); else c.removeAttribute('aria-current');
    });
    count.textContent = `0${i + 1} / 0${N}`;
    const c = chips[i];
    chipsEl.scrollTo({ left: c.offsetLeft - (chipsEl.clientWidth - c.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
  }

  function update() {
    ticking = false;
    const f = focusY();
    let best = 0, bd = Infinity, c0 = 0, cN = 0;
    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect(), mid = r.top + r.height / 2;
      if (i === 0) c0 = mid;
      if (i === N - 1) cN = mid;
      const d = Math.abs(mid - f);
      if (d < bd) { bd = d; best = i; }
    });
    if (best !== active) setActive(best);
    prog.style.transform = `scaleX(${Math.max(0, Math.min(1, (f - c0) / ((cN - c0) || 1)))})`;
  }
  let ticking = false;
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

  function go(i) {
    const r = cards[i].getBoundingClientRect();
    scrollTo({ top: scrollY + r.top + r.height / 2 - focusY(), behavior: reduce ? 'auto' : 'smooth' });
  }

  // ---------- Interaksi ----------
  root.addEventListener('click', e => {
    const chip = e.target.closest('.sj-chip');
    if (chip) return go(+chip.dataset.i);

    const fb = e.target.closest('.sj-fact-btn');
    if (fb) {
      const open = fb.getAttribute('aria-expanded') === 'true';
      fb.setAttribute('aria-expanded', String(!open));
      document.getElementById(fb.getAttribute('aria-controls')).classList.toggle('is-open', !open);
      return;
    }

    // Sambungan ke bagian Klasifikasi (modal yang sudah ada)
    const cta = e.target.closest('.sj-cta');
    if (cta) {
      if (typeof openDrugModal === 'function') openDrugModal(cta.dataset.drug);
      else document.getElementById('klasifikasi')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Klik kartu yang redup = langsung pindah ke era itu
    const card = e.target.closest('.sj-card');
    if (card && +card.dataset.i !== active) go(+card.dataset.i);
  });

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { measure(); onScroll(); });
  addEventListener('load', () => { measure(); update(); });
  measure();
  update();
})();
