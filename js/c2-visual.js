/* =====================================================================
   c2-visual.js · Condición 2
   · Gráfico de enfoques por universidad: al pasar o tocar un enfoque de
     la leyenda (o un segmento) se resaltan solo las universidades que lo
     tienen; un segundo toque lo suelta.
   ===================================================================== */
(function () {
    'use strict';
    document.querySelectorAll('[data-v2-stack]').forEach(function (root) {
        var pinned = null;
        function set(k) {
            root.classList.toggle('has-k', !!k);
            root.querySelectorAll('[data-k]').forEach(function (el) { el.classList.toggle('is-on', !!k && el.getAttribute('data-k') === k); });
            root.querySelectorAll('.v2-sb:not(.v2-sb--axis)').forEach(function (row) {
                row.classList.toggle('has', !!k && !!row.querySelector('.v2-sb__s[data-k="' + k + '"]'));
            });
        }
        root.addEventListener('mouseover', function (e) { var el = e.target.closest('[data-k]'); if (el && !pinned) set(el.getAttribute('data-k')); });
        root.addEventListener('mouseleave', function () { if (!pinned) set(null); });
        root.addEventListener('click', function (e) {
            var el = e.target.closest('[data-k]'); if (!el) return;
            var k = el.getAttribute('data-k'); pinned = pinned === k ? null : k; set(pinned || null);
        });
    });
})();
