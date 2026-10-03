(function () {
  'use strict';

  const section = document.getElementById('video-edukasi');
  if (!section) return;

  const $ = (id) => document.getElementById(id);
  const stage = $('vpStage'), frame = $('vpFrame'), video = $('vpVideo');
  const big = $('vpBig'), play = $('vpPlay'), cur = $('vpCur'), dur = $('vpDur');
  const track = $('vpTrack'), fill = $('vpFill'), buf = $('vpBuf'), thumb = $('vpThumb');
  const mute = $('vpMute'), vol = $('vpVol'), speed = $('vpSpeed'), fs = $('vpFs');
  const glow = $('vpAmbient'), msg = $('vpMsg');
  if (!stage || !frame || !video) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPEEDS = [0.75, 1, 1.25, 1.5, 2];
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const fmt = (s) => {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ':' + String(r).padStart(2, '0');
  };
  const icon = (btn, cls) => { btn.firstElementChild.className = cls; };

  /* ---------- Putar / jeda ---------- */
  function toggle() {
    if (video.paused || video.ended) { const p = video.play(); if (p && p.catch) p.catch(function () {}); }
    else video.pause();
  }
  play.addEventListener('click', toggle);
  big.addEventListener('click', toggle);
  video.addEventListener('click', toggle);
  video.addEventListener('dblclick', toggleFullscreen);

  let playing = false;
  function setPlaying(on) {
    playing = on;
    stage.classList.toggle('is-playing', on);
    icon(play, on ? 'fa-solid fa-pause' : 'fa-solid fa-play');
    play.setAttribute('aria-label', on ? 'Jeda' : 'Putar');
    on ? ambientStart() : ambientStop();
    syncCinema();
    wake();
  }
  video.addEventListener('play', function () { setPlaying(true); });
  video.addEventListener('pause', function () { setPlaying(false); });
  video.addEventListener('ended', function () { setPlaying(false); });

  /* ---------- Waktu & progres ---------- */
  function updateTime() {
    const d = video.duration, t = video.currentTime;
    const p = d ? clamp(t / d, 0, 1) * 100 : 0;
    fill.style.width = p + '%';
    thumb.style.left = p + '%';
    cur.textContent = fmt(t);
    track.setAttribute('aria-valuenow', Math.round(p));
    track.setAttribute('aria-valuetext', fmt(t) + ' dari ' + fmt(d));
  }
  video.addEventListener('timeupdate', updateTime);
  video.addEventListener('loadedmetadata', function () { dur.textContent = fmt(video.duration); updateTime(); });
  video.addEventListener('progress', function () {
    const d = video.duration;
    if (!d || !video.buffered.length) return;
    buf.style.width = (video.buffered.end(video.buffered.length - 1) / d * 100) + '%';
  });

  function seekFromEvent(e) {
    if (!video.duration) return;
    const r = track.getBoundingClientRect();
    video.currentTime = clamp((e.clientX - r.left) / r.width, 0, 1) * video.duration;
  }
  track.addEventListener('pointerdown', function (e) {
    track.setPointerCapture(e.pointerId);
    track.classList.add('is-drag');
    seekFromEvent(e);
  });
  track.addEventListener('pointermove', function (e) { if (track.classList.contains('is-drag')) seekFromEvent(e); });
  track.addEventListener('pointerup', function () { track.classList.remove('is-drag'); });
  track.addEventListener('pointercancel', function () { track.classList.remove('is-drag'); });

  /* ---------- Volume, kecepatan, layar penuh ---------- */
  function syncVolume() {
    const v = video.muted ? 0 : video.volume;
    vol.value = v;
    icon(mute, v === 0 ? 'fa-solid fa-volume-xmark' : v < 0.5 ? 'fa-solid fa-volume-low' : 'fa-solid fa-volume-high');
    mute.setAttribute('aria-label', v === 0 ? 'Aktifkan suara' : 'Bisukan');
  }
  video.addEventListener('volumechange', syncVolume);
  mute.addEventListener('click', function () { video.muted = !video.muted; });
  vol.addEventListener('input', function () { video.volume = +vol.value; video.muted = +vol.value === 0; });
  vol.addEventListener('keydown', function (e) { e.stopPropagation(); });

  speed.addEventListener('click', function () {
    const i = SPEEDS.indexOf(video.playbackRate);
    video.playbackRate = SPEEDS[(i + 1) % SPEEDS.length];
    speed.textContent = video.playbackRate + '×';
  });

  function isFs() { return document.fullscreenElement || document.webkitFullscreenElement; }
  function toggleFullscreen() {
    if (isFs()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
    else if (frame.requestFullscreen) frame.requestFullscreen();
    else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();   // iPhone
  }
  fs.addEventListener('click', toggleFullscreen);
  function onFsChange() {
    icon(fs, isFs() ? 'fa-solid fa-compress' : 'fa-solid fa-expand');
    fs.setAttribute('aria-label', isFs() ? 'Keluar layar penuh' : 'Layar penuh');
  }
  document.addEventListener('fullscreenchange', onFsChange);
  document.addEventListener('webkitfullscreenchange', onFsChange);

  /* ---------- Kontrol otomatis tersembunyi saat diam ---------- */
  let idleTimer = null;
  function wake() {
    stage.classList.remove('is-idle');
    clearTimeout(idleTimer);
    if (playing) idleTimer = setTimeout(function () { stage.classList.add('is-idle'); }, 2600);
  }
  ['pointermove', 'pointerdown', 'keydown', 'focusin'].forEach(function (ev) { frame.addEventListener(ev, wake); });

  /* ---------- Keyboard ---------- */
  frame.addEventListener('keydown', function (e) {
    if (e.target.closest('button, input')) return;
    const k = e.key.toLowerCase();
    if (k === ' ' || k === 'k') { e.preventDefault(); toggle(); }
    else if (k === 'arrowright') { e.preventDefault(); video.currentTime = clamp(video.currentTime + 5, 0, video.duration || 0); }
    else if (k === 'arrowleft') { e.preventDefault(); video.currentTime = Math.max(0, video.currentTime - 5); }
    else if (k === 'arrowup') { e.preventDefault(); video.volume = clamp(video.volume + 0.1, 0, 1); video.muted = false; }
    else if (k === 'arrowdown') { e.preventDefault(); video.volume = clamp(video.volume - 0.1, 0, 1); }
    else if (k === 'm') video.muted = !video.muted;
    else if (k === 'f') toggleFullscreen();
  });

  /* ---------- Cahaya latar (ambient): frame video digambar kecil lalu dikaburkan lewat CSS ---------- */
  const g = glow.getContext('2d');
  let ambTimer = null;
  function drawAmbient() { try { g.drawImage(video, 0, 0, glow.width, glow.height); } catch (e) { /* abaikan */ } }
  function ambientStart() { if (!reduceMotion && !ambTimer) ambTimer = setInterval(drawAmbient, 130); }
  function ambientStop() { clearInterval(ambTimer); ambTimer = null; drawAmbient(); }
  video.addEventListener('loadeddata', drawAmbient);
  video.addEventListener('seeked', drawAmbient);

  /* ---------- Mode bioskop: latar meredup selama video diputar dan terlihat di layar ---------- */
  const dim = document.createElement('div');
  dim.className = 'vp-dim';
  document.body.appendChild(dim);   // di <body> agar tidak terpengaruh transform milik .reveal

  let inView = false;
  function syncCinema() {
    const on = playing && inView;
    section.classList.toggle('is-cinema', on);
    dim.classList.toggle('is-on', on);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { inView = entries[0].isIntersecting; syncCinema(); }, { threshold: 0.4 }).observe(frame);
  } else { inView = true; }

  /* ---------- Bila file video tidak ditemukan ---------- */
  const source = video.querySelector('source');
  function showError() { msg.hidden = false; big.hidden = true; console.warn('Video tidak ditemukan:', source ? source.getAttribute('src') : video.currentSrc); }
  video.addEventListener('error', showError);
  if (source) source.addEventListener('error', showError);
  // Error bisa terjadi sebelum skrip ini jalan, jadi cek juga statusnya secara langsung
  function checkSource() { if (video.error || video.networkState === 3) showError(); }
  checkSource();
  window.addEventListener('load', checkSource);
  setTimeout(checkSource, 1200);

  syncVolume();
})();

