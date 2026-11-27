/* =====================================================================
   c4-infografias.js · Condición 4
   ---------------------------------------------------------------------
   Interacción de las infografías (ver css/c4-infografias.css):
     · Cada bloque .ig[data-ig="<id>"] tiene botones [data-ig-key] y un
       panel [data-ig-detail]. Al pasar el mouse, enfocar o hacer click
       en un botón se resalta y se muestra su detalle (DATA[id][key]).
     · Click fija la selección; un segundo click la libera.
     · Cuando la slide entra en pantalla se añade .ig-on (animaciones).
   ===================================================================== */
(function () {
    'use strict';

    var chip = function (t) { return '<span class="ig-chip">' + t + '</span>'; };
    var list = function (a) { return '<ul>' + a.map(function (t) { return '<li>' + chip(t) + '</li>'; }).join('') + '</ul>'; };

    /* ── Contenidos de cada infografía ─────────────────────────────── */
    var DATA = {
        curriculo: {
            macro: { t: '01 · Macrocurrículo — el horizonte', p: 'Define el marco institucional y normativo que orienta el programa y se articula con la formación integral, la inclusión, la sostenibilidad y el enfoque One Health.', l: ['Decreto 1330 de 2019', 'Acuerdo 001 de 2013', 'PAPS 4.0', 'PEP', 'MHUS 5.0 (Acuerdo 028 de 2025)'] },
            meso:  { t: '02 · Mesocurrículo — la ruta formativa', p: 'El macrocurrículo orienta la ruta formativa del programa: núcleos problémicos, perfil de egreso, RAP y plan de estudios.', l: ['2 núcleos problémicos', '5 RAP', '63 cursos', '174 créditos'] },
            micro: { t: '03 · Microcurrículo — la experiencia', p: 'La ruta se concreta en cada curso: resultados de aprendizaje del curso (RAC), syllabus, guías, rúbricas y ambientes de aprendizaje.', l: ['RAC', 'Syllabus, guías y rúbricas', 'AVA y simulación', 'Prácticas y rotaciones'] },
            loop:  { t: 'Ciclo de mejora curricular', p: 'Las evidencias y el seguimiento de los RAP en el microcurrículo retroalimentan el macrocurrículo y permiten ajustar el diseño del programa.', l: ['Puntos de control RAP', 'Evidencias de logro', 'Mejora curricular'] },
            oh:    { t: 'Eje transversal · One Health', p: 'Integra la salud humana, la salud animal y la salud ambiental en los tres niveles de planeación.', l: ['Salud humana', 'Salud animal', 'Salud ambiental'] },
            ohd:   { t: 'One Health digital · integración propuesta', p: 'Aprovecha datos y tecnologías digitales para la vigilancia epidemiológica, el uso de datos sanitarios y la lectura del riesgo territorial.', l: ['Vigilancia epidemiológica', 'Datos sanitarios', 'Riesgo territorial'] },
            tm:    { t: 'Telemedicina veterinaria · integración propuesta', p: 'Con supervisión profesional, protección de datos y atención presencial cuando corresponda.', l: ['Teleorientación y triaje remoto', 'Historia clínica electrónica', 'Seguimiento a distancia'] }
        },
        saber: {
            b: { t: 'Nivel básico · Periodos I–III · 53 créditos', p: '«Recordar, comprender, aplicar» (taxonomía de Bloom). Formación conceptual en fundamentos biológicos, morfofisiológicos, normativos y éticos de la profesión. Cursos prácticos (P) del nivel:', l: ['Introducción a la MV', 'Anatomía veterinaria comparada', 'Biología del desarrollo y fisiología animal', 'Inmunología veterinaria', 'Nutrición clínica', 'Semiología y competencias clínicas', 'Patología general y sistémica'] },
            i: { t: 'Nivel intermedio · Periodos IV–VI · 55 créditos', p: '«Aplicar, analizar». Desarrollo de capacidades en diagnóstico, terapéutica y epidemiología (preclínicas y laboratorios). Cursos prácticos (P) del nivel:', l: ['Patología diagnóstica y laboratorio clínico', 'Microbiología', 'Parasitología', 'Etología y bienestar animal', 'Biotecnologías y manejo reproductivo', 'Epidemiología y salud pública', 'Virología', 'Imagenología', 'Cirugía, anestesiología y manejo del dolor', 'Medicina interna de rumiantes'] },
            a: { t: 'Nivel avanzado · Periodos VII–X · 66 créditos', p: '«Analizar, evaluar, crear · Saber actuar». Intervención clínica y sanitaria, toma de decisiones en escenarios reales, rotaciones clínicas, One Health y trabajo de grado. Cursos prácticos (P) del nivel:', l: ['Urgencias y cuidados intensivos', 'Medicina interna de pequeños animales', 'Medicina interna en equinos', 'Medicina y producción aviar', 'Medicina y producción porcina', 'Fauna silvestre y exótica', 'Electivos DE I, II y III', 'Rotaciones Clínicas I, II y III'] }
        },
        delegacion: {
            s1: { t: 'Hasta 20 estudiantes por tutor', p: 'Morfología y microbiología, sin animales vivos en consultorio, unidad productiva o centro de fauna.' },
            s2: { t: 'Hasta 10 estudiantes por tutor', p: 'Prácticas con animales vivos en consultorio, unidad productiva o centro de fauna.' },
            s3: { t: 'Hasta 6 estudiantes por tutor', p: 'Procedimientos quirúrgicos, anestésicos e imagenológicos con pacientes.' },
            s4: { t: 'Hasta 4 estudiantes por médico veterinario supervisor', p: 'Rotaciones clínicas de producción, reproducción, One Health y profundización en escenarios externos con supervisión compartida.' },
            n1: { t: '1 · Observación · Periodos I–III', p: 'Observa procedimientos; realiza manejo y sujeción básica y examen clínico general guiado en animales sanos (Introducción a la MV, Anatomía, Fisiología, Semiología).', s: 'Directa y permanente del tutor.' },
            n2: { t: '2 · Ejecución asistida · Periodos IV–VI', p: 'Toma y procesa muestras; asiste procedimientos diagnósticos, anestésicos y quirúrgicos; elabora historias clínicas (Patología diagnóstica, Microbiología, Parasitología, Imagenología, Cirugía, Medicina interna de rumiantes).', s: 'Directa del tutor en cada procedimiento.' },
            n3: { t: '3 · Ejecución supervisada · Periodo VII', p: 'Realiza el abordaje clínico completo; propone diagnósticos diferenciales y planes terapéuticos y sanitarios (Medicinas internas por especie, Urgencias, Medicina aviar y porcina).', s: 'Directa; las decisiones terapéuticas son validadas por el médico veterinario.' },
            n4: { t: '4 · Autonomía supervisada · Periodos VIII–X', p: 'Gestiona casos y planes sanitarios de principio a fin; sustenta decisiones clínicas y sanitarias (Rotaciones clínicas de producción, reproducción, One Health y profundización).', s: 'Indirecta; el médico veterinario supervisor avala cada decisión y procedimiento invasivo.' }
        },
        practico: {
            b: { t: 'Nivel básico · 432 h directas', p: 'Periodos I–III · 7 cursos prácticos · 18 créditos P × 24 h directas por crédito (50 % del trabajo académico).' },
            i: { t: 'Nivel intermedio · 600 h directas', p: 'Periodos IV–VI · 10 cursos prácticos · 25 créditos P × 24 h directas por crédito.' },
            a: { t: 'Nivel avanzado · 552 h directas', p: 'Periodos VII–X · 9 cursos prácticos regulares · 23 créditos P × 24 h directas por crédito.' },
            r: { t: 'Rotaciones clínicas · 924 h directas (37 %)', p: '3 Rotaciones Clínicas de 8 créditos (VIII, IX y X). En cada una el estudiante inscribe 2 de los 6 cursos de rotación: 2 × 154 h = 308 h de trabajo directo, 80 % presencial en escenarios externos con convenio.' },
            c2: { t: 'Curso práctico de 2 créditos', p: '96 h de trabajo académico → 48 h directas y presenciales + 48 h independientes. 10 prácticas de 9,6 h (4,8 h directas + 4,8 h independientes).' },
            c3: { t: 'Curso práctico de 3 créditos', p: '144 h de trabajo académico → 72 h directas y presenciales + 72 h independientes. 10 prácticas de 14,4 h (7,2 h + 7,2 h).' },
            c4: { t: 'Curso práctico de 4 créditos', p: '192 h de trabajo académico → 96 h directas y presenciales + 96 h independientes. 10 prácticas de 19,2 h (9,6 h + 9,6 h).' }
        }
    };

    function render(id, key) {
        var d = DATA[id] && DATA[id][key];
        if (!d) return '';
        return '<h4>' + d.t + '</h4><p>' + d.p + '</p>' +
            (d.s ? '<p class="ig-sup">Supervisión: <span style="font-weight:500">' + d.s + '</span></p>' : '') +
            (d.l ? list(d.l) : '');
    }

    document.querySelectorAll('.ig[data-ig]').forEach(function (box) {
        var id = box.getAttribute('data-ig');
        var detail = box.querySelector('[data-ig-detail]');
        var btns = Array.prototype.slice.call(box.querySelectorAll('[data-ig-key]'));
        var pinned = null;
        var def = box.getAttribute('data-ig-default');

        function show(key) {
            btns.forEach(function (b) {
                var on = b.getAttribute('data-ig-key') === key;
                b.classList.toggle('is-active', on);
                b.setAttribute('aria-pressed', on ? 'true' : 'false');
            });
            // atenúa los otros niveles del currículo
            box.querySelectorAll('.ig-level').forEach(function (lv) {
                lv.classList.toggle('is-dim', !!key && ['macro', 'meso', 'micro'].indexOf(key) >= 0 && !lv.querySelector('[data-ig-key="' + key + '"]'));
            });
            if (detail) {
                detail.innerHTML = render(id, key);
                detail.classList.remove('ig-fade'); void detail.offsetWidth; detail.classList.add('ig-fade');
            }
        }

        btns.forEach(function (b) {
            b.setAttribute('type', 'button');
            b.setAttribute('aria-pressed', 'false');
            var key = b.getAttribute('data-ig-key');
            b.addEventListener('mouseenter', function () { if (!pinned) show(key); });
            b.addEventListener('focus', function () { if (!pinned) show(key); });
            b.addEventListener('click', function (e) {
                e.stopPropagation();
                if (pinned === key) { pinned = null; } else { pinned = key; }
                show(key);
            });
        });
        box.addEventListener('mouseleave', function () { if (!pinned && def) show(def); });
        if (def) show(def);
    });

    /* Puntos de estudiantes por tutor (delegación) */
    document.querySelectorAll('.ig-dots[data-n]').forEach(function (el) {
        var n = +el.getAttribute('data-n'), h = '<i class="is-tutor" title="Tutor"></i>';
        for (var i = 0; i < n; i++) h += '<i style="transition-delay:' + (i * 25) + 'ms"></i>';
        el.innerHTML = h;
    });

    /* Animación de entrada cuando la slide está en pantalla */
    var slides = document.querySelectorAll('.slide');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting && en.intersectionRatio > 0.5) en.target.classList.add('ig-on');
                else if (!en.isIntersecting) en.target.classList.remove('ig-on');
            });
        }, { threshold: [0, 0.5, 0.9] });
        slides.forEach(function (s) { if (s.querySelector('.ig')) io.observe(s); });
    } else {
        slides.forEach(function (s) { s.classList.add('ig-on'); });
    }
})();
