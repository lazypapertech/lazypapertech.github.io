
function equilibrar_rectangulos() {
  // Asumimos que unica_regla es una variable global
  if (!unica_regla) return;

  unica_regla.rectangulos = unica_regla.rectangulos.filter(rect => {
    const startVal = rect.start_value?.trim() || "";
    const endVal = rect.end_value?.trim() || ""; 

    // Si uno está vacío, se rellena con el otro
    if (!endVal && startVal) rect.end_value = startVal;
    if (!startVal && endVal) rect.start_value = endVal;

    return true; // mantener el rectángulo en la lista
  });
}

function formatearTiempoDecimal_2(totalSegundos) { 
    const totalSeg = Number(totalSegundos.toFixed(1));


    // Redondeo a décimas
    let redondeado = Math.round(totalSeg * 10) / 10;

    // Evita valores como 60.0 segundos
    redondeado = Number(redondeado.toFixed(1));

    const horas = Math.floor(redondeado / 3600);
    const minutos = Math.floor((redondeado % 3600) / 60);
    const segundos = Math.floor(redondeado % 60);

    const decima = Math.round((redondeado * 10) % 10);

    let resultado =
        [minutos.toString().padStart(2, '0'),
         segundos.toString().padStart(2, '0')].join(':');

    if (decima > 0) resultado += '.' + decima;

    return resultado;
}
 
function crearPseudoRegla() {
    const alturaPseudo = ALTURA_REGLA * 0.5;

    for (let i = 0; i <= TOTAL_PUNTOS; i++) {
        const x = PADDING + i * SEGMENTO;

        // Guardamos todos los marcadores
        todosLosMarcadores.push({ x: x, top: 0 });

        // Labels cada 5 puntos
        if (i % 5 === 0) {
            todosLosLabels.push({
                x: x,
                top: alturaPseudo / 3 - 4, // centro de la bolita
                texto: formatearTiempoDecimal_2(i / 5)
            });
        }
    }
}
 

function crearPseudoRegla_00() {

    const scrollWrapper = document.querySelector('.scroll-wrapper');
    const contenedor = document.getElementById('contenedor');

    const anchoContenido = contenedor.scrollWidth;
    const alturaPseudo = ALTURA_REGLA * 0.5;

    // 🔹 Crear SIEMPRE el overlay nuevo
    const overlayMarcadores = document.createElement('div');

    overlayMarcadores.id = "overlay_marcadores";

    // ⛔ NO usamos sticky aquí
    overlayMarcadores.style.position = "absolute";

    // Se queda fijo verticalmente
    overlayMarcadores.style.top = "0px";

    // Sigue el scroll horizontal porque vive dentro del scroll-wrapper
    overlayMarcadores.style.left = "0px";

    // 🔹 Muy importante → mismo ancho que el timeline
    overlayMarcadores.style.width = `${anchoContenido}px`;

    overlayMarcadores.style.height = `${alturaPseudo}px`;
    overlayMarcadores.style.pointerEvents = "none";
    overlayMarcadores.style.overflow = "visible";
    overlayMarcadores.style.zIndex = "999";

    scrollWrapper.appendChild(overlayMarcadores);


    // === Dibujar marcadores + labels ===
    for (let i = 0; i <= TOTAL_PUNTOS; i++) {

        const x = PADDING + i * SEGMENTO;

        // --- marcador ---
        const m = document.createElement("div");

        m.style.position = "absolute";
        m.style.left = `${x}px`;

        // ⭐ INVARIANTE EN SCROLL Y
        m.style.top = `${alturaPseudo / 2 - 2}px`;

        m.style.width = "3px";
        m.style.height = "3px";
        m.style.borderRadius = "50%";
        m.style.background = "rgb(150,150,150)";

        overlayMarcadores.appendChild(m);


        // --- label cada 5 ---
        if (i % 5 === 0) {

            const label = document.createElement("div");

            label.style.position = "absolute";
            label.style.left = `${x}px`;
            label.style.top = `${alturaPseudo / 3 - 4}px`;

            // 👀 antes no se veía porque no tenía color
            label.style.color = "#ddd";
            label.style.fontSize = "11px";

            label.textContent = formatearTiempoDecimal_2(i / 5);

            overlayMarcadores.appendChild(label);
        }
    }
}
 



