/* =====================================================================
   c5-visual.js · Condición 5
   ---------------------------------------------------------------------
   · .v5-on en la slide visible (animaciones de entrada).
   · Selector NP1 / NP2 (slide «Articulación con NP»).
   · Fases de la agenda a 7 años (resaltar al pasar o hacer clic).
   · Aro de semilleros: gira solo, un semillero a la vez, mostrando su
     descripción al frente; clic / flechas / pausa.
   · Puente «investigación → impacto territorial» (tramos interactivos).
   ===================================================================== */
(function () {
    'use strict';

    /* ── Animación de entrada ──────────────────────────────────────── */
    var slides = document.querySelectorAll('.slide');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting && en.intersectionRatio > 0.5) en.target.classList.add('v5-on');
                else if (!en.isIntersecting) en.target.classList.remove('v5-on');
            });
        }, { threshold: [0, 0.5, 0.9] });
        slides.forEach(function (s) { if (s.querySelector('.v5')) io.observe(s); });
    } else {
        slides.forEach(function (s) { s.classList.add('v5-on'); });
    }

    /* ── Selector de núcleos problémicos ───────────────────────────── */
    document.querySelectorAll('[data-v5-npwrap]').forEach(function (wrap) {
        var slide = wrap.closest('.slide') || document;
        var btns = wrap.querySelectorAll('[data-v5-np]');
        var panels = wrap.querySelectorAll('[data-v5-panel]');
        var evs = slide.querySelectorAll('[data-v5-ev]');
        function show(k) {
            btns.forEach(function (b) { var on = b.getAttribute('data-v5-np') === k; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on); });
            panels.forEach(function (p) { p.hidden = p.getAttribute('data-v5-panel') !== k; });
            evs.forEach(function (e) { e.hidden = e.getAttribute('data-v5-ev') !== k; });
        }
        btns.forEach(function (b) { b.addEventListener('click', function () { show(b.getAttribute('data-v5-np')); }); });
        show('np1');
    });

    /* ── Fases de la agenda ────────────────────────────────────────── */
    document.querySelectorAll('.v5-phases').forEach(function (box) {
        var ph = box.querySelectorAll('.v5-phase'), pinned = null;
        function set(el) {
            ph.forEach(function (p) { p.classList.toggle('is-active', p === el); });
            box.classList.toggle('has-active', !!el);
        }
        ph.forEach(function (p) {
            p.addEventListener('mouseenter', function () { if (!pinned) set(p); });
            p.addEventListener('click', function () { pinned = pinned === p ? null : p; set(pinned || p); });
        });
        box.addEventListener('mouseleave', function () { if (!pinned) set(null); });
    });

    /* ── Aro de semilleros ─────────────────────────────────────────── */
    /* Gira solo, paso a paso: cada semillero se detiene al frente
       DWELL ms (con su descripción visible) y luego avanza al siguiente.
       Clic en un semillero o en las flechas lo trae al frente; el botón
       central pausa / reanuda. Al pasar el cursor por el aro se detiene. */
    document.querySelectorAll('[data-v5-ring]').forEach(function (root) {
        var stage = root.querySelector('.v5-ring');
        var seeds = Array.prototype.slice.call(root.querySelectorAll('.v5-seed'));
        var idxEl = root.querySelector('[data-v5-card="idx"]');
        var prog = root.querySelector('[data-v5-ring-prog]');
        var playBtn = root.querySelector('[data-v5-ring-play]');
        var n = seeds.length, step = (Math.PI * 2) / n;
        var DWELL = 4800, RESUME = 9000;
        var rot = 0, target = 0, cur = 0, hover = false, paused = false;
        var dwellStart = Date.now(), holdUntil = 0, R = 480, RY = 70;
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var slide = root.closest('.slide');

        function measure() {
            var w = stage.clientWidth || 1000, h = stage.clientHeight || 240;
            R = Math.max(220, Math.min(600, w / 2 - 70));
            RY = Math.max(46, h * 0.30);
        }
        function setFront(i) {
            seeds.forEach(function (x, j) {
                var on = j === i;
                x.classList.toggle('is-front', on);
                x.setAttribute('aria-current', on ? 'true' : 'false');
            });
            if (idxEl) idxEl.textContent = (i + 1) + ' / ' + n;
        }
        function layout() {
            seeds.forEach(function (s, i) {
                var a = i * step + rot, c = Math.cos(a), d = (c + 1) / 2;
                var x = R * Math.sin(a), y = RY * c;
                var sc = 0.5 + 0.55 * Math.pow(d, 2.2);
                s.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + sc.toFixed(3) + ')';
                s.style.opacity = (0.32 + 0.68 * Math.pow(d, 1.4)).toFixed(3);
                s.style.zIndex = String(Math.round(d * 100) + (s.classList.contains('is-front') ? 100 : 0));
                s.style.pointerEvents = d > 0.35 ? 'auto' : 'none';
            });
        }
        function goTo(i, manual) {
            i = ((i % n) + n) % n;
            var want = -i * step;
            var diff = ((want - rot) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
            target = rot + diff; cur = i;
            setFront(i);
            dwellStart = Date.now();
            if (manual) holdUntil = Date.now() + RESUME;
        }
        function setPaused(v) {
            paused = v;
            if (playBtn) {
                playBtn.classList.toggle('is-paused', v);
                playBtn.setAttribute('aria-label', v ? 'Reanudar giro' : 'Pausar giro');
            }
            dwellStart = Date.now();
        }
        function visible() { return !slide || slide.classList.contains('v5-on'); }
        function tick() {
            var now = Date.now();
            rot += (target - rot) * 0.075;
            if (Math.abs(target - rot) < 0.0005) rot = target;
            var running = !reduce && !paused && !hover && now > holdUntil && visible();
            if (!running) dwellStart = now;
            var t = Math.min(1, (now - dwellStart) / DWELL);
            if (prog) prog.style.transform = 'scaleX(' + (running ? t : 0).toFixed(3) + ')';
            if (running && t >= 1) goTo(cur + 1, false);
            layout();
            requestAnimationFrame(tick);
        }
        seeds.forEach(function (s, i) {
            s.setAttribute('type', 'button');
            s.addEventListener('click', function (e) { e.stopPropagation(); goTo(i, true); });
        });
        stage.addEventListener('mouseenter', function () { hover = true; });
        stage.addEventListener('mouseleave', function () { hover = false; });
        var prev = root.querySelector('[data-v5-ring-prev]'), next = root.querySelector('[data-v5-ring-next]');
        if (prev) prev.addEventListener('click', function () { goTo(cur - 1, true); });
        if (next) next.addEventListener('click', function () { goTo(cur + 1, true); });
        if (playBtn) playBtn.addEventListener('click', function () { setPaused(!paused); holdUntil = 0; });
        window.addEventListener('resize', function () { measure(); layout(); });
        measure(); goTo(0, false); rot = target; layout(); requestAnimationFrame(tick);
        setTimeout(measure, 600);
    });

    /* ── Puente «De la investigación al impacto territorial» ────────── */
    /* Recorre solo: Necesidad → Proyecto → Producto → Transferencia →
       Resultado → Impacto. Clic en un tramo, etiqueta o extremo lo fija
       y pausa el recorrido unos segundos. */
    document.querySelectorAll('[data-v5-bridge]').forEach(function (root) {
        var car = root.querySelector('.v5-br__car');
        var spans = root.querySelectorAll('.v5-br__span');
        var labs = root.querySelectorAll('.v5-br__lab');
        var ends = root.querySelectorAll('.v5-br__end');
        var X = { '-1': 46, '0': 185, '1': 395, '2': 605, '3': 815, '4': 954 };
        var slide = root.closest('.slide');
        var cur = -1, holdUntil = 0, timer = null;
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        function set(k) {
            cur = k;
            root.classList.toggle('has-step', k >= 0 && k <= 3);
            spans.forEach(function (s) {
                var i = +s.getAttribute('data-v5-br-step');
                s.classList.toggle('is-on', i === k);
                s.classList.toggle('is-done', i < k);
            });
            labs.forEach(function (l) { l.classList.toggle('is-on', +l.getAttribute('data-v5-br-step') === k); });
            ends.forEach(function (e) { e.classList.toggle('is-on', +e.getAttribute('data-v5-br-step') === k); });
            if (car) car.style.transform = 'translate(' + X[String(k)] + 'px,154px)';
        }
        function loop() {
            var visible = !slide || slide.classList.contains('v5-on');
            if (!reduce && visible && Date.now() > holdUntil) set(cur >= 4 ? -1 : cur + 1);
        }
        root.querySelectorAll('[data-v5-br-step]').forEach(function (el) {
            function go() { set(+el.getAttribute('data-v5-br-step')); holdUntil = Date.now() + 9000; }
            el.addEventListener('click', go);
            el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
        });
        set(-1);
        timer = setInterval(loop, 3200);
    });

})();
