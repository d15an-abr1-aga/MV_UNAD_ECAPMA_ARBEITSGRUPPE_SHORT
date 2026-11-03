/* =========================================================================
   theme.js — tema claro/oscuro + visor de imágenes, común a todo el sitio
   -------------------------------------------------------------------------
   · Una sola clave de almacenamiento: "mv-theme". Lee las claves antiguas
     ("unad-theme", "malla-theme") para no perder la preferencia guardada.
   · Aplica .dark (Tailwind) y data-theme (CSS propio) en <html>.
   · Cárguelo en el <head> (sin defer) para evitar el destello de tema.
   · Visor de imágenes: cualquier elemento con data-image-zoom="ruta.png"
     abre la imagen ampliada (data-image-title, -label, -icon, -alt,
     -gradient-from, -gradient-to son opcionales).
   ========================================================================= */
(function () {
  var KEY = 'mv-theme', OLD = ['unad-theme', 'malla-theme'];
  var root = document.documentElement;

  function read() {
    try {
      var v = localStorage.getItem(KEY);
      for (var i = 0; !v && i < OLD.length; i++) v = localStorage.getItem(OLD[i]);
      return v === 'dark' ? 'dark' : 'light';
    } catch (e) { return 'light'; }
  }
  function apply(theme, persist) {
    var dark = theme === 'dark';
    root.classList.toggle('dark', dark);
    root.classList.toggle('light', !dark);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (persist) { try { localStorage.setItem(KEY, theme); } catch (e) {} }
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.textContent = dark ? '☀️' : '🌙';
      btn.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    });
  }
  apply(read(), false);

  document.addEventListener('DOMContentLoaded', function () {
    apply(read(), false);
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      if (btn.dataset.themeBound) return;
      btn.dataset.themeBound = '1';
      btn.addEventListener('click', function () {
        apply(root.classList.contains('dark') ? 'light' : 'dark', true);
      });
    });
  });
})();

/* ══════════════════════════════════════════════
   VISOR DE IMÁGENES
   ══════════════════════════════════════════════ */
(function () {
  if (window.__imgZoomInit__) return;
  window.__imgZoomInit__ = true;
  var modal = null, lastFocus = null;

  function build() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'img-zoom-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML =
      '<div class="img-zoom-modal__overlay" data-img-zoom-close></div>' +
      '<div class="img-zoom-modal__panel">' +
        '<div class="img-zoom-modal__header">' +
          '<div style="display:flex;align-items:center;gap:.5rem;min-width:0">' +
            '<span class="iconify img-zoom-modal__icon" data-width="20"></span>' +
            '<div style="min-width:0">' +
              '<p class="img-zoom-modal__label" style="font:700 .65rem/1.2 Inter,sans-serif;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.8);margin:0"></p>' +
              '<p class="img-zoom-modal__title" style="font:700 .85rem/1.25 Montserrat,sans-serif;margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></p>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:.5rem;flex-shrink:0">' +
            '<a class="img-zoom-modal__newtab" target="_blank" rel="noopener"><span>↗</span> Nueva pestaña</a>' +
            '<button type="button" class="img-zoom-modal__close" data-img-zoom-close aria-label="Cerrar">×</button>' +
          '</div>' +
        '</div>' +
        '<div class="img-zoom-modal__body"><img alt=""></div>' +
      '</div>';
    document.body.appendChild(modal);
    return modal;
  }

  function close() {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-image-zoom]');
    if (t) {
      e.preventDefault(); e.stopPropagation();
      var m = build(), src = t.getAttribute('data-image-zoom');
      var alt = t.getAttribute('data-image-alt') || '';
      var img = m.querySelector('.img-zoom-modal__body img');
      img.src = src; img.alt = alt;
      m.querySelector('.img-zoom-modal__title').textContent = t.getAttribute('data-image-title') || alt;
      m.querySelector('.img-zoom-modal__label').textContent = t.getAttribute('data-image-label') || '';
      m.querySelector('.img-zoom-modal__newtab').href = src;
      var head = m.querySelector('.img-zoom-modal__header');
      head.style.setProperty('--img-zoom-grad-from', t.getAttribute('data-image-gradient-from') || '#00445B');
      head.style.setProperty('--img-zoom-grad-to', t.getAttribute('data-image-gradient-to') || '#035B3B');
      var icon = m.querySelector('.img-zoom-modal__icon');
      icon.setAttribute('data-icon', t.getAttribute('data-image-icon') || 'lucide:image');
      if (window.Iconify && typeof window.Iconify.scan === 'function') window.Iconify.scan(icon);
      lastFocus = t;
      m.classList.add('is-open');
      m.querySelector('.img-zoom-modal__close').focus();
      return;
    }
    if (e.target.closest('[data-img-zoom-close]')) { e.preventDefault(); e.stopPropagation(); close(); }
  }, true);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') close();
  });
})();