function crearRegla_() {
    const offsetY = ALTURA_REGLA * 0.5;
    const yRegla = offsetY + ALTURA_REGLA / 2;

    contenedor.style.width = `${ANCHO_VENTANA_VIRTUAL}px`; 

    const fondo = document.createElement('div');
    fondo.style.position = 'absolute';
    fondo.style.top = `${offsetY}px`;
    fondo.style.left = '0';
    fondo.style.width = `${ANCHO_VENTANA_VIRTUAL}px`;
    fondo.style.height = `${ALTURA_REGLA}px`;
    fondo.style.background = "rgb(35, 45, 50)";
    fondo.style.borderTop = "2px solid rgb(27, 27, 27)";
    fondo.style.borderBottom = "none";
    fondo.style.borderLeft = "none";
    fondo.style.borderRight = "none";
    fondo.style.boxShadow = "inset 0 0 0 3px rgb(39, 45, 50)";
    fondo.style.zIndex = '-1';
    contenedor.appendChild(fondo); 
}


function crearRegla2() {
    const offsetY = ALTURA_REGLA * 0.5;
    const yRegla = offsetY + ALTURA_REGLA / 2;

    contenedor.style.width = `${ANCHO_VENTANA_VIRTUAL}px`; 

    // Primer fondo
    const fondo1 = document.createElement('div');
    fondo1.style.position = 'absolute';
    fondo1.style.top = `${offsetY}px`;
    fondo1.style.left = '0';
    fondo1.style.width = `${ANCHO_VENTANA_VIRTUAL}px`;
    fondo1.style.height = `${ALTURA_REGLA}px`;
    fondo1.style.background = "rgb(35, 45, 50)";
    fondo1.style.borderTop = "2px solid rgb(27, 27, 27)";
    fondo1.style.boxShadow = "inset 0 0 0 3px rgb(35, 45, 50)";
    fondo1.style.zIndex = '-1';
    contenedor.appendChild(fondo1); 

    // Segundo fondo con 5px de separación
    const espacio = 0; // espacio entre los fondos
    const fondo2 = document.createElement('div');
    fondo2.style.position = 'absolute';
    fondo2.style.top = `${offsetY + ALTURA_REGLA + espacio}px`; // justo debajo
    fondo2.style.left = '0';
    fondo2.style.width = `${ANCHO_VENTANA_VIRTUAL}px`;
    fondo2.style.height = `${ALTURA_REGLA}px`;
    fondo2.style.background = "rgb(35, 45, 50)";
    fondo2.style.borderTop = "2px solid rgb(27, 27, 27)";
    fondo2.style.zIndex = '-1';
    contenedor.appendChild(fondo2);
}

//absolute
function crearRegla9() {
    const offsetY = ALTURA_REGLA * 0.5; 
    contenedor.style.width = `${ANCHO_VENTANA_VIRTUAL}px`;
    contenedor.style.boxSizing = 'border-box';
    contenedor.style.position = "relative";

    const cantidadFondos = 16; // por ejemplo, cuántos fondos quieres
    const espacio = 0;         // espacio entre cada fondo
 
    for (let i = 0; i < cantidadFondos; i++) {
        //const top = offsetY + i * (ALTURA_REGLA + espacio); // calculamos top para cada fondo
        const top = Math.floor(offsetY + i * (ALTURA_REGLA + espacio));

        const fondo = document.createElement('div');
        fondo.style.position = 'relative';
        fondo.style.top = `${top}px`;
        fondo.style.left = '0';
        fondo.style.width = '100%';
        fondo.style.height = `${ALTURA_REGLA}px`;
        fondo.style.background = "rgb(35, 45, 50)"; 
        fondo.style.zIndex = '0';
        contenedor.appendChild(fondo);
    } 
}

