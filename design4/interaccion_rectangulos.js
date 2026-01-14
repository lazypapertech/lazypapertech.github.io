
function iniciarArrastreTouch(e, rect) {
    if (e.target.classList.contains('extremo-blanco')) return;

    opacidad_desplazamiento(rect);

    arrastreActivo = true;
    rectanguloArrastrado = rect;
    rectanguloArrastrado.classList.add('dragging');

    const rectContenedor = contenedor.getBoundingClientRect();

    // Detectamos si es touch o mouse
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;

    ultimoMouseXRelativo = clientX - rectContenedor.left + scrollWrapper.scrollLeft; 
    ultimaDireccion = 0;

    // Guardamos posición inicial del rectángulo dentro del contenedor
    posicionInicialRect = parseFloat(rectanguloArrastrado.dataset.xReal);

    // Guardamos offset inicial del mouse/touch relativo al contenedor
    offsetInicialXContenedor = clientX - rectContenedor.left + scrollWrapper.scrollLeft;

    //e.preventDefault();
    if (e.touches && e.touches.length > 0) {
    	if (e.cancelable) e.preventDefault();
    } 	
 
    document.addEventListener('touchmove', moverRectanguloTouch, { passive: false });
    document.addEventListener('touchend', finalizarArrastreTouch);
}


 
 

 
 

 

 
let offsetDentroRectangulo = 0;
 

 

 

 
 
let offsetInicialXContenedor = 0;
let ultimoMouseXRelativo = null;
let ultimaDireccion = 0;
 
// Auto-scroll
let autoScrollActivo = false;
let direccionAutoScroll = 0; // -1 izquierda, 1 derecha  
  
let ultimoTimestampAutoScroll = null;
 
 
let offsetRectanguloEnViewport = 0;


 

function iniciarArrastre(e, rect) {
console.log("INICIANDO ARRASTRE");
  if (e.target.classList.contains('extremo-blanco')) return;

  opacidad_desplazamiento(rect);

  arrastreActivo = true;
  rect.dataset.arrastrando = "1";   // ← estado propio del rect
  rect.classList.add('dragging');

  const rectContenedor = contenedor.getBoundingClientRect();
  ultimoMouseXRelativo =
      e.clientX - rectContenedor.left + scrollWrapper.scrollLeft;

  posicionInicialRect = parseFloat(rect.dataset.xReal);
  offsetInicialXContenedor =
      e.clientX - rectContenedor.left + scrollWrapper.scrollLeft;

  e.preventDefault();

  function mover(ev) {
    moverRectangulo(ev, rect);   // ← siempre mismo rect del closure
  }

  function finalizar(ev) {
    finalizarArrastre(ev, rect); // ← mismo rect
    document.removeEventListener('mousemove', mover);
    document.removeEventListener('mouseup', finalizar);
  }

  document.addEventListener('mousemove', mover, { passive: false });
  document.addEventListener('mouseup', finalizar);
}

 
 
 

function moverRectanguloTouch(e) {
    if (!arrastreActivo || !rectanguloArrastrado) return;
    
    // Prevenir scroll del navegador
    if (e.cancelable) e.preventDefault();
    
    const touch = e.touches[0];
    if (!touch) return;
    
    console.log("MOVIENDO TOUCH...");
    saveState();
    
    const rectContenedor = contenedor.getBoundingClientRect();
    const mouseXRelativo = touch.clientX - rectContenedor.left + scrollWrapper.scrollLeft;
    
    // Dirección instantánea
    if (ultimoMouseXRelativo !== null) {
        const deltaInstantaneo = mouseXRelativo - ultimoMouseXRelativo;
        if (deltaInstantaneo !== 0) ultimaDireccion = Math.sign(deltaInstantaneo);
    }
    ultimoMouseXRelativo = mouseXRelativo;
    
    const rangoBorde = 60;
    
    // Detectar posición del TOUCH respecto al viewport
    const touchPosEnViewport = touch.clientX - rectContenedor.left;
    const distanciaMouseIzquierda = touchPosEnViewport;
    const distanciaMouseDerecha = rectContenedor.width - touchPosEnViewport;
    
    // Actualizar posición del rectángulo SIEMPRE según el touch
    const deltaX = mouseXRelativo - offsetInicialXContenedor;
    let nuevaPosicion = posicionInicialRect + deltaX;
    
    // Snapping y límites
    nuevaPosicion = Math.round((nuevaPosicion - PADDING) / SEGMENTO) * SEGMENTO + PADDING;
    const maxPos = 60 * PASO_DELTA * MINUTOS_TOTALES * SEGMENTO + PADDING;
    nuevaPosicion = Math.min(Math.max(nuevaPosicion, PADDING), maxPos - rectanguloArrastrado.offsetWidth);
    
    // Asegurarse de que siempre haya al menos 80px visibles
    const minVisible = 60;
    if (nuevaPosicion + rectanguloArrastrado.offsetWidth - scrollWrapper.scrollLeft < minVisible) {
        nuevaPosicion = scrollWrapper.scrollLeft + minVisible - rectanguloArrastrado.offsetWidth;
    }
    if (nuevaPosicion - scrollWrapper.scrollLeft > rectContenedor.width - minVisible) {
        nuevaPosicion = scrollWrapper.scrollLeft + rectContenedor.width - minVisible;
    }
    
    const indice = parseInt(rectanguloArrastrado.dataset.indice);
    
    // SIEMPRE actualizar la posición absoluta (se usa durante auto-scroll)
    posicionAbsolutaInicial = nuevaPosicion;
    
    aplicarFisicaEmpuje(indice, nuevaPosicion);
    actualizarPosicionesVisuales();
    
    // Detectar zona de auto-scroll según POSICIÓN DEL TOUCH en el viewport
    if (distanciaMouseIzquierda < rangoBorde && ultimaDireccion < 0) {
        // Touch cerca del borde izquierdo - scroll hacia la IZQUIERDA
        if (!autoScrollActivo) {
            autoScrollActivo = true;
            direccionAutoScroll = -1;
            ultimoTimestampAutoScroll = null;
            requestAnimationFrame(autoScrollHorizontalContinuo);
        } else if (direccionAutoScroll !== -1) {
            direccionAutoScroll = -1;
        }
    } else if (distanciaMouseDerecha < rangoBorde && ultimaDireccion > 0) {
        // Touch cerca del borde derecho - scroll hacia la DERECHA
        if (!autoScrollActivo) {
            autoScrollActivo = true;
            direccionAutoScroll = 1;
            ultimoTimestampAutoScroll = null;
            requestAnimationFrame(autoScrollHorizontalContinuo);
        } else if (direccionAutoScroll !== 1) {
            direccionAutoScroll = 1;
        }
    } else {
        // Fuera de zonas de auto-scroll
        autoScrollActivo = false;
        direccionAutoScroll = 0;
    }
}

function moverRectangulo(e,rect) {
    if (!arrastreActivo || !rect) return;
    e.preventDefault();
    console.log("MOVIENDO...");
    saveState();
    
    const rectContenedor = contenedor.getBoundingClientRect();
    const mouseXRelativo = e.clientX - rectContenedor.left + scrollWrapper.scrollLeft;
    
    // Dirección instantánea
    if (ultimoMouseXRelativo !== null) {
        const deltaInstantaneo = mouseXRelativo - ultimoMouseXRelativo;
        if (deltaInstantaneo !== 0) ultimaDireccion = Math.sign(deltaInstantaneo);
    }
    ultimoMouseXRelativo = mouseXRelativo;
    
    const rangoBorde = 60;
    
    // CAMBIO CLAVE: detectar posición del MOUSE respecto al viewport
    const mousePosEnViewport = e.clientX - rectContenedor.left;
    const distanciaMouseIzquierda = mousePosEnViewport;
    const distanciaMouseDerecha = rectContenedor.width - mousePosEnViewport;
    
    // Actualizar posición del rectángulo SIEMPRE según el mouse
    const deltaX = mouseXRelativo - offsetInicialXContenedor;
    let nuevaPosicion = posicionInicialRect + deltaX;
    
    // Snapping y límites
    nuevaPosicion = Math.round((nuevaPosicion - PADDING) / SEGMENTO) * SEGMENTO + PADDING;
    const maxPos = 60 * PASO_DELTA * MINUTOS_TOTALES * SEGMENTO + PADDING;
    nuevaPosicion = Math.min(Math.max(nuevaPosicion, PADDING), maxPos - rect.offsetWidth);

// Asegurarse de que siempre haya al menos 60px visibles
const minVisible = 80;
if (nuevaPosicion + rect.offsetWidth - scrollWrapper.scrollLeft < minVisible) {
    nuevaPosicion = scrollWrapper.scrollLeft + minVisible - rect.offsetWidth;
}
if (nuevaPosicion - scrollWrapper.scrollLeft > rectContenedor.width - minVisible) {
    nuevaPosicion = scrollWrapper.scrollLeft + rectContenedor.width - minVisible;
}

    
    const indice = parseInt(rect.dataset.indice);
    
    // SIEMPRE actualizar la posición absoluta (se usa durante auto-scroll)
    posicionAbsolutaInicial = nuevaPosicion;
    
    aplicarFisicaEmpuje(indice, nuevaPosicion);
    actualizarPosicionesVisuales();
    
    // Detectar zona de auto-scroll según POSICIÓN DEL MOUSE en el viewport
    if (distanciaMouseIzquierda < rangoBorde && ultimaDireccion < 0) {
        // Mouse cerca del borde izquierdo - scroll hacia la IZQUIERDA
        if (!autoScrollActivo) {
            autoScrollActivo = true;
            direccionAutoScroll = -1;
            ultimoTimestampAutoScroll = null;
            requestAnimationFrame(autoScrollHorizontalContinuo);
        } else if (direccionAutoScroll !== -1) {
            direccionAutoScroll = -1;
        }
    } else if (distanciaMouseDerecha < rangoBorde && ultimaDireccion > 0) {
        // Mouse cerca del borde derecho - scroll hacia la DERECHA
        if (!autoScrollActivo) {
            autoScrollActivo = true;
            direccionAutoScroll = 1;
            ultimoTimestampAutoScroll = null;
            requestAnimationFrame(autoScrollHorizontalContinuo);
        } else if (direccionAutoScroll !== 1) {
            direccionAutoScroll = 1;
        }
    } else {
        // Fuera de zonas de auto-scroll
        autoScrollActivo = false;
        direccionAutoScroll = 0;
    }
}

