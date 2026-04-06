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

function segundosAfectados(seg) {
    // Un segundo S (intervalo [S, S+1)) está afectado si el segmento [start, end) lo intersecta
    const primerSegundo = Math.floor(seg.start);
    const ultimoSegundo = Math.ceil(seg.end) - 1;
    
    const res = [];
    
    for (let s = primerSegundo; s <= ultimoSegundo; s++) {
        // ¿El intervalo [s, s+1) intersecta con [seg.start, seg.end)?
        const inicioInterseccion = Math.max(s, seg.start);
        const finInterseccion = Math.min(s + 1, seg.end);
        
        if (inicioInterseccion < finInterseccion) {
            res.push(s);
        }
    }
    
    return res;
}

// Construye un mapa: segundo -> Set de hashes únicos
function construirMapaVisual(estado) {
    const mapa = new Map();
    
    for (const fila of estado) {
        for (const seg of fila) {
            const segundos = segundosAfectados(seg);
            
            for (const s of segundos) {
                if (!mapa.has(s)) {
                    mapa.set(s, new Set());
                }
                mapa.get(s).add(seg.hash);
            }
        }
    }
    
    // Convertir Sets a arrays ordenados para comparación
    for (const [segundo, hashes] of mapa.entries()) {
        const hashesArray = Array.from(hashes).sort();
        mapa.set(segundo, hashesArray);
    }
    
    return mapa;
}

// Compara dos arrays de hashes
function hashesIguales(hashesA, hashesB) {
    if (hashesA.length !== hashesB.length) return false;
    
    for (let i = 0; i < hashesA.length; i++) {
        if (hashesA[i] !== hashesB[i]) return false;
    }
    
    return true;
}

function obtenerValoresPendientesDePintar(estadoAnterior, estadoActual) {
    const resultado = new Set();
    
    // Construir mapas visuales: segundo -> hashes únicos
    const mapaAnterior = construirMapaVisual(estadoAnterior);
    const mapaActual = construirMapaVisual(estadoActual);
    
    // Obtener todos los segundos únicos
    const todosLosSegundos = new Set([
        ...mapaAnterior.keys(),
        ...mapaActual.keys()
    ]);
    
    // Comparar cada segundo
    for (const segundo of todosLosSegundos) {
        const hashesAnterior = mapaAnterior.get(segundo) || [];
        const hashesActual = mapaActual.get(segundo) || [];
        
        // Si los hashes únicos no coinciden, ese segundo necesita repintarse
        if (!hashesIguales(hashesAnterior, hashesActual)) {
            resultado.add(segundo);
        }
    }
    
    return Array.from(resultado).sort((a, b) => a - b);
}