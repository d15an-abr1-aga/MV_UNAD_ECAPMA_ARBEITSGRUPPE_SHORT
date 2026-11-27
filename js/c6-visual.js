/* =====================================================================
   c6-visual.js · Condición 6 · Relación con el sector externo
   (la clase .v5-on de entrada la pone js/c5-visual.js)
   · [data-v6-cycle="ms"] recorre sola sus pasos [data-v6-i]; clic, tecla
     o cursor sobre un paso lo fija y pausa el recorrido unos segundos.
   · [data-v6-map]: mapa de Colombia (js/c6-colombia.js) con los
     departamentos de las fincas resaltados y marcadores de finca.
   · [data-v6-count]: conteo animado de cifras.
   ===================================================================== */
(function () {
    'use strict';
    var NS = 'http://www.w3.org/2000/svg';
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function isOn(el) { var s = el.closest('.slide'); return !s || s.classList.contains('v5-on'); }

    /* ── Mapa de Colombia ──────────────────────────────────────────── */
    document.querySelectorAll('[data-v6-map]').forEach(function (box) {
        var G = window.C6_COLOMBIA; if (!G) return;
        /* data-v6-deps: un grupo por índice; «a+b» resalta varios departamentos con el mismo índice */
        var groups = box.getAttribute('data-v6-deps').split(',').map(function (g) { return g.split('+'); });
        var keys = groups.map(function (g) { return g[0]; });
        var farms = (box.getAttribute('data-v6-farms') || '').split(',').filter(Boolean).map(Number);
        var cities = []; try { cities = JSON.parse(box.getAttribute('data-v6-cities') || '[]'); } catch (e) {}
        var svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('viewBox', '95 30 520 664');
        svg.setAttribute('class', 'v6-map__svg');
        var gBase = document.createElementNS(NS, 'g'), gHi = document.createElementNS(NS, 'g'), gMk = document.createElementNS(NS, 'g');
        gMk.setAttribute('class', 'v6-map__mk');
        svg.appendChild(gBase); svg.appendChild(gHi);
        var labels = [['Mar Caribe', 175, 75], ['Océano', 100, 352], ['Pacífico', 100, 372], ['Venezuela', 505, 200], ['Ecuador', 150, 585], ['Perú', 345, 672], ['Brasil', 560, 610]];
        labels.forEach(function (l) {
            var t = document.createElementNS(NS, 'text');
            t.setAttribute('x', l[1]); t.setAttribute('y', l[2]); t.setAttribute('class', 'v6-map__sea');
            t.textContent = l[0]; svg.appendChild(t);
        });
        var hiPaths = [];
        G.deps.forEach(function (d) {
            if (d[0] === 'sap') return;                     /* San Andrés fuera de encuadre */
            var p = document.createElementNS(NS, 'path');
            p.setAttribute('d', d[2]);
            var t = document.createElementNS(NS, 'title'); t.textContent = d[1]; p.appendChild(t);
            var k = -1;
            groups.forEach(function (g, gi) { if (g.indexOf(d[0]) >= 0) k = gi; });
            if (k >= 0) {
                p.setAttribute('class', 'v6-map__dep is-hi');
                p.setAttribute('data-v6-i', k); p.setAttribute('tabindex', '0');
                gHi.appendChild(p); if (d[0] === keys[k]) hiPaths[k] = p;
            } else {
                p.setAttribute('class', 'v6-map__dep'); gBase.appendChild(p);
            }
        });
        svg.appendChild(gMk);
        /* N */
        var n = document.createElementNS(NS, 'g'); n.setAttribute('class', 'v6-map__north');
        n.innerHTML = '<path d="M585 60 l7 18 h-14 z"/><text x="585" y="96">N</text>';
        svg.appendChild(n);
        box.appendChild(svg);
        /* ciudades: [x, y, «nombre», índice, lado de la etiqueta «l»|«r»] */
        cities.forEach(function (c, n) {
            var g = document.createElementNS(NS, 'g');
            g.setAttribute('class', 'v6-city' + (c[4] === 'l' ? ' v6-city--l' : ''));
            g.setAttribute('data-v6-i', c[3]);
            g.setAttribute('transform', 'translate(' + c[0] + ',' + c[1] + ')');
            g.style.setProperty('--d', (0.08 * n).toFixed(2) + 's');
            var dx = c[4] === 'l' ? -11 : 11;
            g.innerHTML = '<circle class="v6-city__halo" r="9"/><circle class="v6-city__dot" r="5.5"/>' +
                '<text class="v6-city__t" x="' + dx + '" y="5" text-anchor="' + (c[4] === 'l' ? 'end' : 'start') + '"></text>';
            g.querySelector('text').textContent = c[2];
            gMk.appendChild(g);
        });
        /* marcadores de finca (granero) en el centro de cada departamento */
        if (farms.length) requestAnimationFrame(function () {
            hiPaths.forEach(function (p, k) {
                if (!p) return;
                var b = p.getBBox(), cx = b.x + b.width / 2, cy = b.y + b.height / 2, nF = farms[k] || 1;
                if (keys[k] === 'put') { cx = b.x + b.width * 0.42; cy = b.y + b.height * 0.42; }
                if (keys[k] === 'cun') { cy = b.y + b.height * 0.42; }
                var cols = nF > 2 ? 2 : nF, gap = 22;
                for (var f = 0; f < nF; f++) {
                    var col = f % cols, row = Math.floor(f / cols), rows = Math.ceil(nF / cols);
                    var x = cx + (col - (cols - 1) / 2) * gap, y = cy + (row - (rows - 1) / 2) * gap;
                    var g = document.createElementNS(NS, 'g');
                    g.setAttribute('class', 'v6-barn'); g.setAttribute('data-v6-i', k);
                    g.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')');
                    g.style.setProperty('--d', (0.15 * f + 0.2 * k).toFixed(2) + 's');
                    g.innerHTML = '<g class="v6-barn__in"><path class="v6-barn__b" d="M-7 7 V-1 L0 -7 L7 -1 V7 Z"/><path class="v6-barn__d" d="M-3 7 V1 H3 V7 M-3 1 L3 7 M3 1 L-3 7"/></g>';
                    gMk.appendChild(g);
                }
            });
            box.dispatchEvent(new CustomEvent('v6mapready', { bubbles: true }));
        });
    });

    /* ── Recorridos interactivos ───────────────────────────────────── */
    function bindCycle(root) {
        var ms = +root.getAttribute('data-v6-cycle') || 3000;
        var n = +root.getAttribute('data-v6-n');
        var cur = -1, holdUntil = 0;
        function items() { return root.querySelectorAll('[data-v6-i]'); }
        function set(k) {
            cur = k;
            root.classList.toggle('has-step', k >= 0);
            root.style.setProperty('--k', k);
            root.style.setProperty('--p', n > 1 ? (k / (n - 1)) : 0);
            items().forEach(function (el) {
                var i = +el.getAttribute('data-v6-i');
                el.classList.toggle('is-on', i === k);
                el.classList.toggle('is-done', i < k);
            });
        }
        function pick(el) { set(+el.getAttribute('data-v6-i')); holdUntil = Date.now() + 9000; }
        root.addEventListener('click', function (e) { var el = e.target.closest('[data-v6-i]'); if (el && root.contains(el)) pick(el); });
        root.addEventListener('mouseover', function (e) { var el = e.target.closest('[data-v6-i]'); if (el && root.contains(el)) pick(el); });
        root.addEventListener('keydown', function (e) {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            var el = e.target.closest('[data-v6-i]'); if (el) { e.preventDefault(); pick(el); }
        });
        set(0);
        setInterval(function () {
            if (reduce || !isOn(root) || Date.now() < holdUntil) return;
            set((cur + 1) % n);
        }, ms);
    }
    document.querySelectorAll('[data-v6-cycle]').forEach(bindCycle);

    /* ── Conteo de cifras ──────────────────────────────────────────── */
    document.querySelectorAll('.slide').forEach(function (slide) {
        var vals = slide.querySelectorAll('[data-v6-count]'); if (!vals.length) return;
        var done = false;
        new MutationObserver(function () {
            var on = slide.classList.contains('v5-on');
            if (on && !done) {
                done = true;
                vals.forEach(function (v) {
                    var end = +v.getAttribute('data-v6-count'), t0 = null;
                    (function step(ts) {
                        if (!t0) t0 = ts;
                        var p = Math.min(1, (ts - t0) / 1200);
                        v.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
                        if (p < 1) requestAnimationFrame(step);
                    })(performance.now());
                });
            }
            if (!on) done = false;
        }).observe(slide, { attributes: true, attributeFilter: ['class'] });
    });
})();