function autoScrollHorizontalContinuo(timestamp) { 
    if (!autoScrollActivo || direccionAutoScroll === 0) return; 
 
    if (ultimoTimestampAutoScroll === null) ultimoTimestampAutoScroll = timestamp; 
    const deltaTime = (timestamp - ultimoTimestampAutoScroll) / 1000; // segundos 
    ultimoTimestampAutoScroll = timestamp; 
 
    const velocidadPxPorSeg = 800; // por ejemplo, 800px/s constante 
    const delta = velocidadPxPorSeg * deltaTime; 
 
    const maxScroll = scrollWrapper.scrollWidth - scrollWrapper.clientWidth; 
    
    // Guardar scroll anterior
    const scrollAnterior = scrollWrapper.scrollLeft;
 
    if (direccionAutoScroll === 1) { 
        scrollWrapper.scrollLeft = Math.min(scrollWrapper.scrollLeft + delta, maxScroll); 
    } else if (direccionAutoScroll === -1) { 
        scrollWrapper.scrollLeft = Math.max(scrollWrapper.scrollLeft - delta, 0); 
    } 
    
    // Calcular cuánto SE MOVIÓ REALMENTE el scroll
    const scrollRealMovido = scrollWrapper.scrollLeft - scrollAnterior;
  
    // Mover el rectángulo la misma cantidad que se movió el scroll
    if (selected_rect && posicionAbsolutaInicial !== undefined) {  
        const indice = selected_rect.dataset.indice;
        
        // Avanzar la posición absoluta según cuánto se movió el scroll
        posicionAbsolutaInicial += scrollRealMovido;
        
        // Aplicar límites
        const maxPos = 60 * PASO_DELTA * MINUTOS_TOTALES * SEGMENTO + PADDING;
        posicionAbsolutaInicial = Math.min(Math.max(posicionAbsolutaInicial, PADDING), maxPos);
        
        aplicarFisicaEmpuje(indice, posicionAbsolutaInicial); 
        actualizarPosicionesVisuales(); 
    } 
  
    requestAnimationFrame(autoScrollHorizontalContinuo); 
}
function autoScrollHorizontalContinuo_0(timestamp) { 
    const index_row = selected_rect.dataset.index_row;
    if (!autoScrollActivo || direccionAutoScroll === 0) return; 

    if (ultimoTimestampAutoScroll === null) ultimoTimestampAutoScroll = timestamp; 
    const deltaTime = (timestamp - ultimoTimestampAutoScroll) / 1000; // segundos 
    ultimoTimestampAutoScroll = timestamp; 

    const velocidadPxPorSeg = 800; // px/s
    const delta = velocidadPxPorSeg * deltaTime; 

    const maxScroll = scrollWrapper.scrollWidth - scrollWrapper.clientWidth; 
    
    // Guardar scroll anterior
    const scrollAnterior = scrollWrapper.scrollLeft;

    if (direccionAutoScroll === 1) { 
        scrollWrapper.scrollLeft = Math.min(scrollWrapper.scrollLeft + delta, maxScroll); 
    } else if (direccionAutoScroll === -1) { 
        scrollWrapper.scrollLeft = Math.max(scrollWrapper.scrollLeft - delta, 0); 
    } 
    
    // Calcular cuánto SE MOVIÓ REALMENTE el scroll
    const scrollRealMovido = scrollWrapper.scrollLeft - scrollAnterior;

    // Mover el rectángulo la misma cantidad que se movió el scroll
    if (rectanguloArrastrado && posicionAbsolutaInicial !== undefined) { 
        const indice = parseInt(rectanguloArrastrado.dataset.indice); 

        const grupo = rectangulos[index_row];
        if (!Array.isArray(grupo)) return;

        // Avanzar la posición absoluta según cuánto se movió el scroll
        posicionAbsolutaInicial += scrollRealMovido;

        // Aplicar límites
        const maxPos = 60 * PASO_DELTA * MINUTOS_TOTALES * SEGMENTO + PADDING;
        posicionAbsolutaInicial = Math.min(
            Math.max(posicionAbsolutaInicial, PADDING),
            maxPos - rectanguloArrastrado.offsetWidth
        );

        // Aplicar física solo dentro de la fila
        aplicarFisicaEmpuje(indice, posicionAbsolutaInicial, index_row); 
        actualizarPosicionesVisuales(); 
    } 

    requestAnimationFrame(autoScrollHorizontalContinuo); 
}

 
 
 
function finalizarArrastre(e, rect) {

  autoScrollActivo = false;
  direccionAutoScroll = 0;
  ultimoTimestampAutoScroll = null;

  if (rect && rect.dataset.arrastrando === "1") {

    rect.classList.remove('dragging');
    rect.dataset.arrastrando = "0";

    actualizarEstadoGlobal();
    crearBotonMas();
  }

  arrastreActivo = false;

  saveState();
  opacidad_reposo(rect);
  ajustarRectangulosMove();
}

 

  

 

function autoScrollHorizontal() {
    const scrollRect = scrollWrapper.getBoundingClientRect();
    const rect = rectanguloArrastrado.getBoundingClientRect();

    const edge = 60;
    const speed = 16;

    const tocaIzq = rect.left < scrollRect.left + edge;
    const tocaDer = rect.right > scrollRect.right - edge;

    // Caso normal
    if (tocaDer && !tocaIzq) {
        scrollWrapper.scrollLeft += speed;
        return;
    }

    if (tocaIzq && !tocaDer) {
        scrollWrapper.scrollLeft -= speed;
        return;
    }

    // ⚠️ Caso especial: toca ambos lados
    if (tocaIzq && tocaDer) {
        if (ultimaDireccion > 0) {
            scrollWrapper.scrollLeft += speed;
        } else if (ultimaDireccion < 0) {
            scrollWrapper.scrollLeft -= speed;
        }
    }
}

  
 
 

function finalizarArrastreTouch() { 
    autoScrollActivo = false;
    direccionAutoScroll = 0;
    ultimoTimestampAutoScroll = null;
 

    if (rectanguloArrastrado) {
        rectanguloArrastrado.classList.remove('dragging');
        actualizarEstadoGlobal(); // descomentar si lo necesitas
        console.log("finalizarArrastreTouch: ", finalizarArrastreTouch);
        crearBotonMas();
    }

    arrastreActivo = false;
    rectanguloArrastrado = null;
 
    document.removeEventListener('touchmove', moverRectanguloTouch);
    document.removeEventListener('touchend', finalizarArrastreTouch);
    //document.removeEventListener('touchcancel', finalizarArrastreTouch);
    saveState();
    opacidad_reposo(selected_rect);
}


 
function aplicarFisicaEmpuje(indice, nuevaPosicion) {

  const index_row = selected_rect.dataset.index_row;

  const grupo = rectangulos[index_row];
  if (!Array.isArray(grupo)) return;

  const rectActual = grupo[indice];
  if (!rectActual) return;

  const posicionActual = parseFloat(rectActual.posicion);
  const delta = nuevaPosicion - posicionActual;

  // Copiar posiciones del grupo
  let posicionesNuevas = grupo.map(r => parseFloat(r.posicion));

  // actualizar posición del rect movido
  posicionesNuevas[indice] = nuevaPosicion;

  // ➜ Mover hacia la derecha (empuja siguiente)
  if (delta > 0) {

    for (let i = indice + 1; i < grupo.length; i++) {

      const anchoAnterior = parseFloat(grupo[i - 1].ancho);
      const finAnterior   = posicionesNuevas[i - 1] + anchoAnterior;

      if (finAnterior > posicionesNuevas[i]) {
        posicionesNuevas[i] = finAnterior;
      } else {
        break;
      }
    }
  }

  // ➜ Mover hacia la izquierda (empuja anteriores)
  else if (delta < 0) {

    for (let i = indice - 1; i >= 0; i--) {

      const anchoActual = parseFloat(grupo[i].ancho);
      const inicioSig   = posicionesNuevas[i + 1];
      const finActual   = posicionesNuevas[i] + anchoActual;

      if (finActual > inicioSig) {
        posicionesNuevas[i] = inicioSig - anchoActual;
      } else {
        break;
      }
    }

    // === Control contra la pared ===
    let indiceConflicto = -1;

    for (let i = 0; i < grupo.length; i++) {
      if (posicionesNuevas[i] < PADDING) {
        indiceConflicto = i;
        break;
      }
    }

    if (indiceConflicto !== -1) {

      posicionesNuevas[indiceConflicto] = PADDING;

      // Reajustar empujando todo a la derecha
      for (let i = indiceConflicto + 1; i < grupo.length; i++) {

        const anchoAnterior = parseFloat(grupo[i - 1].ancho);
        const finAnterior   = posicionesNuevas[i - 1] + anchoAnterior;

        if (posicionesNuevas[i] < finAnterior) {
          posicionesNuevas[i] = finAnterior;
        }
      }
    }
  }

  // === Verificación final (sin solapamientos) ===
  for (let i = 0; i < grupo.length - 1; i++) {

    const anchoActual = parseFloat(grupo[i].ancho);
    const finActual   = posicionesNuevas[i] + anchoActual;
    const inicioSig   = posicionesNuevas[i + 1];

    if (finActual > inicioSig) {
      posicionesNuevas[i + 1] = finActual;
    }
  }

  // === Aplicar cambios al grupo ===
  for (let i = 0; i < grupo.length; i++) {

    grupo[i].posicion = posicionesNuevas[i];

    if (grupo[i].elemento) {
      grupo[i].elemento.dataset.xReal = posicionesNuevas[i];
    }
  }

  console.log(
    "rectangulos grupo[" + index_row + "]:",
    JSON.stringify(grupo)
  );
}

  
/*
function aplicarFisicaEmpuje(indice,nuevaPosicion) { 
    const rectActual = rectangulos[indice];

    //recibir rect como input	
    //obtener rect.property y rect.index_item -> obtener index_regla
    //unica_regla.rectangulos[index_regla]

    const posicionActual = parseFloat(rectActual.posicion);
    const delta = nuevaPosicion - posicionActual;

    // Copiar todas las posiciones actuales
    let posicionesNuevas = rectangulos.map(r => parseFloat(r.posicion));
    posicionesNuevas[indice] = nuevaPosicion;

    if (delta > 0) {
        // Moviendo a la derecha - empujar rectángulos a la derecha
        for (let i = indice + 1; i < rectangulos.length; i++) {
            const anchoAnterior = parseFloat(rectangulos[i - 1].ancho);
            const finAnterior = posicionesNuevas[i - 1] + anchoAnterior;
            
            if (finAnterior > posicionesNuevas[i]) {
                posicionesNuevas[i] = finAnterior;
            } else {
                break;
            }
        }
    } else if (delta < 0) {
        // Moviendo a la izquierda - empujar rectángulos a la izquierda
        for (let i = indice - 1; i >= 0; i--) {
            const anchoActual = parseFloat(rectangulos[i].ancho);
            const inicioSiguiente = posicionesNuevas[i + 1];
            const finActual = posicionesNuevas[i] + anchoActual;
            
            if (finActual > inicioSiguiente) {
                posicionesNuevas[i] = inicioSiguiente - anchoActual;
            } else {
                break;
            }
        }

        // Verificar si algún rectángulo se salió de la pared
        let necesitaReajuste = false;
        let indiceConflicto = -1;
        for (let i = 0; i < rectangulos.length; i++) {
            if (posicionesNuevas[i] < PADDING) {
                necesitaReajuste = true;
                indiceConflicto = i;
                break;
            }
        }

        if (necesitaReajuste) {
            // Reajustar desde la pared hacia la derecha
            posicionesNuevas[indiceConflicto] = PADDING;
            
            // Propagar hacia la derecha empujando todos los rectángulos
            for (let i = indiceConflicto + 1; i < rectangulos.length; i++) {
                const anchoAnterior = parseFloat(rectangulos[i - 1].ancho);
                const finAnterior = posicionesNuevas[i - 1] + anchoAnterior;
                
                // Siempre pegar al anterior cuando hay reajuste desde la pared
                if (posicionesNuevas[i] < finAnterior) {
                    posicionesNuevas[i] = finAnterior;
                }
            }
        }
    }

    // Verificación final: asegurar que NO haya superposiciones
    for (let i = 0; i < rectangulos.length - 1; i++) {
        const anchoActual = parseFloat(rectangulos[i].ancho);
        const finActual = posicionesNuevas[i] + anchoActual;
        const inicioSiguiente = posicionesNuevas[i + 1];
        
        if (finActual > inicioSiguiente) {
            // Hay superposición, forzar separación
            posicionesNuevas[i + 1] = finActual;
        }
    }

    // Aplicar todas las posiciones
    for (let i = 0; i < rectangulos.length; i++) {
        rectangulos[i].posicion = posicionesNuevas[i];
        rectangulos[i].elemento.dataset.xReal = posicionesNuevas[i];
    }
    console.log("000000rectangulos: ",JSON.stringify(rectangulos));
}
*/
 
 
 
 

