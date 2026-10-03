// 2. Mobile Menu Toggle dengan Smooth Slide Down
    
    function toggleMobileMenu() {
      const mobileMenu = document.getElementById('mobileMenu');
      const mobileMenuIcon = document.getElementById('mobileMenuIcon');
      
      if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        setTimeout(() => {
          mobileMenu.classList.remove('opacity-0', 'scale-95');
          mobileMenu.classList.add('opacity-100', 'scale-100');
        }, 10);
        mobileMenuIcon.classList.remove('fa-bars');
        mobileMenuIcon.classList.add('fa-xmark');
      } else {
        mobileMenu.classList.remove('opacity-100', 'scale-100');
        mobileMenu.classList.add('opacity-0', 'scale-95');
        mobileMenuIcon.classList.remove('fa-xmark');
        mobileMenuIcon.classList.add('fa-bars');
        setTimeout(() => {
          mobileMenu.classList.add('hidden');
        }, 300);
      }
    }

// 3. Fullscreen Toggle
    
    function toggleFullscreen() {
      try {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          if (document.exitFullscreen) document.exitFullscreen();
        }
      } catch (err) {
        console.log("Fullscreen error:", err);
      }
    }

// 4. Back to Top Button Handler
    
    const backToTopBtn = document.getElementById('backToTopBtn');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.remove('hidden', 'opacity-0', 'translate-y-4');
        backToTopBtn.classList.add('opacity-100', 'translate-y-0');
      } else {
        backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
        backToTopBtn.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => {
          if (window.scrollY <= 400) backToTopBtn.classList.add('hidden');
        }, 300);
      }
    });

    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

// 5. Scroll Spy Dinamis untuk Header Navigasi
    
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('nav a[data-nav]');

    window.addEventListener('scroll', () => {
      let current = '';
      const scrollPos = window.scrollY + 180;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-nav') === current) {
          link.classList.add('active');
        }
      });
    });

// 6. Modal Popup Detail Klasifikasi Obat
    
    const drugDataDetails = {
      reliever: {
        title: "Reliever (Pereda Cepat / SABA)",
        category: "Short-Acting Bronchodilator",
        icon: "fa-bolt",
        desc: "Reliever adalah obat yang bekerja sangat cepat untuk mengatasi bronkospasme akut (serangan asma mendadak). Obat ini melemaskan otot polos di sekitar saluran pernapasan sehingga udara dapat mengalir dengan lancar kembali.",
        mech: "Berikatan dengan reseptor beta-2 adrenergik di otot polos bronkus, memicu aktivasi adenilat siklase yang meningkatkan kadar cAMP intraseluler, berakibat pada relaksasi otot dan vasodilatasi bronkus dalam waktu 3-5 menit.",
        examples: "Salbutamol (Albuterol) inhaler 100 mcg per semprot, Levalbuterol, dan Ipratropium Bromide sebagai alternatif antikolinergik."
      },
      controller: {
        title: "Controller (Pengontrol Jangka Panjang / ICS)",
        category: "Anti-Inflamasi Kronis & LABA",
        icon: "fa-shield-halved",
        desc: "Controller digunakan setiap hari secara teratur (bukan saat serangan mendadak) untuk mengendalikan peradangan kronis pada mukosa bronkus, menurunkan hiperreaktivitas, dan mencegah terjadinya eksaserbasi akut.",
        mech: "Kortikosteroid inhalasi (ICS) menempel pada reseptor glukokortikoid, menghambat transkripsi gen pro-inflamasi, mengurangi jumlah sel radang (eosinofil & makrofag) di saluran napas, serta menekan produksi mukus berlebih.",
        examples: "Budesonide, Fluticasone Propionate, serta kombinasi dengan LABA (Salmeterol/Formoterol)."
      }
    };

    function openDrugModal(type) {
      const data = drugDataDetails[type];
      if (!data) return;

      document.getElementById('modalTitle').innerText = data.title;
      document.getElementById('modalCategoryBadge').innerText = data.category;
      document.getElementById('modalDesc').innerText = data.desc;
      document.getElementById('modalMech').innerText = data.mech;
      document.getElementById('modalExamples').innerText = data.examples;
      document.getElementById('modalIcon').className = `fa-solid ${data.icon}`;

      const modal = document.getElementById('drugModal');
      const card = document.getElementById('drugModalCard');

      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.classList.remove('opacity-0');
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
      }, 10);
    }

    function closeDrugModal() {
      const modal = document.getElementById('drugModal');
      const card = document.getElementById('drugModalCard');

      modal.classList.add('opacity-0');
      card.classList.remove('scale-100');
      card.classList.add('scale-95');
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 300);
    }