function crearRegla_0() {  
 
    // Limpia todo primero
    contenedor.innerHTML = '';
    
    const offsetY = 0;//ALTURA_REGLA * 0.5 
    contenedor.style.width = `${ANCHO_VENTANA_VIRTUAL}px`; 
    contenedor.style.boxSizing = 'border-box';
    contenedor.style.position = "relative";
    contenedor.style.overflow = 'visible'; // Asegura esto
      
    const cantidadFondos = 8; 

    for (let i = 0; i < rectangulos.length; i++) {//rectangulos.length
        const top = Math.floor(offsetY + i * (ALTURA_REGLA));
        const fondo = document.createElement('div');
        
        fondo.style.position = 'absolute';
        fondo.style.top = `${top+3}px`;
        fondo.style.left = '0';
        fondo.style.right = '0'; // Usa right en lugar de width: 100%
        fondo.style.height = `${ALTURA_REGLA-7}px`;
        fondo.style.background = "rgb(48, 48, 48)"; 
	fondo.style.backgroundColor = "rgb(200, 200, 200,0.2)";
        fondo.style.zIndex = '0';
        
        contenedor.appendChild(fondo);
    } 
}



function timeToX(timeString) {
  // Separar la parte de tiempo de los decimales
  const parts = timeString.split('.');
  const timePart = parts[0]; // HH:MM:SS
  const decimalPart = parts[1] || '0'; // s (décimas de segundo)
  
  // Separar horas, minutos y segundos
  const [hours, minutes, seconds] = timePart.split(':').map(Number);
  
  // Convertir todo a segundos totales (incluyendo décimas)
  const totalSeconds = hours * 3600 + minutes * 60 + seconds + parseInt(decimalPart) / 10;
  
  // Calcular x basándose en la relación:
  // 00:00:00.0 (0 segundos) = x=40
  // 00:00:00.2 (0.2 segundos) = x=80
  // Diferencia: 0.2 segundos = 40 unidades de x
  // Ratio: 40 / 0.2 = 200 unidades de x por segundo
  
  const x = 40 + (totalSeconds * 200);
  
  return x;
}

 
function crearRegla_1() {

    const segmentosPorFila = [
  // Fila 0
  [
    { start: 50, end: 200 },
    { start: 300, end: 450 }
  ],

  // Fila 1
  [
    { start: 100, end: 350 }
  ],

  // Fila 2
  [
    { start: 0, end: 120 },
    { start: 400, end: 600 }
  ],

  // Fila 3
  [], // sin segmentos

  // Fila 4
  [
    { start: 180, end: 260 },
    { start: 280, end: 360 },
    { start: 500, end: 700 }
  ]
];

    contenedor.innerHTML = '';

    const offsetY = 0;
    contenedor.style.width = `${ANCHO_VENTANA_VIRTUAL}px`;
    contenedor.style.boxSizing = 'border-box';
    contenedor.style.position = "relative";
    contenedor.style.overflow = 'visible';

    for (let i = 0; i < rectangulos.length; i++) {

        const top = Math.floor(offsetY + i * ALTURA_REGLA);
        const segmentos = segmentosPorFila[i] || [];

        segmentos.forEach(seg => {
            const fondo = document.createElement('div');

            fondo.style.position = 'absolute';
            fondo.style.top = `${top + 3}px`;
            fondo.style.left = `${seg.start}px`;
            fondo.style.width = `${seg.end - seg.start}px`;
            fondo.style.height = `${ALTURA_REGLA - 7}px`;
            fondo.style.backgroundColor = 'rgba(200, 200, 200, 0.2)';
            fondo.style.zIndex = '0';

            contenedor.appendChild(fondo);
        });
    }
    console.log("rectangulos coord:",JSON.stringify(unica_regla.rectangulos)); 
}