function iniciarRedimensionTouch(e, rect, lado) {
    if (!e.touches || e.touches.length === 0) return;

    console.log("REDIMENSION TOUCH");
    redimensionActiva = true;
    rectanguloRedimensionado = rect;
    ladoRedimension = lado;

    // Guardar estado inicial
    scrollInicialAuto = scrollWrapper.scrollLeft;
    anchoInicialAuto = anchoInicial;

    if (ladoRedimension === 'derecho') {
        bordeFijoAuto = posicionInicialRectRedim; // borde izquierdo fijo
    } else {
        bordeFijoAuto = posicionInicialRectRedim + anchoInicial; // borde derecho fijo
    }

    scrollInicial = scrollWrapper.scrollLeft;

    // Posición inicial del touch
    posicionInicialMouse = e.touches[0].clientX;

    anchoInicial = parseFloat(rect.dataset.widthReal);
    posicionInicialRectRedim = parseFloat(rect.dataset.xReal);

    // Eventos touch
    document.addEventListener('touchmove', redimensionarRectanguloTouch, { passive: false });
    document.addEventListener('touchend', finalizarRedimensionTouch);

    e.stopPropagation();
    //e.preventDefault();
    if (e.touches && e.touches.length > 0) {
    	if (e.cancelable) e.preventDefault();
    }
}
 

 



let scrollInicial;

 
let bordeFijoAuto = 0; 
let anchoInicialAuto = 0;
let scrollInicialAuto = 0;
 
function iniciarRedimension(e, rect, lado) {
    redimensionActiva = true;
    rectanguloRedimensionado = rect;
    ladoRedimension = lado;

    scrollInicialAuto = scrollWrapper.scrollLeft;
    anchoInicialAuto = anchoInicial;

    if (ladoRedimension === 'derecho') {
    	bordeFijoAuto = posicionInicialRectRedim; // borde izquierdo fijo
    } else {
    	bordeFijoAuto = posicionInicialRectRedim + anchoInicial; // borde derecho fijo
    } 


    scrollInicial = scrollWrapper.scrollLeft;


    posicionInicialMouse = e.clientX;
    anchoInicial = parseFloat(rect.dataset.widthReal);
    posicionInicialRectRedim = parseFloat(rect.dataset.xReal); 

    document.addEventListener('mousemove', redimensionarRectangulo);
    document.addEventListener('mouseup', finalizarRedimension);

    e.stopPropagation();
    e.preventDefault();
}

 

 
let ultimoMouseXPantalla = 0;
 


function autoScrollHorizontalContinuoRedim_0(timestamp) {
    if (!autoScrollActivo || direccionAutoScroll === 0) return;
 
    if (ultimoTimestampAutoScroll === null)
        ultimoTimestampAutoScroll = timestamp;

    const deltaTime = (timestamp - ultimoTimestampAutoScroll) / 1000;
    ultimoTimestampAutoScroll = timestamp;

    const velocidadPxPorSeg = 800;
    const delta = velocidadPxPorSeg * deltaTime;

    const maxScroll = scrollWrapper.scrollWidth - scrollWrapper.clientWidth;

    if (direccionAutoScroll === 1) {
        scrollWrapper.scrollLeft = Math.min(
            scrollWrapper.scrollLeft + delta,
            maxScroll
        );
    } else {
        scrollWrapper.scrollLeft = Math.max(
            scrollWrapper.scrollLeft - delta,
            0
        );
    }

    if (selected_rect) {
        const indice = selected_rect.dataset.indice;
        const rectActual = selected_rect;

        if (ladoRedimension === 'derecho' && direccionAutoScroll === 1) {
            const bordeVisible =
                scrollWrapper.scrollLeft +
                scrollWrapper.clientWidth -
                PADDING;

            let nuevoAncho = bordeVisible - bordeFijoAuto;
            if (nuevoAncho < SEGMENTO) nuevoAncho = SEGMENTO;

            // ⬅️ GUARDAR ANCHO ANTERIOR
            const anchoAnterior = parseFloat(rectActual.ancho);

            rectActual.ancho = nuevoAncho;
            rectActual.dataset.widthReal = nuevoAncho;

            // ⬅️ DETECTAR COLISIÓN Y EMPUJAR
            const posActual = parseFloat(rectActual.posicion);
            if (nuevoAncho > anchoAnterior && indice < rectangulos.length - 1) {
                const rectDerecha = rectangulos[indice + 1];
                const posDerecha = parseFloat(rectDerecha.posicion);

                if (posActual + nuevoAncho >= posDerecha) {
                    const desplazamiento = (posActual + nuevoAncho) - posDerecha;
                    aplicarEmpujeRedimension(indice + 1, desplazamiento, 'derecha');
                } 
            } 
        }


        if (ladoRedimension === 'derecho' && direccionAutoScroll === -1) {
            const bordeVisibleDerecho = scrollWrapper.scrollLeft + 60;
            const posActual = parseFloat(rectActual.posicion);

            let nuevoAncho = bordeVisibleDerecho - posActual;
            if (nuevoAncho < SEGMENTO) nuevoAncho = SEGMENTO;

            rectActual.ancho = nuevoAncho;
            rectActual.elemento.dataset.widthReal = nuevoAncho;
        }
        if (ladoRedimension === 'izquierdo' && direccionAutoScroll === -1) {
            const bordeVisible = scrollWrapper.scrollLeft + PADDING;

            let nuevaPos = bordeVisible;

            let nuevoAncho = bordeFijoAuto - nuevaPos;
            if (nuevoAncho < SEGMENTO) nuevoAncho = SEGMENTO;

            // ⬅️ GUARDAR POSICIÓN ANTERIOR
            const posAnterior = parseFloat(rectActual.posicion);

            rectActual.posicion = nuevaPos;
            rectActual.elemento.dataset.xReal = nuevaPos;
            rectActual.ancho = nuevoAncho;
            rectActual.elemento.dataset.widthReal = nuevoAncho;

            // ⬅️ DETECTAR COLISIÓN Y EMPUJAR (lado izquierdo)
            if (nuevaPos < posAnterior && indice > 0) {
                const rectIzquierda = rectangulos[indice - 1];
                const bordeDerechoIzq = parseFloat(rectIzquierda.posicion) + 
                                       parseFloat(rectIzquierda.ancho);

                if (nuevaPos < bordeDerechoIzq) {
                    const desplazamiento = bordeDerechoIzq - nuevaPos;
                    aplicarEmpujeRedimension(indice - 1, desplazamiento, 'izquierda');
                }
            }
        }
        if (ladoRedimension === 'izquierdo' && direccionAutoScroll === 1) {
            const bordeVisibleIzquierdo = scrollWrapper.scrollLeft + scrollWrapper.clientWidth - 60;
            const bordeDerechoFijo = bordeFijoAuto;

            let nuevoAncho = bordeDerechoFijo - bordeVisibleIzquierdo;
            if (nuevoAncho < SEGMENTO) nuevoAncho = SEGMENTO;

            let nuevaPos = bordeDerechoFijo - nuevoAncho;

            rectActual.posicion = nuevaPos;
            rectActual.elemento.dataset.xReal = nuevaPos;
            rectActual.ancho = nuevoAncho;
            rectActual.elemento.dataset.widthReal = nuevoAncho;
        }

        actualizarPosicionesVisuales();
    }

    requestAnimationFrame(autoScrollHorizontalContinuoRedim);
}