// 7. Inhaler Step-by-Step Interactive Guide
    
    const inhalerSteps = [
      {
        step: 1,
        title: "Persiapan & Lepas Penutup",
        icon: "fa-bottle-droplet",
        desc: "Lepaskan penutup mouthpiece inhaler (MDI). Periksa bagian corong inhaler untuk memastikan tidak ada debu atau kotoran yang menyumbat saluran keluar obat."
      },
      {
        step: 2,
        title: "Kocok Botol & Posisi Tegak",
        icon: "fa-hand-holding-medical",
        desc: "Kocok inhaler secara kuat ke atas dan ke bawah sebanyak 4-5 kali agar suspensi obat tercampur merata. Pegang inhaler dengan posisi tegak (ibu jari di dasar, telunjuk di atas tabung)."
      },
      {
        step: 3,
        title: "Keluarkan Napas & Semprotkan",
        icon: "fa-wind",
        desc: "Tengadahkan kepala sedikit. Buang napas panjang di luar. Letakkan mouthpiece di antara gigi (jangan digigit) dan rapatkan bibir. Tekan tabung inhaler 1 kali sambil menarik napas dalam secara perlahan dan konstan."
      },
      {
        step: 4,
        title: "Tahan Napas & Berkumur",
        icon: "fa-face-smile",
        desc: "Tahan napas selama 10 detik (atau selama mungkin yang terasa nyaman) agar obat mengendap sempurna di bronkus kecil. Hembuskan napas perlahan, lalu kumur-kumur dengan air bersih jika menggunakan ICS."
      }
    ];

    let currentInhalerStep = 1;

    function renderInhalerStep() {
      const data = inhalerSteps[currentInhalerStep - 1];
      const container = document.getElementById('inhalerContent');

      container.innerHTML = `
        <div class="flex flex-col md:flex-row items-center gap-6 glass-card p-6 rounded-2xl border-teal-500/30">
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-600/20 to-cyan-500/20 text-teal-500 flex items-center justify-center text-3xl flex-shrink-0 shadow-inner">
            <i class="fa-solid ${data.icon}"></i>
          </div>
          <div class="space-y-2 text-center md:text-left">
            <span class="text-xs font-bold uppercase tracking-wider text-teal-500">Langkah ${data.step} dari 4</span>
            <h4 class="text-xl font-bold">${data.title}</h4>
            <p class="text-sm opacity-85 leading-relaxed">${data.desc}</p>
          </div>
        </div>
      `;

      // Update Tab Styles

      for (let i = 1; i <= 4; i++) {
        const tab = document.getElementById(`inhalerTab${i}`);
        if (i === currentInhalerStep) {
          tab.className = "inhaler-tab p-3 rounded-2xl bg-teal-600 text-white font-bold text-xs transition flex flex-col items-center gap-1 shadow-md";
        } else {
          tab.className = "inhaler-tab p-3 rounded-2xl bg-black/5 dark:bg-slate-900/60 border border-black/10 dark:border-slate-800 text-xs font-bold transition flex flex-col items-center gap-1 hover:border-teal-500";
        }
      }

      document.getElementById('inhalerStepIndicator').innerText = `Langkah ${currentInhalerStep} dari 4`;
      document.getElementById('prevInhalerBtn').style.opacity = currentInhalerStep === 1 ? '0.5' : '1';
      document.getElementById('nextInhalerBtn').style.opacity = currentInhalerStep === 4 ? '0.5' : '1';
    }

    function nextInhalerStep() {
      if (currentInhalerStep < 4) {
        currentInhalerStep++;
        renderInhalerStep();
      }
    }

    function prevInhalerStep() {
      if (currentInhalerStep > 1) {
        currentInhalerStep--;
        renderInhalerStep();
      }
    }

    function switchInhalerStep(stepNum) {
      currentInhalerStep = stepNum;
      renderInhalerStep();
    }

