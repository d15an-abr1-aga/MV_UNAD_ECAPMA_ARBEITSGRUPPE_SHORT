/* =========================================================================
   presentacion.js — motor común de las páginas "Condición N"
   -------------------------------------------------------------------------
   Reemplaza los <script> en línea que cada condición traía copiados.
   Requiere GSAP + Observer (CDN) y se carga al final del <body>.

     · Navegación entre slides (rueda, táctil, teclado, puntos laterales)
     · Animación de entrada (.gsap-reveal) y contadores (data-count)
     · Scroll interno sin cambiar de slide (.custom-scroll / .flex-1)
     · Pestañas (.tabs-nav → .tab-panel)
     · Modales de página (aliados, malla) con openModal / closeModal
   El visor de imágenes y el tema claro/oscuro viven en js/theme.js.
   ========================================================================= */
(function () {
  'use strict';

  var isEmbed = new URLSearchParams(location.search).get('embed') === '1';
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  if (!slides.length || !window.gsap) return;
  if (window.Observer) gsap.registerPlugin(Observer);

  var current = 0, animating = false;

  function overlayOpen() {
    return !!document.querySelector('.img-zoom-modal.is-open, [data-modal].is-open');
  }

  /* ── Contadores animados ─────────────────────────────────────────── */
  var counted = new WeakSet();
  function animateCounter(el) {
    if (counted.has(el)) return;
    counted.add(el);
    var end = parseFloat(el.dataset.count);
    var dec = (el.dataset.count.split('.')[1] || '').length;
    var suffix = el.dataset.suffix || '';
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = end.toFixed(dec) + suffix; return; }
    var t0 = performance.now(), dur = 1200;
    (function tick(t) {
      var p = Math.min((t - t0) / dur, 1);
      el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  function reveal(slide) {
    var els = slide.querySelectorAll('.gsap-reveal');
    if (els.length) gsap.fromTo(els, { y: 24, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: .55, stagger: .06, ease: 'power3.out', overwrite: 'auto', delay: .05 });
    slide.querySelectorAll('[data-count]').forEach(animateCounter);
  }

  /* ── Puntos laterales ────────────────────────────────────────────── */
  var dotBox = document.getElementById('dot-container');
  if (!isEmbed && dotBox) {
    slides.forEach(function (slide, i) {
      var title = slide.dataset.title || ('Diapositiva ' + (i + 1));
      var w = document.createElement('button');
      w.type = 'button';
      w.className = 'dot-wrapper nav-btn';
      w.dataset.title = title;
      w.setAttribute('aria-label', 'Ir a: ' + title);
      w.addEventListener('click', function () { go(i, i > current ? 1 : -1); });
      var d = document.createElement('span');
      d.className = 'dot';
      w.appendChild(d);
      dotBox.appendChild(w);
    });
  }
  var dots = document.querySelectorAll('.dot');
  function updateDots() {
    dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
  }

  /* ── Navegación ──────────────────────────────────────────────────── */
  function go(index, dir) {
    if (overlayOpen() || animating || index < 0 || index >= slides.length || index === current) return;
    animating = true;
    var from = slides[current], to = slides[index];
    gsap.set(to, { yPercent: dir === 1 ? 100 : -100, autoAlpha: 1 });
    gsap.timeline({
      defaults: { duration: .7, ease: 'power4.inOut' },
      onComplete: function () {
        gsap.set(from, { autoAlpha: 0 });
        current = index;
        updateDots();
        animating = false;
        document.dispatchEvent(new CustomEvent('slidechange', { detail: { index: index, slide: to } }));
      }
    }).to(from, { yPercent: dir === 1 ? -100 : 100 }).to(to, { yPercent: 0 }, '<');
    reveal(to);
  }
  window.gotoSlide = go;

  gsap.set(slides, { yPercent: 100, autoAlpha: 0 });
  gsap.set(slides[0], { yPercent: 0, autoAlpha: 1 });
  updateDots();
  reveal(slides[0]);

  if (window.Observer) {
    Observer.create({
      type: 'wheel,touch,pointer', wheelSpeed: -1, tolerance: 40, preventDefault: false,
      onDown: function () { go(current - 1, -1); },
      onUp:   function () { go(current + 1, 1); }
    });
  }

  /* Las zonas con scroll propio no cambian de slide hasta llegar al borde */
  document.querySelectorAll('.custom-scroll, .glass-panel > .flex-1').forEach(function (el) {
    el.addEventListener('wheel', function (e) {
      var atTop = el.scrollTop <= 0;
      var atBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 2;
      if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) e.stopPropagation();
    }, { passive: false });
    el.addEventListener('touchmove', function (e) {
      if (el.scrollHeight > el.clientHeight + 2) e.stopPropagation();
    }, { passive: false });
  });

  window.addEventListener('keydown', function (e) {
    if (overlayOpen()) return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (['ArrowDown', 'PageDown', ' '].indexOf(e.key) >= 0) { e.preventDefault(); go(current + 1, 1); }
    else if (['ArrowUp', 'PageUp'].indexOf(e.key) >= 0) { e.preventDefault(); go(current - 1, -1); }
    else if (e.key === 'Home') { e.preventDefault(); go(0, -1); }
    else if (e.key === 'End') { e.preventDefault(); go(slides.length - 1, 1); }
  });

  var up = document.getElementById('btn-up'), down = document.getElementById('btn-down');
  if (up) up.addEventListener('click', function () { go(current - 1, -1); });
  if (down) down.addEventListener('click', function () { go(current + 1, 1); });
  var restart = document.getElementById('restart-btn');
  if (restart) restart.addEventListener('click', function () { go(0, -1); });

  /* ── Pestañas ────────────────────────────────────────────────────── */
  document.querySelectorAll('.tabs-nav').forEach(function (nav) {
    var scope = nav.closest('.slide') || document;
    var cards = nav.querySelectorAll('.tab-card');
    var panels = scope.querySelectorAll('.tab-panel');
    cards.forEach(function (card) {
      card.setAttribute('role', 'tab');
      card.addEventListener('click', function () {
        cards.forEach(function (c) { c.classList.toggle('is-active', c === card); c.setAttribute('aria-selected', c === card); });
        panels.forEach(function (p) { p.classList.toggle('is-active', p.dataset.panel === card.dataset.tab); });
      });
    });
  });

  /* ── Modales de página ──────────────────────────────────────────────
     <div id="x" data-modal class="hidden …">  ·  openModal('x') / closeModal('x')
     Para la malla, el iframe se carga al abrir (data-src).               */
  function openModal(id) {
    var m = document.getElementById(id); if (!m) return;
    m.querySelectorAll('iframe[data-src]').forEach(function (f) { f.src = f.dataset.src; });
    m.classList.remove('hidden'); m.classList.add('flex', 'is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(id) {
    var m = id ? document.getElementById(id) : document.querySelector('[data-modal].is-open');
    if (!m) return;
    m.classList.add('hidden'); m.classList.remove('flex', 'is-open');
    document.body.style.overflow = '';
    setTimeout(function () { m.querySelectorAll('iframe[data-src]').forEach(function (f) { f.src = 'about:blank'; }); }, 300);
  }
  window.openModal = openModal;
  window.closeModal = closeModal;
  /* Compatibilidad con los onclick existentes */
  window.openAliadosModal  = function () { openModal('aliados-modal'); };
  window.closeAliadosModal = function () { closeModal('aliados-modal'); };
  window.openMallaModal    = function () { openModal('malla-modal'); };
  window.closeMallaModal   = function () { closeModal('malla-modal'); };

  document.addEventListener('click', function (e) {
    var m = e.target.closest('[data-modal].is-open');
    if (m && e.target === m) closeModal(m.id);           /* clic en el fondo */
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.querySelector('[data-modal].is-open')) closeModal();
  });
})();