function autoScrollHorizontalContinuoRedim(timestamp) {
    const index_row = selected_rect.dataset.index_row;
    if (!autoScrollActivo || direccionAutoScroll === 0) return;

    if (ultimoTimestampAutoScroll === null)
        ultimoTimestampAutoScroll = timestamp;

    const deltaTime = (timestamp - ultimoTimestampAutoScroll) / 1000;
    ultimoTimestampAutoScroll = timestamp;

    const velocidadPxPorSeg = 800;
    const delta = velocidadPxPorSeg * deltaTime;

    const maxScroll = scrollWrapper.scrollWidth - scrollWrapper.clientWidth;

    if (direccionAutoScroll === 1) {
        scrollWrapper.scrollLeft = Math.min(
            scrollWrapper.scrollLeft + delta,
            maxScroll
        );
    } else {
        scrollWrapper.scrollLeft = Math.max(
            scrollWrapper.scrollLeft - delta,
            0
        );
    }

    if (rectanguloRedimensionado) {

        const indice = parseInt(rectanguloRedimensionado.dataset.indice);

        const grupo = rectangulos[index_row];
        if (!Array.isArray(grupo)) return;

        const rectActual = grupo[indice];
        if (!rectActual) return;

        if (ladoRedimension === 'derecho' && direccionAutoScroll === 1) {
            const bordeVisible =
                scrollWrapper.scrollLeft +
                scrollWrapper.clientWidth -
                PADDING;

            let nuevoAncho = bordeVisible - bordeFijoAuto;
            if (nuevoAncho < SEGMENTO) nuevoAncho = SEGMENTO;

            const anchoAnterior = parseFloat(rectActual.ancho);
            rectActual.ancho = nuevoAncho;
            rectActual.elemento.dataset.widthReal = nuevoAncho;

            const posActual = parseFloat(rectActual.posicion);
            if (nuevoAncho > anchoAnterior && indice < grupo.length - 1) {
                const rectDerecha = grupo[indice + 1];
                const posDerecha = parseFloat(rectDerecha.posicion);

                if (posActual + nuevoAncho >= posDerecha) {
                    const desplazamiento = (posActual + nuevoAncho) - posDerecha;
                    aplicarEmpujeRedimension(
                        indice + 1,
                        desplazamiento,
                        'derecha',
                        index_row
                    );
                }
            }
        }

        if (ladoRedimension === 'derecho' && direccionAutoScroll === -1) {
            const bordeVisibleDerecho = scrollWrapper.scrollLeft + 60;
            const posActual = parseFloat(rectActual.posicion);

            let nuevoAncho = bordeVisibleDerecho - posActual;
            if (nuevoAncho < SEGMENTO) nuevoAncho = SEGMENTO;

            rectActual.ancho = nuevoAncho;
            rectActual.elemento.dataset.widthReal = nuevoAncho;
        }

        if (ladoRedimension === 'izquierdo' && direccionAutoScroll === -1) {
            const bordeVisible = scrollWrapper.scrollLeft + PADDING;

            let nuevaPos = bordeVisible;
            let nuevoAncho = bordeFijoAuto - nuevaPos;
            if (nuevoAncho < SEGMENTO) nuevoAncho = SEGMENTO;

            const posAnterior = parseFloat(rectActual.posicion);

            rectActual.posicion = nuevaPos;
            rectActual.elemento.dataset.xReal = nuevaPos;
            rectActual.ancho = nuevoAncho;
            rectActual.elemento.dataset.widthReal = nuevoAncho;

            if (nuevaPos < posAnterior && indice > 0) {
                const rectIzquierda = grupo[indice - 1];
                const bordeDerechoIzq =
                    parseFloat(rectIzquierda.posicion) +
                    parseFloat(rectIzquierda.ancho);

                if (nuevaPos < bordeDerechoIzq) {
                    const desplazamiento = bordeDerechoIzq - nuevaPos;
                    aplicarEmpujeRedimension(
                        indice - 1,
                        desplazamiento,
                        'izquierda',
                        index_row
                    );
                }
            }
        }

        if (ladoRedimension === 'izquierdo' && direccionAutoScroll === 1) {
            const bordeVisibleIzquierdo = scrollWrapper.scrollLeft + scrollWrapper.clientWidth - 60;
            const bordeDerechoFijo = bordeFijoAuto;

            let nuevoAncho = bordeDerechoFijo - bordeVisibleIzquierdo;
            if (nuevoAncho < SEGMENTO) nuevoAncho = SEGMENTO;

            let nuevaPos = bordeDerechoFijo - nuevoAncho;

            rectActual.posicion = nuevaPos;
            rectActual.elemento.dataset.xReal = nuevaPos;
            rectActual.ancho = nuevoAncho;
            rectActual.elemento.dataset.widthReal = nuevoAncho;
        }

        actualizarPosicionesVisuales();
    }

    requestAnimationFrame(autoScrollHorizontalContinuoRedim);
}



 


function normalizarAGrilla_0() {
    for (let i = 0; i < rectangulos.length; i++) {
        const rect = rectangulos[i];

        rect.posicion =
            Math.round(rect.posicion / SEGMENTO) * SEGMENTO;
        rect.ancho =
            Math.round(rect.ancho / SEGMENTO) * SEGMENTO;

        rect.elemento.dataset.xReal = rect.posicion;
        rect.elemento.dataset.widthReal = rect.ancho;
    }

    actualizarPosicionesVisuales();
}


function normalizarAGrillaVideoSpeed_0() {  
    for (let i = 0; i < rectangulos.length; i++) {
        const rect = rectangulos[i];
	if (!rect.elemento) return;
	const rect_position = Math.round(rect.posicion);
	const rect_ancho = Math.round(rect.ancho);

        rect.posicion = Math.floor(rect_position / SEGMENTO) * SEGMENTO;
 
        rect.ancho = Math.floor(rect_ancho / SEGMENTO) * SEGMENTO;

        rect.elemento.dataset.xReal = rect.posicion;
        rect.elemento.dataset.widthReal = rect.ancho;
    }

    actualizarPosicionesVisuales(); 
}

 


function normalizarAGrilla() {

    // ⬅️ Ahora rectangulos es una LISTA DE SUBLISTAS
    for (let r = 0; r < rectangulos.length; r++) {

        const fila = rectangulos[r];
        if (!Array.isArray(fila)) continue;

        for (let i = 0; i < fila.length; i++) {

            const rect = fila[i];
            if (!rect || !rect.elemento) continue;

            rect.posicion = Math.round((rect.posicion / SEGMENTO) * SEGMENTO);

            rect.ancho = Math.round((rect.ancho / SEGMENTO) * SEGMENTO);

            rect.elemento.dataset.xReal = rect.posicion;
            rect.elemento.dataset.widthReal = rect.ancho;
        }
    }

    actualizarPosicionesVisuales();
}


function normalizarAGrillaVideoSpeed() {   

    // ⬅️ Ahora rectangulos es una MATRIZ
    for (let r = 0; r < rectangulos.length; r++) {

        const fila = rectangulos[r];
        if (!Array.isArray(fila)) continue;

        for (let i = 0; i < fila.length; i++) {

            const rect = fila[i];
            if (!rect || !rect.elemento) continue;

            const rect_position = Math.round(rect.posicion);
            const rect_ancho = Math.round(rect.ancho);

            rect.posicion =
                Math.floor(rect_position / SEGMENTO) * SEGMENTO;

            rect.ancho =
                Math.floor(rect_ancho / SEGMENTO) * SEGMENTO;

            rect.elemento.dataset.xReal = rect.posicion;
            rect.elemento.dataset.widthReal = rect.ancho;
        }
    }

    actualizarPosicionesVisuales(); 
}



