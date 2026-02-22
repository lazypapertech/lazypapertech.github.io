// ==============================
// UTILIDADES DE ORDEN Y FUSIÓN
// ==============================

function ordenar_dics(listaDeEjes) {
    return listaDeEjes.map(eje =>
        [...eje].sort((a, b) => a.start - b.start)
    );
}

function simplificarSegmentos(listaDeEjes) {
    const ejesOrdenados = ordenar_dics(listaDeEjes);

    return ejesOrdenados.map(eje => {
        if (eje.length === 0) return [];

        const resultado = [];
        let actual = { ...eje[0] };

        for (let i = 1; i < eje.length; i++) {
            const sig = eje[i];

            if (
                actual.filtro_color === sig.filtro_color &&
                actual.end === sig.start
            ) {
                // fusionar segmentos contiguos con mismo filtro
                actual.end = sig.end;
            } else {
                resultado.push(actual);
                actual = { ...sig };
            }
        }

        resultado.push(actual);
        return resultado;
    });
}

// ==============================
// MAPA VISUAL (núcleo del modelo)
// ==============================
/*
function construirMapaVisual(all_segments) {
    const mapa = new Map();

    for (const fila of all_segments) {
        for (const seg of fila) {
            const { start, end, filtro_color } = seg;

            const ini = Math.floor(start);
            const fin = Math.ceil(end) - 1;

            for (let s = ini; s <= fin; s++) {
                if (!mapa.has(s)) mapa.set(s, []);
                mapa.get(s).push(filtro_color);
            }
        }
    }

    // ordenar para que la comparación sea determinista
    for (const filtros of mapa.values()) {
        filtros.sort();
    }

    return mapa;
}

function arraysIguales(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
*/

function construirMapaVisual(all_segments) {
    const mapa = new Map();
    for (let filaIdx = 0; filaIdx < all_segments.length; filaIdx++) {
        const fila = all_segments[filaIdx];
        for (let segIdx = 0; segIdx < fila.length; segIdx++) {
            const seg = fila[segIdx];
            const { start, end, filtro_color } = seg;
            const ini = Math.floor(start);
            const fin = Math.floor(end);
            
            for (let s = ini; s <= fin; s++) {
                const segStart = Math.max(start, s);
                const segEnd = Math.min(end, s + 1);
                
                if (segEnd > segStart) {
                    if (!mapa.has(s)) mapa.set(s, []);
                    // Calcular qué parte del contenido original se muestra
                    const offsetEnSegmento = segStart - start;
                    mapa.get(s).push({
                        filtro_color,
                        desde: segStart - s,
                        hasta: segEnd - s,
                        filaIdx,
                        segIdx,
                        offsetContenido: offsetEnSegmento  // ← CLAVE: qué parte del video se muestra
                    });
                }
            }
        }
    }
    
    for (const ocupaciones of mapa.values()) {
        ocupaciones.sort((a, b) => {
            if (a.desde !== b.desde) return a.desde - b.desde;
            if (a.hasta !== b.hasta) return a.hasta - b.hasta;
            if (a.filaIdx !== b.filaIdx) return a.filaIdx - b.filaIdx;
            if (a.segIdx !== b.segIdx) return a.segIdx - b.segIdx;
            if (a.offsetContenido !== b.offsetContenido) return a.offsetContenido - b.offsetContenido;
            return a.filtro_color.localeCompare(b.filtro_color);
        });
    }
    return mapa;
}

function arraysIguales(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i].filtro_color !== b[i].filtro_color ||
            Math.abs(a[i].desde - b[i].desde) > 0.001 ||
            Math.abs(a[i].hasta - b[i].hasta) > 0.001 ||
            a[i].filaIdx !== b[i].filaIdx ||
            a[i].segIdx !== b[i].segIdx ||
            Math.abs(a[i].offsetContenido - b[i].offsetContenido) > 0.001) {
            return false;
        }
    }
    return true;
}

// ==============================
// FUNCIÓN PRINCIPAL
// ==============================

function obtenerValoresPendientesDePintar(estadoAnterior, estadoActual) {

    estadoAnterior = simplificarSegmentos(estadoAnterior);
    estadoActual   = simplificarSegmentos(estadoActual);

    const mapaA = construirMapaVisual(estadoAnterior);
    const mapaB = construirMapaVisual(estadoActual);

    const resultado = new Set();

    const segundos = new Set([
        ...mapaA.keys(),
        ...mapaB.keys()
    ]);

    for (const s of segundos) {
        const a = mapaA.get(s) || [];
        const b = mapaB.get(s) || [];

        if (!arraysIguales(a, b)) {
            resultado.add(s);
        }
    }

    return [...resultado].sort((a, b) => a - b);
}

