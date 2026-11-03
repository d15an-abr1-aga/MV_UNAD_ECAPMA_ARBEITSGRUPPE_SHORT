/* =========================================================================
   malla-data.js
   -------------------------------------------------------------------------
   Fuente de verdad de la malla académica de Medicina Veterinaria.
   Ubicación, tipo y créditos de cada curso: hoja "C3. Plan de Estudios"
   del Anexo 3.8 (misma distribución de las hojas RUTA IDIOMA, RUTA DE
   INNOVACIÓN y SABER PRO) → 66 cursos · 174 créditos · 10 periodos.

   Los IDs son legibles (slug del curso) para que prerrequisitos, RAP y
   rutas se puedan mantener a mano sin confundirse de periodo.

   Contiene:
     · MALLA          → periodos y cursos
     · PREREQUISITOS  → prerrequisitos directos (rutas de color)
     · RAP            → resultados de aprendizaje (hoja Consistencia
                        Curricular + Puntos de Control + Evidencias)
     · NUCLEOS        → NP1 / NP2 (hoja C3. RUTA NP)
     · RUTAS          → prerrequisitos y rutas transversales
                        (hojas RUTA IDIOMA, INVESTIGACIÓN, RUTA DE
                        INNOVACIÓN, SABER PRO, RUTA SISSU)
   ========================================================================= */
