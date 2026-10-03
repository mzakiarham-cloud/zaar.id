(function () {
  'use strict';

  const canvas = document.getElementById('cursorCanvas');
  if (!canvas) return;

  // Nonaktifkan di layar sentuh dan jika pengguna meminta gerakan dikurangi
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || reduceMotion) {
    canvas.remove();
    return;
  }

  // Kursor kustom aktif, sembunyikan kursor bawaan
  document.documentElement.classList.add('has-custom-cursor');

  const ctx = canvas.getContext('2d');

  // --- Pengaturan (silakan diubah) ---
  const TEAL = '0, 191, 165';
  const DOT_RADIUS = 8;
  const RING_NORMAL = 16;
  const RING_HOVER = 28;      // cincin membesar di atas link/tombol
  const RING_PRESSED = 11;    // cincin mengecil saat ditekan
  const FOLLOW = 0.2;         // 0-1, semakin kecil semakin lambat mengikuti
  const MAX_RIPPLES = 40;
  const RIPPLE_EVERY_PX = 28; // jarak gerak untuk memunculkan 1 riak
  const INTERACTIVE = 'a, button, [onclick], input, select, textarea, summary, label';
  // Elemen yang memakai kursor bawaan browser (kursor kustom disembunyikan di sini)
  const NATIVE = 'iframe, input[type="text"], textarea, .vp-frame';

  let width = 0;
  let height = 0;

  const mouse = { x: -100, y: -100 };
  const cursor = { x: -100, y: -100 };
  const lastRipple = { x: -100, y: -100 };

  let ring = RING_NORMAL;
  let ringTarget = RING_NORMAL;
  let visible = false;
  let running = false;
  let lastTime = 0;
  let ripples = [];

  // Status interaksi
  let hovering = false;   // di atas link/tombol
  let pressed = false;    // tombol mouse sedang ditekan
  let overNative = false; // di atas iframe / kolom teks

  function resize() {
    // Batasi DPR ke 2 agar tetap ringan
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function addRipple(x, y, radius, maxRadius, opacity) {
    if (ripples.length >= MAX_RIPPLES) ripples.shift();
    ripples.push({ x, y, radius, maxRadius, opacity });
  }

  function updateRing() {
    ringTarget = pressed ? RING_PRESSED : hovering ? RING_HOVER : RING_NORMAL;
    start();
  }

  function start() {
    if (running) return;
    running = true;
    lastTime = performance.now();
    requestAnimationFrame(frame);
  }

  function frame(now) {
    // dt = 1 berarti satu frame pada 60 Hz, sehingga kecepatan sama di semua monitor
    const dt = Math.min((now - lastTime) / 16.667, 3);
    lastTime = now;

    ctx.clearRect(0, 0, width, height);

    // 1. Gerak halus (lerp) yang tidak bergantung pada refresh rate
    const ease = 1 - Math.pow(1 - FOLLOW, dt);
    cursor.x += (mouse.x - cursor.x) * ease;
    cursor.y += (mouse.y - cursor.y) * ease;
    ring += (ringTarget - ring) * ease;

    // Gambar titik + cincin hanya jika tidak sedang di atas elemen dengan kursor bawaan
    if (visible && !overNative) {
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${TEAL}, 0.8)`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, ring, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${TEAL}, 0.4)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // 2. Riak air
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += 1.5 * dt;
      r.opacity -= 0.02 * dt;

      if (r.opacity <= 0 || r.radius >= r.maxRadius) {
        ripples.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${TEAL}, ${r.opacity})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 3. Berhenti sendiri jika sudah diam, hemat CPU/baterai
    const settled =
      Math.abs(mouse.x - cursor.x) < 0.1 &&
      Math.abs(mouse.y - cursor.y) < 0.1 &&
      Math.abs(ringTarget - ring) < 0.1 &&
      ripples.length === 0;

    if (settled) {
      running = false;
      return;
    }
    requestAnimationFrame(frame);
  }

  // --- Event ---
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Gerakan pertama: langsung lompat ke posisi mouse, tanpa "terbang" dari pojok
    if (!visible) {
      cursor.x = mouse.x;
      cursor.y = mouse.y;
      lastRipple.x = mouse.x;
      lastRipple.y = mouse.y;
      visible = true;
    }

    // Riak muncul berdasarkan jarak gerak, bukan acak (tidak di atas elemen bawaan)
    if (!overNative) {
      const dx = mouse.x - lastRipple.x;
      const dy = mouse.y - lastRipple.y;
      if (dx * dx + dy * dy > RIPPLE_EVERY_PX * RIPPLE_EVERY_PX) {
        addRipple(mouse.x, mouse.y, 5, 40, 0.6);
        lastRipple.x = mouse.x;
        lastRipple.y = mouse.y;
      }
    }

    start();
  }, { passive: true });

  window.addEventListener('click', (e) => {
    if (overNative) return;
    addRipple(e.clientX, e.clientY, 10, 80, 0.8);
    start();
  });

  // Satu handler mouseover untuk cincin (hover) dan elemen bawaan
  document.addEventListener('mouseover', (e) => {
    const t = e.target;
    const closest = t && t.closest ? (sel) => t.closest(sel) : () => null;

    hovering = !!closest(INTERACTIVE);

    const wasNative = overNative;
    overNative = !!closest(NATIVE);

    // Saat keluar dari iframe/kolom teks, titik langsung ke posisi mouse (tidak "terbang")
    if (wasNative && !overNative) {
      cursor.x = mouse.x;
      cursor.y = mouse.y;
    }

    updateRing();
  });

  window.addEventListener('mousedown', () => { pressed = true; updateRing(); });
  window.addEventListener('mouseup', () => { pressed = false; updateRing(); });

  // Jika jendela kehilangan fokus saat tombol ditekan, jangan biarkan cincin "macet" kecil
  window.addEventListener('blur', () => { pressed = false; updateRing(); });

  // Sembunyikan saat kursor keluar dari jendela
  document.documentElement.addEventListener('mouseleave', () => {
    visible = false;
    start();
  });
  document.documentElement.addEventListener('mouseenter', (e) => {
    // Lompat langsung ke titik masuk agar tidak muncul di posisi lama
    mouse.x = cursor.x = e.clientX;
    mouse.y = cursor.y = e.clientY;
    visible = true;
    start();
  });

  window.addEventListener('resize', resize);
  resize();
})();