
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

function crearRegla() { 
return;
    // Limpia todo primero
    contenedor.innerHTML = '';
    
    const offsetY = 0;//ALTURA_REGLA * 0.5 
    contenedor.style.width = `${ANCHO_VENTANA_VIRTUAL}px`; 
    contenedor.style.boxSizing = 'border-box';
    contenedor.style.position = "relative";
    contenedor.style.overflow = 'visible'; // Asegura esto
      
    const cantidadFondos = 8; 

    for (let i = 0; i < rectangulos.length; i++) {
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
        fondo.style.zIndex = '0';
        
        contenedor.appendChild(fondo);
    }
    if (window.innerWidth <= 1000) {
        const emptyBlockContainer = document.querySelector('.empty-block-container');
        const generalMain = document.querySelector('.general-main');
        
        if (generalMain && emptyBlockContainer) {
            const alturaGeneralMain = generalMain.offsetHeight;
            emptyBlockContainer.style.height = `calc(100vh - ${alturaGeneralMain}px)`;
        }
    }
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

 