/* 
function crearRegla() {

    if (current_view == "filename") return;
    if (current_view == "group") return;	

    const data = unica_regla.rectangulos;

    contenedor.innerHTML = '';

    const offsetY = 0;
    contenedor.style.width = `${ANCHO_VENTANA_VIRTUAL}px`;
    contenedor.style.boxSizing = 'border-box';
    contenedor.style.position = "relative";
    contenedor.style.overflow = 'visible';

    let rowIndex = 0; // 👈 índice SOLO para filas pintadas

    for (let i = 0; i < data.length; i++) {

        const sublist = data[i];
        if (!sublist || sublist.length === 0) continue;

         
        if (sublist[0].property !== "filename") continue;

        // ✅ ahora el top se calcula SOLO con filas válidas
        const top = Math.floor(offsetY + rowIndex * ALTURA_REGLA);

        sublist.forEach(seg => {

            const xStart = timeToX(seg.start);
            const xEnd   = timeToX(seg.end);

            if (xEnd <= xStart) return;

            const fondo = document.createElement('div');
            fondo.style.position = 'absolute';
            fondo.style.top = `${top + 3}px`;
            fondo.style.left = `${xStart}px`;
            fondo.style.width = `${xEnd - xStart}px`;
            fondo.style.height = `${ALTURA_REGLA - 7}px`;
            fondo.style.backgroundColor = 'rgba(200, 200, 200, 0.2)';
	    fondo.style.borderRadius = "8px";
            fondo.style.zIndex = '0';

            contenedor.appendChild(fondo);
        });

        rowIndex++; // 👈 SOLO aquí se incrementa
    }
    console.log("current_view REGLA:",current_view);
}
*/

function crearRegla() {
    if (current_view == "filename") return;
    if (current_view == "group") return;	
    const data = unica_regla.rectangulos;
    contenedor.innerHTML = '';
    const offsetY = 0;
    contenedor.style.width = `${ANCHO_VENTANA_VIRTUAL}px`;
    contenedor.style.boxSizing = 'border-box';
    contenedor.style.position = "relative";
    contenedor.style.overflow = 'visible';
    
    const scrollLeft = scrollWrapper.scrollLeft;
    const anchoReal = PADDING + TOTAL_PUNTOS * SEGMENTO + PADDING;
    const newOffsetVirtual = Math.max(0, scrollLeft);
    const finalOffset = (newOffsetVirtual + ANCHO_VENTANA_VIRTUAL > anchoReal) 
        ? Math.max(0, anchoReal - ANCHO_VENTANA_VIRTUAL)
        : newOffsetVirtual;
    
    let rowIndex = 0;
    
    for (let i = 0; i < data.length; i++) {
        const sublist = data[i];
        if (!sublist || sublist.length === 0) continue;
         
        if (sublist[0].property !== "filename") continue;
        
        const top = Math.floor(offsetY + rowIndex * ALTURA_REGLA);
        sublist.forEach(seg => {
            const xStart = timeToX(seg.start);
            const xEnd   = timeToX(seg.end);
            if (xEnd <= xStart) return;
            
            const fondo = document.createElement('div');
            fondo.classList.add('segmento-regla');
            fondo.style.position = 'absolute';
            fondo.style.top = `${top + 3}px`;
            fondo.style.left = `${xStart - finalOffset}px`;
            fondo.style.width = `${xEnd - xStart}px`;
            fondo.style.height = `${ALTURA_REGLA - 7}px`;
            fondo.style.backgroundColor = 'rgba(200, 200, 200, 0.2)';
            fondo.style.borderRadius = "8px";
            fondo.style.zIndex = '0';
            fondo.dataset.xReal = xStart;
            contenedor.appendChild(fondo);
        });
        rowIndex++;
    }
    console.log("current_view REGLA:",current_view);
}

scrollWrapper.addEventListener('scroll', function() {
    const scrollLeft = scrollWrapper.scrollLeft;
    const anchoReal = PADDING + TOTAL_PUNTOS * SEGMENTO + PADDING;
    const newOffsetVirtual = Math.max(0, scrollLeft);
    const finalOffset = (newOffsetVirtual + ANCHO_VENTANA_VIRTUAL > anchoReal) 
        ? Math.max(0, anchoReal - ANCHO_VENTANA_VIRTUAL)
        : newOffsetVirtual;
    
    // Actualizar segmentos de la regla
    const segmentos = contenedor.querySelectorAll('.segmento-regla');
    segmentos.forEach(seg => {
        const xReal = parseFloat(seg.dataset.xReal);
        seg.style.left = `${xReal - finalOffset}px`;
    });
});


