/* =====================================================================
   c7-visual.js · Condición 7
   (la clase .v5-on de entrada la pone js/c5-visual.js)
   · Figura 4 recreada: al pasar o tocar una barra se resalta su nivel
     de formación y el indicador correspondiente (y viceversa).
   · Conteo animado de los valores de las barras al entrar a la slide.
   · Escalonado de las filas de la Tabla 7.8.
   ===================================================================== */
(function () {
    'use strict';

    /* Filas de la tabla: aparición escalonada */
    document.querySelectorAll('.v7-table tbody tr').forEach(function (tr, i) {
        tr.style.transitionDelay = (0.08 + i * 0.06).toFixed(2) + 's';
    });

    /* Gráfico ↔ indicadores */
    document.querySelectorAll('.v7-comp').forEach(function (root) {
        var chart = root.querySelector('[data-v7-chart]');
        var items = root.querySelectorAll('[data-v7-k]');
        var pinned = null;
        function set(k) {
            root.classList.toggle('has-k', !!k);
            if (chart) chart.classList.toggle('has-k', !!k);
            items.forEach(function (el) { el.classList.toggle('is-on', !!k && el.getAttribute('data-v7-k') === k); });
        }
        items.forEach(function (el) {
            var k = el.getAttribute('data-v7-k');
            el.addEventListener('mouseenter', function () { if (!pinned) set(k); });
            el.addEventListener('mouseleave', function () { if (!pinned) set(null); });
            el.addEventListener('click', function () { pinned = pinned === k ? null : k; set(pinned); });
        });

        /* conteo de valores */
        var slide = root.closest('.slide'), done = false;
        var vals = root.querySelectorAll('[data-v7-count]');
        function count() {
            vals.forEach(function (v) {
                var end = +v.getAttribute('data-v7-count'), t0 = null;
                function step(ts) {
                    if (!t0) t0 = ts;
                    var p = Math.min(1, (ts - t0) / 1100);
                    v.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
                    if (p < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
            });
        }
        if (slide && 'MutationObserver' in window) {
            new MutationObserver(function () {
                var on = slide.classList.contains('v5-on');
                if (on && !done) { done = true; count(); }
                if (!on) done = false;
            }).observe(slide, { attributes: true, attributeFilter: ['class'] });
        }
    });
})();
