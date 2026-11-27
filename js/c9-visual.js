/* =====================================================================
   c9-visual.js · Condición 9
   · Red de aliados: filtro por ciudad (chips) sobre la tabla.
   ===================================================================== */
(function () {
    'use strict';
    document.querySelectorAll('[data-v9-filter]').forEach(function (root) {
        var chips = root.querySelectorAll('.v9-chip'), rows = root.querySelectorAll('tbody tr');
        chips.forEach(function (ch) {
            ch.addEventListener('click', function () {
                var c = ch.getAttribute('data-city');
                chips.forEach(function (x) { x.classList.toggle('is-on', x === ch); });
                rows.forEach(function (r) { r.hidden = !(c === '*' || r.getAttribute('data-city') === c); });
            });
        });
    });
})();