//console.log("rectangulos coord:",JSON.stringify(unica_regla.rectangulos)); 

function crearReglaEnPropiedad() {  
    // Limpia todo primero
    contenedor.innerHTML = '';
    
    const offsetY = 0;//ALTURA_REGLA * 0.5 
    contenedor.style.width = `${ANCHO_VENTANA_VIRTUAL}px`; 
    contenedor.style.boxSizing = 'border-box';
    contenedor.style.position = "relative";
    contenedor.style.overflow = 'visible'; // Asegura esto
      
    const cantidadFondos = 8; 

    for (let i = 0; i < rectangulos.length; i++) {//rectangulos.length
        const top = Math.floor(offsetY + i * (ALTURA_REGLA));
        const fondo = document.createElement('div');
        
        fondo.style.position = 'absolute';
        fondo.style.top = `${top+3}px`;
        fondo.style.left = '0';
        fondo.style.right = '0'; // Usa right en lugar de width: 100%
        fondo.style.height = `${ALTURA_REGLA-7}px`;
        fondo.style.background = "rgb(48, 48, 48)";//rgb(35, 45, 50) 31, 46, 60
	if (true){//i>0
		//fondo.style.borderTop = "2px solid rgb(27, 27, 27,0.5)"; //Bottom
		fondo.style.backgroundColor = "rgb(200, 200, 200,0.2)";
	}
        fondo.style.zIndex = '0';
        
        contenedor.appendChild(fondo);
    } 
}


 
function saveState(){
return;
}

function crearReglaIndividual_0(i) {   

    const offsetY = 0;  
 
        const top = Math.floor(offsetY + i * (ALTURA_REGLA));
        const fondo = document.createElement('div');
        
        fondo.style.position = 'absolute';
        fondo.style.top = `${top}px`;
        fondo.style.left = '0';
        fondo.style.right = '0'; // Usa right en lugar de width: 100%
        fondo.style.height = `${ALTURA_REGLA}px`;
        fondo.style.background = "rgb(48, 48, 48)";//rgb(35, 45, 50) 31, 46, 60
	if (i>0){
		fondo.style.borderTop = "2px solid rgb(27, 27, 27,0.5)"; //Bottom
	} 
        
        scrollWrapper.appendChild(fondo); 
     
}

function crearReglaIndividual(i) {
return;
    const offsetY = 0;
    const top = Math.floor(offsetY + i * ALTURA_REGLA);

    // 🔴 eliminar el fondo anterior "extra" si existe
    const anterior = scrollWrapper.querySelector('#altura_extra');
    if (anterior) {
        anterior.remove();
    }

    // 🟢 crear nuevo fondo
    const fondo = document.createElement('div');
    fondo.id = 'altura_extra';

    fondo.style.position = 'absolute';
    fondo.style.top = `${top}px`;
    fondo.style.left = '0';
    fondo.style.right = '0';
    fondo.style.height = `${3*ALTURA_REGLA}px`;
    fondo.style.background = "rgb(48, 48, 48)";

    if (i > 0) {
        //fondo.style.borderTop = "2px solid rgba(27, 27, 27, 0.5)";
    }

    scrollWrapper.appendChild(fondo);
}

function llevarRectanguloArriba_0() {
    const rectanguloTop = rectanguloSeleccionado.offsetTop;
    scrollWrapper.scrollTop = rectanguloTop;
}
function llevarRectanguloArriba() {
    const rectTop = rectanguloSeleccionado.getBoundingClientRect().top;
    const contTop = scrollWrapper.getBoundingClientRect().top;

    // scroll actual + diferencia de posiciones
    scrollWrapper.scrollTop += rectTop - contTop;
}