function redimensionarRectangulo(e) { 

    const index_row = selected_rect.dataset.index_row;
	
    if (!redimensionActiva || !rectanguloRedimensionado) return;

    // ===============================
    // 1️⃣ Posición del mouse EN LA PANTALLA (sin scroll)
    // =============================== 

    saveState();

    const rectContenedor = contenedor.getBoundingClientRect();
    const mouseXPantalla = e.clientX - rectContenedor.left;  

    // ⬅️ Durante auto-scroll, detectar dirección usando posición en pantalla
    if (autoScrollActivo) {
        if (ultimoMouseXPantalla !== null) {
            const deltaInstantaneo = mouseXPantalla - ultimoMouseXPantalla;
            if (deltaInstantaneo !== 0) {
                const direccionInstantanea = Math.sign(deltaInstantaneo);
                
                // Detectar cambio de dirección opuesta
                if ((direccionAutoScroll === 1 && direccionInstantanea < 0) ||
                    (direccionAutoScroll === -1 && direccionInstantanea > 0)) {
                    
                    // ⬅️ CANCELAR AUTO-SCROLL
                    autoScrollActivo = false;
                    direccionAutoScroll = 0;
                    ultimoTimestampAutoScroll = null; 

                    // ⬅️ RESETEAR TODO AL ESTADO ACTUAL
                    posicionInicialMouse = e.clientX;
                    scrollInicial = scrollWrapper.scrollLeft;
                    anchoInicial = parseFloat(rectanguloRedimensionado.dataset.widthReal);
                    posicionInicialRectRedim = parseFloat(rectanguloRedimensionado.dataset.xReal);
                    ultimaDireccion = direccionInstantanea;
                    ultimoMouseXPantalla = mouseXPantalla;
                    
                    // NO hacer return, continuar con lógica manual
                } else { 
                    // ⬅️ Misma dirección: actualizar y salir
                    ultimoMouseXPantalla = mouseXPantalla;
                    return; 
                }
            } else {
                return;
            }
        } else {
            ultimoMouseXPantalla = mouseXPantalla;
            return;
        }
    }

    // ===============================
    // Modo manual: usar mouseXRelativo (con scroll)
    // ===============================
    const mouseXRelativo = e.clientX - rectContenedor.left + scrollWrapper.scrollLeft;

    if (ultimoMouseXRelativo !== null) {
        const deltaInstantaneo = mouseXRelativo - ultimoMouseXRelativo;
        if (deltaInstantaneo !== 0)
            ultimaDireccion = Math.sign(deltaInstantaneo);
    }
    ultimoMouseXRelativo = mouseXRelativo;
    ultimoMouseXPantalla = mouseXPantalla; // ⬅️ Actualizar también

    // ===============================
    // 2️⃣ Detectar zona de auto-scroll
    // ===============================
    const rectVisual = rectanguloRedimensionado.getBoundingClientRect();

    const rangoBorde = 60;
    const distanciaDerecha = rectContenedor.right - rectVisual.right;
    const distanciaIzquierda = rectVisual.left - rectContenedor.left;


    // ===============================
    // Auto-scroll inverso (rect borde contrario)
    // ===============================
    const bordeDerechoRect = parseFloat(rectanguloRedimensionado.dataset.xReal) + 
                             parseFloat(rectanguloRedimensionado.dataset.widthReal);
    const bordeIzquierdoVisible = scrollWrapper.scrollLeft;
    const distanciaBordeDerechoAlIzquierdo = bordeDerechoRect - bordeIzquierdoVisible;

    if (ladoRedimension === 'derecho' && distanciaBordeDerechoAlIzquierdo <= 60 && ultimaDireccion < 0) {
        console.log('🔴 Los últimos 60px del rectángulo están dentro de los 60px del extremo izquierdo');
        
        if (!autoScrollActivo) {
            bordeFijoAuto = parseFloat(rectanguloRedimensionado.dataset.xReal);  // ⬅️ POSICIÓN IZQUIERDA
            autoScrollActivo = true;
            direccionAutoScroll = -1;
            ultimoMouseXPantalla = mouseXPantalla;
            requestAnimationFrame(autoScrollHorizontalContinuoRedim);
        }
        return;
    }

    const bordeIzquierdoRect = parseFloat(rectanguloRedimensionado.dataset.xReal);
    const bordeDerechoVisible = scrollWrapper.scrollLeft + scrollWrapper.clientWidth;
    const distanciaBordeIzquierdoAlDerecho = bordeDerechoVisible - bordeIzquierdoRect;

    if (ladoRedimension === 'izquierdo' && distanciaBordeIzquierdoAlDerecho <= 60 && ultimaDireccion > 0) {
        console.log('🔴 Los primeros 60px del rectángulo están dentro de los 60px del extremo derecho');
        
        if (!autoScrollActivo) {
            bordeFijoAuto = parseFloat(rectanguloRedimensionado.dataset.xReal) + 
                            parseFloat(rectanguloRedimensionado.dataset.widthReal);  // ⬅️ BORDE DERECHO FIJO
            autoScrollActivo = true;
            direccionAutoScroll = 1;  // ⬅️ HACIA LA DERECHA
            ultimoMouseXPantalla = mouseXPantalla;
            requestAnimationFrame(autoScrollHorizontalContinuoRedim);
        }
        return;
    }


    // ===============================
    // Auto-scroll normal en bordes visibles
    // ===============================
    if (
        ladoRedimension === 'derecho' &&
        distanciaDerecha <= rangoBorde &&
        ultimaDireccion > 0
    ) {
        if (!autoScrollActivo) {
            bordeFijoAuto = parseFloat(rectanguloRedimensionado.dataset.xReal);
            autoScrollActivo = true;
            direccionAutoScroll = 1;
            ultimoMouseXPantalla = mouseXPantalla;
            requestAnimationFrame(autoScrollHorizontalContinuoRedim);
        }
        return;
    } else if (
        ladoRedimension === 'izquierdo' &&
        distanciaIzquierda <= rangoBorde &&
        ultimaDireccion < 0
    ) {
        if (!autoScrollActivo) {
            bordeFijoAuto = parseFloat(rectanguloRedimensionado.dataset.xReal) + 
                            parseFloat(rectanguloRedimensionado.dataset.widthReal);
            autoScrollActivo = true;
            direccionAutoScroll = -1;
            ultimoMouseXPantalla = mouseXPantalla;
            requestAnimationFrame(autoScrollHorizontalContinuoRedim);
        }
        return;
    }

    // ===============================
    // 3️⃣ DeltaX (mouse en modo manual)
    // ===============================
    const deltaX = (e.clientX - posicionInicialMouse) +
                   (scrollWrapper.scrollLeft - scrollInicial);


    // ===============================
    // GRUPO DE LA FILA
    // ===============================
    const grupo = rectangulos[index_row];
    if (!Array.isArray(grupo)) return;

    const indice = parseInt(rectanguloRedimensionado.dataset.indice);
    const rectActual = grupo[indice];


    // ===============================
    // ⬇️⬇️⬇️ LÓGICA DE REDIMENSIÓN MANUAL ⬇️⬇️⬇️
    // ===============================
    if (ladoRedimension === 'derecho') {

        let nuevoAncho = anchoInicial + deltaX;
        nuevoAncho = Math.round(nuevoAncho / SEGMENTO) * SEGMENTO;
        if (nuevoAncho < SEGMENTO) nuevoAncho = SEGMENTO;

        const posActual = parseFloat(rectActual.posicion);

        if (nuevoAncho > anchoInicial && indice < grupo.length - 1) {

            const rectDerecha = grupo[indice + 1];
            const posDerecha = parseFloat(rectDerecha.posicion);

            if (posActual + nuevoAncho >= posDerecha) {

                const desplazamiento =
                    (posActual + nuevoAncho) - posDerecha;

                aplicarEmpujeRedimension(
                    indice + 1,
                    desplazamiento,
                    'derecha',
                    index_row
                );
            }
        }

        rectActual.ancho = nuevoAncho;
        rectActual.elemento.dataset.widthReal = nuevoAncho;
    }

    else if (ladoRedimension === 'izquierdo') {

        let nuevoAncho = anchoInicial - deltaX;
        nuevoAncho = Math.round(nuevoAncho / SEGMENTO) * SEGMENTO;
        if (nuevoAncho < SEGMENTO) nuevoAncho = SEGMENTO;

        let nuevaPosicion =
            posicionInicialRectRedim + (anchoInicial - nuevoAncho);

        const rectRight = posicionInicialRectRedim + anchoInicial;

        if (indice > 0) {

            const rectPrev = grupo[indice - 1];
            const bordeDerechoPrev =
                parseFloat(rectPrev.posicion) + parseFloat(rectPrev.ancho);

            if (nuevaPosicion < bordeDerechoPrev) {

                // ⬅️ HAY COLISIÓN: EMPUJAR anterior hacia la izquierda
                const desplazamiento = bordeDerechoPrev - nuevaPosicion;

                aplicarEmpujeRedimension(
                    indice - 1,
                    desplazamiento,
                    'izquierda',
                    index_row
                );

                // Recalcular nuevo borde derecho del anterior
                const nuevoBordeDerechoPrev =
                    parseFloat(rectPrev.posicion) + parseFloat(rectPrev.ancho);

                // Si el empuje fue bloqueado
                if (nuevoBordeDerechoPrev > nuevaPosicion) {
                    nuevaPosicion = nuevoBordeDerechoPrev;
                }
            }
        } else {
            if (nuevaPosicion < PADDING) nuevaPosicion = PADDING;
        }

        const limiteDerecho = rectRight - SEGMENTO;
        if (nuevaPosicion > limiteDerecho) nuevaPosicion = limiteDerecho;

        nuevaPosicion = Math.round(nuevaPosicion / SEGMENTO) * SEGMENTO;

        nuevoAncho = rectRight - nuevaPosicion;
        if (nuevoAncho < SEGMENTO) nuevoAncho = SEGMENTO;

        nuevoAncho = Math.round(nuevoAncho / SEGMENTO) * SEGMENTO;

        rectActual.posicion = nuevaPosicion;
        rectActual.elemento.dataset.xReal = nuevaPosicion;

        rectActual.ancho = nuevoAncho;
        rectActual.elemento.dataset.widthReal = nuevoAncho;
    }

    actualizarPosicionesVisuales();
}

 