// 9. Filter Tim Penyusun & Fitur Search Bar
    
    function filterTeam(category) {
      const cards = document.querySelectorAll('.team-card');
      const buttons = document.querySelectorAll('.filter-btn');

      buttons.forEach(btn => {
        if (btn.getAttribute('data-filter') === category || (category === 'all' && btn.getAttribute('data-filter') === 'all')) {
          btn.className = "filter-btn px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white transition shadow-sm";
        } else {
          btn.className = "filter-btn px-4 py-2 rounded-xl text-xs font-semibold glass-card hover:opacity-80 transition";
        }
      });

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    function filterTeamBySearch() {
      const query = document.getElementById('teamSearchInput').value.toLowerCase();
      const cards = document.querySelectorAll('.team-card');

      cards.forEach(card => {
        const nameAttr = card.getAttribute('data-name');
        const textContent = card.innerText.toLowerCase();
        if (nameAttr.includes(query) || textContent.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

// Inisialisasi awal saat halaman dimuat
    
    document.addEventListener('DOMContentLoaded', () => {
  renderInhalerStep();
});

(function () {
  const root = document.documentElement;
  const storageKey = "asma-theme";

  function updateThemeButton() {
    const btn = document.getElementById("themeToggleBtn");
    const icon = document.getElementById("themeIcon");
    if (!btn || !icon) return;

    const dark = root.classList.contains("dark");

    icon.className = dark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    btn.title = dark ? "Aktifkan mode terang" : "Aktifkan mode gelap";
    btn.setAttribute(
      "aria-label",
      dark ? "Aktifkan mode terang" : "Aktifkan mode gelap",
    );
  }

  window.toggleTheme = function () {
    const dark = root.classList.toggle("dark");
    localStorage.setItem(storageKey, dark ? "dark" : "light");
    updateThemeButton();
  };

  // Restore the user's previous choice.

  const savedTheme = localStorage.getItem(storageKey);
  if (savedTheme === "dark") {
    root.classList.add("dark");
  } else if (savedTheme === "light") {
    root.classList.remove("dark");
  }

  updateThemeButton();
})();

// --- FITUR ACCORDION ATURAN PAKAI & EFEK SAMPING ---
function toggleInfoAccordion(id) {
    const content = document.getElementById('content-' + id);
    const icon = document.getElementById('icon-' + id);
    
  // Jika posisi sedang terbuka, maka tutup
  
    if (content.style.maxHeight && content.style.maxHeight !== "0px") {
        content.style.maxHeight = "0px";
        icon.classList.remove('rotate-180');
    } 
      // Jika posisi tertutup, maka buka
  
    else {
        // scrollHeight mengambil tinggi asli dari konten yang tersembunyi
        content.style.maxHeight = content.scrollHeight + "px";
        icon.classList.add('rotate-180');
    }
}

// --- FITUR BUKA/TUTUP STRATEGI PEMASARAN ---

function toggleMarketingInfo(id) {
    const info = document.getElementById('info-mkt-' + id);
    const icon = document.getElementById('icon-mkt-' + id);
    
    if (info.style.maxHeight && info.style.maxHeight !== "0px") {
        // Tutup elemen
        info.style.maxHeight = "0px";
        icon.classList.remove('rotate-180');
    } else {
        // Buka elemen dengan menghitung tinggi teks asli di dalamnya
        info.style.maxHeight = info.scrollHeight + "px";
        icon.classList.add('rotate-180');
    }
}

// --- FITUR INTERAKTIF PEMUTAR VIDEO EDUKASI ---
function changeVideo(youtubeId, title, category, description, element) {
  // 1. Perbarui embed URL video YouTube
  const iframe = document.getElementById('mainVideoIframe');
  if (iframe) {
    iframe.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`;
  }

  // 2. Perbarui judul, kategori, dan deskripsi video di layar
  const titleElem = document.getElementById('videoTitleDisplay');
  const categoryElem = document.getElementById('videoCategoryBadge');
  const descElem = document.getElementById('videoDescDisplay');

  if (titleElem) titleElem.innerText = title;
  if (categoryElem) categoryElem.innerText = category;
  if (descElem) descElem.innerText = description;

  // 3. Reset tampilan semua item playlist menjadi non-aktif
  const allItems = document.querySelectorAll('.video-playlist-item');
  allItems.forEach(item => {
    item.classList.remove('active-video', 'border-rose-500/40', 'bg-rose-500/10');
    item.classList.add('border-black/10', 'dark:border-white/10');
    
    // Reset warna ikon tombol menjadi standar
    const iconContainer = item.querySelector('div:first-child');
    if (iconContainer) {
      iconContainer.className = "w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-rose-500 group-hover:text-white flex items-center justify-center flex-shrink-0 transition-all duration-200";
    }
  });

  // 4. Aktifkan styling khusus pada item playlist yang sedang diklik
  if (element) {
    element.classList.add('active-video', 'border-rose-500/40', 'bg-rose-500/10');
    element.classList.remove('border-black/10', 'dark:border-white/10');
    
    const activeIconContainer = element.querySelector('div:first-child');
    if (activeIconContainer) {
      activeIconContainer.className = "w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform";
    }
  }
}

// --- OTOMATISASI TAHUN COPYRIGHT FOOTER ---
window.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.innerText = new Date().getFullYear();
  }
});

// --- ANIMASI SCROLL REVEAL (FADE UP) ---
document.addEventListener("DOMContentLoaded", function () {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15 // Animasi akan mulai berjalan saat elemen terlihat 15% di layar
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // Opsional: Hentikan pengamatan jika animasi hanya ingin dimainkan sekali
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Daftarkan semua elemen yang memiliki kelas 'reveal'
  const revealElements = document.querySelectorAll(".reveal");
  revealElements.forEach(el => observer.observe(el));
});

const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    // Mendapatkan posisi kursor relatif terhadap kartu itu sendiri
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Mengupdate variabel CSS `--mouse-x` dan `--mouse-y` pada kartu yang sedang di-hover
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});


// ================= TAMBAHAN =================

// Progress bar baca di atas halaman
(function () {
  const bar = document.createElement('div');
  bar.className = 'fixed top-0 left-0 h-1 z-[60] bg-gradient-to-r from-teal-500 to-cyan-400';
  bar.style.width = '0%';
  document.body.appendChild(bar);
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// Stagger: isi grid dan timeline sejarah muncul berurutan
document.querySelectorAll('.reveal .grid').forEach(g => {
  [...g.children].forEach((el, i) => { el.classList.add('stagger'); el.style.setProperty('--d', i * 100 + 'ms'); });
});

// Modal: tutup dengan Esc atau klik di luar kartu
document.addEventListener('keydown', e => {
  const m = document.getElementById('drugModal');
  if (e.key === 'Escape' && m && !m.classList.contains('hidden')) closeDrugModal();
});
const drugModalEl = document.getElementById('drugModal');
if (drugModalEl) drugModalEl.addEventListener('click', e => { if (e.target === drugModalEl) closeDrugModal(); });

// Aksesibilitas: aria-expanded pada tombol accordion
document.querySelectorAll('button[onclick^="toggleInfoAccordion"], button[onclick^="toggleMarketingInfo"]').forEach(b => {
  b.setAttribute('aria-expanded', 'false');
  b.addEventListener('click', () => b.setAttribute('aria-expanded', String(b.getAttribute('aria-expanded') !== 'true')));
});

for (let i = 0; i < 15; i++) {
  const b = document.createElement('span');
  const s = 10 + Math.random() * 40;
  b.className = 'bubble';
  Object.assign(b.style, {
    width: s + 'px', height: s + 'px',
    left: Math.random() * 100 + 'vw',
    animationDuration: 14 + Math.random() * 14 + 's',
    animationDelay: -Math.random() * 20 + 's'
  });
  document.body.appendChild(b);
}

// =====================================================
// ILUSTRASI PARU-PARU HERO  (tempel di bawah script.js)
// =====================================================
(function () {
  const wrap = document.getElementById('lungWrap');
  if (!wrap) return;

  const svg = wrap.querySelector('svg');
  const status = document.getElementById('lungStatus');
  const reliever = document.getElementById('lungReliever');
  const buttons = wrap.querySelectorAll('[data-lung]');

  const MSG = {
    normal: 'Bronkus terbuka, udara mengalir lancar sampai ke alveoli.',
    asthma: 'Otot bronkus mengencang, dinding meradang dan berlendir. Saluran menyempit, napas jadi berat dan mengi.',
    relief: 'Reliever (SABA) melemaskan otot bronkus. Saluran melebar kembali dalam 3-5 menit.'
  };

  function setState(state, message) {
    wrap.dataset.state = state;
    buttons.forEach(b => {
      const on = b.dataset.lung === state;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    reliever.hidden = state !== 'asthma';
    status.textContent = message || MSG[state];
  }

  buttons.forEach(b => b.addEventListener('click', () => setState(b.dataset.lung)));

  reliever.addEventListener('click', () => {
    wrap.classList.remove('bursting');
    void wrap.offsetWidth;               // restart animasi
    wrap.classList.add('bursting');
    setState('normal', MSG.relief);
    setTimeout(() => wrap.classList.remove('bursting'), 1500);
  });

  // Jeda semua animasi saat ilustrasi tidak terlihat (hemat baterai)
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      wrap.classList.toggle('is-paused', !entry.isIntersecting);
      if (svg.pauseAnimations) entry.isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations();
    }, { threshold: 0.05 }).observe(wrap);
  }
})();

(function () {
  const el = document.querySelector('.typewriter');
  if (!el) return;
  const full = el.dataset.text;
  const out = el.querySelector('.tw-text');

  // tanpa gerakan: tampilkan langsung
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.querySelector('.tw-ghost').style.visibility = 'visible';
    el.querySelector('.tw-live').remove();
    return;
  }

  el.classList.add('js-tw');
  let i = 0;
  setTimeout(function step() {
    out.textContent = full.slice(0, ++i);
    if (i < full.length) setTimeout(step, 90 + Math.random() * 70);
    else el.classList.add('done');
  }, 700);
})();

// ===== NAVIGASI: baris geser kiri-kanan =====
(function () {
  const wrap = document.getElementById('navScroll');
  if (!wrap) return;
  const track = wrap.querySelector('.nav-track');

  // Fade di tepi hanya muncul kalau memang masih ada menu yang tersembunyi
  const updateFade = () => {
    const max = track.scrollWidth - track.clientWidth;
    wrap.classList.toggle('can-left', track.scrollLeft > 4);
    wrap.classList.toggle('can-right', track.scrollLeft < max - 4);
  };
  track.addEventListener('scroll', updateFade, { passive: true });
  window.addEventListener('resize', updateFade);
  if (window.ResizeObserver) new ResizeObserver(updateFade).observe(track);
  updateFade();

  // Roda mouse vertikal -> geser horizontal (hanya saat kursor di atas menu)
  track.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      track.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  }, { passive: false });

  // Seret dengan mouse (sentuh sudah otomatis bisa digeser)
  let down = false, moved = false, startX = 0, startLeft = 0;
  track.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
  });
  window.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 5) { moved = true; track.classList.add('dragging'); }
    if (moved) track.scrollLeft = startLeft - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!down) return;
    down = false; track.classList.remove('dragging');
  });
  // Setelah menyeret, jangan ikut mengklik link
  track.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  track.addEventListener('dragstart', e => e.preventDefault());

  // Link yang sedang aktif otomatis digeser ke tengah
  const centerActive = () => {
    const a = track.querySelector('.nav-link.active');
    if (!a || down) return;
    const target = a.offsetLeft - (track.clientWidth - a.offsetWidth) / 2;
    if (Math.abs(track.scrollLeft - target) > 8) track.scrollTo({ left: target, behavior: 'smooth' });
  };
  let t;
  window.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(centerActive, 150); }, { passive: true });
})();