function arreglar_posicion(){ 
// Altura visible del contenedor
const contHeight = scrollWrapper.clientHeight;

// Posición del rectángulo dentro del contenedor
const rectTop = rectanguloSeleccionado.offsetTop;
const rectHeight = rectanguloSeleccionado.offsetHeight;

// Scroll actual
const scrollTop = scrollWrapper.scrollTop;

// Posición de la parte inferior del rectángulo relativa al viewport del contenedor
const rectBottom = rectTop + rectHeight;

// Posición de la parte inferior visible del contenedor
const viewportBottom = scrollTop + contHeight;

// Distancia entre la parte inferior del rectángulo y la parte inferior del viewport
const distancia = viewportBottom - rectBottom;

// Si la distancia es menor o igual a 65px, mover el scroll
const segment_visible = document.getElementById('segment_options');
/*
if (distancia <= 40 && segment_visible.style.display == "none") {
    llevarRectanguloArriba(); 
    deseleccionar_continuo = false;	
} 
*/
if (distancia <= 40) {
    llevarRectanguloArriba();  	
}  
if (segment_visible.style.display == "none") { 
    console.log("deseleccionar_continuo:",deseleccionar_continuo);
    deseleccionar_continuo = false;	
} 
}


function llevarRectanguloAbajo() {
    const rectTop = rectanguloSeleccionado.offsetTop;
    const rectHeight = rectanguloSeleccionado.offsetHeight;
    const contHeight = scrollWrapper.clientHeight;

    scrollWrapper.scrollTop = rectTop - (contHeight - rectHeight);
}









function limpiarMarcadoresYLabels() {
    const marcadores_fijos = document.getElementById('marcadores_fijos');
     
    marcadoresEnDOM.forEach((elemento) => {
        elemento.remove();
    }); 
    
    labelsEnDOM.forEach((elemento) => {
        elemento.remove();
    }); 
}
 
window.addEventListener('resize', () => {
    ANCHO_VENTANA_VIRTUAL = window.innerWidth;
    limpiarMarcadoresYLabels();
    resetear();   
});

/*
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => { 
    limpiarMarcadoresYLabels();
    renderizarElementosVisibles(); 
  });
}
*/

 


//funciona bien
function ratio_9_16_0() {
    const videoBlock = document.querySelector('.video-block');
    const wrapperMultimedia = document.querySelector('.wrapper-multimedia');
    const videoContent = document.querySelector('.video-content');
    const canvas = document.getElementById('canvas');
    
    // Resetear y aplicar estilos para video-block
    if (videoBlock) {
        videoBlock.style.cssText = `
            position: relative;
            width: 100%;
            flex: 1;
            min-height: 0;
            display: flex;
            align-items: stretch;
            justify-content: center;
            overflow: hidden;
        `;
    }
    
    // Resetear y aplicar estilos para wrapper-multimedia
    if (wrapperMultimedia) {
        wrapperMultimedia.style.cssText = `
            flex: 1 1 0;
            min-height: 0;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: initial;
            height: auto;
            max-height: none;
            max-width: none;
            aspect-ratio: auto;
            background-color: transparent;
        `;
    }
    
    // Resetear y aplicar estilos para video-content
    if (videoContent) {
        videoContent.style.cssText = `
            aspect-ratio: 9/16;
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
        `;
    }
    
    // Resetear y aplicar estilos para canvas
    if (canvas) {
        canvas.style.cssText = `
            max-width: 100%;
            max-height: 100%;
            aspect-ratio: 9/16;
            width: auto;
            height: auto;
        `;
    }
}