function redimensionarRectangulo_0(e) { 

    if (!redimensionActiva || !rectanguloRedimensionado) return;

    // ===============================
    // 1️⃣ Posición del mouse EN LA PANTALLA (sin scroll)
    // =============================== 

saveState();

    const rectContenedor = contenedor.getBoundingClientRect();
    const mouseXPantalla = e.clientX - rectContenedor.left;  

    // ⬅️ Durante auto-scroll, detectar dirección usando posición en pantalla
    if (autoScrollActivo) {
        if (ultimoMouseXPantalla !== null) {
            const deltaInstantaneo = mouseXPantalla - ultimoMouseXPantalla;
            if (deltaInstantaneo !== 0) {
                const direccionInstantanea = Math.sign(deltaInstantaneo);
                
                // Detectar cambio de dirección opuesta
                if ((direccionAutoScroll === 1 && direccionInstantanea < 0) ||
                    (direccionAutoScroll === -1 && direccionInstantanea > 0)) {
                    
                    // ⬅️ CANCELAR AUTO-SCROLL
                    autoScrollActivo = false;
                    direccionAutoScroll = 0;
                    ultimoTimestampAutoScroll = null; 

                    // ⬅️ RESETEAR TODO AL ESTADO ACTUAL
                    posicionInicialMouse = e.clientX;
                    scrollInicial = scrollWrapper.scrollLeft;
                    anchoInicial = parseFloat(rectanguloRedimensionado.dataset.widthReal);
                    posicionInicialRectRedim = parseFloat(rectanguloRedimensionado.dataset.xReal);
                    ultimaDireccion = direccionInstantanea;
                    ultimoMouseXPantalla = mouseXPantalla;
                    
                    // NO hacer return, continuar con lógica manual
                } else { 
                    // ⬅️ Misma dirección: actualizar y salir
                    ultimoMouseXPantalla = mouseXPantalla;
                    return; 
                }
            } else {
                return;
            }
        } else {
            ultimoMouseXPantalla = mouseXPantalla;
            return;
        }
    }

    // ===============================
    // Modo manual: usar mouseXRelativo (con scroll)
    // ===============================
    const mouseXRelativo = e.clientX - rectContenedor.left + scrollWrapper.scrollLeft;

    if (ultimoMouseXRelativo !== null) {
        const deltaInstantaneo = mouseXRelativo - ultimoMouseXRelativo;
        if (deltaInstantaneo !== 0)
            ultimaDireccion = Math.sign(deltaInstantaneo);
    }
    ultimoMouseXRelativo = mouseXRelativo;
    ultimoMouseXPantalla = mouseXPantalla; // ⬅️ Actualizar también

    // ===============================
    // 2️⃣ Detectar zona de auto-scroll
    // ===============================
    const rectVisual = rectanguloRedimensionado.getBoundingClientRect();

    const rangoBorde = 60;
    const distanciaDerecha = rectContenedor.right - rectVisual.right;
    const distanciaIzquierda = rectVisual.left - rectContenedor.left;

 
//de aqui
const bordeDerechoRect = parseFloat(rectanguloRedimensionado.dataset.xReal) + 
                         parseFloat(rectanguloRedimensionado.dataset.widthReal);
const bordeIzquierdoVisible = scrollWrapper.scrollLeft;
const distanciaBordeDerechoAlIzquierdo = bordeDerechoRect - bordeIzquierdoVisible;

if (ladoRedimension === 'derecho' && distanciaBordeDerechoAlIzquierdo <= 60 && ultimaDireccion < 0) {
    console.log('🔴 Los últimos 60px del rectángulo están dentro de los 60px del extremo izquierdo');
    
    if (!autoScrollActivo) {
        bordeFijoAuto = parseFloat(rectanguloRedimensionado.dataset.xReal);  // ⬅️ POSICIÓN IZQUIERDA, NO DERECHA
        autoScrollActivo = true;
        direccionAutoScroll = -1;
        ultimoMouseXPantalla = mouseXPantalla;
        requestAnimationFrame(autoScrollHorizontalContinuoRedim);
    }
    return;
}
const bordeIzquierdoRect = parseFloat(rectanguloRedimensionado.dataset.xReal);
const bordeDerechoVisible = scrollWrapper.scrollLeft + scrollWrapper.clientWidth;
const distanciaBordeIzquierdoAlDerecho = bordeDerechoVisible - bordeIzquierdoRect;

if (ladoRedimension === 'izquierdo' && distanciaBordeIzquierdoAlDerecho <= 60 && ultimaDireccion > 0) {
    console.log('🔴 Los primeros 60px del rectángulo están dentro de los 60px del extremo derecho');
    
    if (!autoScrollActivo) {
        bordeFijoAuto = parseFloat(rectanguloRedimensionado.dataset.xReal) + 
                        parseFloat(rectanguloRedimensionado.dataset.widthReal);  // ⬅️ BORDE DERECHO FIJO
        autoScrollActivo = true;
        direccionAutoScroll = 1;  // ⬅️ HACIA LA DERECHA
        ultimoMouseXPantalla = mouseXPantalla;
        requestAnimationFrame(autoScrollHorizontalContinuoRedim);
    }
    return;
}
//hasta aqui
 

    if (
        ladoRedimension === 'derecho' &&
        distanciaDerecha <= rangoBorde &&
        ultimaDireccion > 0
    ) {
        if (!autoScrollActivo) {
            bordeFijoAuto = parseFloat(rectanguloRedimensionado.dataset.xReal);
            autoScrollActivo = true;
            direccionAutoScroll = 1;
            ultimoMouseXPantalla = mouseXPantalla; // ⬅️ Guardar posición inicial
            requestAnimationFrame(autoScrollHorizontalContinuoRedim);
        }
        return;
    } else if (
        ladoRedimension === 'izquierdo' &&
        distanciaIzquierda <= rangoBorde &&
        ultimaDireccion < 0
    ) {
        if (!autoScrollActivo) {
            bordeFijoAuto = parseFloat(rectanguloRedimensionado.dataset.xReal) + 
                            parseFloat(rectanguloRedimensionado.dataset.widthReal);
            autoScrollActivo = true;
            direccionAutoScroll = -1;
            ultimoMouseXPantalla = mouseXPantalla; // ⬅️ Guardar posición inicial
            requestAnimationFrame(autoScrollHorizontalContinuoRedim);
        }
        return;
    }

    // ===============================
    // 3️⃣ DeltaX (mouse en modo manual)
    // ===============================
    const deltaX = (e.clientX - posicionInicialMouse) +
                   (scrollWrapper.scrollLeft - scrollInicial);

 
    // ===============================
    // ⬇️⬇️⬇️ LÓGICA DE REDIMENSIÓN MANUAL ⬇️⬇️⬇️
    // ===============================

    const indice = parseInt(rectanguloRedimensionado.dataset.indice);
    const rectActual = rectangulos[indice];

    if (ladoRedimension === 'derecho') {
        let nuevoAncho = anchoInicial + deltaX;
        nuevoAncho = Math.round(nuevoAncho / SEGMENTO) * SEGMENTO;
        if (nuevoAncho < SEGMENTO) nuevoAncho = SEGMENTO;

        const posActual = parseFloat(rectActual.posicion);

        if (nuevoAncho > anchoInicial && indice < rectangulos.length - 1) {
            const rectDerecha = rectangulos[indice + 1];
            const posDerecha = parseFloat(rectDerecha.posicion);

            if (posActual + nuevoAncho >= posDerecha) {
                const desplazamiento =
                    (posActual + nuevoAncho) - posDerecha;
                aplicarEmpujeRedimension(
                    indice + 1,
                    desplazamiento,
                    'derecha'
                );
            }
        }

        rectActual.ancho = nuevoAncho;
        rectActual.elemento.dataset.widthReal = nuevoAncho;

    } else if (ladoRedimension === 'izquierdo') {

    let nuevoAncho = anchoInicial - deltaX;
    nuevoAncho = Math.round(nuevoAncho / SEGMENTO) * SEGMENTO;
    if (nuevoAncho < SEGMENTO) nuevoAncho = SEGMENTO;

    let nuevaPosicion = posicionInicialRectRedim + (anchoInicial - nuevoAncho);
    const rectRight = posicionInicialRectRedim + anchoInicial;

    if (indice > 0) {
        const rectPrev = rectangulos[indice - 1];
        const bordeDerechoPrev = parseFloat(rectPrev.posicion) + parseFloat(rectPrev.ancho);

        if (nuevaPosicion < bordeDerechoPrev) {
            // ⬅️ HAY COLISIÓN: EMPUJAR el rectángulo anterior hacia la izquierda
            const desplazamiento = bordeDerechoPrev - nuevaPosicion;
            aplicarEmpujeRedimension(indice - 1, desplazamiento, 'izquierda');
            
            // ⬅️ Después de empujar, el rectángulo anterior se habrá movido
            // Recalcular su nuevo borde derecho
            const nuevobordeDerechoPrev = parseFloat(rectPrev.posicion) + parseFloat(rectPrev.ancho);
            
            // Si el empuje fue bloqueado (llegó a PADDING), ajustar nuevaPosicion
            if (nuevobordeDerechoPrev > nuevaPosicion) {
                nuevaPosicion = nuevobordeDerechoPrev;
            }
        }
    } else {
        if (nuevaPosicion < PADDING) nuevaPosicion = PADDING;
    }

    const limiteDerecho = rectRight - SEGMENTO;
    if (nuevaPosicion > limiteDerecho) nuevaPosicion = limiteDerecho;

    nuevaPosicion = Math.round(nuevaPosicion / SEGMENTO) * SEGMENTO;
    nuevoAncho = rectRight - nuevaPosicion;
    
    if (nuevoAncho < SEGMENTO) nuevoAncho = SEGMENTO;
    nuevoAncho = Math.round(nuevoAncho / SEGMENTO) * SEGMENTO;

    rectActual.posicion = nuevaPosicion;
    rectActual.elemento.dataset.xReal = nuevaPosicion;
    rectActual.ancho = nuevoAncho;
    rectActual.elemento.dataset.widthReal = nuevoAncho;
}
 

    actualizarPosicionesVisuales();
}



