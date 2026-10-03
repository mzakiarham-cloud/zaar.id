// ==========================================================
// KUIS — evaluasi mandiri dengan pembahasan yang mengajar ulang
// Menggantikan blok "8. Kuis Interaktif" lama di script.js
// ==========================================================
(function () {
  'use strict';
  const root = document.getElementById('kuisRoot');
  if (!root) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const LET = 'ABCD';
  const PTS = 10;

  // Penjelasan sengaja netral (tanpa "Benar!" / "Tepat!"): penilaian dibuat oleh antarmuka.
  // link: drug = buka modal Klasifikasi, href = lompat ke section terkait.
  const Q = [
    { t: 'Reliever (pereda cepat)',
      q: 'Golongan obat manakah yang berfungsi sebagai <b>pereda cepat (reliever)</b> saat pasien mengalami serangan asma akut?',
      o: ['ICS (Inhaled Corticosteroid)', 'SABA (Short-Acting Beta-Agonist / Salbutamol)', 'LABA (Long-Acting Beta-Agonist)'], c: 1,
      e: 'SABA seperti Salbutamol bekerja sangat cepat (dalam hitungan menit) melemaskan otot polos bronkus saat serangan akut.',
      link: { label: 'Baca: Reliever', drug: 'reliever' } },
    { t: 'Controller (ICS)',
      q: 'Apa fungsi utama dari golongan obat <b>Controller (Pengontrol Jangka Panjang)</b> seperti ICS?',
      o: ['Mengatasi peradangan kronis saluran napas setiap hari', 'Menurunkan tekanan darah secara mendadak', 'Menaikkan nafsu makan pasien asma'], c: 0,
      e: 'ICS (Inhaled Corticosteroid) digunakan rutin setiap hari untuk meredam inflamasi atau peradangan kronis pada saluran pernapasan.',
      link: { label: 'Baca: Controller', drug: 'controller' } },
    { t: 'Gejala klinis asma',
      q: 'Manakah di bawah ini yang termasuk salah satu <b>gejala klinis utama</b> dari serangan asma?',
      o: ['Pembengkakan pada sendi lutut', 'Mengi (bunyi bersiul saat ekspirasi) dan sesak napas', 'Peningkatan kadar gula darah'], c: 1,
      e: 'Gejala utama asma meliputi mengi, sesak napas, batuk persisten, serta rasa berat di dada akibat penyempitan bronkus.',
      link: { label: 'Baca: Materi asma', href: '#materi' } },
    { t: 'Berkumur setelah ICS',
      q: 'Instruksi khusus apa yang wajib dilakukan pasien setelah menggunakan obat pengontrol golongan <b>ICS (Inhaled Corticosteroid)</b>?',
      o: ['Langsung tidur setelah pemakaian', 'Wajib berkumur dengan air bersih dan dibuang', 'Minum 2 gelas air es'], c: 1,
      e: 'Berkumur setelah menggunakan ICS bertujuan mencegah sisa obat tertinggal di dalam mulut yang dapat memicu infeksi jamur (kandidiasis oral).',
      link: { label: 'Baca: Panduan inhaler', href: '#inhaler' } },
    { t: 'Pencegahan kekambuhan',
      q: 'Langkah pencegahan non-farmakologis apa yang paling efektif bagi penderita asma untuk <b>menghindari kekambuhan</b>?',
      o: ['Menghindari faktor pemicu (alergen, debu, dan asap rokok)', 'Berjemur di bawah terik matahari pukul 12 siang', 'Menghentikan penggunaan obat secara total'], c: 0,
      e: 'Menghindari faktor pemicu (trigger) seperti debu, bulu hewan, dan asap rokok adalah kunci utama pencegahan kekambuhan serangan asma.',
      link: { label: 'Baca: Pola hidup sehat', href: '#edukasi-gaya-hidup' } }
  ];

  const OK_HEAD = ['Tepat!', 'Benar sekali!', 'Bagus, betul!'];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); [a[i], a[k]] = [a[k], a[i]]; } return a; };

  // Skor terbaik: kunci yang sama dengan versi lama
  const KEY = 'asma-quiz-best';
  const getBest = () => { try { return parseInt(localStorage.getItem(KEY) || '0', 10) || 0; } catch (e) { return 0; } };
  const saveBest = s => { let b = getBest(); if (s > b) { b = s; try { localStorage.setItem(KEY, String(b)); } catch (e) {} } return b; };

  root.innerHTML =
    `<div class="kz-card">
       <div class="kz-top">
         <div class="kz-steps" role="progressbar" aria-label="Kemajuan kuis" aria-valuemin="0"></div>
         <div class="kz-meta"><span class="kz-count"></span><span class="kz-score"></span></div>
       </div>
       <div class="kz-body"></div>
     </div>`;
  const stepsEl = root.querySelector('.kz-steps'), countEl = root.querySelector('.kz-count'),
        scoreEl = root.querySelector('.kz-score'), body = root.querySelector('.kz-body');

  let round, phase = 'ask';

  function start(indices, mode) {
    round = { mode, pos: 0, score: 0,
      items: shuffle(indices).map(qi => ({ qi, perm: shuffle(Q[qi].o.map((_, i) => i)), picked: null, ok: null })) };
    renderQ();
  }

  function head() {
    const n = round.items.length;
    stepsEl.setAttribute('aria-valuemax', n);
    stepsEl.setAttribute('aria-valuenow', round.items.filter(i => i.ok !== null).length);
    stepsEl.innerHTML = round.items.map((it, i) =>
      `<span class="${it.ok === true ? 'is-ok' : it.ok === false ? 'is-bad' : (phase !== 'done' && i === round.pos ? 'is-now' : '')}"></span>`).join('');
    scoreEl.textContent = `Skor: ${round.score}`;
  }

  function swap(html) {
    body.innerHTML = html;
    body.classList.remove('kz-in'); void body.offsetWidth; body.classList.add('kz-in');
  }

  function renderQ() {
    phase = 'ask';
    const it = round.items[round.pos], q = Q[it.qi], n = round.items.length;
    countEl.textContent = (round.mode === 'retry' ? 'Ulang soal yang salah · ' : '') + `Pertanyaan ${round.pos + 1} dari ${n}`;
    head();
    swap(`
      <h4 class="kz-q">${q.q}</h4>
      <div class="kz-opts" role="group" aria-label="Pilihan jawaban">
        ${it.perm.map((oi, k) => `<button type="button" class="kz-opt" data-k="${k}"><span class="kz-badge">${LET[k]}</span><span class="kz-otext">${q.o[oi]}</span><i class="fa-solid kz-oicon" aria-hidden="true"></i></button>`).join('')}
      </div>
      <p class="kz-hint">Tip: tekan ${it.perm.map((_, k) => LET[k]).join(', ')} di keyboard untuk menjawab.</p>
      <div class="kz-fb" role="status" hidden></div>
      <div class="kz-next" hidden><button type="button" class="kz-next-btn">${round.pos === n - 1 ? 'Lihat hasil' : 'Pertanyaan selanjutnya'} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button></div>`);
  }

  const readBtn = q => q.link
    ? `<button type="button" class="kz-read" ${q.link.drug ? `data-drug="${q.link.drug}"` : `data-href="${q.link.href}"`}><i class="fa-solid fa-book-open" aria-hidden="true"></i> ${q.link.label} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>` : '';

  function answer(k) {
    if (phase !== 'ask') return;
    phase = 'fb';
    const it = round.items[round.pos], q = Q[it.qi];
    const right = it.perm.indexOf(q.c);
    it.picked = k; it.ok = (k === right);
    if (it.ok) round.score += PTS;

    body.querySelectorAll('.kz-opt').forEach((b, i) => {
      b.disabled = true;
      const ic = b.querySelector('.kz-oicon');
      if (i === right) { b.classList.add('is-right'); ic.classList.add('fa-circle-check'); }
      else if (i === k) { b.classList.add('is-wrong'); ic.classList.add('fa-circle-xmark'); }
      else b.classList.add('is-dim');
    });

    const fb = body.querySelector('.kz-fb');
    fb.className = 'kz-fb ' + (it.ok ? 'is-ok' : 'is-bad');
    fb.innerHTML =
      `<div class="kz-fb-head"><i class="fa-solid ${it.ok ? 'fa-circle-check' : 'fa-circle-xmark'}" aria-hidden="true"></i><b>${it.ok ? OK_HEAD[Math.floor(Math.random() * OK_HEAD.length)] : 'Belum tepat'}</b></div>` +
      (it.ok ? '' : `<p class="kz-fb-ans">Jawaban yang benar: <b>${LET[right]}. ${q.o[q.c]}</b></p>`) +
      `<p class="kz-fb-exp">${q.e}</p>` + readBtn(q);
    fb.hidden = false;

    const nx = body.querySelector('.kz-next'); nx.hidden = false;
    head();
    nx.querySelector('button').focus({ preventScroll: true });
  }

  function next() {
    if (phase !== 'fb') return;
    round.pos++;
    if (round.pos < round.items.length) renderQ(); else renderResult();
  }

  function renderResult() {
    phase = 'done';
    const n = round.items.length, max = n * PTS, pct = Math.round(round.score / max * 100);
    const wrong = round.items.filter(i => i.ok === false);
    const [title, msg] = pct === 100
      ? ['Sempurna!', 'Semua jawaban benar. Pemahamanmu tentang farmakoterapi asma sudah kuat.']
      : pct >= 60
        ? ['Bagus!', 'Sebagian besar sudah tepat. Ulas materi untuk soal yang masih keliru di bawah ini.']
        : ['Ayo belajar lagi', 'Tidak apa-apa, ini bagian dari proses belajar. Baca ulang materinya, lalu coba lagi.'];
    countEl.textContent = 'Kuis selesai';
    head();

    const bestLine = round.mode === 'full' ? `<p class="kz-best"><i class="fa-solid fa-trophy" aria-hidden="true"></i> Skor terbaik: ${saveBest(round.score)} / ${max}</p>` : '';
    const list = wrong.length ? `
      <div class="kz-review"><h5>Perlu diulang</h5><ul>
        ${wrong.map(it => { const q = Q[it.qi]; return `<li><div><b>${q.t}</b><span>Jawaban benar: ${q.o[q.c]}</span></div>${readBtn(q)}</li>`; }).join('')}
      </ul></div>` : '';

    swap(`
      <div class="kz-res">
        <div class="kz-ring">
          <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="kz-ring-bg" cx="60" cy="60" r="52" pathLength="100"/><circle class="kz-ring-fg" cx="60" cy="60" r="52" pathLength="100"/></svg>
          <div class="kz-ring-num"><b>${round.score}</b><span>/ ${max}</span></div>
        </div>
        <h4 class="kz-res-title">${title}</h4>
        <p class="kz-res-msg">${msg}</p>
        ${bestLine}
      </div>
      ${list}
      <div class="kz-res-actions">
        <button type="button" class="kz-btn kz-btn-main" data-act="again"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i> Ulangi kuis</button>
        ${wrong.length ? `<button type="button" class="kz-btn" data-act="retry"><i class="fa-solid fa-arrow-rotate-left" aria-hidden="true"></i> Ulangi ${wrong.length} soal yang salah</button>` : ''}
      </div>`);

    const fg = body.querySelector('.kz-ring-fg');
    if (reduce) fg.style.strokeDashoffset = 100 - pct;
    else requestAnimationFrame(() => requestAnimationFrame(() => { fg.style.strokeDashoffset = 100 - pct; }));
  }

  // ---------- Interaksi ----------
  root.addEventListener('click', e => {
    const opt = e.target.closest('.kz-opt');
    if (opt) return answer(+opt.dataset.k);
    if (e.target.closest('.kz-next-btn')) return next();

    const rd = e.target.closest('.kz-read');
    if (rd) {
      if (rd.dataset.drug) {
        if (typeof openDrugModal === 'function') openDrugModal(rd.dataset.drug);
        else document.getElementById('klasifikasi')?.scrollIntoView({ behavior: 'smooth' });
      } else if (rd.dataset.href) {
        document.querySelector(rd.dataset.href)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      }
      return;
    }
    const act = e.target.closest('[data-act]');
    if (act) {
      if (act.dataset.act === 'again') start(Q.map((_, i) => i), 'full');
      else start(round.items.filter(i => i.ok === false).map(i => i.qi), 'retry');
    }
  });

  // Keyboard: hanya aktif saat kuis terlihat, tidak sedang mengetik, dan tidak ada modal terbuka
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target;
    if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
    const modal = document.getElementById('drugModal');
    if (modal && !modal.classList.contains('hidden')) return;
    const r = root.getBoundingClientRect();
    if (!(r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.4)) return;

    if (phase === 'ask') {
      const m = /^[a-d]$/i.test(e.key) ? e.key.toUpperCase().charCodeAt(0) - 65 : /^[1-4]$/.test(e.key) ? +e.key - 1 : -1;
      if (m >= 0 && m < round.items[round.pos].perm.length) { e.preventDefault(); answer(m); }
    } else if (phase === 'fb' && e.key === 'Enter' && !(t && /^(BUTTON|A)$/.test(t.tagName))) {
      e.preventDefault(); next();
    }
  });

  start(Q.map((_, i) => i), 'full');
})();