//funciona bien y mas estable
function ratio_9_16() {
    const generalMain = document.querySelector('.general-main');
    const videoBlock = document.querySelector('.video-block');
    const wrapperMultimedia = document.querySelector('.wrapper-multimedia');
    const videoContent = document.querySelector('.video-content');
    const canvas = document.getElementById('canvas');
    
    // RESETEO COMPLETO - eliminar el atributo style
    if (videoBlock) videoBlock.removeAttribute('style');
    if (wrapperMultimedia) wrapperMultimedia.removeAttribute('style');
    if (videoContent) videoContent.removeAttribute('style');
    if (canvas) canvas.removeAttribute('style');
    
    // Forzar reflow para que el navegador recalcule
    void videoBlock?.offsetHeight;
    
    // Aplicar estilos para video-block
    if (videoBlock) {
        videoBlock.style.cssText = `
            position: relative !important;
            width: 100% !important;
            flex: 1 !important;
            min-height: 0 !important;
            display: flex !important;
            align-items: stretch !important;
            justify-content: center !important;
            overflow: hidden !important;
        `;
    }
    
    // Aplicar estilos para wrapper-multimedia
    if (wrapperMultimedia) {
 
        wrapperMultimedia.style.cssText = `
            flex: 1 1 0 !important;
            min-height: 0 !important;
            overflow: hidden !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex-direction: initial !important;
            height: auto !important;
            max-height: none !important;
            max-width: none !important;
            aspect-ratio: auto !important;
            background-color: transparent !important;
        `;
 
 
	if (window.innerWidth <= 1000) {
	wrapperMultimedia.style.cssText = `
            flex: 1 1 0 !important;
            min-height: 0 !important;
            overflow: hidden !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex-direction: initial !important;
            height: auto !important;
            max-height: 50vh !important;
            max-width: none !important;
            aspect-ratio: auto !important;
            background-color: transparent !important;
        `; 
	}
	if (window.innerWidth <= 540) {
	wrapperMultimedia.style.cssText = `
            flex: 1 1 0 !important;
            min-height: 0 !important;
            overflow: hidden !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            flex-direction: initial !important;
            height: auto !important;
            max-height: 40vh !important;
            max-width: none !important;
            aspect-ratio: auto !important;
            background-color: transparent !important;
        `;  
	}
 
    }
    
    // Aplicar estilos para video-content
    if (videoContent) {
        videoContent.style.cssText = `
            aspect-ratio: 9/16 !important;
            max-width: 100% !important;
            max-height: 100% !important;
            width: auto !important;
            height: auto !important;
        `;
    }
    
    // Aplicar estilos para canvas
    if (canvas) {
        canvas.style.cssText = `
            max-width: 100% !important;
            max-height: 100% !important;
            aspect-ratio: 9/16 !important;
            width: auto !important;
            height: auto !important;
        `;
    } 
    resolution_scene = "720x1280";
    request_new_project();
}
 




function ratio_16_9() {
    const videoBlock = document.querySelector('.video-block');
    const wrapperMultimedia = document.querySelector('.wrapper-multimedia');
    const videoContent = document.querySelector('.video-content');
    const canvas = document.getElementById('canvas');
    
    // RESETEO COMPLETO - eliminar el atributo style
    if (videoBlock) videoBlock.removeAttribute('style');
    if (wrapperMultimedia) wrapperMultimedia.removeAttribute('style');
    if (videoContent) videoContent.removeAttribute('style');
    if (canvas) canvas.removeAttribute('style');
    
    // Forzar reflow para que el navegador recalcule
    void videoBlock?.offsetHeight;
    
    // Aplicar estilos para video-block
    if (videoBlock) {
        videoBlock.style.cssText = `
            position: relative !important;
            width: 100% !important;
            flex: 1 !important;
            min-height: 0 !important;
            display: flex !important;
            align-items: stretch !important;
            justify-content: center !important;
            overflow: hidden !important;
        `;
    }
    
    // Aplicar estilos para wrapper-multimedia
    if (wrapperMultimedia) { 
        wrapperMultimedia.style.cssText = `
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            justify-content: center !important;
            height: 100% !important;
            max-height: 100% !important;
            max-width: 100% !important;
            aspect-ratio: 16/9 !important;
            background-color: transparent !important;
        `; 
    }
    
    // Aplicar estilos para video-content
    if (videoContent) {
        videoContent.style.cssText = `
            display: block !important;
        `;
    }
    
    // Aplicar estilos para canvas
    if (canvas) {
        canvas.style.cssText = `
            width: 100% !important;
            height: 100% !important;
            aspect-ratio: 16/9 !important;
        `;
    }
    resolution_scene = "1280x720";
    request_new_project();
}

 


function safeSend(message) {
if (websocketClient.readyState === WebSocket.OPEN) {
websocketClient.send(message);
} else {
console.warn("WebSocket no está listo, estado:", websocketClient.readyState);
}
}