function redimensionarRectanguloTouch(e) {
 
    if (!redimensionActiva || !rectanguloRedimensionado) return;

saveState();

    // ===============================
    // 1️⃣ Posición del mouse EN LA PANTALLA (sin scroll)
    // ===============================
    let clientX;
    if (e.type.startsWith('touch')) {
        clientX = e.touches[0].clientX; // para touch
    } else {
        clientX = e.clientX; // para mouse
    } 

    const rectContenedor = contenedor.getBoundingClientRect();
    const mouseXPantalla = clientX - rectContenedor.left;  

    // ⬅️ Durante auto-scroll, detectar dirección usando posición en pantalla
    if (autoScrollActivo) {
        if (ultimoMouseXPantalla !== null) {
            const deltaInstantaneo = mouseXPantalla - ultimoMouseXPantalla;
            if (deltaInstantaneo !== 0) {
                const direccionInstantanea = Math.sign(deltaInstantaneo);
                
                // Detectar cambio de dirección opuesta
                if ((direccionAutoScroll === 1 && direccionInstantanea < 0) ||
                    (direccionAutoScroll === -1 && direccionInstantanea > 0)) {
                    
                    // ⬅️ CANCELAR AUTO-SCROLL
                    autoScrollActivo = false;
                    direccionAutoScroll = 0;
                    ultimoTimestampAutoScroll = null; 

 

                    // ⬅️ RESETEAR TODO AL ESTADO ACTUAL
                    posicionInicialMouse = clientX;
                    scrollInicial = scrollWrapper.scrollLeft;
                    anchoInicial = parseFloat(rectanguloRedimensionado.dataset.widthReal);
                    posicionInicialRectRedim = parseFloat(rectanguloRedimensionado.dataset.xReal);
                    ultimaDireccion = direccionInstantanea;
                    ultimoMouseXPantalla = mouseXPantalla;
                    
                    // NO hacer return, continuar con lógica manual
                } else { 
                    // ⬅️ Misma dirección: actualizar y salir
                    ultimoMouseXPantalla = mouseXPantalla;
                    return; 
                }
            } else {
                return;
            }
        } else {
            ultimoMouseXPantalla = mouseXPantalla;
            return;
        }
    }

    // ===============================
    // Modo manual: usar mouseXRelativo (con scroll)
    // ===============================
    const mouseXRelativo = clientX - rectContenedor.left + scrollWrapper.scrollLeft;

    if (ultimoMouseXRelativo !== null) {
        const deltaInstantaneo = mouseXRelativo - ultimoMouseXRelativo;
        if (deltaInstantaneo !== 0)
            ultimaDireccion = Math.sign(deltaInstantaneo);
    }
    ultimoMouseXRelativo = mouseXRelativo;
    ultimoMouseXPantalla = mouseXPantalla; // ⬅️ Actualizar también

    // ===============================
    // 2️⃣ Detectar zona de auto-scroll
    // ===============================
    const rectVisual = rectanguloRedimensionado.getBoundingClientRect();

    const rangoBorde = 60;
    const distanciaDerecha = rectContenedor.right - rectVisual.right;
    const distanciaIzquierda = rectVisual.left - rectContenedor.left;

 
//de aqui
const bordeDerechoRect = parseFloat(rectanguloRedimensionado.dataset.xReal) + 
                         parseFloat(rectanguloRedimensionado.dataset.widthReal);
const bordeIzquierdoVisible = scrollWrapper.scrollLeft;
const distanciaBordeDerechoAlIzquierdo = bordeDerechoRect - bordeIzquierdoVisible;

if (ladoRedimension === 'derecho' && distanciaBordeDerechoAlIzquierdo <= 60 && ultimaDireccion < 0) {
    console.log('🔴 Los últimos 60px del rectángulo están dentro de los 60px del extremo izquierdo');
    
    if (!autoScrollActivo) {
        bordeFijoAuto = parseFloat(rectanguloRedimensionado.dataset.xReal);  // ⬅️ POSICIÓN IZQUIERDA, NO DERECHA
        autoScrollActivo = true;
        direccionAutoScroll = -1;
        ultimoMouseXPantalla = mouseXPantalla;
        requestAnimationFrame(autoScrollHorizontalContinuoRedim);
    }
    return;
}
const bordeIzquierdoRect = parseFloat(rectanguloRedimensionado.dataset.xReal);
const bordeDerechoVisible = scrollWrapper.scrollLeft + scrollWrapper.clientWidth;
const distanciaBordeIzquierdoAlDerecho = bordeDerechoVisible - bordeIzquierdoRect;

if (ladoRedimension === 'izquierdo' && distanciaBordeIzquierdoAlDerecho <= 60 && ultimaDireccion > 0) {
    console.log('🔴 Los primeros 60px del rectángulo están dentro de los 60px del extremo derecho');
    
    if (!autoScrollActivo) {
        bordeFijoAuto = parseFloat(rectanguloRedimensionado.dataset.xReal) + 
                        parseFloat(rectanguloRedimensionado.dataset.widthReal);  // ⬅️ BORDE DERECHO FIJO
        autoScrollActivo = true;
        direccionAutoScroll = 1;  // ⬅️ HACIA LA DERECHA
        ultimoMouseXPantalla = mouseXPantalla;
        requestAnimationFrame(autoScrollHorizontalContinuoRedim);
    }
    return;
}
//hasta aqui
 

    if (
        ladoRedimension === 'derecho' &&
        distanciaDerecha <= rangoBorde &&
        ultimaDireccion > 0
    ) {
        if (!autoScrollActivo) {
            bordeFijoAuto = parseFloat(rectanguloRedimensionado.dataset.xReal);
            autoScrollActivo = true;
            direccionAutoScroll = 1;
            ultimoMouseXPantalla = mouseXPantalla; // ⬅️ Guardar posición inicial
            requestAnimationFrame(autoScrollHorizontalContinuoRedim);
        }
        return;
    } else if (
        ladoRedimension === 'izquierdo' &&
        distanciaIzquierda <= rangoBorde &&
        ultimaDireccion < 0
    ) {
        if (!autoScrollActivo) {
            bordeFijoAuto = parseFloat(rectanguloRedimensionado.dataset.xReal) + 
                            parseFloat(rectanguloRedimensionado.dataset.widthReal);
            autoScrollActivo = true;
            direccionAutoScroll = -1;
            ultimoMouseXPantalla = mouseXPantalla; // ⬅️ Guardar posición inicial
            requestAnimationFrame(autoScrollHorizontalContinuoRedim);
        }
        return;
    }

    // ===============================
    // 3️⃣ DeltaX (mouse en modo manual)
    // ===============================
    const deltaX = (clientX - posicionInicialMouse) +
                   (scrollWrapper.scrollLeft - scrollInicial);

 
    // ===============================
    // ⬇️⬇️⬇️ LÓGICA DE REDIMENSIÓN MANUAL ⬇️⬇️⬇️
    // ===============================

    const indice = parseInt(rectanguloRedimensionado.dataset.indice);
    const rectActual = rectangulos[indice];

    if (ladoRedimension === 'derecho') {
        let nuevoAncho = anchoInicial + deltaX;
        nuevoAncho = Math.round(nuevoAncho / SEGMENTO) * SEGMENTO;
        if (nuevoAncho < SEGMENTO) nuevoAncho = SEGMENTO;

        const posActual = parseFloat(rectActual.posicion);

        if (nuevoAncho > anchoInicial && indice < rectangulos.length - 1) {
            const rectDerecha = rectangulos[indice + 1];
            const posDerecha = parseFloat(rectDerecha.posicion);

            if (posActual + nuevoAncho >= posDerecha) {
                const desplazamiento =
                    (posActual + nuevoAncho) - posDerecha;
                aplicarEmpujeRedimension(
                    indice + 1,
                    desplazamiento,
                    'derecha'
                );
            }
        }

        rectActual.ancho = nuevoAncho;
        rectActual.elemento.dataset.widthReal = nuevoAncho;

    } else if (ladoRedimension === 'izquierdo') {

    let nuevoAncho = anchoInicial - deltaX;
    nuevoAncho = Math.round(nuevoAncho / SEGMENTO) * SEGMENTO;
    if (nuevoAncho < SEGMENTO) nuevoAncho = SEGMENTO;

    let nuevaPosicion = posicionInicialRectRedim + (anchoInicial - nuevoAncho);
    const rectRight = posicionInicialRectRedim + anchoInicial;

    if (indice > 0) {
        const rectPrev = rectangulos[indice - 1];
        const bordeDerechoPrev = parseFloat(rectPrev.posicion) + parseFloat(rectPrev.ancho);

        if (nuevaPosicion < bordeDerechoPrev) {
            // ⬅️ HAY COLISIÓN: EMPUJAR el rectángulo anterior hacia la izquierda
            const desplazamiento = bordeDerechoPrev - nuevaPosicion;
            aplicarEmpujeRedimension(indice - 1, desplazamiento, 'izquierda');
            
            // ⬅️ Después de empujar, el rectángulo anterior se habrá movido
            // Recalcular su nuevo borde derecho
            const nuevobordeDerechoPrev = parseFloat(rectPrev.posicion) + parseFloat(rectPrev.ancho);
            
            // Si el empuje fue bloqueado (llegó a PADDING), ajustar nuevaPosicion
            if (nuevobordeDerechoPrev > nuevaPosicion) {
                nuevaPosicion = nuevobordeDerechoPrev;
            }
        }
    } else {
        if (nuevaPosicion < PADDING) nuevaPosicion = PADDING;
    }

    const limiteDerecho = rectRight - SEGMENTO;
    if (nuevaPosicion > limiteDerecho) nuevaPosicion = limiteDerecho;

    nuevaPosicion = Math.round(nuevaPosicion / SEGMENTO) * SEGMENTO;
    nuevoAncho = rectRight - nuevaPosicion;
    
    if (nuevoAncho < SEGMENTO) nuevoAncho = SEGMENTO;
    nuevoAncho = Math.round(nuevoAncho / SEGMENTO) * SEGMENTO;

    rectActual.posicion = nuevaPosicion;
    rectActual.elemento.dataset.xReal = nuevaPosicion;
    rectActual.ancho = nuevoAncho;
    rectActual.elemento.dataset.widthReal = nuevoAncho;
}

    actualizarPosicionesVisuales();
}

 
 

function aplicarEmpujeRedimensionVideoAudio(indiceRedimensionado) {
 
    const rectActual = rectangulos[indiceRedimensionado];
    const posicionActual = parseFloat(rectActual.posicion);
    const anchoActual = parseFloat(rectActual.ancho);

    // Posiciones temporales para calcular empujes
    let posicionesNuevas = rectangulos.map(r => parseFloat(r.posicion));

    // Empujar hacia la derecha los rectángulos siguientes
    for (let i = indiceRedimensionado + 1; i < rectangulos.length; i++) {
        const rectSiguiente = rectangulos[i];
        const anchoPrevio = parseFloat(rectangulos[i - 1].ancho);
        const finPrevio = posicionesNuevas[i - 1] + anchoPrevio;

        if (posicionesNuevas[i] < finPrevio) {
            // Ajustar para que quede justo pegado al anterior
            posicionesNuevas[i] = finPrevio;
        } else {
            break; // No hay solapamiento, se puede detener
        }
    }

    // Empujar hacia la izquierda los rectángulos anteriores
    for (let i = indiceRedimensionado - 1; i >= 0; i--) {
        const rectAnterior = rectangulos[i];
        const anchoActual = parseFloat(rectAnterior.ancho);
        const inicioSiguiente = posicionesNuevas[i + 1];

        if (posicionesNuevas[i] + anchoActual > inicioSiguiente) {
            // Ajustar para que quede justo pegado al siguiente
            posicionesNuevas[i] = inicioSiguiente - anchoActual;
        } else {
            break; // No hay solapamiento
        }
    } 
    // Aplicar las nuevas posiciones
    for (let i = 0; i < rectangulos.length; i++) {
        rectangulos[i].posicion = posicionesNuevas[i]; 
    }

    unica_regla.rectangulos = rectangulos.map(rect => {
                const segundosInicio = (parseFloat(rect.posicion) - PADDING) / SEGMENTO * VALOR_SEGMENTO; 
                const segundosFin = segundosInicio + (parseFloat(rect.ancho) / SEGMENTO * VALOR_SEGMENTO);
	console.log("MAL segundosFin: ",segundosFin);
                return {
                    start: formatearTiempoDecimal(segundosInicio),
                    end: formatearTiempoDecimal(segundosFin),
                    start_value: rect.start_value,
                    end_value: rect.end_value,
		    video_audio_value: rect.video_audio_value
                };
            });

    //importante (relacionado con la redimension del rectangulo despues de definir el segmento de video o audio)
    const json_data_2 =  {"service":"save_item_data","itemName":current_item,"property":current_timeline[2],"params":"empty",     "rectangulos":unica_regla.rectangulos,"extra":"clip"}; 

    websocketClient.send(JSON.stringify(json_data_2)); 
 
}


 
function aplicarEmpujeRedimension(indiceInicio, desplazamiento, direccion) {

  const index_row = selected_rect.dataset.index_row;
  const grupo = rectangulos[index_row];
  if (!Array.isArray(grupo)) return;

  const rectActual = grupo[indiceInicio];
  if (!rectActual) return;

  const posicionActual = parseFloat(rectActual.posicion);
  const nuevaPos = Math.round((posicionActual + (direccion === "derecha" ? desplazamiento : -desplazamiento)) * 10) / 10;

  // Copiar posiciones actuales del grupo
  let posicionesNuevas = grupo.map(r => parseFloat(r.posicion));
  posicionesNuevas[indiceInicio] = nuevaPos;

  // ➜ EMPUJE HACIA LA DERECHA
  if (direccion === "derecha") {

    for (let i = indiceInicio + 1; i < grupo.length; i++) {
      const finAnterior = posicionesNuevas[i - 1] + parseFloat(grupo[i - 1].ancho);
      if (finAnterior > posicionesNuevas[i]) {
        posicionesNuevas[i] = Math.round(finAnterior * 10) / 10;
      } else break;
    }

  }
  // ➜ EMPUJE HACIA LA IZQUIERDA
  else if (direccion === "izquierda") {

    for (let i = indiceInicio - 1; i >= 0; i--) {
      const finActual = posicionesNuevas[i] + parseFloat(grupo[i].ancho);
      const inicioSig = posicionesNuevas[i + 1];
      if (finActual > inicioSig) {
        posicionesNuevas[i] = Math.round((inicioSig - parseFloat(grupo[i].ancho)) * 10) / 10;
      } else break;
    }
/*
    if (posicionesNuevas[0] < PADDING) {
      // Si tocamos la pared, detener todo
      //return;
    }	
*/
    const primerRect = grupo[0];
    const excedente = PADDING - posicionesNuevas[0];
    if (excedente > 0) {
        // Reducir el desplazamiento del bloque para que toque exactamente la pared
        for (let i = 0; i <= indiceInicio; i++) {
            posicionesNuevas[i] = Math.round((posicionesNuevas[i] + excedente) * 10) / 10;
        }
    }
/* 
    // Control contra PADDING
    if (posicionesNuevas[0] < PADDING) {
      const corrige = PADDING - posicionesNuevas[0];
      for (let i = 0; i < grupo.length; i++) {
        posicionesNuevas[i] = Math.round((posicionesNuevas[i] + corrige) * 10) / 10;
      }
    } 
*/
 
  }

  // Verificación final: evitar solapamientos
  for (let i = 0; i < grupo.length - 1; i++) {
    const finActual = posicionesNuevas[i] + parseFloat(grupo[i].ancho);
    if (finActual > posicionesNuevas[i + 1]) {
      posicionesNuevas[i + 1] = Math.round(finActual * 10) / 10;
    }
  }

  // Aplicar todas las posiciones al grupo
  for (let i = 0; i < grupo.length; i++) {
    grupo[i].posicion = posicionesNuevas[i];
    if (grupo[i].elemento) {
      grupo[i].elemento.dataset.xReal = posicionesNuevas[i];
    }
  }
}

