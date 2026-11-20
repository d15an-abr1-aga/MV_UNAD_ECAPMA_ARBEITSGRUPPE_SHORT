/* =========================================================================
   malla-data.js
   -------------------------------------------------------------------------
   Fuente de verdad de la malla académica de Medicina Veterinaria.
   Actualizado con el Anexo 3.8 (versión de noviembre de 2026):

     · MALLA          → hoja "C3. Plan de Estudios": 63 cursos, 174 créditos.
                        Las 3 Rotaciones Clínicas (8 cr) agrupan cada una 2 de
                        los 6 cursos de rotación de la TABLA 1 (areas).
     · PREREQUISITOS  → flechas de colores dibujadas en "C3. Plan de Estudios":
                        cada curso con flecha de un color es prerrequisito del
                        siguiente curso de ese mismo color.
     · NUCLEOS / RAP  → hojas "C3. Consistencia Curricular" y "C3. NIP-NP".
     · Puntos de control → hoja "C3. Puntos de Control RAP".
     · EVIDENCIAS     → hoja "C3. Evidencia de los RAP", tal como está en la
                        matriz (RAP 1 y RAP 2 comparten la misma fila).
     · RUTAS          → rutas de prerrequisitos (flechas) y rutas transversales
                        (hojas RUTA IDIOMA, INVESTIGACIÓN, RUTA DE INNOVACIÓN,
                        SABER PRO y RUTA SISSU).

   Los IDs son legibles (slug del curso). Los cursos de rotación (áreas)
   tienen ID propio para poder asociarlos a los RAP y a las rutas.
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

  /* Nota de la TABLA 1 (hoja Plan de Estudios) */
  var NOTA_ROTACIONES = "Nota: El estudiante deberá realizar las rotaciones formativas en las seis áreas clínicas y de profundización establecidas por el programa, de acuerdo con la organización curricular y los escenarios de práctica definidos para tal fin.";

  /* ── Plan de estudios (orden = orden de filas en la hoja) ──────────
     rap: resultados de aprendizaje a los que aporta el curso
     (hoja "C3. Consistencia Curricular", columna Cursos).            */
  var MALLA = [
    { id: 'p1', numero: 'I', cursos: [
      { id: 'intro-mv',         tipo: 'P', creditos: 2, nombre: 'Introducción a la Medicina Veterinaria', rap: [1] },
      { id: 'bio-celular',      tipo: 'M', creditos: 3, nombre: 'Biología celular y molecular', codigo: '30176', rap: [1] },
      { id: 'quimica-organica', tipo: 'M', creditos: 3, nombre: 'Química orgánica', codigo: '300047', rap: [1] },
      { id: 'one-health',       tipo: 'M', creditos: 2, nombre: 'Fundamentos del enfoque One Health', rap: [4] },
      { id: 'catedra-unadista', tipo: 'M', creditos: 3, nombre: 'Cátedra Unadista', codigo: '80017' },
      { id: 'comp-comunicativas', tipo: 'T', creditos: 3, nombre: 'Competencias Comunicativas', codigo: '40003' },
      { id: 'etica-ciudadania', tipo: 'T', creditos: 3, nombre: 'Ética y Ciudadanía (grado)', codigo: '400002' }
    ]},
    { id: 'p2', numero: 'II', cursos: [
      { id: 'anatomia',         tipo: 'P', creditos: 4, nombre: 'Anatomía Veterinaria comparada', rap: [1] },
      { id: 'bio-desarrollo',   tipo: 'P', creditos: 2, nombre: 'Biología del desarrollo y fisiología animal', rap: [1] },
      { id: 'bioquimica',       tipo: 'M', creditos: 3, nombre: 'Bioquímica metabólica', codigo: '352001', rap: [1] },
      { id: 'bioetica',         tipo: 'M', creditos: 2, nombre: 'Bioética y legislación Veterinaria', rap: [3] },
      { id: 'herramientas-digitales', tipo: 'M', creditos: 3, nombre: 'Herramientas digitales para la gestión del conocimiento', codigo: '200610', rap: [4] },
      { id: 'pensamiento-logico', tipo: 'T', creditos: 3, nombre: 'Pensamiento lógico y matemático', codigo: '200611' }
    ]},
    { id: 'p3', numero: 'III', cursos: [
      { id: 'inmunologia',      tipo: 'P', creditos: 3, nombre: 'Inmunología Veterinaria', rap: [1] },
      { id: 'nutricion',        tipo: 'P', creditos: 2, nombre: 'Nutrición clínica', rap: [3] },
      { id: 'genetica',         tipo: 'M', creditos: 2, nombre: 'Genética y Genómica Aplicada a la Medicina Veterinaria', rap: [1] },
      { id: 'estadistica',      tipo: 'T', creditos: 3, nombre: 'Estadística Descriptiva Aplicada a las Ciencias Agrarias', codigo: '300032', rap: [4] },
      { id: 'semiologia',       tipo: 'P', creditos: 2, nombre: 'Semiología y Competencias Clínicas Veterinarias', rap: [2] },
      { id: 'transformacion-digital', tipo: 'M', creditos: 2, nombre: 'Transformación Digital y Tecnologías Emergentes en Medicina Veterinaria', rap: [4] },
      { id: 'patologia-general', tipo: 'P', creditos: 3, nombre: 'Patología general y sistémica', rap: [1] },
      { id: 'servicio-social',  tipo: 'M', creditos: 0, nombre: 'Prestación del Servicio Social Unadista (Requisito de grado)', codigo: '700004' }
    ]},
    { id: 'p4', numero: 'IV', cursos: [
      { id: 'patologia-diagnostica', tipo: 'P', creditos: 3, nombre: 'Patología diagnóstica y de laboratorio clínico', rap: [2] },
      { id: 'microbiologia',    tipo: 'P', creditos: 2, nombre: 'Microbiología veterinaria', rap: [1] },
      { id: 'parasitologia',    tipo: 'P', creditos: 2, nombre: 'Parasitología veterinaria', rap: [1] },
      { id: 'diseno-experimental', tipo: 'T', creditos: 2, nombre: 'Diseño experimental', codigo: '300004', rap: [5] },
      { id: 'etologia',         tipo: 'P', creditos: 2, nombre: 'Etología y bienestar animal', rap: [5] },
      { id: 'gestion-integral', tipo: 'M', creditos: 3, nombre: 'Fundamentos en gestión integral', codigo: '112001', rap: [4] },
      { id: 'ingles-a1',        tipo: 'M', creditos: 3, nombre: 'Inglés A1', codigo: '900001' },
      { id: 'elec-fc-1',        tipo: 'T', creditos: 1, nombre: 'Electivo de formación complementaria', electivo: true }
    ]},
    { id: 'p5', numero: 'V', cursos: [
      { id: 'farmacologia',     tipo: 'M', creditos: 3, nombre: 'Farmacología veterinaria', rap: [3] },
      { id: 'ingles-a2',        tipo: 'M', creditos: 3, nombre: 'Inglés A2', codigo: '900002' },
      { id: 'toxicologia',      tipo: 'M', creditos: 2, nombre: 'Toxicología veterinaria', rap: [2] },
      { id: 'diseno-proyectos', tipo: 'T', creditos: 3, nombre: 'Diseño y evaluación de proyectos', codigo: '331005', rap: [5] },
      { id: 'biotecnologias',   tipo: 'P', creditos: 2, nombre: 'Biotecnologías y Manejo Reproductivo', rap: [5] },
      { id: 'epidemiologia',    tipo: 'P', creditos: 2, nombre: 'Epidemiología y salud pública Veterinaria', rap: [4] },
      { id: 'virologia',        tipo: 'P', creditos: 2, nombre: 'Virología veterinaria', rap: [1] }
    ]},
    { id: 'p6', numero: 'VI', cursos: [
      { id: 'imagenologia',     tipo: 'P', creditos: 3, nombre: 'Imagenología Veterinaria', rap: [2] },
      { id: 'cirugia',          tipo: 'P', creditos: 4, nombre: 'Cirugía, anestesiología y manejo del dolor', rap: [3] },
      { id: 'mi-rumiantes',     tipo: 'P', creditos: 3, nombre: 'Medicina interna de rumiantes', rap: [2] },
      { id: 'fundamentos-investigacion', tipo: 'M', creditos: 3, nombre: 'Fundamentos y Generalidades de Investigación', codigo: '150001', rap: [5] },
      { id: 'ingles-b1',        tipo: 'M', creditos: 3, nombre: 'Inglés B1', codigo: '900003' },
      { id: 'elec-fc-2',        tipo: 'T', creditos: 1, nombre: 'Electivo de formación complementaria', electivo: true },
      { id: 'elec-dc-1',        tipo: 'M', creditos: 3, nombre: 'Electivo Disciplinar Común (DC)', electivo: true }
    ]},
    { id: 'p7', numero: 'VII', cursos: [
      { id: 'urgencias',        tipo: 'P', creditos: 2, nombre: 'Medicina de urgencias y cuidados intensivos', rap: [3] },
      { id: 'mi-pequenos',      tipo: 'P', creditos: 3, nombre: 'Medicina interna de pequeños animales', rap: [2] },
      { id: 'mi-equinos',       tipo: 'P', creditos: 3, nombre: 'Medicina Interna en Equinos', rap: [2] },
      { id: 'ingles-b2',        tipo: 'M', creditos: 3, nombre: 'Inglés B2', codigo: '900004' },
      { id: 'trabajo-grado',    tipo: 'T', creditos: 2, nombre: 'Trabajo de Grado', codigo: '204015', rap: [5] },
      { id: 'aviar',            tipo: 'P', creditos: 2, nombre: 'Medicina y producción aviar', rap: [5] },
      { id: 'porcina',          tipo: 'P', creditos: 2, nombre: 'Medicina y producción porcina', rap: [5] }
    ]},
    { id: 'p8', numero: 'VIII', cursos: [
      { id: 'rot-clinica-1',    tipo: 'P', creditos: 8, nombre: 'Rotación Clínica I', rotacion: true, eleccion: 2 },
      { id: 'mercadeo',         tipo: 'T', creditos: 2, nombre: 'Mercadeo Agropecuario', codigo: '300005', rap: [5] },
      { id: 'elec-dc-2',        tipo: 'M', creditos: 3, nombre: 'Electivo Disciplinar Común (DC)', electivo: true },
      { id: 'elec-de-1',        tipo: 'P', creditos: 3, nombre: 'Electivo Disciplinar Específico I', nota: 'Línea de profundización elegida', electivo: true },
      { id: 'fauna-silvestre',  tipo: 'P', creditos: 2, nombre: 'Medicina de fauna silvestre y exótica', rap: [2] }
    ]},
    { id: 'p9', numero: 'IX', cursos: [
      { id: 'rot-clinica-2',    tipo: 'P', creditos: 8, nombre: 'Rotación Clínica II', rotacion: true, eleccion: 2 },
      { id: 'elec-fc-3',        tipo: 'M', creditos: 1, nombre: 'Electivo de formación complementaria', electivo: true },
      { id: 'elec-ibc-1',       tipo: 'M', creditos: 3, nombre: 'Electivo Interdisciplinar Básico Común (IBC)', electivo: true },
      { id: 'elec-de-2',        tipo: 'P', creditos: 3, nombre: 'Electivo Disciplinar Específico II', nota: 'Línea de profundización elegida', electivo: true },
      { id: 'sociologia-rural', tipo: 'T', creditos: 2, nombre: 'Sociología rural', codigo: '30174', rap: [4] }
    ]},
    { id: 'p10', numero: 'X', cursos: [
      { id: 'rot-clinica-3',    tipo: 'P', creditos: 8, nombre: 'Rotación Clínica III', rotacion: true, eleccion: 2 },
      { id: 'elec-ibc-2',       tipo: 'M', creditos: 3, nombre: 'Electivo Interdisciplinar Básico Común (IBC)', electivo: true },
      { id: 'elec-de-3',        tipo: 'P', creditos: 3, nombre: 'Electivo Disciplinar Específico III', nota: 'Línea de profundización elegida', electivo: true }
    ]}
  ];

  /* ── Cursos de rotación (TABLA 1 del Plan de Estudios) ───────────────
     No tienen periodo fijo: en cada Rotación Clínica (I, II y III) el
     estudiante inscribe 2 de estos 6 cursos, según su elección, hasta
     completar las seis áreas. rap = RAP al que aporta (Consistencia).  */
  var ROTACION_CURSOS = [
    { id: 'rot-pequenos',       nombre: 'Rotación Clínica de pequeños animales',             corto: 'Pequeños animales',              rap: [2] },
    { id: 'rot-equina',         nombre: 'Rotación Clínica en Medicina y cirugía equina',      corto: 'Medicina y cirugía equina',      rap: [2] },
    { id: 'rot-produccion',     nombre: 'Rotación sistemas de producción animal',             corto: 'Sistemas de producción animal',  rap: [5] },
    { id: 'rot-reproduccion',   nombre: 'Rotación Reproducción y biotecnología veterinaria',  corto: 'Reproducción y biotecnología',   rap: [5] },
    { id: 'rot-one-health',     nombre: 'Rotación One Health y vigilancia sanitaria',         corto: 'One Health y vigilancia sanitaria', rap: [4] },
    { id: 'rot-profundizacion', nombre: 'Rotación de profundización',                         corto: 'Profundización',                 rap: [3] }
  ];

  /* Créditos por periodo: se calculan, no se escriben a mano. */
  MALLA.forEach(function (p) {
    p.creditos = p.cursos.reduce(function (s, c) { return s + (c.creditos || 0); }, 0);
  });

  /* ── Rutas de prerrequisitos = flechas de colores del Plan de Estudios ──
     Cada lista va en orden de periodo: cada curso es prerrequisito del
     siguiente de la misma lista. Un curso puede estar en dos rutas.      */
  var CADENAS = {
    verde:    ['bio-celular', 'bio-desarrollo', 'genetica', 'etologia'],
    amarilla: ['bio-celular', 'anatomia', 'semiologia', 'microbiologia', 'cirugia', 'mi-pequenos'],
    roja:     ['pensamiento-logico', 'transformacion-digital', 'diseno-experimental', 'diseno-proyectos', 'fundamentos-investigacion', 'trabajo-grado'],
    azul:     ['quimica-organica', 'bioquimica', 'nutricion'],
    negra:    ['bioquimica', 'nutricion', 'farmacologia', 'elec-de-1', 'elec-de-2', 'elec-de-3'],
    blanca:   ['one-health', 'bioetica', 'etologia', 'epidemiologia'],
    rosada:   ['ingles-a1', 'ingles-a2', 'ingles-b1', 'ingles-b2']
  };

  /* Regla del programa: ningún curso tiene doble prerrequisito. Las líneas
     son independientes aunque un curso lleve flechas de dos colores.
     Cuando dos líneas llegan al mismo curso, se fija aquí cuál define su
     prerrequisito (Etología → Bioética, línea blanca).                   */
  var PRERREQUISITO_FIJO = { 'etologia': 'bioetica' };

  var PREREQUISITOS = {};
  Object.keys(CADENAS).forEach(function (k) {
    var c = CADENAS[k];
    for (var i = 1; i < c.length; i++) {
      var id = c[i], req = PRERREQUISITO_FIJO[id] || c[i - 1];
      PREREQUISITOS[id] = PREREQUISITOS[id] || [];
      if (PREREQUISITOS[id].indexOf(req) < 0) PREREQUISITOS[id].push(req);
    }
  });
  Object.keys(PREREQUISITOS).forEach(function (id) {
    if (PREREQUISITOS[id].length > 1 && window.console) console.warn('[malla-data] Doble prerrequisito en', id, PREREQUISITOS[id]);
  });

  /* ── NIP y núcleos problémicos · hojas Consistencia Curricular y NIP-NP ── */
  var NIP = "Gestión integral de la salud y el bienestar animal, la salud pública veterinaria y la sostenibilidad de los sistemas pecuarios y los ecosistemas en la interfaz animal-humano-ambiente.";

  var NUCLEOS = {
    np1: {
      id: 'np1', sigla: 'NP1', color: '#00445B',
      nombre: "Procesos de salud-enfermedad, diagnóstico y atención veterinaria",
      manifestacion: "Necesidad de comprender e intervenir los procesos de salud-enfermedad y bienestar animal mediante fundamentos biológicos, diagnóstico y atención veterinaria basada en evidencia.",
      pregunta: "¿Cómo integrar los fundamentos biológicos, fisiológicos, inmunológicos, etiológicos y fisiopatológicos con el método clínico, las ayudas diagnósticas y los procedimientos veterinarios para comprender e intervenir las alteraciones de la salud animal en diferentes especies y contextos de práctica?",
      competencias: [1, 2], raps: [1, 2, 3]
    },
    np2: {
      id: 'np2', sigla: 'NP2', color: '#035B3B',
      nombre: "Salud poblacional, bienestar y sostenibilidad de los sistemas pecuarios",
      manifestacion: "Necesidad de prevenir y gestionar riesgos sanitarios en poblaciones animales y sistemas pecuarios, articulando salud pública veterinaria, bienestar, sostenibilidad y la interfaz animal-humano-ambiente.",
      pregunta: "¿Cómo evaluar los factores epidemiológicos, sanitarios, nutricionales, genéticos, reproductivos, productivos, sociales y ambientales que afectan la salud y el bienestar de las poblaciones animales, con el fin de sustentar acciones de salud pública veterinaria y formular alternativas que contribuyan a la sostenibilidad de los sistemas pecuarios desde el enfoque Una Salud?",
      competencias: [3, 4], raps: [4, 5]
    }
  };

  var COMPETENCIAS = {
    1: "Comprende los procesos biológicos, fisiológicos, inmunológicos y patológicos que intervienen en la salud y la enfermedad animal, interpretando sus manifestaciones y sustentando la toma de decisiones en la práctica veterinaria.",
    2: "Desarrolla procedimientos clínicos, terapéuticos, anestésicos y quirúrgicos con fundamento científico y técnico, integrando el método clínico veterinario (anamnesis, examen clínico, ayudas diagnósticas y evidencia) en el diagnóstico, pronóstico, tratamiento y seguimiento de las alteraciones de la salud animal, garantizando el bienestar animal, la bioseguridad, la ética profesional y la normatividad vigente.",
    3: "Establece los factores epidemiológicos, sanitarios y ambientales asociados a la ocurrencia y transmisión de enfermedades animales y zoonóticas, sustentando acciones de prevención, vigilancia y control orientadas al fortalecimiento de la sanidad animal y la protección de la salud pública.",
    4: "Integra factores sanitarios, nutricionales, genéticos, reproductivos y de bienestar animal, evaluando condiciones de salud en poblaciones animales y sustentando decisiones veterinarias orientadas al bienestar, la prevención de riesgos y la sostenibilidad de los sistemas pecuarios, en articulación con el enfoque Una sola Salud (One Health)."
  };

  /* ── Evidencia de los RAP (tal como está en la matriz) ──────────────
     La fila de NP1 agrupa RAP 1 y RAP 2 en una sola celda por columna. */
  var EVIDENCIAS = {
    'np1-a': Object.assign({ raps: [1, 2] }, {
      "seguimiento": [
        "Seguimiento al desarrollo progresivo de competencias en ciencias básicas y biomédicas mediante actividades integradoras",
        "Acompañamiento a la articulación entre anatomía, fisiología, inmunología y genética para la comprensión de la salud animal",
        "Monitoreo de la capacidad de análisis de relaciones estructura-función en diferentes especies animales",
        "Retroalimentación continua sobre la interpretación de procesos biológicos asociados al mantenimiento de la salud",
        "Seguimiento a la construcción de portafolios académicos y estudios integradores de salud animal",
        "Seguimiento a la integración progresiva de conocimientos microbiológicos, parasitológicos, virológicos y patológicos",
        "Acompañamiento a la interpretación de casos relacionados con procesos de enfermedad",
        "Monitoreo de la capacidad para relacionar agentes etiológicos con manifestaciones clínicas y epidemiológicas",
        "Retroalimentación sobre el análisis de mecanismos fisiopatológicos y respuesta inmunológica",
        "Seguimiento a ejercicios integradores de análisis de enfermedades animales"
      ],
      "mecanismos": [
        "Pruebas integradoras de ciencias básicas y biomédicas",
        "Estudios de caso orientados al análisis de relaciones estructura-función",
        "Talleres de análisis comparativo entre especies animales",
        "Evaluaciones teórico-prácticas de anatomía, fisiología e inmunología",
        "Informes de laboratorio y prácticas académicas",
        "Sustentaciones orales de casos de integración biomédica",
        "Elaboración de mapas conceptuales y modelos explicativos",
        "Rúbricas para valoración del razonamiento biológico y fisiológico",
        "Portafolio académico integrador con evidencias de aprendizaje progresivo",
        "Estudios de caso de enfermedades infecciosas, parasitarias y tóxicas",
        "Análisis e interpretación de resultados de laboratorio clínico y patología diagnóstica",
        "Pruebas integradoras de microbiología, virología, parasitología y patología",
        "Informes de prácticas de laboratorio y ejercicios diagnósticos",
        "Rúbricas para la interpretación de procesos fisiopatológicos",
        "Sustentación de casos clínicos y epidemiológicos",
        "Análisis de problemas sanitarios mediante aprendizaje basado en casos (ABC)",
        "Evaluaciones de integración disciplinar enfocadas en la relación agente-hospedero-ambiente",
        "Portafolio de evidencias con análisis de enfermedades y mecanismos de presentación"
      ],
      "evidencias": [
        "Informes de laboratorio de anatomía, fisiología e inmunología",
        "Estudios de caso relacionados con procesos fisiológicos normales",
        "Mapas conceptuales y modelos explicativos de relaciones estructura-función",
        "Análisis comparativos entre especies animales",
        "Portafolio académico de ciencias biomédicas",
        "Sustentaciones orales de integración anatómica, fisiológica e inmunológica",
        "Productos de aprendizaje basados en problemas de salud animal",
        "Informes de laboratorio de microbiología, virología, parasitología y patología",
        "Estudios de caso de enfermedades animales",
        "Reportes de interpretación fisiopatológica",
        "Análisis de resultados diagnósticos y epidemiológicos",
        "Sustentaciones de casos de enfermedad",
        "Portafolio de evidencias sobre salud y enfermedad animal",
        "Informes integradores de procesos etiológicos y fisiopatológicos"
      ]
    }),
    'np1-b': Object.assign({ raps: [3] }, {
      "seguimiento": [
        "Seguimiento al desarrollo progresivo de competencias clínicas básicas mediante simulación y práctica supervisada",
        "Acompañamiento a la construcción de historias clínicas y formulación de hipótesis diagnósticas",
        "Monitoreo de la interpretación de resultados de laboratorio e imagenología",
        "Retroalimentación sistemática sobre la aplicación del método clínico veterinario",
        "Seguimiento al desempeño en escenarios clínicos simulados y reales",
        "Seguimiento a la construcción progresiva del portafolio clínico integrador desde las bases biomédicas hasta las rotaciones clínicas",
        "Acompañamiento a la ruta formativa de análisis, diagnóstico y abordaje terapéutico de casos de complejidad creciente",
        "Seguimiento a la integración de resultados provenientes de laboratorios, prácticas clínicas y rotaciones",
        "Retroalimentación sobre la toma de decisiones clínicas fundamentadas en evidencia científica, criterios éticos y normativos",
        "Monitoreo del desempeño profesional en escenarios clínicos mediante evidencias acumulativas"
      ],
      "mecanismos": [
        "Examen Clínico Objetivo Estructurado (OSCE)",
        "Evaluación de habilidades de anamnesis y examen clínico mediante rúbricas y listas de chequeo",
        "Análisis y resolución de casos clínicos simulados y reales",
        "Interpretación de resultados de laboratorio clínico e imagenología",
        "Evaluaciones teórico-prácticas de razonamiento clínico",
        "Sustentación oral de hipótesis diagnósticas",
        "Evaluación de historias clínicas elaboradas por el estudiante",
        "Portafolio clínico con evidencias de análisis diagnóstico progresivo",
        "Evaluación de casos clínicos integradores de complejidad creciente",
        "Evaluación del razonamiento clínico mediante rúbricas analíticas",
        "Sustentación de planes diagnósticos, terapéuticos y de seguimiento",
        "Evaluación del desempeño en rotaciones clínicas y prácticas profesionales",
        "Análisis crítico de literatura científica aplicada a casos clínicos",
        "Simulaciones de toma de decisiones clínicas",
        "Valoración de competencias profesionalizantes mediante listas de cotejo",
        "Evaluación del portafolio clínico integrador"
      ],
      "evidencias": [
        "Historias clínicas completas y documentadas",
        "Hipótesis diagnósticas argumentadas",
        "Informes de interpretación de resultados de laboratorio clínico",
        "Reportes de análisis de estudios imagenológicos",
        "Registros de simulación clínica y OSCE",
        "Portafolio clínico de diagnóstico veterinario",
        "Resolución de casos clínicos básicos",
        "Casos clínicos integradores resueltos",
        "Planes diagnósticos y terapéuticos sustentados en evidencia",
        "Protocolos de seguimiento de pacientes",
        "Informes de rotaciones clínicas",
        "Sustentación de decisiones clínicas complejas",
        "Reportes de atención de casos en diferentes especies",
        "Portafolio clínico integrador consolidado",
        "Evaluaciones de desempeño en escenarios clínicos reales o simulados"
      ]
    }),
    'np2-a': Object.assign({ raps: [4] }, {
      "seguimiento": [
        "Seguimiento a la construcción progresiva del Proyecto Integrador de Vigilancia Epidemiológica y Gestión Sanitaria con Enfoque One Health, desarrollado a través de la red curricular",
        "Acompañamiento en la consolidación de diagnósticos sanitarios territoriales fundamentados en información epidemiológica, diagnóstica y normativa",
        "Seguimiento a la integración de las dimensiones de salud animal, salud humana y salud ambiental en el análisis de problemáticas sanitarias",
        "Retroalimentación periódica sobre la formulación de estrategias de vigilancia, prevención, control de enfermedades y gestión del riesgo sanitario",
        "Monitoreo de la incorporación de criterios de inocuidad alimentaria, normatividad sanitaria y sostenibilidad territorial en las propuestas de intervención",
        "Seguimiento a la maduración del proyecto integrador mediante entregables parciales y evidencias acumulativas del proceso formativo"
      ],
      "mecanismos": [
        "Análisis e interpretación de indicadores epidemiológicos, sanitarios y ambientales",
        "Estudios de caso sobre enfermedades animales, zoonosis y eventos de interés en salud pública veterinaria",
        "Elaboración y sustentación de diagnósticos sanitarios territoriales",
        "Evaluación de informes técnicos de vigilancia epidemiológica y sanitaria",
        "Análisis de brotes y emergencias sanitarias mediante metodologías de investigación epidemiológica",
        "Desarrollo y evaluación del Proyecto Integrador de Vigilancia Epidemiológica y Gestión Sanitaria con Enfoque One Health",
        "Construcción y análisis de mapas de riesgo sanitario y rutas de transmisión de enfermedades",
        "Aplicación de rúbricas para la valoración de la interpretación de información epidemiológica y la identificación de factores de riesgo",
        "Evaluación de propuestas de prevención, vigilancia y control sustentadas en evidencia científica y normativa",
        "Valoración del desempeño en la Rotación One Health y Vigilancia Sanitaria mediante listas de chequeo y rúbricas",
        "Sustentaciones orales y escritas de problemáticas sanitarias desde la perspectiva One Health",
        "Portafolio de evidencias con productos académicos desarrollados durante la red curricular"
      ],
      "evidencias": [
        "Diagnósticos sanitarios territoriales",
        "Informes epidemiológicos",
        "Análisis de brotes y eventos sanitarios",
        "Mapas de riesgo sanitario",
        "Reportes de vigilancia epidemiológica",
        "Estudios de caso de zoonosis y enfermedades de importancia sanitaria",
        "Propuestas de prevención y control basadas en evidencia",
        "Informes de la Rotación One Health y Vigilancia Sanitaria",
        "Productos del Proyecto Integrador de Vigilancia Epidemiológica y Gestión Sanitaria"
      ]
    }),
    'np2-b': Object.assign({ raps: [5] }, {
      "seguimiento": [
        "Seguimiento al análisis progresivo de sistemas pecuarios desde la salud y el bienestar de las poblaciones animales",
        "Acompañamiento a la evaluación de factores sanitarios, nutricionales, reproductivos, genéticos y de bienestar animal",
        "Monitoreo de la capacidad para relacionar dichos factores con riesgos para la salud, el bienestar y la sostenibilidad de los sistemas pecuarios",
        "Seguimiento a la interpretación de registros sanitarios, nutricionales y reproductivos para sustentar decisiones veterinarias",
        "Retroalimentación sobre estrategias de medicina preventiva, bioseguridad y bienestar animal en contextos pecuarios",
        "Monitoreo del desempeño durante las rotaciones de sistemas de producción animal y reproducción veterinaria",
        "Seguimiento a productos integradores que articulen salud, bienestar, sostenibilidad y enfoque Una Salud"
      ],
      "mecanismos": [
        "Análisis de casos de salud y bienestar en sistemas pecuarios",
        "Evaluación de factores sanitarios, nutricionales, reproductivos, genéticos y de bienestar animal",
        "Estudios de caso relacionados con nutrición, reproducción, genética, sanidad y bienestar",
        "Informes técnicos de evaluación veterinaria de poblaciones animales y unidades productivas",
        "Rúbricas para valoración de bienestar, bioseguridad y sostenibilidad",
        "Sustentación de decisiones veterinarias de prevención y manejo sanitario",
        "Evaluación del desempeño en rotaciones de sistemas de producción animal y reproducción veterinaria",
        "Análisis e interpretación de registros sanitarios, nutricionales y reproductivos",
        "Portafolio de evidencias de aprendizaje aplicado"
      ],
      "evidencias": [
        "Diagnósticos veterinarios integrales de poblaciones animales en sistemas pecuarios",
        "Informes de evaluación sanitaria y nutricional",
        "Análisis de indicadores sanitarios, reproductivos y de bienestar animal",
        "Evaluaciones de bienestar y bioseguridad",
        "Propuestas veterinarias de prevención, manejo sanitario y bienestar",
        "Informes de rotación en sistemas de producción animal y reproducción veterinaria",
        "Producto integrador de salud, bienestar y sostenibilidad",
        "Portafolio de evidencias"
      ]
    })
  };

  /* ── Resultados de Aprendizaje de Programa ──────────────────────────
     cursos  → red curricular (Consistencia Curricular, columna Cursos)
     control → Puntos de Control RAP                                    */
  var RAP = {
    1: { num: 1, np: 'np1', competencia: 1, color: '#0E7490', verbo: 'Identificar',
         corto: 'Bases biológicas y fisiopatológicas',
         enunciado: "Identificar la organización estructural y funcional de los organismos animales con los procesos biológicos, fisiológicos, inmunológicos, etiológicos y fisiopatológicos, para interpretar el mantenimiento de la salud y la presentación de enfermedades animales.",
         cursos: ['intro-mv', 'bio-celular', 'quimica-organica', 'bioquimica', 'anatomia', 'bio-desarrollo',
                  'inmunologia', 'microbiologia', 'parasitologia', 'virologia', 'patologia-general', 'genetica'],
         control: ['anatomia', 'bio-desarrollo', 'patologia-general'],
         evidencias: 'np1-a' },
    2: { num: 2, np: 'np1', competencia: 1, color: '#6D28D9', verbo: 'Analizar',
         corto: 'Análisis clínico y diagnóstico diferencial',
         enunciado: "Analizar la información obtenida mediante la anamnesis, el examen clínico, la evaluación semiológica y las ayudas diagnósticas, para establecer diagnósticos diferenciales y orientar decisiones clínicas fundamentadas en diferentes especies y contextos de la práctica veterinaria.",
         cursos: ['semiologia', 'patologia-diagnostica', 'imagenologia', 'toxicologia', 'mi-pequenos',
                  'mi-rumiantes', 'mi-equinos', 'fauna-silvestre', 'rot-pequenos', 'rot-equina'],
         control: ['semiologia', 'patologia-diagnostica', 'mi-pequenos'],
         evidencias: 'np1-a' },
    3: { num: 3, np: 'np1', competencia: 2, color: '#BE185D', verbo: 'Ejecutar',
         corto: 'Procedimientos clínicos y quirúrgicos',
         enunciado: "Ejecutar procedimientos clínicos, terapéuticos, anestésicos y quirúrgicos propios de la medicina veterinaria, para contribuir al manejo de las alteraciones de la salud animal con fundamento científico y técnico, considerando el diagnóstico, el pronóstico, el bienestar animal, la bioseguridad, la ética profesional y la normatividad vigente.",
         cursos: ['farmacologia', 'nutricion', 'cirugia', 'urgencias', 'bioetica', 'rot-profundizacion'],
         control: ['farmacologia', 'cirugia', 'urgencias'],
         evidencias: 'np1-b' },
    4: { num: 4, np: 'np2', competencia: 3, color: '#15803D', verbo: 'Argumentar',
         corto: 'Prevención, vigilancia y gestión del riesgo',
         enunciado: "Argumentar acciones de prevención, vigilancia, control y gestión del riesgo frente a enfermedades animales y zoonóticas, mediante el análisis de información epidemiológica, sanitaria, social y ambiental, apoyado en herramientas tecnológicas pertinentes, para contribuir a la salud pública veterinaria y a la protección de los ecosistemas bajo el enfoque de Una Salud.",
         cursos: ['one-health', 'epidemiologia', 'estadistica', 'transformacion-digital', 'herramientas-digitales',
                  'gestion-integral', 'sociologia-rural', 'rot-one-health'],
         control: ['one-health', 'epidemiologia', 'rot-one-health'],
         evidencias: 'np2-a' },
    5: { num: 5, np: 'np2', competencia: 4, color: '#C2410C', verbo: 'Evaluar',
         corto: 'Salud poblacional y sostenibilidad pecuaria',
         enunciado: "Evaluar la salud y el bienestar de las poblaciones animales a partir del análisis integrado de factores sanitarios, nutricionales, genéticos, reproductivos, productivos y ambientales, para formular alternativas que contribuyan a la sostenibilidad de los sistemas pecuarios, la inocuidad de los alimentos de origen animal y la solución de problemáticas propias de la medicina veterinaria.",
         cursos: ['etologia', 'biotecnologias', 'aviar', 'porcina', 'mercadeo', 'diseno-experimental',
                  'diseno-proyectos', 'fundamentos-investigacion', 'rot-reproduccion', 'rot-produccion', 'trabajo-grado'],
         control: ['etologia', 'porcina', 'rot-produccion'],
         evidencias: 'np2-b' }
  };

  /* ── Rutas ─────────────────────────────────────────────────────────── */
  var RUTAS = {
    /* Prerrequisitos (flechas de colores) */
    verde:    { grupo: 'prereq', nombre: 'Ciencias biológicas',                 color: '#15803D', ids: CADENAS.verde },
    amarilla: { grupo: 'prereq', nombre: 'Fundamentos biomédicos',              color: '#B7860B', ids: CADENAS.amarilla },
    roja:     { grupo: 'prereq', nombre: 'Pensamiento científico e investigación', color: '#C2410C', ids: CADENAS.roja },
    azul:     { grupo: 'prereq', nombre: 'Metabolismo y nutrición animal',      color: '#0284C7', ids: CADENAS.azul },
    negra:    { grupo: 'prereq', nombre: 'Salud animal integrada',              color: '#1E293B', ids: CADENAS.negra },
    blanca:   { grupo: 'prereq', nombre: 'Bienestar y salud pública',           color: '#64748B', ids: CADENAS.blanca },
    rosada:   { grupo: 'prereq', nombre: 'Inglés A1 → B2',                      color: '#DB2777', ids: CADENAS.rosada },

    /* Rotaciones clínicas (TABLA 1 de la hoja Plan de Estudios) */
    rotaciones: { grupo: 'trans', nombre: 'Rotaciones clínicas', color: '#0891B2',
                  ids: ['rot-clinica-1', 'rot-clinica-2', 'rot-clinica-3', 'rot-pequenos', 'rot-equina', 'rot-produccion', 'rot-reproduccion', 'rot-one-health', 'rot-profundizacion'] },
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

  Object.keys(RUTAS).forEach(function (k) {
    var r = RUTAS[k];
    if (r.modulos && !r.ids) {
      r.ids = [];
      r.modulos.forEach(function (m) { m.ids.forEach(function (id) { if (r.ids.indexOf(id) < 0) r.ids.push(id); }); });
    }
  });

  window.MALLA_DATA = {
    MALLA: MALLA,
    ROTACION_CURSOS: ROTACION_CURSOS,
    PREREQUISITOS: PREREQUISITOS,
    CADENAS: CADENAS,
    TIPO_INFO: TIPO_INFO,
    PERIODO_COLORES: PERIODO_COLORES,
    NIP: NIP,
    NUCLEOS: NUCLEOS,
    COMPETENCIAS: COMPETENCIAS,
    RAP: RAP,
    EVIDENCIAS: EVIDENCIAS,
    RUTAS: RUTAS,
    NOTA_ROTACIONES: NOTA_ROTACIONES
  };
})();
