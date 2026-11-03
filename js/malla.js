/* =========================================================================
   malla.js — malla académica interactiva
   -------------------------------------------------------------------------
   · Dibuja los 10 periodos (todos visibles a la vez en escritorio).
   · Hover / click en un curso → resalta su cadena de prerrequisitos y
     los cursos que dependen de él; el detalle aparece en el panel inferior.
   · Barra de rutas con 3 pestañas:
       - Resultados de aprendizaje (NP1 → RAP 1-3 · NP2 → RAP 4-5)
       - Rutas de prerrequisitos
       - Rutas transversales (Idioma, Investigación, Innovación, Saber Pro, SISSU)
   Lee los datos de window.MALLA_DATA (malla-data.js).
   ========================================================================= */
(function () {
  'use strict';

  var mallaEl   = document.getElementById('malla');
  var detalleEl = document.getElementById('detalle');
  var tabsEl    = document.getElementById('rutas-tabs');
  var btnsEl    = document.getElementById('rutas-btns');

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function showFatal(msg) {
    console.error('[malla.js]', msg);
    if (detalleEl) {
      detalleEl.innerHTML =
        '<div class="det-empty"><span class="iconify" data-icon="lucide:triangle-alert" data-width="30"></span>' +
        '<div><h3>Error al cargar la malla</h3><p class="det-mono">' + esc(msg) + '</p></div></div>';
      if (window.Iconify && window.Iconify.scan) window.Iconify.scan(detalleEl);
    }
  }

  if (!mallaEl || !detalleEl) { showFatal('Falta #malla o #detalle en el HTML'); return; }
  if (!window.MALLA_DATA)     { showFatal('window.MALLA_DATA es undefined. Revisa que malla-data.js esté cargado.'); return; }

  var D = window.MALLA_DATA;
  var MALLA = D.MALLA, PRE = D.PREREQUISITOS, TIPO = D.TIPO_INFO, PCOL = D.PERIODO_COLORES;
  var RAP = D.RAP || {}, NUC = D.NUCLEOS || {}, RUTAS = D.RUTAS || {};

  /* ── Índices ─────────────────────────────────────────────────────── */
  var cursoById = new Map();      // id → datos + periodo
  var elById    = new Map();      // id → <article>
  var dependientes = {};          // id → [ids que lo tienen como prerrequisito]

  MALLA.forEach(function (p, i) {
    p.cursos.forEach(function (c) {
      cursoById.set(c.id, Object.assign({}, c, { periodo: p.numero, periodoIndex: i }));
    });
  });
  Object.keys(PRE).forEach(function (id) {
    PRE[id].forEach(function (req) { (dependientes[req] = dependientes[req] || []).push(id); });
  });

  function cadena(id, mapa, visit) {
    visit = visit || new Set();
    (mapa[id] || []).forEach(function (x) {
      if (!visit.has(x)) { visit.add(x); cadena(x, mapa, visit); }
    });
    return visit;
  }

  var TOTAL_CREDITOS = MALLA.reduce(function (s, p) { return s + p.creditos; }, 0);
  var TOTAL_CURSOS   = MALLA.reduce(function (s, p) { return s + p.cursos.length; }, 0);

  /* ── Render de la malla ──────────────────────────────────────────── */
  function rapDots(c) {
    if (!c.rap || !c.rap.length) return '';
    return '<span class="curso__raps" aria-hidden="true">' +
      c.rap.map(function (n) {
        var r = RAP[n]; return r ? '<i style="--rap:' + r.color + '" title="RAP ' + n + '"></i>' : '';
      }).join('') + '</span>';
  }

  function render() {
    mallaEl.innerHTML = '';
    MALLA.forEach(function (p, i) {
      var col = document.createElement('section');
      col.className = 'periodo';
      col.style.setProperty('--per', PCOL[i] || '#00445B');
      col.setAttribute('aria-label', 'Periodo ' + p.numero);

      col.innerHTML =
        '<header class="periodo__header"><span>Periodo</span><b>' + p.numero + '</b></header>';

      var body = document.createElement('div');
      body.className = 'periodo__body';

      p.cursos.forEach(function (c) {
        var el = document.createElement('article');
        el.className = 'curso' + (c.electivo ? ' curso--electivo' : '') + (c.rotacion ? ' curso--rotacion' : '');
        el.tabIndex = 0;
        el.dataset.id = c.id;
        el.style.setProperty('--tipo-color', (TIPO[c.tipo] || {}).color || '#00445B');
        el.setAttribute('role', 'button');
        el.setAttribute('title', c.nombre);
        el.setAttribute('aria-label', c.nombre + '. ' + ((TIPO[c.tipo] || {}).label || '') + ', ' + c.creditos + ' créditos.');
        el.innerHTML =
          '<span class="curso__top"><span class="curso__type">' + c.tipo + ' · ' + c.creditos + ' cr</span>' + rapDots(c) + '</span>' +
          '<span class="curso__name">' + esc(c.nombre) + '</span>';
        elById.set(c.id, el);
        body.appendChild(el);
      });

      col.appendChild(body);
      var foot = document.createElement('footer');
      foot.className = 'periodo__footer';
      foot.innerHTML = '<span>' + p.cursos.length + ' cursos</span><strong>' + p.creditos + ' cr</strong>';
      col.appendChild(foot);
      mallaEl.appendChild(col);
    });

    var totEl = document.getElementById('malla-totales');
    if (totEl) totEl.innerHTML =
      '<span><b>' + TOTAL_CURSOS + '</b> cursos</span><span><b>' + TOTAL_CREDITOS + '</b> créditos</span><span><b>10</b> periodos</span><span><b>5</b> RAP</span>';
  }

  /* ── Estado ──────────────────────────────────────────────────────── */
  var ruta = null;          // { key, tipo:'rap'|'np'|'ruta', ids, color }
  var pinnedId = null;
  var tabActiva = 'rap';

  function limpiarClases() {
    mallaEl.classList.remove('has-focus', 'has-ruta');
    mallaEl.querySelectorAll('.curso').forEach(function (el) {
      el.classList.remove('is-active', 'is-prereq', 'is-dep', 'is-pinned', 'is-ruta', 'is-control');
      el.style.removeProperty('--ruta-color');
    });
  }

  /* ── Rutas: definición unificada ─────────────────────────────────── */
  function getRuta(key) {
    if (/^rap\d$/.test(key)) {
      var r = RAP[+key.slice(3)];
      return r && { key: key, tipo: 'rap', ids: r.cursos, control: r.control || [], color: r.color, rap: r };
    }
    if (NUC[key]) {
      var n = NUC[key], set = n.cursos ? n.cursos.slice() : [];
      if (!set.length) n.raps.forEach(function (num) { RAP[num].cursos.forEach(function (id) { if (set.indexOf(id) < 0) set.push(id); }); });
      return { key: key, tipo: 'np', ids: set, control: [], color: n.color, np: n };
    }
    /* Módulo individual de una ruta con módulos: "saberpro~2" */
    var mm = key.split('~');
    var x = RUTAS[mm[0]];
    if (!x) return null;
    var r = { key: key, tipo: 'ruta', ids: x.ids, control: [], color: x.color, def: x, colorDe: {} };
    if (x.modulos) {
      var mods = mm.length > 1 ? [x.modulos[+mm[1]]] : x.modulos;
      if (mm.length > 1) { r.ids = mods[0].ids; r.color = mods[0].color; r.modulo = mods[0]; }
      mods.forEach(function (m) { m.ids.forEach(function (id) { if (!r.colorDe[id]) r.colorDe[id] = m.color; }); });
    }
    return r;
  }

  function pintarRuta() {
    limpiarClases();
    if (!ruta) return;
    mallaEl.classList.add('has-ruta');
    mallaEl.style.setProperty('--ruta-color', ruta.color);
    ruta.ids.forEach(function (id) {
      var el = elById.get(id); if (!el) return;
      el.classList.add('is-ruta');
      if (ruta.colorDe && ruta.colorDe[id]) el.style.setProperty('--ruta-color', ruta.colorDe[id]);
    });
    ruta.control.forEach(function (id) {
      var el = elById.get(id); if (el) el.classList.add('is-control');
    });
  }

  /* ── Panel inferior ──────────────────────────────────────────────── */
  function chip(id, extra) {
    var c = cursoById.get(id); if (!c) return '';
    return '<button type="button" class="det-chip ' + (extra || '') + '" data-goto="' + id + '">' +
      '<span class="det-chip__per">P' + c.periodo + '</span>' + esc(c.nombre) + '</button>';
  }

  function timeline(ids, control, color, colorDe) {
    colorDe = colorDe || {};
    var porPer = MALLA.map(function () { return []; });
    ids.forEach(function (id) { var c = cursoById.get(id); if (c) porPer[c.periodoIndex].push(c); });
    return '<div class="det-timeline" style="--ruta-color:' + color + '">' +
      porPer.map(function (lista, i) {
        return '<div class="det-tl__col' + (lista.length ? ' has' : '') + '">' +
          '<span class="det-tl__per">' + MALLA[i].numero + '</span>' +
          lista.map(function (c) {
            var cp = control.indexOf(c.id) >= 0;
            return '<button type="button" class="det-tl__item' + (cp ? ' is-control' : '') + '" data-goto="' + c.id + '"' + (colorDe[c.id] ? ' style="--ruta-color:' + colorDe[c.id] + '"' : '') + ' title="' + esc(c.nombre) + (cp ? ' · Punto de control' : '') + '">' +
              (cp ? '<span class="iconify" data-icon="lucide:flag" data-width="11"></span>' : '') +
              esc(c.nombre) + '</button>';
          }).join('') +
        '</div>';
      }).join('') + '</div>';
  }

  function creditosDe(ids) {
    return ids.reduce(function (s, id) { var c = cursoById.get(id); return s + (c ? c.creditos : 0); }, 0);
  }

  function htmlRuta() {
    var r = ruta, head = '', side = '';
    var stats = '<div class="det-stats"><span><b>' + r.ids.length + '</b> cursos</span><span><b>' + creditosDe(r.ids) + '</b> créditos</span>' +
      (r.control.length ? '<span><b>' + r.control.length + '</b> puntos de control</span>' : '') + '</div>';

    if (r.tipo === 'rap') {
      var rap = r.rap, np = NUC[rap.np];
      head =
        '<p class="det-kicker">' + np.sigla + ' · Competencia ' + rap.competencia + ' · Resultado de Aprendizaje de Programa</p>' +
        '<h3><span class="det-badge">RAP ' + rap.num + '</span>' + esc(rap.corto) + '</h3>' +
        '<p class="det-lead"><strong>' + esc(rap.verbo) + '</strong>' + esc(rap.enunciado.slice(rap.verbo.length)) + '</p>';
      side =
        '<aside class="det-side">' +
          '<h4>Competencia ' + rap.competencia + '</h4><p>' + esc(rap.competenciaTexto) + '</p>' +
          '<h4>Evidencias de logro</h4><ul>' + rap.evidencias.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>' +
        '</aside>';
    } else if (r.tipo === 'np') {
      var n = r.np;
      head =
        '<p class="det-kicker">Núcleo problémico · Competencias ' + n.competencias.join(' y ') + '</p>' +
        '<h3><span class="det-badge">' + n.sigla + '</span>' + esc(n.nombre) + '</h3>' +
        '<p class="det-lead">Cursos marcados en la hoja <strong>C3. RUTA NP</strong>. Integra los resultados de aprendizaje ' + n.raps.map(function (x) { return 'RAP ' + x; }).join(', ') + '.</p>';
      side =
        '<aside class="det-side"><h4>Resultados que lo componen</h4><ul class="det-raplist">' +
          n.raps.map(function (x) {
            var rp = RAP[x];
            return '<li><button type="button" data-ruta-go="rap' + x + '" style="--rap:' + rp.color + '"><b>RAP ' + x + '</b> ' + esc(rp.corto) + '</button></li>';
          }).join('') +
        '</ul></aside>';
    } else {
      head =
        '<p class="det-kicker">' + (r.def.grupo === 'prereq' ? 'Ruta de prerrequisitos' : 'Ruta transversal') + '</p>' +
        '<h3>' + esc(r.def.nombre) + (r.modulo ? ' · ' + esc(r.modulo.nombre) : '') + '</h3>';
      if (r.def.modulos) {
        var base = r.key.split('~')[0];
        side =
          '<aside class="det-side"><h4>Módulos Saber Pro</h4><ul class="det-raplist">' +
            '<li><button type="button" data-ruta-go="' + base + '" style="--rap:' + r.def.color + '"><b>Todos</b> ' + r.def.ids.length + ' cursos</button></li>' +
            r.def.modulos.map(function (m, i) {
              return '<li><button type="button" data-ruta-go="' + base + '~' + i + '" style="--rap:' + m.color + '"><b>' + esc(m.nombre) + '</b> ' + m.ids.length + ' cursos</button></li>';
            }).join('') +
          '</ul></aside>';
      }
    }

    return '<div class="det-ruta" style="--ruta-color:' + r.color + '">' +
      '<div class="det-main">' +
        '<div class="det-head">' + head + stats +
          '<button type="button" class="det-close" data-clear aria-label="Quitar ruta">×</button></div>' +
        timeline(r.ids, r.control, r.color, r.colorDe) +
        (r.control.length ? '<p class="det-note"><span class="iconify" data-icon="lucide:flag" data-width="12"></span> Cursos marcados con bandera = <strong>puntos de seguimiento del RAP</strong>.</p>' : '') +
      '</div>' + side + '</div>';
  }

  function htmlCurso(id) {
    var c = cursoById.get(id); if (!c) return '';
    var pre = Array.from(cadena(id, PRE)).sort(function (a, b) { return cursoById.get(a).periodoIndex - cursoById.get(b).periodoIndex; });
    var dep = Array.from(cadena(id, dependientes)).sort(function (a, b) { return cursoById.get(a).periodoIndex - cursoById.get(b).periodoIndex; });
    var raps = (c.rap || []).map(function (n) {
      var r = RAP[n];
      var cp = r.control.indexOf(id) >= 0;
      return '<button type="button" class="det-rapchip" data-ruta-go="rap' + n + '" style="--rap:' + r.color + '"><b>RAP ' + n + '</b> ' + esc(r.corto) +
        (cp ? ' <span class="iconify" data-icon="lucide:flag" data-width="11" title="Punto de control"></span>' : '') + '</button>';
    }).join('');
    var tipo = TIPO[c.tipo] || {};
    var pinned = pinnedId === id;

    return '<div class="det-curso" style="--ruta-color:' + PCOL[c.periodoIndex] + '">' +
      '<div class="det-head">' +
        '<p class="det-kicker">Periodo ' + c.periodo + ' · ' + (tipo.label || '') + ' · ' + c.creditos + ' créditos' +
          (c.codigo ? ' · Cód. ' + esc(c.codigo) : '') + (c.electivo ? ' · Electivo' : ' · Obligatorio') + '</p>' +
        '<h3>' + esc(c.nombre) + '</h3>' +
        (c.nota ? '<p class="det-lead">' + esc(c.nota) + '</p>' : '') +
        (c.rotacion ? '<p class="det-lead">Para matricular una rotación se debe haber cursado al menos el <strong>80 % de los créditos</strong> del programa.</p>' : '') +
        (pinned ? '<button type="button" class="det-close" data-unpin aria-label="Soltar curso">×</button>' : '') +
      '</div>' +
      '<div class="det-grid">' +
        '<div><h4>Aporta a</h4>' + (raps ? '<div class="det-chips">' + raps + '</div>' : '<p class="det-muted">Sin RAP asociado en la matriz de consistencia.</p>') + '</div>' +
        '<div><h4><span class="det-dot det-dot--pre"></span>Requiere haber cursado</h4>' + (pre.length ? '<div class="det-chips">' + pre.map(function (x) { return chip(x, 'is-pre'); }).join('') + '</div>' : '<p class="det-muted">No tiene prerrequisitos.</p>') + '</div>' +
        '<div><h4><span class="det-dot det-dot--dep"></span>Habilita</h4>' + (dep.length ? '<div class="det-chips">' + dep.map(function (x) { return chip(x, 'is-dep'); }).join('') + '</div>' : '<p class="det-muted">No es prerrequisito de otros cursos.</p>') + '</div>' +
      '</div>' +
      (pinned ? '' : '<p class="det-note">Haz click para fijar el curso.</p>') +
    '</div>';
  }

  function htmlVacio() {
    return '<div class="det-empty">' +
      '<span class="iconify" data-icon="lucide:mouse-pointer-click" data-width="30"></span>' +
      '<div><h3>Explora la malla</h3>' +
      '<p>Pasa el cursor sobre un curso para ver qué requiere y qué habilita, o elige un <strong>Resultado de Aprendizaje</strong> arriba para ver su recorrido por periodos y sus puntos de control.</p></div>' +
      '<div class="det-legend">' +
        '<span><i class="lg lg--pre"></i>Prerrequisito</span><span><i class="lg lg--dep"></i>Habilita</span>' +
        '<span><span class="iconify" data-icon="lucide:flag" data-width="12"></span>Punto de control RAP</span>' +
      '</div></div>';
  }

  function renderDetalle(html) {
    detalleEl.innerHTML = html;
    if (window.Iconify && window.Iconify.scan) window.Iconify.scan(detalleEl);
  }

  /* ── Foco en curso ──────────────────────────────────────────────── */
  function enfocar(id) {
    limpiarClases();
    var el = elById.get(id); if (!el) return;
    mallaEl.classList.add('has-focus');
    el.classList.add('is-active');
    if (pinnedId === id) el.classList.add('is-pinned');
    cadena(id, PRE).forEach(function (x) { var e = elById.get(x); if (e) e.classList.add('is-prereq'); });
    cadena(id, dependientes).forEach(function (x) { var e = elById.get(x); if (e) e.classList.add('is-dep'); });
    renderDetalle(htmlCurso(id));
  }

  function reposo() {
    if (pinnedId) { enfocar(pinnedId); return; }
    if (ruta) { pintarRuta(); renderDetalle(htmlRuta()); return; }
    limpiarClases(); renderDetalle(htmlVacio());
  }

  /* ── Activar / quitar ruta ──────────────────────────────────────── */
  function activarRuta(key) {
    if (ruta && ruta.key === key) { quitarRuta(); return; }
    var r = getRuta(key); if (!r) return;
    ruta = r; pinnedId = null;
    if (/^rap|^np/.test(key)) setTab('rap'); else setTab(RUTAS[key.split('~')[0]].grupo);
    marcarBotones();
    reposo();
  }
  function quitarRuta() { ruta = null; marcarBotones(); reposo(); }

  function marcarBotones() {
    btnsEl.querySelectorAll('[data-ruta]').forEach(function (b) {
      b.classList.toggle('is-active', !!ruta && b.dataset.ruta === ruta.key.split('~')[0]);
    });
  }

  /* ── Barra de rutas ─────────────────────────────────────────────── */
  function btn(key, label, color, extra, title) {
    return '<button type="button" class="ruta-btn ' + (extra || '') + '" data-ruta="' + key + '"' + (title ? ' title="' + esc(title) + '"' : '') + ' style="--ruta-color:' + color + '">' +
      '<span class="ruta-btn__dot"></span>' + label + '</button>';
  }

  function renderBotones() {
    var html = '';
    if (tabActiva === 'rap') {
      Object.keys(NUC).forEach(function (k) {
        var n = NUC[k];
        html += '<div class="ruta-np">' + btn(k, '<b>' + n.sigla + '</b>', n.color, 'ruta-btn--np') +
          n.raps.map(function (x) {
            return btn('rap' + x, '<b>RAP ' + x + '</b><span class="ruta-btn__sub">' + esc(RAP[x].corto) + '</span>', RAP[x].color, 'ruta-btn--rap', RAP[x].corto);
          }).join('') + '</div>';
      });
    } else {
      Object.keys(RUTAS).forEach(function (k) {
        if (RUTAS[k].grupo === tabActiva) html += btn(k, esc(RUTAS[k].nombre), RUTAS[k].color);
      });
    }
    btnsEl.innerHTML = html;
    marcarBotones();
  }

  function setTab(t) {
    if (tabActiva === t) return;
    tabActiva = t;
    tabsEl.querySelectorAll('[data-tab]').forEach(function (b) {
      var on = b.dataset.tab === t;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on);
    });
    renderBotones();
  }

  /* ── Eventos ─────────────────────────────────────────────────────── */
  mallaEl.addEventListener('mouseover', function (e) {
    var card = e.target.closest('.curso');
    if (card && !pinnedId) enfocar(card.dataset.id);
  });
  mallaEl.addEventListener('mouseleave', reposo);
  mallaEl.addEventListener('focusin', function (e) {
    var card = e.target.closest('.curso');
    if (card && !pinnedId) enfocar(card.dataset.id);
  });

  function togglePin(id) {
    pinnedId = pinnedId === id ? null : id;
    if (pinnedId) enfocar(id); else reposo();
  }
  mallaEl.addEventListener('click', function (e) {
    var card = e.target.closest('.curso');
    if (card) togglePin(card.dataset.id);
  });
  mallaEl.addEventListener('keydown', function (e) {
    var card = e.target.closest('.curso');
    if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); togglePin(card.dataset.id); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { pinnedId = null; ruta = null; marcarBotones(); reposo(); }
  });

  detalleEl.addEventListener('click', function (e) {
    var go = e.target.closest('[data-goto]');
    if (go) { pinnedId = go.dataset.goto; enfocar(pinnedId); var el = elById.get(pinnedId); if (el) el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' }); return; }
    var rg = e.target.closest('[data-ruta-go]');
    if (rg) { activarRuta(rg.dataset.rutaGo); return; }
    if (e.target.closest('[data-unpin]')) { pinnedId = null; reposo(); return; }
    if (e.target.closest('[data-clear]')) { quitarRuta(); }
  });

  tabsEl.addEventListener('click', function (e) {
    var t = e.target.closest('[data-tab]'); if (t) setTab(t.dataset.tab);
  });
  btnsEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-ruta]'); if (b) activarRuta(b.dataset.ruta);
  });
  var clr = document.getElementById('rutas-clear');
  if (clr) clr.addEventListener('click', function () { pinnedId = null; quitarRuta(); });

  /* ── Arranque ───────────────────────────────────────────────────── */
  try {
    render();
    tabActiva = null; setTab('rap');
    renderDetalle(htmlVacio());
    console.log('[malla.js] Render OK:', TOTAL_CURSOS, 'cursos ·', TOTAL_CREDITOS, 'créditos');
  } catch (err) {
    showFatal('Error durante el render: ' + (err && err.message ? err.message : err));
  }
})();