function aplicarEmpujeRedimension_bien(indiceInicio, desplazamiento, direccion) {

  const index_row = selected_rect.dataset.index_row;

  const grupo = rectangulos[index_row];
  if (!Array.isArray(grupo)) return;

  // ➜ EMPUJE HACIA LA DERECHA
  if (direccion === "derecha") {

    for (let i = indiceInicio; i < grupo.length; i++) {

      const rect = grupo[i];

      const nuevaPos = parseFloat(rect.posicion) + desplazamiento;

      rect.posicion = nuevaPos;

      if (rect.elemento) {
        rect.elemento.dataset.xReal = nuevaPos;
      }
    }
  }

  // ➜ EMPUJE HACIA LA IZQUIERDA
  else if (direccion === "izquierda") {

    // 1) Detectar rectángulos consecutivos que deben moverse
    const rectangulosAMover = [];

    for (let i = indiceInicio; i >= 0; i--) {

      const rect = grupo[i];
      rectangulosAMover.push(i);

      if (i > 0) {

        const rectAnterior = grupo[i - 1];

        const bordeDerechoAnterior = parseFloat(rectAnterior.posicion) + parseFloat(rectAnterior.ancho);

        const bordeIzquierdoActual = parseFloat(rect.posicion);

        // Si ya no están pegados → detener propagación
        if (bordeDerechoAnterior < bordeIzquierdoActual) break;
      }
    }

    // 2) Verificar si alguno chocará contra PADDING
    let bloqueado = false;

    for (let idx of rectangulosAMover) {

      const rect = grupo[idx];
      let nuevaPos = parseFloat(rect.posicion) - desplazamiento;
      nuevaPos  = Math.round(nuevaPos  * 10) / 10;

      if (nuevaPos < PADDING) {
        bloqueado = true;
        break;
      }
    }

    // 3) Si está bloqueado → no mover ninguno
    if (bloqueado) {

      console.log("🚫 NO SE PUEDE EMPUJAR — límite izquierdo (PADDING)");

      autoScrollActivo = false;
      direccionAutoScroll = 0;
      ultimoTimestampAutoScroll = null;

      console.log("GRILLA");
      normalizarAGrilla();
    }

    // 4) Si NO está bloqueado → mover todos
    else {

      for (let idx of rectangulosAMover) {

        const rect = grupo[idx];

        let nuevaPos = parseFloat(rect.posicion) - desplazamiento;
	nuevaPos  = Math.round(nuevaPos  * 10) / 10;

        rect.posicion = nuevaPos;

        if (rect.elemento) {
          rect.elemento.dataset.xReal = nuevaPos;
        }
      }
    }
  }
}
 


function aplicarEmpujeRedimension_0(indiceInicio, desplazamiento, direccion) {
 
    if (direccion === 'derecha') {
        for (let i = indiceInicio; i < rectangulos.length; i++) {
            const rect = rectangulos[i];
            rect.posicion = parseFloat(rect.posicion) + desplazamiento;
            rect.elemento.dataset.xReal = rect.posicion;
        }
    } else if (direccion === 'izquierda') {
        // ⬅️ PRIMERO: Verificar qué rectángulos necesitan moverse (consecutivos)
        const rectangulosAMover = [];
        
        for (let i = indiceInicio; i >= 0; i--) {
            const rect = rectangulos[i];
            rectangulosAMover.push(i);
            
            // Verificar si el siguiente está pegado
            if (i > 0) {
                const rectAnterior = rectangulos[i - 1];
                const bordeDerechoAnterior = parseFloat(rectAnterior.posicion) + parseFloat(rectAnterior.ancho);
                const bordeIzquierdoActual = parseFloat(rect.posicion);
                
                // Si NO están pegados, detener
                if (bordeDerechoAnterior < bordeIzquierdoActual) {
                    break;
                }
            }
        }
        
        // ⬅️ SEGUNDO: Verificar si ALGUNO llegará a PADDING
        let bloqueado = false;
        for (let idx of rectangulosAMover) {
            const rect = rectangulos[idx];
            const nuevaPos = parseFloat(rect.posicion) - desplazamiento;
            if (nuevaPos < PADDING) {
                bloqueado = true;
                break;
            }
        }
        
        // ⬅️ TERCERO: Si está bloqueado, NO mover ninguno
        if (bloqueado) {
            console.log("🚫 NO SE PUEDE EMPUJAR - Rectángulo en el límite izquierdo (PADDING)");
            autoScrollActivo = false;
            direccionAutoScroll = 0;
            ultimoTimestampAutoScroll = null;
            console.log("GRILLA");
            normalizarAGrilla();
        } else {
            // ⬅️ CUARTO: Si NO está bloqueado, mover todos
            for (let idx of rectangulosAMover) {
                const rect = rectangulos[idx];
                const nuevaPos = parseFloat(rect.posicion) - desplazamiento;
                rect.posicion = nuevaPos;
                rect.elemento.dataset.xReal = nuevaPos;
            }
        }
    }
}
 
 

 

function finalizarRedimension() {
    ultimoMouseXPantalla = 0;
    // ===============================
    // 🧲 DETENER AUTO-SCROLL LIMPIO
    // ===============================
    autoScrollActivo = false;
    direccionAutoScroll = 0;
    ultimoTimestampAutoScroll = null;
    console.log("GRILLA");
    normalizarAGrilla();
    // ===============================
    // 🔄 RESETEAR ESTADOS AUTO
    // ===============================
    ultimoMouseXRelativo = null;
    ultimaDireccion = 0;
    bordeFijoAuto = null;
    scrollInicialAuto = null;
    // ===============================
    // 📌 REDONDEAR Y CONGELAR ESTADO FINAL
    // ===============================
    if (selected_rect) {
        //const indice = parseInt(rectanguloRedimensionado.dataset.indice);
        const rectActual = selected_rect;
        
        // ⬅️ REDONDEAR VALORES FINALES A LA CUADRÍCULA
        rectActual.ancho = Math.round(rectActual.ancho / SEGMENTO) * SEGMENTO;
        rectActual.posicion = Math.round(rectActual.posicion / SEGMENTO) * SEGMENTO;
        
        // asegurar que el dataset coincide con el estado final
        //rectActual.elemento.dataset.widthReal = rectActual.dataset.ancho;
        //rectActual.elemento.dataset.xReal = rectActual.dataset.posicion;
        
        // ⬅️ ACTUALIZAR VISUAL UNA ÚLTIMA VEZ CON VALORES REDONDEADOS
        actualizarPosicionesVisuales();
        
        actualizarEstadoGlobal();
        crearBotonMas();
    }
    // ===============================
    // 🔓 LIMPIAR REDIMENSIÓN
    // ===============================
    redimensionActiva = false;
    rectanguloRedimensionado = null;
    ladoRedimension = '';
    // ===============================
    // 🧹 QUITAR LISTENERS
    // ===============================
    document.removeEventListener('mousemove', redimensionarRectangulo);
    document.removeEventListener('mouseup', finalizarRedimension);
}


 

 


function finalizarRedimensionTouch(e) {
    ultimoMouseXPantalla = 0;

    // ===============================
    // 🧲 DETENER AUTO-SCROLL LIMPIO
    // ===============================
    autoScrollActivo = false;
    direccionAutoScroll = 0;
    ultimoTimestampAutoScroll = null;
    console.log("GRILLA");
    normalizarAGrilla();

    // ===============================
    // 🔄 RESETEAR ESTADOS AUTO
    // ===============================
    ultimoMouseXRelativo = null;
    ultimaDireccion = 0;
    bordeFijoAuto = null;
    scrollInicialAuto = null;

    // ===============================
    // 📌 REDONDEAR Y CONGELAR ESTADO FINAL
    // ===============================
    if (rectanguloRedimensionado) {
        const indice = parseInt(rectanguloRedimensionado.dataset.indice);
        const rectActual = rectangulos[indice];
        
        // ⬅️ REDONDEAR VALORES FINALES A LA CUADRÍCULA
        rectActual.ancho = Math.round(rectActual.ancho / SEGMENTO) * SEGMENTO;
        rectActual.posicion = Math.round(rectActual.posicion / SEGMENTO) * SEGMENTO;
        
        // asegurar que el dataset coincide con el estado final
        rectActual.elemento.dataset.widthReal = rectActual.ancho;
        rectActual.elemento.dataset.xReal = rectActual.posicion;
        
        // ⬅️ ACTUALIZAR VISUAL UNA ÚLTIMA VEZ CON VALORES REDONDEADOS
        actualizarPosicionesVisuales();
        
        actualizarEstadoGlobal();
        crearBotonMas();
    }

    // ===============================
    // 🔓 LIMPIAR REDIMENSIÓN
    // ===============================
    redimensionActiva = false;
    rectanguloRedimensionado = null;
    ladoRedimension = '';

    // ===============================
    // 🧹 QUITAR LISTENERS TOUCH
    // ===============================
    document.removeEventListener('touchmove', redimensionarRectanguloTouch);
    document.removeEventListener('touchend', finalizarRedimensionTouch);
}