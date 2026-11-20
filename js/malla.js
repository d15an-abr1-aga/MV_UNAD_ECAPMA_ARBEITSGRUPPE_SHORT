/* =========================================================================
   malla.js — malla académica interactiva
   -------------------------------------------------------------------------
   · Dibuja los 10 periodos (todos visibles a la vez en escritorio).
   · Hover / click en un curso → resalta su cadena de prerrequisitos y
     los cursos que dependen de él; el detalle aparece en el panel inferior.
   · Barra de rutas con 3 pestañas:
       - Resultados de aprendizaje (NIP → NP1: RAP 1-3 · NP2: RAP 4-5)
       - Rutas de prerrequisitos (flechas de colores del Plan de Estudios)
       - Rutas transversales (Rotaciones, Idioma, Investigación, Innovación,
         Saber Pro, SISSU)
   · Rotaciones Clínicas I, II y III: en cada una el estudiante inscribe 2
     de los 6 cursos de rotación (TABLA 1 del Anexo 3.8), a su elección.
     Los 6 cursos se muestran en un banco bajo los periodos VIII–X.
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
  var COMP = D.COMPETENCIAS || {}, EVID = D.EVIDENCIAS || {}, NIP = D.NIP || '';
  var NOTA_ROT = D.NOTA_ROTACIONES || '';

  /* ── Índices ─────────────────────────────────────────────────────── */
  var cursoById = new Map();      // id → datos + periodo
  var elById    = new Map();      // id → <article>
  var dependientes = {};          // id → [ids que lo tienen como prerrequisito]

  MALLA.forEach(function (p, i) {
    p.cursos.forEach(function (c) {
      cursoById.set(c.id, Object.assign({}, c, { periodo: p.numero, periodoIndex: i }));
    });
  });
  var ROT_IDS = [];      // tarjetas Rotación Clínica I, II, III
  MALLA.forEach(function (p) { p.cursos.forEach(function (c) { if (c.rotacion) ROT_IDS.push(c.id); }); });
  var ROT_CURSOS = D.ROTACION_CURSOS || [];
  var ROT_DESDE = cursoById.get(ROT_IDS[0]) ? cursoById.get(ROT_IDS[0]).periodoIndex : 7;
  ROT_CURSOS.forEach(function (a) {
    cursoById.set(a.id, Object.assign({}, a, { tipo: 'P', area: true, periodo: 'VIII–X',
      parentNombre: 'Rotación Clínica I, II o III (a elección)', periodoIndex: ROT_DESDE }));
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
  var TOTAL_AREAS    = ROT_CURSOS.length;

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
        if (c.rotacion) {
          var box = document.createElement('span');
          box.className = 'curso__eleccion';
          box.innerHTML = '<span class="iconify" data-icon="lucide:shuffle" data-width="11"></span>' +
            (c.eleccion || 2) + ' cursos de rotación a elección';
          el.appendChild(box);
        }
        body.appendChild(el);
      });

      col.appendChild(body);
      var foot = document.createElement('footer');
      foot.className = 'periodo__footer';
      foot.innerHTML = '<span>' + p.cursos.length + ' cursos</span><strong>' + p.creditos + ' cr</strong>';
      col.appendChild(foot);
      mallaEl.appendChild(col);
    });

    /* Banco de cursos de rotación (bajo los periodos de las Rotaciones Clínicas) */
    if (ROT_CURSOS.length) {
      var banco = document.createElement('section');
      banco.className = 'rot-banco';
      banco.style.gridColumn = (ROT_DESDE + 1) + ' / span ' + ROT_IDS.length;
      banco.innerHTML = '<header class="rot-banco__head"><span class="iconify" data-icon="lucide:shuffle" data-width="13"></span>' +
        'Cursos de rotación · el estudiante elige 2 por Rotación Clínica</header>';
      var grid = document.createElement('div');
      grid.className = 'rot-banco__grid';
      ROT_CURSOS.forEach(function (a) {
        var s = document.createElement('span');
        s.className = 'curso__area';
        s.dataset.id = a.id;
        s.tabIndex = 0;
        s.setAttribute('role', 'button');
        s.setAttribute('title', a.nombre);
        s.style.setProperty('--tipo-color', (TIPO.P || {}).color || '#C9930C');
        s.innerHTML = '<span class="curso__area-name">' + esc(a.corto || a.nombre) + '</span>' + rapDots(a);
        elById.set(a.id, s);
        grid.appendChild(s);
      });
      banco.appendChild(grid);
      mallaEl.appendChild(banco);
    }

    var totEl = document.getElementById('malla-totales');
    if (totEl) totEl.innerHTML =
      '<span><b>' + TOTAL_CURSOS + '</b> cursos</span><span><b>' + TOTAL_CREDITOS + '</b> créditos</span><span><b>10</b> periodos</span>' +
      '<span><b>' + TOTAL_AREAS + '</b> cursos de rotación</span><span><b>5</b> RAP</span>';
  }

  /* ── Estado ──────────────────────────────────────────────────────── */
  var ruta = null;          // { key, tipo:'rap'|'np'|'ruta', ids, color }
  var pinnedId = null;
  var tabActiva = 'rap';

  function limpiarClases() {
    mallaEl.classList.remove('has-focus', 'has-ruta');
    mallaEl.querySelectorAll('.curso, .curso__area').forEach(function (el) {
      el.classList.remove('is-active', 'is-prereq', 'is-dep', 'is-pinned', 'is-ruta', 'is-control', 'has-hit');
      el.style.removeProperty('--ruta-color');
    });
  }

  function marcar(id, cls, color) {
    var el = elById.get(id); if (!el) return;
    el.classList.add(cls);
    if (color) el.style.setProperty('--ruta-color', color);
    var c = cursoById.get(id);
    if (c && c.area) ROT_IDS.forEach(function (r) { var p = elById.get(r); if (p) p.classList.add('has-hit'); });
  }

  /* ── Rutas: definición unificada ─────────────────────────────────── */
  function getRuta(key) {
    if (/^rap\d$/.test(key)) {
      var r = RAP[+key.slice(3)];
      return r && { key: key, tipo: 'rap', ids: r.cursos, control: r.control || [], color: r.color, rap: r };
    }
    if (NUC[key]) {
      var n = NUC[key], set = [];
      n.raps.forEach(function (num) { RAP[num].cursos.forEach(function (id) { if (set.indexOf(id) < 0) set.push(id); }); });
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
      marcar(id, 'is-ruta', ruta.colorDe && ruta.colorDe[id]);
    });
    ruta.control.forEach(function (id) { marcar(id, 'is-control'); });
  }

  /* ── Panel inferior ──────────────────────────────────────────────── */
  function chip(id, extra) {
    var c = cursoById.get(id); if (!c) return '';
    return '<button type="button" class="det-chip ' + (extra || '') + '" data-goto="' + id + '">' +
      '<span class="det-chip__per">' + (c.area ? 'Rot.' : 'P' + c.periodo) + '</span>' + esc(c.nombre) + '</button>';
  }

  function timeline(ids, control, color, colorDe) {
    colorDe = colorDe || {};
    var porPer = MALLA.map(function () { return []; });
    var areas = [];
    ids.forEach(function (id) { var c = cursoById.get(id); if (!c) return; if (c.area) areas.push(c); else porPer[c.periodoIndex].push(c); });
    return '<div class="det-timeline" style="--ruta-color:' + color + '">' +
      porPer.map(function (lista, i) {
        return '<div class="det-tl__col' + (lista.length ? ' has' : '') + '">' +
          '<span class="det-tl__per">' + MALLA[i].numero + '</span>' +
          lista.map(function (c) {
            var cp = control.indexOf(c.id) >= 0;
            return '<button type="button" class="det-tl__item' + (cp ? ' is-control' : '') + '" data-goto="' + c.id + '"' + (colorDe[c.id] ? ' style="--ruta-color:' + colorDe[c.id] + '"' : '') + ' title="' + esc(c.nombre) + (cp ? ' · Punto de control' : '') + '">' +
              (cp ? '<span class="iconify" data-icon="lucide:flag" data-width="11"></span>' : '') +
              esc(c.nombre) + (c.area ? '<small class="det-tl__sub">en ' + esc(c.parentNombre) + '</small>' : '') + '</button>';
          }).join('') +
        '</div>';
      }).join('') + '</div>' +
      (areas.length ? '<div class="det-tl__rot" style="--ruta-color:' + color + '"><span class="det-tl__per">Cursos de rotación · VIII–X, a elección del estudiante</span><div>' +
        areas.map(function (c) {
          var cp = control.indexOf(c.id) >= 0;
          return '<button type="button" class="det-tl__item' + (cp ? ' is-control' : '') + '" data-goto="' + c.id + '" title="' + esc(c.nombre) + (cp ? ' · Punto de control' : '') + '">' +
            (cp ? '<span class="iconify" data-icon="lucide:flag" data-width="11"></span>' : '') + esc(c.nombre) + '</button>';
        }).join('') + '</div></div>' : '');
  }

  function creditosDe(ids) {
    /* Un curso de rotación aporta los créditos de su Rotación Clínica (una sola vez). */
    var vistos = {};
    return ids.reduce(function (s, id) {
      var c = cursoById.get(id); if (!c) return s;
      if (c.area || vistos[id]) return s; vistos[id] = 1;
      return s + (c.creditos || 0);
    }, 0);
  }
  function areasDe(ids) {
    return ids.filter(function (id) { var c = cursoById.get(id); return c && c.area; }).length;
  }

  function lista(items) {
    return '<ul>' + items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
  }

  /* Matriz "Evidencia de los RAP": acciones · mecanismos · evidencias */
  function htmlEvidencias(key) {
    var e = EVID[key]; if (!e) return '';
    var nota = e.raps.length > 1
      ? '<p class="det-evid__nota">En la matriz, <strong>' + e.raps.map(function (n) { return 'RAP ' + n; }).join(' y ') + '</strong> comparten la misma fila de seguimiento, mecanismos y evidencias.</p>'
      : '';
    return '<details class="det-evid" open><summary>Evidencia de los RAP · seguimiento, evaluación y logro</summary>' + nota +
      '<div class="det-evid__grid">' +
        '<div><h4>Acciones de seguimiento</h4>' + lista(e.seguimiento) + '</div>' +
        '<div><h4>Mecanismos de evaluación</h4>' + lista(e.mecanismos) + '</div>' +
        '<div><h4>Evidencias de logro</h4>' + lista(e.evidencias) + '</div>' +
      '</div></details>';
  }

  function htmlRuta() {
    var r = ruta, head = '', side = '', extra = '';
    var nAreas = areasDe(r.ids);
    var nCursos = r.ids.length - nAreas;
    var stats = '<div class="det-stats">' + (nCursos ? '<span><b>' + nCursos + '</b> cursos</span>' : '') +
      (nAreas ? '<span><b>' + nAreas + '</b> ' + (nAreas === 1 ? 'curso de rotación' : 'cursos de rotación') + '</span>' : '') +
      '<span><b>' + creditosDe(r.ids) + '</b> créditos</span>' +
      (r.control.length ? '<span><b>' + r.control.length + '</b> puntos de control</span>' : '') + '</div>';

    if (r.tipo === 'rap') {
      var rap = r.rap, np = NUC[rap.np];
      head =
        '<p class="det-kicker">' + np.sigla + ' · Competencia ' + rap.competencia + ' · Resultado de Aprendizaje de Programa</p>' +
        '<h3><span class="det-badge">RAP ' + rap.num + '</span>' + esc(rap.corto) + '</h3>' +
        '<p class="det-lead"><strong>' + esc(rap.verbo) + '</strong>' + esc(rap.enunciado.slice(rap.verbo.length)) + '</p>';
      side =
        '<aside class="det-side">' +
          '<h4>Núcleo problémico ' + np.sigla.slice(2) + '</h4><p>' + esc(np.nombre) + '.</p>' +
          '<h4>Competencia ' + rap.competencia + '</h4><p>' + esc(COMP[rap.competencia] || '') + '</p>' +
        '</aside>';
      extra = htmlEvidencias(rap.evidencias);
    } else if (r.tipo === 'np') {
      var n = r.np;
      head =
        '<p class="det-kicker">Núcleo problémico · Competencias ' + n.competencias.join(' y ') + '</p>' +
        '<h3><span class="det-badge">' + n.sigla + '</span>' + esc(n.nombre) + '</h3>' +
        '<p class="det-lead"><strong>Pregunta generadora:</strong> ' + esc(n.pregunta) + '</p>' +
        '<p class="det-lead"><strong>Manifestación del problema:</strong> ' + esc(n.manifestacion) + '</p>';
      side =
        '<aside class="det-side"><h4>Núcleo Integrador de Problema (NIP)</h4><p>' + esc(NIP) + '</p>' +
        '<h4>Competencias</h4><ul>' + n.competencias.map(function (k) { return '<li><b>C' + k + '.</b> ' + esc(COMP[k] || '') + '</li>'; }).join('') + '</ul>' +
        '<h4>Resultados que lo componen</h4><ul class="det-raplist">' +
          n.raps.map(function (x) {
            var rp = RAP[x];
            return '<li><button type="button" data-ruta-go="rap' + x + '" style="--rap:' + rp.color + '"><b>RAP ' + x + '</b> ' + esc(rp.corto) + '</button></li>';
          }).join('') +
        '</ul></aside>';
    } else {
      head =
        '<p class="det-kicker">' + (r.def.grupo === 'prereq' ? 'Ruta de prerrequisitos' : 'Ruta transversal') + '</p>' +
        '<h3>' + esc(r.def.nombre) + (r.modulo ? ' · ' + esc(r.modulo.nombre) : '') + '</h3>';
      if (r.def.grupo === 'prereq') {
        var pasos = [], avisos = [];
        for (var i = 1; i < r.def.ids.length; i++) {
          var a = cursoById.get(r.def.ids[i - 1]), b = cursoById.get(r.def.ids[i]);
          if ((PRE[b.id] || []).indexOf(a.id) >= 0) pasos.push(esc(a.nombre) + ' → ' + esc(b.nombre));
          else (PRE[b.id] || []).forEach(function (x) {
            avisos.push('<strong>' + esc(b.nombre) + '</strong> continúa esta línea, pero su único prerrequisito es <strong>' + esc(cursoById.get(x).nombre) + '</strong> (otra línea): ningún curso tiene doble prerrequisito.');
          });
        }
        head += '<p class="det-lead">Cada curso es prerrequisito del siguiente de la misma línea: ' + pasos.join(' · ') + '.</p>' +
          avisos.map(function (t) { return '<p class="det-note"><span class="iconify" data-icon="lucide:info" data-width="12"></span> ' + t + '</p>'; }).join('');
      }
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
        (r.control.length ? '<p class="det-note"><span class="iconify" data-icon="lucide:flag" data-width="12"></span> Cursos marcados con bandera = <strong>puntos de seguimiento del RAP</strong> (hoja Puntos de Control RAP).</p>' : '') +
        (nAreas ? '<p class="det-note"><span class="iconify" data-icon="lucide:repeat" data-width="12"></span> Los cursos de rotación no tienen periodo fijo: el estudiante inscribe 2 en cada Rotación Clínica (VIII, IX y X; 8 créditos cada una; requisito: 80 % de los créditos) hasta completar los 6.</p>' : '') +
      '</div>' + side + '</div>' + extra;
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
    var rapsHijos = '';
    if (c.rotacion) {
      var vistos = {};
      ROT_CURSOS.forEach(function (a) { (a.rap || []).forEach(function (n) { vistos[n] = 1; }); });
      raps = Object.keys(vistos).map(function (n) {
        var r = RAP[n];
        return '<button type="button" class="det-rapchip" data-ruta-go="rap' + n + '" style="--rap:' + r.color + '"><b>RAP ' + n + '</b> ' + esc(r.corto) + '</button>';
      }).join('');
      rapsHijos = '<div class="det-areas"><h4>El estudiante inscribe ' + (c.eleccion || 2) + ' de estos cursos de rotación</h4><div class="det-chips">' +
        ROT_CURSOS.map(function (a) { return chip(a.id, 'is-area'); }).join('') +
        '</div></div>';
    }
    var kicker = c.area
      ? 'Curso de rotación · periodos VIII–X · se inscribe, a elección del estudiante, en la Rotación Clínica I, II o III'
      : 'Periodo ' + c.periodo + ' · ' + (tipo.label || '') + ' · ' + c.creditos + ' créditos' +
        (c.codigo ? ' · Cód. ' + esc(c.codigo) : '') + (c.electivo ? ' · Electivo' : ' · Obligatorio');
    var esRot = c.rotacion || c.area;

    return '<div class="det-curso" style="--ruta-color:' + (PCOL[c.periodoIndex] || '#0891B2') + '">' +
      '<div class="det-head">' +
        '<p class="det-kicker">' + kicker + '</p>' +
        '<h3>' + esc(c.nombre) + '</h3>' +
        (c.nota ? '<p class="det-lead">' + esc(c.nota) + '</p>' : '') +
        (esRot ? '<p class="det-lead">Requisito: haber cursado al menos el <strong>80 % de los créditos académicos</strong> del programa. ' + esc(NOTA_ROT.replace(/^Nota:\s*/, '')) + '</p>' : '') +
        (pinned ? '<button type="button" class="det-close" data-unpin aria-label="Soltar curso">×</button>' : '') +
      '</div>' +
      '<div class="det-grid">' +
        '<div><h4>Aporta a</h4>' + (raps ? '<div class="det-chips">' + raps + '</div>' : '<p class="det-muted">Sin RAP asociado en la matriz de consistencia.</p>') + '</div>' +
        '<div><h4><span class="det-dot det-dot--pre"></span>Requiere haber cursado</h4>' + (pre.length ? '<div class="det-chips">' + pre.map(function (x) { return chip(x, 'is-pre'); }).join('') + '</div>' : '<p class="det-muted">' + (esRot ? 'Sin prerrequisito de curso: aplica la regla del 80 % de créditos.' : 'No tiene prerrequisitos.') + '</p>') + '</div>' +
        '<div><h4><span class="det-dot det-dot--dep"></span>Habilita</h4>' + (dep.length ? '<div class="det-chips">' + dep.map(function (x) { return chip(x, 'is-dep'); }).join('') + '</div>' : '<p class="det-muted">No es prerrequisito de otros cursos.</p>') + '</div>' +
      '</div>' + rapsHijos +
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
    marcar(id, 'is-active');
    if (pinnedId === id) el.classList.add('is-pinned');
    var c = cursoById.get(id);
    if (c && c.rotacion) ROT_CURSOS.forEach(function (a) { marcar(a.id, 'is-ruta'); });
    cadena(id, PRE).forEach(function (x) { marcar(x, 'is-prereq'); });
    cadena(id, dependientes).forEach(function (x) { marcar(x, 'is-dep'); });
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
  function objetivo(e) { return e.target.closest('.curso__area') || e.target.closest('.curso'); }
  var ultimo = null;
  mallaEl.addEventListener('mouseover', function (e) {
    var card = objetivo(e);
    if (card && !pinnedId && card.dataset.id !== ultimo) { ultimo = card.dataset.id; enfocar(ultimo); }
  });
  mallaEl.addEventListener('mouseleave', function () { ultimo = null; });
  mallaEl.addEventListener('mouseleave', reposo);
  mallaEl.addEventListener('focusin', function (e) {
    var card = objetivo(e);
    if (card && !pinnedId) enfocar(card.dataset.id);
  });

  function togglePin(id) {
    pinnedId = pinnedId === id ? null : id;
    if (pinnedId) enfocar(id); else reposo();
  }
  mallaEl.addEventListener('click', function (e) {
    var card = objetivo(e);
    if (card) togglePin(card.dataset.id);
  });
  mallaEl.addEventListener('keydown', function (e) {
    var card = objetivo(e);
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
    console.log('[malla.js] Render OK:', TOTAL_CURSOS, 'cursos ·', TOTAL_CREDITOS, 'créditos ·', TOTAL_AREAS, 'cursos de rotación');
  } catch (err) {
    showFatal('Error durante el render: ' + (err && err.message ? err.message : err));
  }
})();