(function () {
  'use strict';

  var TIPO_INFO = {
    T: { label: 'Teórico',      color: '#D26714' },
    P: { label: 'Práctico',     color: '#C9930C' },
    M: { label: 'Metodológico', color: '#035B3B' }
  };

  var PERIODO_COLORES = [
    '#00445B', '#0B5266', '#166071', '#1B6E71', '#217A66',
    '#2E8460', '#4C8A52', '#7C8A3E', '#AC7A28', '#D26714'
  ];

  /* ── Plan de estudios (orden = orden de filas en la hoja) ──────────
     rap: resultados de aprendizaje a los que aporta el curso
     (hoja "C3. Consistencia Curricular", columna Cursos).            */
  var MALLA = [
    { id: 'p1', numero: 'I', cursos: [
      { id: 'intro-mv',         tipo: 'P', creditos: 2, nombre: 'Introducción a la Medicina Veterinaria', rap: [1] },
      { id: 'bio-celular',      tipo: 'M', creditos: 3, nombre: 'Biología celular y molecular', codigo: '30176' },
      { id: 'quimica-organica', tipo: 'M', creditos: 3, nombre: 'Química orgánica', codigo: '300047' },
      { id: 'one-health',       tipo: 'M', creditos: 2, nombre: 'Fundamentos del enfoque One Health', rap: [4] },
      { id: 'catedra-unadista', tipo: 'M', creditos: 3, nombre: 'Cátedra Unadista', codigo: '80017' },
      { id: 'comp-comunicativas', tipo: 'T', creditos: 3, nombre: 'Competencias Comunicativas', codigo: '40003' },
      { id: 'etica-ciudadania', tipo: 'T', creditos: 3, nombre: 'Ética y Ciudadanía (grado)', codigo: '400002' }
    ]},
    { id: 'p2', numero: 'II', cursos: [
      { id: 'anatomia',         tipo: 'P', creditos: 4, nombre: 'Anatomía Veterinaria comparada', rap: [1] },
      { id: 'bio-desarrollo',   tipo: 'P', creditos: 2, nombre: 'Biología del desarrollo y fisiología animal', rap: [1] },
      { id: 'bioquimica',       tipo: 'M', creditos: 3, nombre: 'Bioquímica metabólica', codigo: '352001' },
      { id: 'bioetica',         tipo: 'M', creditos: 2, nombre: 'Bioética y legislación Veterinaria', rap: [4] },
      { id: 'herramientas-digitales', tipo: 'M', creditos: 3, nombre: 'Herramientas digitales para la gestión del conocimiento', codigo: '200610' },
      { id: 'pensamiento-logico', tipo: 'T', creditos: 3, nombre: 'Pensamiento lógico y matemático', codigo: '200611' }
    ]},
    { id: 'p3', numero: 'III', cursos: [
      { id: 'inmunologia',      tipo: 'P', creditos: 3, nombre: 'Inmunología Veterinaria', rap: [1, 4] },
      { id: 'nutricion',        tipo: 'P', creditos: 2, nombre: 'Nutrición clínica', rap: [5] },
      { id: 'genetica',         tipo: 'M', creditos: 3, nombre: 'Genética y Genómica Aplicada a la Medicina Veterinaria', rap: [1, 5] },
      { id: 'estadistica',      tipo: 'T', creditos: 3, nombre: 'Estadística Descriptiva Aplicada a las Ciencias Agrarias', codigo: '300032' },
      { id: 'semiologia',       tipo: 'P', creditos: 2, nombre: 'Semiología y Competencias Clínicas Veterinarias', rap: [3] },
      { id: 'transformacion-digital', tipo: 'M', creditos: 2, nombre: 'Transformación Digital y Tecnologías Emergentes en Medicina Veterinaria' },
      { id: 'patologia-general', tipo: 'P', creditos: 3, nombre: 'Patología general y sistémica', rap: [2] },
      { id: 'servicio-social',  tipo: 'M', creditos: 0, nombre: 'Prestación del Servicio Social Unadista (Requisito de grado)', codigo: '700004' }
    ]},
    { id: 'p4', numero: 'IV', cursos: [
      { id: 'patologia-diagnostica', tipo: 'P', creditos: 3, nombre: 'Patología diagnóstica y de laboratorio clínico', rap: [2, 3] },
      { id: 'microbiologia',    tipo: 'P', creditos: 2, nombre: 'Microbiología veterinaria', rap: [2, 4] },
      { id: 'parasitologia',    tipo: 'P', creditos: 2, nombre: 'Parasitología veterinaria', rap: [2, 4] },
      { id: 'diseno-experimental', tipo: 'T', creditos: 2, nombre: 'Diseño experimental', codigo: '300004' },
      { id: 'etologia',         tipo: 'P', creditos: 2, nombre: 'Etología y bienestar animal', rap: [5] },
      { id: 'gestion-integral', tipo: 'M', creditos: 3, nombre: 'Fundamentos en gestión integral', codigo: '112001' },
      { id: 'ingles-a1',        tipo: 'M', creditos: 3, nombre: 'Inglés A1', codigo: '900001' },
      { id: 'elec-fc-1',        tipo: 'T', creditos: 1, nombre: 'Electivo de formación complementaria', electivo: true }
    ]},
    { id: 'p5', numero: 'V', cursos: [
      { id: 'farmacologia',     tipo: 'M', creditos: 3, nombre: 'Farmacología veterinaria', rap: [3] },
      { id: 'ingles-a2',        tipo: 'M', creditos: 3, nombre: 'Inglés A2', codigo: '900002' },
      { id: 'toxicologia',      tipo: 'P', creditos: 2, nombre: 'Toxicología veterinaria', rap: [2, 3] },
      { id: 'diseno-proyectos', tipo: 'T', creditos: 3, nombre: 'Diseño y evaluación de proyectos', codigo: '331005' },
      { id: 'biotecnologias',   tipo: 'P', creditos: 2, nombre: 'Biotecnologías y Manejo Reproductivo', rap: [5] },
      { id: 'epidemiologia',    tipo: 'P', creditos: 2, nombre: 'Epidemiología y salud pública Veterinaria', rap: [2, 4] },
      { id: 'virologia',        tipo: 'P', creditos: 2, nombre: 'Virología veterinaria', rap: [2, 4] }
    ]},
    { id: 'p6', numero: 'VI', cursos: [
      { id: 'imagenologia',     tipo: 'P', creditos: 3, nombre: 'Imagenología Veterinaria', rap: [3] },
      { id: 'cirugia',          tipo: 'P', creditos: 4, nombre: 'Cirugía, anestesiología y manejo del dolor', rap: [3] },
      { id: 'mi-rumiantes',     tipo: 'P', creditos: 3, nombre: 'Medicina interna de rumiantes', rap: [3] },
      { id: 'fundamentos-investigacion', tipo: 'M', creditos: 3, nombre: 'Fundamentos y Generalidades de Investigación', codigo: '150001' },
      { id: 'ingles-b1',        tipo: 'M', creditos: 3, nombre: 'Inglés B1', codigo: '900003' },
      { id: 'elec-fc-2',        tipo: 'T', creditos: 1, nombre: 'Electivo de formación complementaria', electivo: true },
      { id: 'elec-dc-1',        tipo: 'M', creditos: 2, nombre: 'Electivo Disciplinar Común (DC)', electivo: true }
    ]},
    { id: 'p7', numero: 'VII', cursos: [
      { id: 'urgencias',        tipo: 'P', creditos: 2, nombre: 'Medicina de urgencias y cuidados intensivos', rap: [3] },
      { id: 'mi-pequenos',      tipo: 'P', creditos: 3, nombre: 'Medicina interna de pequeños animales', rap: [3] },
      { id: 'mi-equinos',       tipo: 'P', creditos: 3, nombre: 'Medicina Interna en Equinos', rap: [3] },
      { id: 'ingles-b2',        tipo: 'M', creditos: 3, nombre: 'Inglés B2', codigo: '900004' },
      { id: 'trabajo-grado',    tipo: 'T', creditos: 2, nombre: 'Trabajo de Grado', codigo: '204015' },
      { id: 'aviar',            tipo: 'P', creditos: 2, nombre: 'Medicina y producción aviar', rap: [5] },
      { id: 'porcina',          tipo: 'P', creditos: 2, nombre: 'Medicina y producción porcina', rap: [5] }
    ]},
    { id: 'p8', numero: 'VIII', cursos: [
      { id: 'rot-pequenos',     tipo: 'P', creditos: 4, nombre: 'Rotación Clínica de pequeños animales', rap: [3], rotacion: true },
      { id: 'rot-equina',       tipo: 'P', creditos: 4, nombre: 'Rotación Clínica en Medicina y cirugía equina', rap: [3], rotacion: true },
      { id: 'mercadeo',         tipo: 'T', creditos: 2, nombre: 'Mercadeo Agropecuario', codigo: '300005' },
      { id: 'elec-dc-2',        tipo: 'M', creditos: 3, nombre: 'Electivo Disciplinar Común (DC)', electivo: true },
      { id: 'elec-de-1',        tipo: 'P', creditos: 3, nombre: 'Electivo Disciplinar Específico I', nota: 'Línea de profundización elegida', electivo: true },
      { id: 'fauna-silvestre',  tipo: 'P', creditos: 2, nombre: 'Medicina de fauna silvestre y exótica', rap: [3] }
    ]},
    { id: 'p9', numero: 'IX', cursos: [
      { id: 'rot-produccion',   tipo: 'P', creditos: 4, nombre: 'Rotación sistemas de producción animal', rap: [5], rotacion: true },
      { id: 'rot-reproduccion', tipo: 'P', creditos: 4, nombre: 'Rotación Reproducción y biotecnología veterinaria', rap: [5], rotacion: true },
      { id: 'elec-fc-3',        tipo: 'M', creditos: 1, nombre: 'Electivo de formación complementaria', electivo: true },
      { id: 'elec-ibc-1',       tipo: 'M', creditos: 3, nombre: 'Electivo Interdisciplinar Básico Común (IBC)', electivo: true },
      { id: 'elec-de-2',        tipo: 'P', creditos: 3, nombre: 'Electivo Disciplinar Específico II', nota: 'Línea de profundización elegida', electivo: true },
      { id: 'sociologia-rural', tipo: 'T', creditos: 2, nombre: 'Sociología rural', codigo: '30174' }
    ]},
    { id: 'p10', numero: 'X', cursos: [
      { id: 'rot-one-health',   tipo: 'P', creditos: 4, nombre: 'Rotación One Health y Vigilancia Sanitaria', rap: [4], rotacion: true },
      { id: 'rot-profundizacion', tipo: 'P', creditos: 4, nombre: 'Rotación de profundización', rap: [3], rotacion: true },
      { id: 'elec-ibc-2',       tipo: 'M', creditos: 3, nombre: 'Electivo Interdisciplinar Básico Común (IBC)', electivo: true },
      { id: 'elec-de-3',        tipo: 'P', creditos: 3, nombre: 'Electivo Disciplinar Específico III', nota: 'Línea de profundización elegida', electivo: true }
    ]}
  ];

  /* Créditos por periodo: se calculan, no se escriben a mano. */
  MALLA.forEach(function (p) {
    p.creditos = p.cursos.reduce(function (s, c) { return s + (c.creditos || 0); }, 0);
  });

  /* ── Prerrequisitos directos ─────────────────────────────────────── */
  var PREREQUISITOS_MANUALES = {
    /* Ruta verde · Ciencias biológicas */
    'bio-desarrollo':         ['bio-celular'],
    'herramientas-digitales': ['bio-celular'],
    'genetica':               ['bio-desarrollo', 'herramientas-digitales'],

    /* Ruta amarilla · Fundamentos biomédicos */
    'anatomia':               ['bio-celular'],
    'inmunologia':            ['bio-desarrollo', 'anatomia'],
    'semiologia':             ['bio-desarrollo', 'anatomia'],
    'microbiologia':          ['inmunologia', 'semiologia'],
    'virologia':              ['microbiologia'],
    'cirugia':                ['virologia'],
    'mi-pequenos':            ['cirugia'],

    /* Ruta roja · Pensamiento científico e innovación */
    'transformacion-digital': ['pensamiento-logico'],
    'diseno-experimental':    ['transformacion-digital'],
    'fundamentos-investigacion': ['diseno-experimental'],
    'diseno-proyectos':       ['diseno-experimental'],

    /* Ruta violeta · Inglés (IV → VII) */
    'ingles-a2':              ['ingles-a1'],
    'ingles-b1':              ['ingles-a2'],
    'ingles-b2':              ['ingles-b1'],

    /* Ruta azul · Metabolismo y nutrición */
    'bioquimica':             ['quimica-organica'],
    'nutricion':              ['bioquimica'],

    /* Ruta negra · Salud animal integrada */
    'farmacologia':           ['nutricion'],
    'elec-de-1':              ['farmacologia'],
    'elec-de-2':              ['elec-de-1'],
    'elec-de-3':              ['elec-de-2'],

    /* Ruta blanca · Bienestar y salud pública */
    'bioetica':               ['one-health'],
    'etologia':               ['bioetica'],
    'epidemiologia':          ['etologia']
  };

  var PREREQUISITOS = {};
  MALLA.forEach(function (periodo) {
    periodo.cursos.forEach(function (curso) {
      var reqs = PREREQUISITOS_MANUALES[curso.id];
      if (reqs && reqs.length) PREREQUISITOS[curso.id] = reqs.slice();
    });
  });

  /* ── Núcleos problémicos · hoja "C3. RUTA NP" ─────────────────────
     cursos = celdas coloreadas en la hoja (NP1 lila, NP2 cian).        */
  var NUCLEOS = {
    np1: {
      id: 'np1', sigla: 'NP1', color: '#00445B',
      nombre: 'Procesos de salud-enfermedad, diagnóstico y atención veterinaria',
      competencias: [1, 2], raps: [1, 2, 3],
      cursos: ['intro-mv', 'anatomia', 'bio-desarrollo', 'semiologia', 'patologia-general',
               'patologia-diagnostica', 'farmacologia', 'imagenologia', 'mi-rumiantes',
               'urgencias', 'mi-pequenos', 'mi-equinos', 'fauna-silvestre']
    },
    np2: {
      id: 'np2', sigla: 'NP2', color: '#035B3B',
      nombre: 'Salud poblacional, bienestar y sostenibilidad de los sistemas pecuarios',
      competencias: [3, 4], raps: [4, 5],
      cursos: ['one-health', 'bioetica', 'nutricion', 'genetica', 'etologia', 'biotecnologias',
               'epidemiologia', 'aviar', 'porcina', 'rot-reproduccion', 'rot-one-health']
    }
  };

  /* ── Resultados de Aprendizaje de Programa ──────────────────────────
     cursos     → red curricular (hoja Consistencia Curricular)
     control    → puntos de seguimiento (hoja Puntos de Control RAP)
     evidencias → selección de la hoja Evidencia de los RAP              */
  var RAP = {
    1: {
      num: 1, np: 'np1', competencia: 1, color: '#0E7490',
      corto: 'Organización estructural y funcional',
      verbo: 'Identificar',
      enunciado: 'Identificar la organización estructural y funcional de los organismos animales para interpretar los procesos biológicos, fisiológicos e inmunológicos asociados al mantenimiento de la salud animal.',
      competenciaTexto: 'Comprende los procesos biológicos, fisiológicos, inmunológicos y patológicos que intervienen en la salud y la enfermedad animal, interpretando sus manifestaciones y sustentando la toma de decisiones en la práctica veterinaria.',
      cursos: ['intro-mv', 'anatomia', 'bio-desarrollo', 'inmunologia', 'genetica'],
      control: ['bio-desarrollo', 'inmunologia'],
      evidencias: [
        'Informes de laboratorio de anatomía, fisiología e inmunología',
        'Mapas conceptuales y modelos estructura-función',
        'Análisis comparativos entre especies animales',
        'Portafolio académico de ciencias biomédicas'
      ]
    },
    2: {
      num: 2, np: 'np1', competencia: 1, color: '#6D28D9',
      corto: 'Agentes etiológicos y fisiopatología',
      verbo: 'Clasificar',
      enunciado: 'Clasificar los agentes etiológicos, mecanismos fisiopatológicos e inmunológicos involucrados en la presentación de enfermedades animales para interpretar sus manifestaciones clínicas, diagnósticas y epidemiológicas.',
      competenciaTexto: 'Comprende los procesos biológicos, fisiológicos, inmunológicos y patológicos que intervienen en la salud y la enfermedad animal, interpretando sus manifestaciones y sustentando la toma de decisiones en la práctica veterinaria.',
      cursos: ['microbiologia', 'virologia', 'parasitologia', 'patologia-general', 'patologia-diagnostica', 'toxicologia', 'epidemiologia'],
      control: ['patologia-general', 'patologia-diagnostica'],
      evidencias: [
        'Informes de laboratorio de microbiología, virología, parasitología y patología',
        'Estudios de caso de enfermedades animales',
        'Reportes de interpretación fisiopatológica',
        'Análisis de resultados diagnósticos y epidemiológicos'
      ]
    },
    3: {
      num: 3, np: 'np1', competencia: 2, color: '#BE185D',
      corto: 'Razonamiento y método clínico',
      verbo: 'Analizar',
      enunciado: 'Analizar información obtenida mediante la anamnesis, el examen clínico y las ayudas diagnósticas para fundamentar decisiones relacionadas con la salud y el bienestar animal en diferentes contextos de la práctica veterinaria.',
      competenciaTexto: 'Interpreta el estado de salud animal mediante la aplicación del método clínico veterinario, integrando información proveniente de la anamnesis, el examen clínico, las ayudas diagnósticas y la evidencia científica para sustentar decisiones orientadas a la prevención, diagnóstico, tratamiento y seguimiento de enfermedades, en concordancia con principios éticos, normativos y de bienestar animal.',
      cursos: ['semiologia', 'imagenologia', 'patologia-diagnostica', 'farmacologia', 'toxicologia',
               'mi-pequenos', 'mi-equinos', 'mi-rumiantes', 'urgencias', 'fauna-silvestre', 'cirugia',
               'rot-pequenos', 'rot-equina', 'rot-profundizacion'],
      control: ['semiologia', 'patologia-diagnostica', 'urgencias'],
      evidencias: [
        'Historias clínicas completas y documentadas',
        'Registros de simulación clínica y OSCE',
        'Planes diagnósticos y terapéuticos sustentados en evidencia',
        'Portafolio clínico integrador consolidado'
      ]
    },
    4: {
      num: 4, np: 'np2', competencia: 3, color: '#15803D',
      corto: 'Epidemiología, zoonosis y salud pública',
      verbo: 'Argumentar',
      enunciado: 'Argumentar la relación entre factores epidemiológicos, sanitarios y ambientales y la ocurrencia y transmisión de enfermedades animales y zoonóticas, para sustentar acciones de prevención, vigilancia y control en salud pública veterinaria.',
      competenciaTexto: 'Establece los factores epidemiológicos, sanitarios y ambientales asociados a la ocurrencia y transmisión de enfermedades animales y zoonóticas, sustentando acciones de prevención, vigilancia y control orientadas al fortalecimiento de la sanidad animal y la protección de la salud pública.',
      cursos: ['epidemiologia', 'one-health', 'microbiologia', 'virologia', 'parasitologia', 'inmunologia', 'bioetica', 'rot-one-health'],
      control: ['one-health', 'epidemiologia', 'rot-one-health'],
      evidencias: [
        'Diagnósticos sanitarios territoriales',
        'Mapas de riesgo sanitario',
        'Reportes de vigilancia epidemiológica',
        'Proyecto Integrador de Vigilancia Epidemiológica y Gestión Sanitaria One Health'
      ]
    },
    5: {
      num: 5, np: 'np2', competencia: 4, color: '#C2410C',
      corto: 'Salud poblacional y sistemas pecuarios',
      verbo: 'Evaluar',
      enunciado: 'Evaluar condiciones de salud en poblaciones animales mediante la integración de factores sanitarios, nutricionales, genéticos, reproductivos y de bienestar animal para sustentar decisiones orientadas al bienestar, la prevención de riesgos y la sostenibilidad de los sistemas pecuarios.',
      competenciaTexto: 'Integra factores sanitarios, nutricionales, genéticos, reproductivos y de bienestar animal, evaluando condiciones de salud en poblaciones animales y sustentando decisiones veterinarias orientadas al bienestar, la prevención de riesgos y la sostenibilidad de los sistemas pecuarios, en articulación con el enfoque Una Salud (One Health).',
      cursos: ['nutricion', 'genetica', 'biotecnologias', 'etologia', 'aviar', 'porcina', 'rot-produccion', 'rot-reproduccion'],
      control: ['aviar', 'porcina', 'rot-produccion'],
      evidencias: [
        'Diagnósticos veterinarios integrales de poblaciones animales',
        'Evaluaciones de bienestar y bioseguridad',
        'Informes de rotación en sistemas de producción y reproducción',
        'Producto integrador de salud, bienestar y sostenibilidad'
      ]
    }
  };

  /* ── Rutas no-RAP ──────────────────────────────────────────────────
     Rutas transversales = celdas resaltadas en cada hoja de ruta.
     "modulos" permite colorear subgrupos (Saber Pro: leyenda filas 63-67). */
  var RUTAS = {
    /* Prerrequisitos */
    verde:    { grupo: 'prereq', nombre: 'Ciencias biológicas', color: '#035B3B',
                ids: ['bio-celular', 'bio-desarrollo', 'herramientas-digitales', 'genetica'] },
    amarilla: { grupo: 'prereq', nombre: 'Fundamentos biomédicos', color: '#B7860B',
                ids: ['bio-celular', 'anatomia', 'bio-desarrollo', 'inmunologia', 'semiologia', 'microbiologia', 'virologia', 'cirugia', 'mi-pequenos'] },
    roja:     { grupo: 'prereq', nombre: 'Pensamiento científico e innovación', color: '#B91C1C',
                ids: ['pensamiento-logico', 'transformacion-digital', 'diseno-experimental', 'diseno-proyectos', 'fundamentos-investigacion'] },
    azul:     { grupo: 'prereq', nombre: 'Metabolismo y nutrición animal', color: '#1D4ED8',
                ids: ['quimica-organica', 'bioquimica', 'nutricion'] },
    negra:    { grupo: 'prereq', nombre: 'Salud animal integrada', color: '#1E293B',
                ids: ['bioquimica', 'nutricion', 'farmacologia', 'elec-de-1', 'elec-de-2', 'elec-de-3'] },
    blanca:   { grupo: 'prereq', nombre: 'Bienestar y salud pública', color: '#64748B',
                ids: ['one-health', 'bioetica', 'etologia', 'epidemiologia'] },

    /* Hoja C3. RUTA IDIOMA */
    idioma:   { grupo: 'trans', nombre: 'Ruta Idioma · Inglés A1 → B2', color: '#DB2777',
                ids: ['ingles-a1', 'ingles-a2', 'ingles-b1', 'ingles-b2'] },
    /* Hoja C3. INVESTIGACIÓN */
    investigacion: { grupo: 'trans', nombre: 'Ruta de Investigación', color: '#0F766E',
                ids: ['estadistica', 'diseno-experimental', 'diseno-proyectos', 'trabajo-grado'] },
    /* Hoja C3. RUTA DE INNOVACIÓN */
    innovacion: { grupo: 'trans', nombre: 'Ruta de Innovación', color: '#9333EA',
                ids: ['one-health', 'transformacion-digital', 'biotecnologias', 'rot-reproduccion'] },
    /* Hoja C3. SABER PRO (colores = módulos de la leyenda) */
    saberpro: { grupo: 'trans', nombre: 'Ruta Saber Pro', color: '#D26714',
                modulos: [
                  { nombre: 'Lectura crítica',           color: '#0369A1', ids: ['bio-celular', 'anatomia', 'semiologia', 'patologia-diagnostica'] },
                  { nombre: 'Razonamiento cuantitativo', color: '#15803D', ids: ['pensamiento-logico', 'nutricion', 'farmacologia', 'cirugia'] },
                  { nombre: 'Competencias ciudadanas',   color: '#7C3AED', ids: ['etica-ciudadania', 'bioetica', 'transformacion-digital', 'epidemiologia'] },
                  { nombre: 'Inglés',                    color: '#DB2777', ids: ['etologia', 'ingles-a1', 'ingles-a2', 'mi-rumiantes', 'ingles-b1', 'ingles-b2'] },
                  { nombre: 'Comunicación escrita',      color: '#0891B2', ids: ['comp-comunicativas', 'bio-desarrollo', 'patologia-general', 'biotecnologias'] }
                ] },
    /* Hoja C3. RUTA SISSU (celdas en amarillo) */
    sissu:    { grupo: 'trans', nombre: 'Ruta SISSU', color: '#CA8A04',
                ids: ['intro-mv', 'catedra-unadista', 'servicio-social', 'epidemiologia', 'rot-one-health'] }
  };

  /* Las rutas con módulos exponen también la lista completa de ids. */
  Object.keys(RUTAS).forEach(function (k) {
    var r = RUTAS[k];
    if (r.modulos && !r.ids) {
      r.ids = [];
      r.modulos.forEach(function (m) { m.ids.forEach(function (id) { if (r.ids.indexOf(id) < 0) r.ids.push(id); }); });
    }
  });

  window.MALLA_DATA = {
    MALLA: MALLA,
    PREREQUISITOS: PREREQUISITOS,
    TIPO_INFO: TIPO_INFO,
    PERIODO_COLORES: PERIODO_COLORES,
    NUCLEOS: NUCLEOS,
    RAP: RAP,
    RUTAS: RUTAS
  };
})();
