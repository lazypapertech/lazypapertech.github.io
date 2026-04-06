 
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
      const siguiente = eje[i];

      if (
        actual.hash === siguiente.hash &&
        actual.end === siguiente.start
      ) {
        // fusionar
        actual.end = siguiente.end;
      } else {
        resultado.push(actual);
        actual = { ...siguiente };
      }
    }

    resultado.push(actual);
    return resultado;
  });
}


 



let valores_pendientes = [];
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

    valores_pendientes = valores_pendientes.filter(v => v !== String(valor));

}

function segmentoIgual(a, b) {

    return a.start === b.start && a.end === b.end && a.hash === b.hash;

}

function obtenerSegmentosCambiados(prev, curr) {

    const cambios = [];

    const p = prev.flat();

    const c = curr.flat();

    for (const s of p) {

        const match = c.find(x => x.hash === s.hash);

        if (!match || !segmentoIgual(s, match)) {

            cambios.push(s);

        }

    }

    for (const s of c) {

        const match = p.find(x => x.hash === s.hash);

        if (!match) {

            cambios.push(s);

        }

    }

    return cambios;

}

function segundosAfectados(seg) {

    const ini = Math.floor(seg.start);

    const fin = Math.ceil(seg.end) - 1;

    const res = [];

    for (let s = ini; s <= fin; s++) {

        res.push(s);

    }

    return res;

}

function segmentosCambiados(prev, curr) {

    const cambios = [];

    const flatPrev = prev.flat();

    const flatCurr = curr.flat();

    for (const p of flatPrev) {

        const match = flatCurr.find(c => c.hash === p.hash);

        if (!match || match.start !== p.start || match.end !== p.end) {

            cambios.push(p);

        }

    }

    for (const c of flatCurr) {

        const match = flatPrev.find(p => p.hash === c.hash);

        if (!match) {

            cambios.push(c);

        }

    }

    return cambios;

}

function construirMapaVisual(all_segments) {

    const mapa = new Map();

    for (const fila of all_segments) {

        for (const seg of fila) {

            const { start, end, hash } = seg;

            const sIni = Math.floor(start);

            const sFin = Math.ceil(end) - 1;

            for (let s = sIni; s <= sFin; s++) {

                if (!mapa.has(s)) mapa.set(s, []);

                mapa.get(s).push(hash);

            }

        }

    }

    for (const hashes of mapa.values()) {

        hashes.sort();

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

function obtenerValoresPendientesDePintar(estadoAnterior, estadoActual) {

    estadoAnterior = simplificarSegmentos(estadoAnterior);
    estadoActual = simplificarSegmentos(estadoActual);

    const resultado = new Set();

    // 🔴 1. Repintado forzado por movimiento temporal

    const segsCambiados = obtenerSegmentosCambiados(

        estadoAnterior,

        estadoActual

    );

    for (const seg of segsCambiados) {

        for (const s of segundosAfectados(seg)) {

            resultado.add(s);

        }

    }

    // 🔴 2. Repintado por cambios de solapamiento (aparición/desaparición)

    const mapaA = construirMapaVisual(estadoAnterior);

    const mapaB = construirMapaVisual(estadoActual);

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

/*
let estado1=[[{"start":0,"end":10,"hash":"640,360400,18010.500"}]];
let estado2=[[{"start":2,"end":12,"hash":"640,360400,18010.500"}],[{"start":0,"end":2,"hash":"640,360640,360110011"}]];
*/
let estado1=[[{"start":0,"end":4,"hash":"640,360320,18010.500"}],[{"start":4,"end":10,"hash":"640,360320,18010.500"}]];
let estado2=[[{"start":0,"end":4,"hash":"640,360320,18010.500"},{"start":5,"end":11,"hash":"640,360320,18010.500"}]];


//let nuevo2=obtenerValoresPendientesDePintar(estado1,estado2);
//console.log("nuevo2:",nuevo2);