// ==============================
// GESTIÓN DE VALORES PENDIENTES
// ==============================

let valores_pendientes = []; // SIEMPRE strings
let estado_actual = [];

function add_valores_pendientes(nuevos) {
    const set = new Set(valores_pendientes);

    for (const v of nuevos) {
        set.add(String(v));
    }

    valores_pendientes = Array.from(set)
        .map(Number)
        .sort((a, b) => a - b)
        .map(String);
}

function eliminar_valor_pendiente(valor) {
    valores_pendientes = valores_pendientes.filter(
        v => v !== String(valor)
    );
}
 















let s1 = [[{"start":1,"end":3.4,"filtro_color":"640,360640,360110011"},{"start":3.4,"end":10,"filtro_color":"640,360640,360110011"}]];

let s2 = [[{"start":1,"end":10,"filtro_color":"640,360640,360110011"}]];

let s4 = obtenerValoresPendientesDePintar(s1, s2);
console.log("s4:",s4);






// Datos de ejemplo
const data = [
  // Jefe
  [
    { start: 9, end: 12, start_value: "Reunión", end_value: "", property: "filename" },
    { start: 13, end: 17, start_value: "Revisar proyectos", end_value: "", property: "jefe" }
  ],
  // Empleado 1
  [
    { start: 10, end: 11, start_value: "Trabajar en tarea A", end_value: "", property: "empleado" },
    { start: 14, end: 15, start_value: "Trabajar en tarea B", end_value: "", property: "empleado" }
  ],
  // Empleado 2
  [
    { start: 11, end: 12, start_value: "Tarea X", end_value: "", property: "empleado" },
    { start: 16, end: 18, start_value: "Tarea Y", end_value: "", property: "empleado" }
  ],
  // Otro jefe
  [
    { start: 9, end: 12, start_value: "Planificación", end_value: "", property: "filename" }
  ],
  // Empleado 3
  [
    { start: 10, end: 11, start_value: "Analizar informe", end_value: "", property: "empleado" }
  ]
];
 

// Ejecutar
const resultado = agruparEmpleados(unica_regla.rectangulos);
console.log("nuevo000:",JSON.stringify(resultado, null, 2));


// Estado anterior: segmento de 0 a 10 con color rojo
let estadoAnterior = [
    [
        { start: 0, end: 10, filtro_color: "rojo" }
    ]
];

// Estado actual: mismo segmento movido de 2 a 12
let estadoActual = [
    [
        { start: 2, end: 12, filtro_color: "rojo" }
    ]
];


estadoAnterior = [[{"start":0,"end":3,"filtro_color":"400,180400,1801109011"}],[{"start":3,"end":13,"filtro_color":"640,360640,3601100"}],[{"start":1,"end":3.6,"filtro_color":"0,0400,1800.20.50011"}]];
 
estadoActual = [[{"start":1,"end":3,"filtro_color":"400,180400,1801109011"}],[{"start":3,"end":13,"filtro_color":"640,360640,3601100"}],[{"start":1,"end":3.6,"filtro_color":"0,0400,1800.20.50011"}]];



// Estado Anterior
estadoAnterior = [
    // Línea 0 (fondo): segmento rojo de 0 a 10
    [
        { start: 0, end: 10, anchor_point:9, filtro_color: "rojo" }
    ],
    // Línea 1 (encima): segmento azul de 3 a 5
    [
        { start: 3, end: 5, filtro_color: "azul" }
    ]
];

// Estado Actual
estadoActual = [
    // Línea 0 (fondo): IGUAL - segmento rojo de 0 a 10
    [
        { start: 0, end: 10, anchor_point:19, filtro_color: "rojo" }
    ],
    // Línea 1 (encima): MOVIDO - segmento azul de 6 a 8
    [
        { start: 6, end: 8.01, filtro_color: "azul" }
    ]
];
 

estadoAnterior = [
    // Línea 0 (fondo): segmento rojo de 0 a 10
    [
        { start: 0, end: 10, anchor_point:9, filtro_color: "rojo" }
    ],
    // Línea 1 (encima): segmento azul de 3 a 5
    [
        { start: 6, end: 8.01, filtro_color: "azul" }
    ]
];

// Estado Actual
estadoActual = [
    // Línea 0 (fondo): IGUAL - segmento rojo de 0 a 10
    [
        { start: 0, end: 10, anchor_point:19, filtro_color: "rojo" }
    ],
    // Línea 1 (encima): MOVIDO - segmento azul de 6 a 8
    [
        { start: 6, end: 8.01, filtro_color: "azul" }
    ]
];


const segundosARepintar = obtenerValoresPendientesDePintar(estadoAnterior, estadoActual);

console.log("Segundos a repintar:", segundosARepintar); 