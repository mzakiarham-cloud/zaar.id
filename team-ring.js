(function () {
  'use strict';

  /* ==========================================================
     DATA ANGGOTA — ubah/tambah di sini saja, HTML tidak perlu disentuh.
     cat  : farmasi | tech | editor  (sesuai tombol filter)
     tone : teal | cyan              (warna aksen)
     tasks: daftar tugas yang tampil di panel detail (silakan edit)
     ========================================================== */
  const MEMBERS = [
    {
      name: 'M. Alvin Faza',
      role: 'Ketua Kelompok / Farmasis',
      cat: 'farmasi', tone: 'teal',
      img: 'img/alvin.png',
      fallback: 'https://placehold.co/400x400/0d9488/ffffff?text=MA',
      desc: 'Bertanggung jawab atas koordinasi materi farmakoterapi dan perancangan tata letak.',
      tasks: [
        'Mengoordinasikan pembagian tugas dan jadwal kerja kelompok',
        'Menyusun serta memeriksa kesesuaian materi farmakoterapi',
        'Merancang tata letak (layout) halaman website'
      ],
      links: [
        { type: 'instagram', href: 'https://www.instagram.com/alvin_zaa15?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==' }
      ]
    },
    {
      name: 'Mafida Afrilia',
      role: 'Ahli Farmakologi',
      cat: 'farmasi', tone: 'cyan',
      img: 'img/mafida.png',
      fallback: 'https://placehold.co/400x400/06b6d4/ffffff?text=MA',
      desc: 'Menganalisis mekanisme kerja obat bronkodilator dan golongan steroid anti-inflamasi.',
      tasks: [
        'Menganalisis mekanisme kerja obat bronkodilator',
        'Menyusun materi golongan steroid anti-inflamasi',
        'Memastikan penjelasan farmakologi akurat dan mudah dipahami'
      ],
      links: [
        { type: 'instagram', href: 'https://www.instagram.com/maratuttsssennailongs?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==' }
      ]
    },
    {
      name: 'Nadira Zahra',
      role: 'Riset & Patofisiologi',
      cat: 'farmasi', tone: 'teal',
      img: 'img/nadira.png',
      fallback: 'https://placehold.co/400x400/0d9488/ffffff?text=NZ',
      desc: 'Menyusun data gejala klinis asma serta referensi literatur medis kedokteran terkini.',
      tasks: [
        'Menyusun data gejala klinis asma',
        'Mengumpulkan referensi literatur medis terkini',
        'Menyiapkan materi patofisiologi saluran napas'
      ],
      links: [
        { type: 'instagram', href: 'https://www.instagram.com/nadra_zha03/?utm_source=ig_web_button_share_sheet' }
      ]
    },
    {
      name: 'M. Zaki Arham',
      role: 'Developer Web / UI',
      cat: 'tech', tone: 'cyan',
      img: 'img/arham.png',
      fallback: 'https://placehold.co/400x400/06b6d4/ffffff?text=MZ',
      desc: 'Membangun tampilan antarmuka web interaktif berbasis Tailwind CSS dan struktur responsif.',
      tasks: [
        'Membangun tampilan antarmuka dengan Tailwind CSS',
        'Menyusun struktur halaman yang responsif di semua layar',
        'Membuat fitur interaktif: kuis, animasi, dan mode gelap'
      ],
      links: [
        { type: 'github', href: 'https://github.com/mzakiarham-cloud' },
        { type: 'instagram', href: 'https://www.instagram.com/zaar.iez?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==' }
      ]
    },
    {
      name: 'M. Ilham Nafi',
      role: 'Editor Konten Medis',
      cat: 'editor', tone: 'teal',
      img: 'img/ilham.png',
      fallback: 'https://placehold.co/400x400/0d9488/ffffff?text=MI',
      desc: 'Melakukan penyuntingan tata bahasa, validasi istilah farmasi klinis agar mudah dipahami.',
      tasks: [
        'Menyunting tata bahasa seluruh konten',
        'Memvalidasi istilah farmasi klinis',
        'Menyederhanakan penjelasan agar mudah dipahami pembaca'
      ],
      links: [
        { type: 'instagram', href: 'https://www.instagram.com/hampyy2/?utm_source=ig_web_button_share_sheet' }
      ]
    },
    {
      name: 'Nabilah Sausan',
      role: 'Dokumentasi & Presentasi',
      cat: 'editor', tone: 'cyan',
      img: 'img/bilsus.png',
      fallback: 'https://placehold.co/400x400/06b6d4/ffffff?text=NS',
      desc: 'Menyiapkan alur materi presentasi laporan akhir dan dokumentasi kegiatan kelompok.',
      tasks: [
        'Menyiapkan alur materi presentasi laporan akhir',
        'Mendokumentasikan kegiatan kelompok',
        'Mengarsipkan foto dan catatan proses pengerjaan'
      ],
      links: [
        { type: 'instagram', href: 'https://www.instagram.com/nabilaasausan?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==' }
      ]
    }
  ];

  const TONES = { teal: '20, 184, 166', cyan: '6, 182, 212' };
  const LINK_ICON = { instagram: 'fa-brands fa-instagram', github: 'fa-brands fa-github' };
  const LINK_LABEL = { instagram: 'Instagram', github: 'GitHub' };
  const BTN_ON = 'filter-btn px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white transition shadow-sm';
  const BTN_OFF = 'filter-btn px-4 py-2 rounded-xl text-xs font-semibold glass-card hover:opacity-80 transition';

  const AUTO_EVERY = 4500;   // ms antar putaran otomatis
  const AUTO_IDLE = 8000;    // ms tanpa interaksi sebelum putar otomatis lanjut lagi

  /* ---------- Elemen ---------- */
  const section = document.getElementById('tim');
  const stage = document.getElementById('trStage');
  if (!section || !stage) return;

  const scene = document.getElementById('trScene');
  const ring = document.getElementById('trRing');
  const dotsEl = document.getElementById('trDots');
  const prevBtn = document.getElementById('trPrev');
  const nextBtn = document.getElementById('trNext');
  const emptyEl = document.getElementById('trEmpty');
  const liveEl = document.getElementById('trLive');
  const searchInput = document.getElementById('teamSearchInput');
  const filterBtns = Array.from(section.querySelectorAll('.filter-btn'));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const N = MEMBERS.length;
  const STEP = 360 / N;

  /* ---------- Util ---------- */
  const mod = (a, b) => ((a % b) + b) % b;

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function setImg(img, m) {
    img.onerror = function () { img.onerror = null; img.src = m.fallback; };
    img.src = m.img;
  }

  MEMBERS.forEach(function (m) {
    m.hay = (m.name + ' ' + m.name.replace(/\./g, '') + ' ' + m.role + ' ' + m.desc).toLowerCase();
  });

  /* ---------- Bangun kartu & titik ---------- */
  const cards = [];
  const dots = [];

  MEMBERS.forEach(function (m, i) {
    const card = el('button', 'tr-card');
    card.type = 'button';
    card.style.setProperty('--tone-rgb', TONES[m.tone]);

    const photo = el('span', 'tr-photo');
    const img = el('img');
    img.alt = 'Foto ' + m.name;
    img.loading = 'lazy';
    img.draggable = false;
    setImg(img, m);
    const open = el('span', 'tr-open');
    open.setAttribute('aria-hidden', 'true');
    open.innerHTML = '<i class="fa-solid fa-expand"></i>';
    photo.append(img, open);

    card.append(photo, el('span', 'tr-name', m.name), el('span', 'tr-role', m.role));
    card.addEventListener('click', function () { onCardClick(i); });
    ring.appendChild(card);
    cards.push(card);

    const dot = el('button', 'tr-dot');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Tampilkan ' + m.name);
    dot.addEventListener('click', function () { touch(); goTo(i); });
    dotsEl.appendChild(dot);
    dots.push(dot);
  });

  /* ---------- State ---------- */
  let current = 0;
  let angle = 0;
  let radius = 220;
  let filterCat = 'all';
  let query = '';
  let lastInteraction = -Infinity;
  let lastDragAt = -Infinity;
  let inView = false;
  let hovering = false;

  function touch() { lastInteraction = Date.now(); }

  function matches(m) {
    return (filterCat === 'all' || m.cat === filterCat) && (!query || m.hay.indexOf(query) !== -1);
  }

  /* ---------- Layout & render ---------- */
  function layout() {
    const w = cards[0].offsetWidth || 190;
    // radius ideal untuk N sisi + celah antar kartu
    radius = Math.round((w / 2) / Math.tan(Math.PI / N) * 1.3);
    cards.forEach(function (c, i) {
      c.style.transform = 'rotateY(' + (i * STEP) + 'deg) translateZ(' + radius + 'px)';
    });
    applyRing();
  }

  function applyRing() {
    ring.style.transform = 'translateZ(' + (-radius) + 'px) rotateY(' + angle + 'deg)';
  }

  function render() {
    applyRing();
    cards.forEach(function (c, i) {
      const d = Math.min(mod(i - current, N), mod(current - i, N));
      c.dataset.d = d;
      c.setAttribute('aria-label',
        (d === 0 ? 'Buka detail ' : 'Putar ke ') + MEMBERS[i].name + ', ' + MEMBERS[i].role);
      dots[i].classList.toggle('is-active', i === current);
      if (i === current) dots[i].setAttribute('aria-current', 'true');
      else dots[i].removeAttribute('aria-current');
    });
    liveEl.textContent = MEMBERS[current].name + ', ' + MEMBERS[current].role +
      ' (' + (current + 1) + ' dari ' + N + ')';
  }

  function goTo(target) {
    target = mod(target, N);
    // putar lewat jalur terpendek
    const delta = mod(target - current + N / 2, N) - N / 2;
    angle -= delta * STEP;
    current = target;
    render();
  }

  // indeks anggota berikutnya/sebelumnya yang cocok dengan filter aktif
  function stepIndex(dir) {
    for (let k = 1; k <= N; k++) {
      const i = mod(current + dir * k, N);
      if (matches(MEMBERS[i])) return i;
    }
    return mod(current + dir, N);
  }

  function nearestMatch(from) {
    for (let k = 0; k <= N / 2; k++) {
      const f = mod(from + k, N);
      if (matches(MEMBERS[f])) return f;
      const b = mod(from - k, N);
      if (matches(MEMBERS[b])) return b;
    }
    return from;
  }

  /* ---------- Filter & pencarian ---------- */
  function applyFilter() {
    let any = false;
    MEMBERS.forEach(function (m, i) {
      const ok = matches(m);
      any = any || ok;
      cards[i].classList.toggle('is-dim', !ok);
      dots[i].classList.toggle('is-dim', !ok);
    });
    emptyEl.hidden = any;
    filterBtns.forEach(function (b) {
      b.className = b.getAttribute('data-filter') === filterCat ? BTN_ON : BTN_OFF;
    });
    if (any && !matches(MEMBERS[current])) goTo(nearestMatch(current));
  }

  filterBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      touch();
      filterCat = b.getAttribute('data-filter') || 'all';
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      touch();
      query = searchInput.value.trim().toLowerCase();
      applyFilter();
    });
  }

  /* ---------- Kontrol ---------- */
  prevBtn.addEventListener('click', function () { touch(); goTo(stepIndex(-1)); });
  nextBtn.addEventListener('click', function () { touch(); goTo(stepIndex(1)); });

  stage.addEventListener('keydown', function (e) {
    if (isOpen) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); touch(); goTo(stepIndex(1)); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); touch(); goTo(stepIndex(-1)); }
  });

  // Geser (mouse / sentuh)
  let dragX = null;
  scene.addEventListener('pointerdown', function (e) { dragX = e.clientX; });
  scene.addEventListener('pointerup', function (e) {
    if (dragX === null) return;
    const dx = e.clientX - dragX;
    dragX = null;
    if (Math.abs(dx) > 45) {
      lastDragAt = performance.now();
      touch();
      goTo(stepIndex(dx < 0 ? 1 : -1));   // geser kiri = berikutnya
    }
  });
  scene.addEventListener('pointercancel', function () { dragX = null; });

  function onCardClick(i) {
    if (performance.now() - lastDragAt < 300) return;   // klik akibat geseran diabaikan
    touch();
    if (i === current) openDetail(i);
    else goTo(i);
  }

  /* ---------- Putar otomatis ---------- */
  stage.addEventListener('pointerenter', function () { hovering = true; });
  stage.addEventListener('pointerleave', function () { hovering = false; });
  stage.addEventListener('focusin', touch);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
    }, { threshold: 0.35 }).observe(stage);
  } else {
    inView = true;
  }

  setInterval(function () {
    if (reduceMotion || document.hidden || isOpen || hovering || !inView) return;
    if (Date.now() - lastInteraction < AUTO_IDLE) return;
    goTo(stepIndex(1));
  }, AUTO_EVERY);

  /* ==========================================================
     PANEL DETAIL — foto "terbang" ke kiri, tugas di kanan (FLIP)
     ========================================================== */
  const overlay = el('div', 'td-overlay');
  overlay.hidden = true;
  overlay.innerHTML =
    '<div class="td-bg" data-close></div>' +
    '<div class="td-panel" role="dialog" aria-modal="true" aria-labelledby="tdName" tabindex="-1">' +
      '<button type="button" class="td-close" data-close aria-label="Tutup detail"><i class="fa-solid fa-xmark"></i></button>' +
      '<div class="td-photo" id="tdPhoto"><img id="tdImg" alt=""></div>' +
      '<div class="td-info" id="tdInfo">' +
        '<div id="tdInner">' +
          '<span class="td-count" id="tdCount"></span><br>' +
          '<span class="td-role" id="tdRole"></span>' +
          '<h3 class="td-name" id="tdName"></h3>' +
          '<p class="td-desc" id="tdDesc"></p>' +
          '<h4 class="td-sub"><i class="fa-solid fa-list-check"></i> Tugas Utama</h4>' +
          '<ul class="td-tasks" id="tdTasks"></ul>' +
          '<div class="td-links" id="tdLinks"></div>' +
        '</div>' +
        '<div class="td-nav">' +
          '<button type="button" class="td-step" id="tdPrev"><i class="fa-solid fa-chevron-left"></i> Sebelumnya</button>' +
          '<button type="button" class="td-step" id="tdNext">Berikutnya <i class="fa-solid fa-chevron-right"></i></button>' +
        '</div>' +
      '</div>' +
    '</div>';
  // dipasang ke <body> agar tidak terpengaruh transform milik .reveal
  document.body.appendChild(overlay);

  const panel = overlay.querySelector('.td-panel');
  const tdPhoto = overlay.querySelector('#tdPhoto');
  const tdImg = overlay.querySelector('#tdImg');
  const tdInner = overlay.querySelector('#tdInner');
  const tdCount = overlay.querySelector('#tdCount');
  const tdRole = overlay.querySelector('#tdRole');
  const tdName = overlay.querySelector('#tdName');
  const tdDesc = overlay.querySelector('#tdDesc');
  const tdTasks = overlay.querySelector('#tdTasks');
  const tdLinks = overlay.querySelector('#tdLinks');
  const closeBtn = overlay.querySelector('.td-close');

  let isOpen = false;
  let isBusy = false;
  let lastFocus = null;
  let liftedCard = null;

  const EASE = 'cubic-bezier(.2, .8, .2, 1)';

  function fillDetail(i) {
    const m = MEMBERS[i];
    overlay.style.setProperty('--tone-rgb', TONES[m.tone]);
    setImg(tdImg, m);
    tdImg.alt = 'Foto ' + m.name;
    tdCount.textContent = (i + 1) + ' / ' + N;
    tdRole.textContent = m.role;
    tdName.textContent = m.name;
    tdDesc.textContent = m.desc;

    tdTasks.textContent = '';
    m.tasks.forEach(function (t) {
      const li = document.createElement('li');
      li.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i>';
      li.appendChild(el('span', null, t));
      tdTasks.appendChild(li);
    });

    tdLinks.textContent = '';
    m.links.forEach(function (l) {
      const a = document.createElement('a');
      a.className = 'td-link';
      a.href = l.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = '<i class="' + LINK_ICON[l.type] + '" aria-hidden="true"></i>';
      a.appendChild(el('span', null, LINK_LABEL[l.type]));
      tdLinks.appendChild(a);
    });
  }

  function lift(i) {
    if (liftedCard) liftedCard.classList.remove('is-lifted');
    liftedCard = cards[i];
    liftedCard.classList.add('is-lifted');
  }

  function cancelAnims(node) {
    node.getAnimations().forEach(function (a) { a.cancel(); });
  }

  function openDetail(i) {
    if (isOpen || isBusy) return;
    isOpen = true;
    isBusy = true;
    lastFocus = document.activeElement;

    fillDetail(i);
    const from = cards[i].querySelector('.tr-photo').getBoundingClientRect();
    lift(i);

    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.paddingRight = sbw > 0 ? sbw + 'px' : '';
    document.documentElement.classList.add('td-lock');

    overlay.hidden = false;
    overlay.getBoundingClientRect();          // paksa layout sebelum animasi
    overlay.classList.add('is-open');
    const to = tdPhoto.getBoundingClientRect();

    if (!reduceMotion && from.width && to.width) {
      const dx = from.left - to.left;
      const dy = from.top - to.top;
      const s = from.width / to.width;
      tdPhoto.animate(
        [
          { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')' },
          { transform: 'translate(0,0) scale(1)' }
        ],
        { duration: 620, easing: EASE }
      ).finished.then(function () { isBusy = false; }, function () { isBusy = false; });
    } else {
      isBusy = false;
    }
    closeBtn.focus({ preventScroll: true });
  }

  function closeDetail() {
    if (!isOpen || isBusy) return;
    isBusy = true;

    const card = cards[current];
    const to = card.querySelector('.tr-photo').getBoundingClientRect();
    const from = tdPhoto.getBoundingClientRect();
    overlay.classList.remove('is-open');

    function finish() {
      cancelAnims(tdPhoto);
      overlay.hidden = true;
      document.documentElement.classList.remove('td-lock');
      document.documentElement.style.paddingRight = '';
      if (liftedCard) { liftedCard.classList.remove('is-lifted'); liftedCard = null; }
      isOpen = false;
      isBusy = false;
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }

    if (!reduceMotion && from.width && to.width) {
      const dx = to.left - from.left;
      const dy = to.top - from.top;
      const s = to.width / from.width;
      tdPhoto.animate(
        [
          { transform: 'translate(0,0) scale(1)' },
          { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + s + ')' }
        ],
        { duration: 460, easing: EASE, fill: 'forwards' }
      ).finished.then(finish, finish);
    } else {
      finish();
    }
  }

  // Pindah anggota tanpa menutup panel
  function detailStep(dir) {
    if (!isOpen || isBusy) return;
    const next = stepIndex(dir);
    if (next === current) return;
    touch();
    goTo(next);
    lift(next);

    if (reduceMotion) { fillDetail(next); return; }

    const x = dir > 0 ? 26 : -26;
    cancelAnims(tdInner);
    cancelAnims(tdImg);
    tdImg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: 'forwards' });
    tdInner.animate(
      [{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: 'translateX(' + (-x) + 'px)' }],
      { duration: 150, fill: 'forwards' }
    ).finished.then(function () {
      fillDetail(next);
      cancelAnims(tdImg);
      tdImg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: EASE });
      cancelAnims(tdInner);
      tdInner.animate(
        [{ opacity: 0, transform: 'translateX(' + x + 'px)' }, { opacity: 1, transform: 'translateX(0)' }],
        { duration: 320, easing: EASE }
      );
    }, function () { fillDetail(next); });
  }

  overlay.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) closeDetail();
  });
  overlay.querySelector('#tdPrev').addEventListener('click', function () { detailStep(-1); });
  overlay.querySelector('#tdNext').addEventListener('click', function () { detailStep(1); });

  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); closeDetail(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); detailStep(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); detailStep(-1); }
    else if (e.key === 'Tab') {
      // jaga fokus tetap di dalam dialog
      const f = Array.from(panel.querySelectorAll('button, a[href]'));
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });

  /* ---------- Mulai ---------- */
  layout();
  render();
  applyFilter();
  window.addEventListener('resize', layout);
  window.addEventListener('load', layout);   // ukur ulang setelah font/gambar siap
})();
