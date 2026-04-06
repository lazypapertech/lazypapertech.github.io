 
function loadAnchorImage() {
    const filename = selected_rect.dataset.start_value; 
    const blobUrl = filename_url[filename]; 
    const img = document.getElementById('anchor-img');
    img.src = blobUrl;

    img.onload = () => {
        initAnchorPoint();
        updateAnchorPoint();
    };
}
 
const anchorState = {
    x: 0.5,
    y: 0.5,
    zoom: 1,
    dragging: false, 
    dragOffsetX: 0,
    dragOffsetY: 0
};

const POINT_RADIUS = 10;
const STEP_VALUE = 0.01;

 

function snapToGrid(value) {
    return Math.round(value / STEP_VALUE) * STEP_VALUE;
}

function initAnchorPoint() {
    const inputX = document.getElementById('input_dynamic_box_0');
    const inputY = document.getElementById('input_dynamic_box_1');

    anchorState.x = inputX.value === '' ? 0.5 : parseFloat(inputX.value);
    anchorState.y = inputY.value === '' ? 0.5 : parseFloat(inputY.value);
}

function updateAnchorPoint_0() {
    const viewport = document.querySelector('.image-scroll');
    const point = document.getElementById('anchor-point');

    if (!viewport || !point) return;

    const rect = viewport.getBoundingClientRect();
    const px = anchorState.x * rect.width;
    const py = anchorState.y * rect.height;

    point.style.left = `${px}px`;
    point.style.top = `${py}px`;
}
function updateAnchorPoint() {
    const viewport = document.querySelector('.image-scroll');
    const point = document.getElementById('anchor-point');
    const img = document.getElementById('anchor-img');

    if (!viewport || !point || !img) return;

    const imgRect = img.getBoundingClientRect(); // Usar la imagen, no el viewport

    const px = anchorState.x * imgRect.width;
    const py = anchorState.y * imgRect.height;

    // Posicionar relativo a la imagen
    point.style.left = `${px + (imgRect.left - viewport.getBoundingClientRect().left)}px`;
    point.style.top = `${py + (imgRect.top - viewport.getBoundingClientRect().top)}px`;
}

/*
function initAnchorEvents() {
    const point = document.getElementById('anchor-point');
    const wrapper = document.querySelector('.image-wrapper');
    const img = document.getElementById('anchor-img');

    if (!point || !wrapper || !img) return;

    window.addEventListener('mouseup', () => {
        if (anchorState.dragging) {
            anchorState.x = snapToGrid(anchorState.x);
            anchorState.y = snapToGrid(anchorState.y);
            
            document.getElementById('input_dynamic_box_0').value = anchorState.x.toFixed(2);
            document.getElementById('input_dynamic_box_1').value = anchorState.y.toFixed(2);
            
            updateAnchorPoint();
        }
        anchorState.dragging = false;
    });

    point.addEventListener('mousedown', e => {
        anchorState.dragging = true;
        const rect = point.getBoundingClientRect();
        anchorState.dragOffsetX = e.clientX - (rect.left + rect.width / 2);
        anchorState.dragOffsetY = e.clientY - (rect.top + rect.height / 2);
        e.preventDefault();
    });

    wrapper.addEventListener('mousemove', e => {
        if (!anchorState.dragging) return;

        const imgRect = img.getBoundingClientRect();
        const x = (e.clientX - imgRect.left - anchorState.dragOffsetX) / imgRect.width;
        const y = (e.clientY - imgRect.top - anchorState.dragOffsetY) / imgRect.height;

        anchorState.x = Math.min(1, Math.max(0, x));
        anchorState.y = Math.min(1, Math.max(0, y)); 

        document.getElementById('input_dynamic_box_0').value = anchorState.x.toFixed(2);
        document.getElementById('input_dynamic_box_1').value = anchorState.y.toFixed(2);

        updateAnchorPoint();
    });

    window.addEventListener('resize', () => {
        updateAnchorPoint();
    });
}
*/

function initAnchorEvents() {

    // Conectar botón de reset
const btnReset = document.querySelector('.reset_position_value');
if (btnReset) {
    btnReset.addEventListener('click', resetAnchorPosition);
}

    const point = document.getElementById('anchor-point');
    const wrapper = document.querySelector('.image-wrapper');
    const img = document.getElementById('anchor-img');
    if (!point || !wrapper || !img) return;

    // Función común para finalizar arrastre
    function finalizarArrastre() {
        if (anchorState.dragging) {
            anchorState.x = snapToGrid(anchorState.x);
            anchorState.y = snapToGrid(anchorState.y);
            
            document.getElementById('input_dynamic_box_0').value = anchorState.x.toFixed(2);
            document.getElementById('input_dynamic_box_1').value = anchorState.y.toFixed(2);
            
            updateAnchorPoint();
        }
        anchorState.dragging = false;
    }

    // Función común para iniciar arrastre
    function iniciarArrastre(clientX, clientY) {
        anchorState.dragging = true;
        const rect = point.getBoundingClientRect();
        anchorState.dragOffsetX = clientX - (rect.left + rect.width / 2);
        anchorState.dragOffsetY = clientY - (rect.top + rect.height / 2);
    }

    // Función común para mover
    function moverArrastre(clientX, clientY) {
        if (!anchorState.dragging) return;
        const imgRect = img.getBoundingClientRect();
        const x = (clientX - imgRect.left - anchorState.dragOffsetX) / imgRect.width;
        const y = (clientY - imgRect.top - anchorState.dragOffsetY) / imgRect.height;
        
        anchorState.x = Math.min(1, Math.max(0, x));
        anchorState.y = Math.min(1, Math.max(0, y)); 
        
        document.getElementById('input_dynamic_box_0').value = anchorState.x.toFixed(2);
        document.getElementById('input_dynamic_box_1').value = anchorState.y.toFixed(2);
        
        updateAnchorPoint();
    }

    // ===== EVENTOS MOUSE =====
    window.addEventListener('mouseup', finalizarArrastre);
    
    point.addEventListener('mousedown', e => {
        iniciarArrastre(e.clientX, e.clientY);
        e.preventDefault();
    });
    
    wrapper.addEventListener('mousemove', e => {
        moverArrastre(e.clientX, e.clientY);
    });

    // ===== EVENTOS TOUCH (TÁCTIL) =====
    window.addEventListener('touchend', finalizarArrastre);
    window.addEventListener('touchcancel', finalizarArrastre);
    
    point.addEventListener('touchstart', e => {
        const touch = e.touches[0];
        iniciarArrastre(touch.clientX, touch.clientY);
        e.preventDefault();
    }, { passive: false });
    
    wrapper.addEventListener('touchmove', e => {
        if (!anchorState.dragging) return;
        const touch = e.touches[0];
        moverArrastre(touch.clientX, touch.clientY);
        e.preventDefault();
    }, { passive: false });

    // ===== RESIZE =====
    window.addEventListener('resize', () => {
        updateAnchorPoint();
    });
}
  
function resetAnchorPosition() {
    anchorState.x = 0.5;
    anchorState.y = 0.5;
    
    document.getElementById('input_dynamic_box_0').value = anchorState.x.toFixed(2);
    document.getElementById('input_dynamic_box_1').value = anchorState.y.toFixed(2);
    
    updateAnchorPoint();
    
    console.log('Anchor point reseteado al centro:', anchorState.x, anchorState.y);
}

 
/*
window.addEventListener('wheel', function(e) {
  const zona = document.getElementById('marcadores_fijos');
  const rect = zona.getBoundingClientRect();
  
  const dentroDeZona = 
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom;

  if (dentroDeZona) {
    e.preventDefault();
    document.querySelector('.scroll-wrapper').scrollLeft += e.deltaY;
  }
}, { passive: false });
//window.addEventListener('wheel', (e) => console.log("ERROR WHEEL",e.clientX, e.clientY));
*/

document.getElementById('marcadores_fijos').addEventListener('wheel', function(e) {
  e.preventDefault();
  document.querySelector('.scroll-wrapper').scrollLeft += e.deltaY;
}, { passive: false, capture: true });
 

/*scale*/

function crearSliderDinamicoScale(idInput,property_name) {
    const input_original = document.getElementById(idInput);
    
    if (!input_original) {
        console.error('No se encontró el input con id:', idInput);
        return;
    }
    
    // Leer el valor original (flotante entre 0 y 1)
    let valorFlotante = parseFloat(input_original.value) || 0.5;
    if (property_name=="glow"){
	if (parseFloat(input_original.value)<0.02){
		valorFlotante = 0;
	}
	if (parseFloat(input_original.value)>=0.7){
		valorFlotante = 1;
	}
    }
     
    
    // Convertir a porcentaje (0.44 → 44)
    let valorPorcentaje = Math.round(valorFlotante * 100);
    
    console.log('Valor flotante leído:', valorFlotante);
    console.log('Convertido a porcentaje:', valorPorcentaje);
    
    // Crear contenedor para slider y display
    const contenedor = document.createElement('div');
    contenedor.style.cssText = 'display:flex; flex-direction:column; gap:12px; width:100%;';
    
    // Crear el slider
    const sliderContainer = document.createElement('div');
    sliderContainer.style.cssText = 'position:relative; width:100%; padding:10px 0;';
    
    const slider = document.createElement('input');
    slider.id = 'slider_scale_dynamic';
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100';
    if (property_name=="scale"){
	slider.max = '200';
    }
    slider.value = valorPorcentaje;
 
    slider.style.cssText = `
        width: 100%;
        height: 6px;
        border-radius: 10px;
        background: linear-gradient(to right, #7c55e6 0%, #7c55e6 ${valorPorcentaje}%, rgba(255,255,255,0.2) ${valorPorcentaje}%, rgba(255,255,255,0.2) 100%);
        outline: none;
        -webkit-appearance: none;
        cursor: pointer;
    `;
 
if (property_name=="scale"){
slider.style.cssText = `
    width: 100%;
    height: 6px;
    border-radius: 10px;
    background: linear-gradient(
        to right,
        #7c55e6 0%,
        #7c55e6 ${(valorPorcentaje / 200) * 100}%,
        rgba(255,255,255,0.2) ${(valorPorcentaje / 200) * 100}%,
        rgba(255,255,255,0.2) 100%
    );
    outline: none;
    -webkit-appearance: none;
    cursor: pointer;
`;
}
    
    sliderContainer.appendChild(slider);
    
    // Crear display visual (muestra el porcentaje)
    const displayVisual = document.createElement('input');
    displayVisual.id = 'display_scale_visual';
    displayVisual.type = 'text';
    displayVisual.readOnly = true;
    displayVisual.value = valorPorcentaje + '%';
    displayVisual.style.cssText = `
        width:100%; 
        padding:12px; 
        font-size:16px; 
        border-radius:8px; 
        background-color: rgba(65,65,65,0.6);
        border: 1px solid rgba(124,85,230,0.3);
        color: white;
        text-align: center;
        font-weight: 500;
        cursor: default;
    `;
    
    // Agregar slider y display al contenedor
    contenedor.appendChild(sliderContainer);
    contenedor.appendChild(displayVisual);
    
    // Insertar ANTES del input original
    input_original.parentNode.insertBefore(contenedor, input_original);
    
    // Ocultar el input original (pero mantenerlo funcional)
    input_original.style.display = 'none';
    
    // Evento cuando se mueve el slider
    slider.addEventListener('input', function() {
        const valorPorcentaje = this.value;
        
        // Actualizar display visual con porcentaje
        displayVisual.value = valorPorcentaje + '%';
        
        // Convertir de porcentaje a flotante (67 → 0.67)
        let valorFlotante = valorPorcentaje / 100;
        
        // Actualizar input original con flotante
        if (valorFlotante==0){
		valorFlotante = 0.001;
	}
        input_original.value = valorFlotante;
	if (property_name=="glow"){
		input_original.value = valorFlotante*0.7;
		if (valorFlotante<0.02){
			input_original.value = 0.01;
		}
	}
        
        console.log('Porcentaje:', valorPorcentaje + '% → Flotante:', valorFlotante);
        
        // Actualizar gradiente del slider 
        this.style.background = `linear-gradient(to right, #7c55e6 0%, #7c55e6 ${valorPorcentaje}%, rgba(255,255,255,0.2) ${valorPorcentaje}%, rgba(255,255,255,0.2) 100%)`;
	if (property_name=="scale"){
    	const porcentajeVisual = (valorPorcentaje / 200) * 100; 
    	this.style.background = `
        	linear-gradient(
            	to right,
            	#7c55e6 0%,
            	#7c55e6 ${porcentajeVisual}%,
            	rgba(255,255,255,0.2) ${porcentajeVisual}%,
            	rgba(255,255,255,0.2) 100%
        	)
    	`;
	}
    });
    
    console.log('Slider creado correctamente');
}


function crearSliderDinamicoBlur(idInput) {
    const input_original = document.getElementById(idInput);
    
    if (!input_original) {
        console.error('No se encontró el input con id:', idInput);
        return;
    }
    
    // Leer el valor original (flotante entre 0 y 1)
    let valorFlotante = parseFloat(input_original.value) || 0; 
     
    
    // Convertir a porcentaje (0.44 → 44)
    let valorPorcentaje = Math.round(valorFlotante * 100);
    
    console.log('Valor flotante leído:', valorFlotante);
    console.log('Convertido a porcentaje:', valorPorcentaje);
    
    // Crear contenedor para slider y display
    const contenedor = document.createElement('div');
    contenedor.style.cssText = 'display:flex; flex-direction:column; gap:12px; width:100%;';
    
    // Crear el slider
    const sliderContainer = document.createElement('div');
    sliderContainer.style.cssText = 'position:relative; width:100%; padding:10px 0;';
    
    const slider = document.createElement('input');
    slider.id = 'slider_scale_dynamic';
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100'; 
    slider.value = valorPorcentaje;
 
    slider.style.cssText = `
        width: 100%;
        height: 6px;
        border-radius: 10px;
        background: linear-gradient(to right, #7c55e6 0%, #7c55e6 ${valorPorcentaje}%, rgba(255,255,255,0.2) ${valorPorcentaje}%, rgba(255,255,255,0.2) 100%);
        outline: none;
        -webkit-appearance: none;
        cursor: pointer;
    `;
 
 
    
    sliderContainer.appendChild(slider);
    
    // Crear display visual (muestra el porcentaje)
    const displayVisual = document.createElement('input');
    displayVisual.id = 'display_scale_visual';
    displayVisual.type = 'text';
    displayVisual.readOnly = true;
    displayVisual.value = valorPorcentaje + '%';
    displayVisual.style.cssText = `
        width:100%; 
        padding:12px; 
        font-size:16px; 
        border-radius:8px; 
        background-color: rgba(65,65,65,0.6);
        border: 1px solid rgba(124,85,230,0.3);
        color: white;
        text-align: center;
        font-weight: 500;
        cursor: default;
    `;
    
    // Agregar slider y display al contenedor
    contenedor.appendChild(sliderContainer);
    contenedor.appendChild(displayVisual);
    
    // Insertar ANTES del input original
    input_original.parentNode.insertBefore(contenedor, input_original);
    
    // Ocultar el input original (pero mantenerlo funcional)
    input_original.style.display = 'none';
    
    // Evento cuando se mueve el slider
    slider.addEventListener('input', function() {
        const valorPorcentaje = this.value;
        
        // Actualizar display visual con porcentaje
        displayVisual.value = valorPorcentaje + '%';
        
        // Convertir de porcentaje a flotante (67 → 0.67)
        let valorFlotante = valorPorcentaje / 100;
        
         
        input_original.value = valorFlotante; 
        
        console.log('Porcentaje:', valorPorcentaje + '% → Flotante:', valorFlotante);
        
        // Actualizar gradiente del slider 
        this.style.background = `linear-gradient(to right, #7c55e6 0%, #7c55e6 ${valorPorcentaje}%, rgba(255,255,255,0.2) ${valorPorcentaje}%, rgba(255,255,255,0.2) 100%)`;
	 
    });
    
    console.log('Slider creado correctamente');
}


function crearSliderDinamicoOpacity(idInput) {
    const input_original = document.getElementById(idInput);
    
    if (!input_original) {
        console.error('No se encontró el input con id:', idInput);
        return;
    }
    
    // Leer el valor original (flotante entre 0 y 1)
    let valorFlotante = parseFloat(input_original.value) || 0.5;
    
    // Convertir a porcentaje (0.44 → 44)
    let valorPorcentaje = Math.round((valorFlotante/255.0) * 100);
    
    console.log('Valor flotante leído:', valorFlotante);
    console.log('Convertido a porcentaje:', valorPorcentaje);
    
    // Crear contenedor para slider y display
    const contenedor = document.createElement('div');
    contenedor.style.cssText = 'display:flex; flex-direction:column; gap:12px; width:100%;';
    
    // Crear el slider
    const sliderContainer = document.createElement('div');
    sliderContainer.style.cssText = 'position:relative; width:100%; padding:10px 0;';
    
    const slider = document.createElement('input');
    slider.id = 'slider_scale_dynamic';
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100';
    slider.value = valorPorcentaje;
    slider.style.cssText = `
        width: 100%;
        height: 6px;
        border-radius: 10px;
        background: linear-gradient(to right, #7c55e6 0%, #7c55e6 ${valorPorcentaje}%, rgba(255,255,255,0.2) ${valorPorcentaje}%, rgba(255,255,255,0.2) 100%);
        outline: none;
        -webkit-appearance: none;
        cursor: pointer;
    `;
    
    sliderContainer.appendChild(slider);
    
    // Crear display visual (muestra el porcentaje)
    const displayVisual = document.createElement('input');
    displayVisual.id = 'display_scale_visual';
    displayVisual.type = 'text';
    displayVisual.readOnly = true;
    displayVisual.value = valorPorcentaje + '%';
    displayVisual.style.cssText = `
        width:100%; 
        padding:12px; 
        font-size:16px; 
        border-radius:8px; 
        background-color: rgba(65,65,65,0.6);
        border: 1px solid rgba(124,85,230,0.3);
        color: white;
        text-align: center;
        font-weight: 500;
        cursor: default;
    `;
    
    // Agregar slider y display al contenedor
    contenedor.appendChild(sliderContainer);
    contenedor.appendChild(displayVisual);
    
    // Insertar ANTES del input original
    input_original.parentNode.insertBefore(contenedor, input_original);
    
    // Ocultar el input original (pero mantenerlo funcional)
    input_original.style.display = 'none';
    
    // Evento cuando se mueve el slider
    slider.addEventListener('input', function() {
        const valorPorcentaje = this.value;
        
        // Actualizar display visual con porcentaje
        displayVisual.value = valorPorcentaje + '%';
        
        // Convertir de porcentaje a flotante (67 → 0.67)
        let valorFlotante = Math.round(255 * valorPorcentaje / 100); 
        input_original.value = valorFlotante;
        
        console.log('Porcentaje:', valorPorcentaje + '% → Flotante:', valorFlotante);
        
        // Actualizar gradiente del slider
        this.style.background = `linear-gradient(to right, #7c55e6 0%, #7c55e6 ${valorPorcentaje}%, rgba(255,255,255,0.2) ${valorPorcentaje}%, rgba(255,255,255,0.2) 100%)`;
    });
    
    console.log('Slider creado correctamente');
}







function crearSliderCircular(idInput) {
    const input_original = document.getElementById(idInput);
    
    if (!input_original) {
        console.error('No se encontró el input con id:', idInput);
        return;
    }
    
    // Leer el valor original en grados
    let gradosActuales = parseFloat(input_original.value) || 0;
    
    console.log('Grados iniciales leídos:', gradosActuales);
    
    // Crear contenedor principal
    const contenedor = document.createElement('div');
    contenedor.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:20px; width:100%;';
    
    // Display de grados (arriba del aro)
    const displayGrados = document.createElement('input');
    displayGrados.id = 'display_grados_visual';
    displayGrados.type = 'text';
    displayGrados.readOnly = true;
    displayGrados.value = Math.round(gradosActuales) + '°';
    displayGrados.style.cssText = `
        width:120px; 
        padding:12px; 
        font-size:20px; 
        border-radius:8px; 
        background-color: rgba(65,65,65,0.6);
        border: 1px solid rgba(124,85,230,0.3);
        color: white;
        text-align: center;
        font-weight: 600;
        cursor: default;
    `;
    
    // Contenedor del aro circular
    const aroContainer = document.createElement('div');
    aroContainer.style.cssText = 'position:relative; width:200px; height:200px;';
    
    // Canvas para dibujar el aro y el progreso
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    canvas.style.cssText = 'position:absolute; top:0; left:0;';
    
    const ctx = canvas.getContext('2d');
    
    // SVG para el cursor (círculo blanco)
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: grab;
        transform: translate(-50%, -50%);
        touch-action: none;
    `;
    
    aroContainer.appendChild(canvas);
    aroContainer.appendChild(cursor);
    
    contenedor.appendChild(displayGrados);
    contenedor.appendChild(aroContainer);
    
    // Insertar ANTES del input original
    input_original.parentNode.insertBefore(contenedor, input_original);
    input_original.style.display = 'none';
    
    // Función para dibujar el aro
    function dibujarAro() {
        const centerX = 100;
        const centerY = 100;
        const radius = 80;
        
        ctx.clearRect(0, 0, 200, 200);
        
        // Dibujar aro base (gris oscuro)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgb(25,25,25)';
        ctx.lineWidth = 10;
        ctx.stroke();
        
        // Determinar si es positivo (antihorario/púrpura) o negativo (horario/verde)
        const esPositivo = gradosActuales >= 0;
        const gradosAbsolutos = Math.abs(gradosActuales);
        
        // Calcular cuántas vueltas completas (cada 360°)
        const vueltasCompletas = Math.floor(gradosAbsolutos / 360);
        const gradosRestantes = gradosAbsolutos % 360;
        
        // Calcular opacidad acumulada (máximo 5 vueltas = opacidad 1)
        let opacidadTotal = Math.min(vueltasCompletas * 0.2, 1);
        
        // Color según dirección
        const color = esPositivo ? '124, 85, 230' : '85, 230, 124'; // Púrpura o Verde
        
        // Si hay vueltas completas, pintar círculo completo con opacidad acumulada
        if (vueltasCompletas > 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${color}, ${opacidadTotal})`;
            ctx.lineWidth = 10;
            ctx.stroke();
        }
        
        // Dibujar progreso de la vuelta actual
        if (gradosRestantes > 0) {
            const anguloInicio = -Math.PI / 2; // 0° arriba
            
            if (esPositivo) {
                // Antihorario (púrpura)
                const anguloFin = anguloInicio - (gradosRestantes * Math.PI / 180);
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, anguloInicio, anguloFin, true);
                ctx.strokeStyle = `rgba(${color}, ${0.2 + opacidadTotal})`;
                ctx.lineWidth = 10;
                ctx.stroke();
            } else {
                // Horario (verde)
                const anguloFin = anguloInicio + (gradosRestantes * Math.PI / 180);
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, anguloInicio, anguloFin, false);
                ctx.strokeStyle = `rgba(${color}, ${0.2 + opacidadTotal})`;
                ctx.lineWidth = 10;
                ctx.stroke();
            }
        }
    }
    
    // Función para actualizar posición del cursor
    function actualizarCursor() {
        const centerX = 100;
        const centerY = 100;
        const radius = 80;
        
        // Convertir grados a radianes (0° arriba, antihorario positivo)
        const angulo = (-gradosActuales - 90) * Math.PI / 180;
        
        const x = centerX + radius * Math.cos(angulo);
        const y = centerY + radius * Math.sin(angulo);
        
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
    }
    
    // Variables para el arrastre
    let isDragging = false;
    let anguloAnterior = 0;
    
    function calcularAngulo(clientX, clientY) {
        const rect = aroContainer.getBoundingClientRect();
        const centerX = rect.left + 100;
        const centerY = rect.top + 100;
        
        const dx = clientX - centerX;
        const dy = clientY - centerY;
        
        // Calcular ángulo en grados (0° arriba, antihorario positivo)
        let angulo = -(Math.atan2(dy, dx) * 180 / Math.PI + 90);
        if (angulo < 0) angulo += 360;
        
        return angulo;
    }
    
    function iniciarArrastre(clientX, clientY) {
        isDragging = true;
        cursor.style.cursor = 'grabbing';
        anguloAnterior = calcularAngulo(clientX, clientY);
    }
    
    function moverArrastre(clientX, clientY) {
        if (!isDragging) return;
        
        const anguloActual = calcularAngulo(clientX, clientY);
        let diferencia = anguloActual - anguloAnterior;
        
        // Detectar cruce de 0°/360°
        if (diferencia > 180) diferencia -= 360;
        if (diferencia < -180) diferencia += 360;
        
        gradosActuales += diferencia;
        anguloAnterior = anguloActual;
        
        // Actualizar displays
        displayGrados.value = Math.round(gradosActuales) + '°';
        gradosActuales = Math.round((gradosActuales) * 100) / 100;
        input_original.value = gradosActuales;
        
        // Redibujar
        dibujarAro();
        actualizarCursor();
        
        console.log('Grados actuales:', gradosActuales);
    }
    
    function finalizarArrastre() {
        if (isDragging) {
            isDragging = false;
            cursor.style.cursor = 'grab';
        }
    }
    
    // Eventos MOUSE
    cursor.addEventListener('mousedown', (e) => {
        iniciarArrastre(e.clientX, e.clientY);
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        moverArrastre(e.clientX, e.clientY);
    });
    
    document.addEventListener('mouseup', finalizarArrastre);
    
    // Eventos TOUCH (táctil)
    cursor.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        iniciarArrastre(touch.clientX, touch.clientY);
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        moverArrastre(touch.clientX, touch.clientY);
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchend', finalizarArrastre);
    document.addEventListener('touchcancel', finalizarArrastre);
    
    // Dibujo inicial
    dibujarAro();
    actualizarCursor();
    
    console.log('Slider circular creado correctamente');
}







function crearControlPosicion2D(idInputX, idInputY, lienzo_width, lienzo_height, pasos = 10) {
    const input_x = document.getElementById(idInputX);
    const input_y = document.getElementById(idInputY);
    
    if (!input_x || !input_y) {
        console.error('No se encontraron los inputs');
        return;
    }
    
    // Leer valores iniciales
    let posX = parseFloat(input_x.value) || 0;
    let posY = parseFloat(input_y.value) || 0;
    
    console.log('Posición inicial:', posX, posY);
    
    // Calcular el porcentaje necesario para mostrar el punto si está fuera
    function calcularZoomNecesario(x, y) {
    let maxExceso = 1;
    
    // Calcular cuánto excede en cada dirección
    if (x < 0) maxExceso = Math.max(maxExceso, 1 + Math.abs(x) / (lienzo_width / 2));
    if (y < 0) maxExceso = Math.max(maxExceso, 1 + Math.abs(y) / (lienzo_height / 2));
    if (x > lienzo_width) maxExceso = Math.max(maxExceso, 1 + (x - lienzo_width) / (lienzo_width / 2));
    if (y > lienzo_height) maxExceso = Math.max(maxExceso, 1 + (y - lienzo_height) / (lienzo_height / 2));
    
    if (maxExceso!=1){
	maxExceso = maxExceso + 0.1;
    }	
    return Math.min(maxExceso * 100, 200);
}
    
    let zoomPorcentaje = calcularZoomNecesario(posX, posY);
    
    console.log('Zoom inicial calculado:', zoomPorcentaje + '%');
    
    // Crear contenedor principal
    const contenedor = document.createElement('div');
    contenedor.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:20px; width:100%;';
    
    // Contenedor del lienzo (tamaño fijo visual)
    let VISUAL_WIDTH = 280;
    const ratio = lienzo_height / lienzo_width;
    let VISUAL_HEIGHT = VISUAL_WIDTH * ratio;
    if (VISUAL_HEIGHT>480){
	VISUAL_WIDTH = 180; 
        VISUAL_HEIGHT = VISUAL_WIDTH * ratio;
    }
    
    const canvasContainer = document.createElement('div');
    canvasContainer.style.cssText = `
        position: relative;
        width: ${VISUAL_WIDTH}px;
        height: ${VISUAL_HEIGHT}px;
        overflow: hidden;
        border: 2px solid white;
        background: transparent;
    `;
    
    // Canvas para el lienzo y fondo
    const canvas = document.createElement('canvas');
    canvas.width = VISUAL_WIDTH * 2;
    canvas.height = VISUAL_HEIGHT * 2;
    canvas.style.cssText = `
        position: absolute;
        transform-origin: top left;
    `;
    
    const ctx = canvas.getContext('2d');
    
    // Punto rojo draggable
    const punto = document.createElement('div');
    punto.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        background: red;
        border: 2px solid white;
        border-radius: 50%;
        cursor: grab;
        transform: translate(-50%, -50%);
        z-index: 10;
        touch-action: none;
    `;
    
    canvasContainer.appendChild(canvas);
    canvasContainer.appendChild(punto);
    
    // Slider de zoom
    const zoomContainer = document.createElement('div');
    zoomContainer.style.cssText = 'display:flex; flex-direction:column; gap:12px; width:100%;';
    
    const zoomLabel = document.createElement('strong');
    zoomLabel.textContent = 'Zoom:';
    zoomLabel.style.fontSize = '14px';
    
    const sliderZoomDiv = document.createElement('div');
    sliderZoomDiv.style.cssText = 'position:relative; width:100%; padding:10px 0;';
    
    const sliderZoom = document.createElement('input');
    sliderZoom.type = 'range';
    sliderZoom.min = '100';
    sliderZoom.max = '200';
    sliderZoom.value = zoomPorcentaje;
    sliderZoom.style.cssText = `
        width: 100%;
        height: 6px;
        border-radius: 10px;
        background: linear-gradient(to right, #7c55e6 0%, #7c55e6 ${(zoomPorcentaje - 100)}%, rgba(255,255,255,0.2) ${(zoomPorcentaje - 100)}%, rgba(255,255,255,0.2) 100%);
        outline: none;
        -webkit-appearance: none;
        cursor: pointer;
    `;
    
    sliderZoomDiv.appendChild(sliderZoom);
    
    const displayZoom = document.createElement('input');
    displayZoom.type = 'text';
    displayZoom.readOnly = true;
    displayZoom.value = Math.round(zoomPorcentaje) + '%';
    displayZoom.style.cssText = `
        width:100%; 
        padding:12px; 
        font-size:16px; 
        border-radius:8px; 
        background-color: rgba(65,65,65,0.6);
        border: 1px solid rgba(124,85,230,0.3);
        color: white;
        text-align: center;
        font-weight: 500;
        cursor: default;
    `;
    
    //zoomContainer.appendChild(zoomLabel);
    zoomContainer.appendChild(sliderZoomDiv);
    //zoomContainer.appendChild(displayZoom);
    
    contenedor.appendChild(canvasContainer);
    contenedor.appendChild(zoomContainer);
    
    // Insertar antes del primer input
    input_x.parentNode.parentNode.insertBefore(contenedor, input_x.parentNode);
    
    // Hacer inputs readonly
    //input_x.readOnly = true;
    //input_y.readOnly = true;
    input_x.style.cssText = 'flex:1; min-width:75px; max-width:85px; padding:8px 4px; font-size:16px; border-radius:6px; background-color: rgba(65,65,65,0.6); border: 1px solid rgba(124,85,230,0.3); color: white; text-align: center; cursor: default;';
    input_y.style.cssText = 'flex:1; min-width:75px; max-width:85px; padding:8px 4px; font-size:16px; border-radius:6px; background-color: rgba(65,65,65,0.6); border: 1px solid rgba(124,85,230,0.3); color: white; text-align: center; cursor: default;';
    
    // Función para dibujar
    function dibujar() {
        const zoom = zoomPorcentaje / 100;
        const canvasW = VISUAL_WIDTH * 2;
        const canvasH = VISUAL_HEIGHT * 2;
        
        ctx.clearRect(0, 0, canvasW, canvasH);
        
        // Calcular dimensiones del lienzo real escalado
        const lienzoVisualW = VISUAL_WIDTH / zoom;
        const lienzoVisualH = VISUAL_HEIGHT / zoom;
        
        // Centrar el lienzo en el canvas
        const offsetX = (VISUAL_WIDTH - lienzoVisualW) / 2;
        const offsetY = (VISUAL_HEIGHT - lienzoVisualH) / 2;
        
        // Dibujar región del lienzo real (gris)
        ctx.fillStyle = 'rgb(100,100,100)';
        ctx.fillRect(offsetX, offsetY, lienzoVisualW, lienzoVisualH);
        
        // Contorno blanco del lienzo
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(offsetX, offsetY, lienzoVisualW, lienzoVisualH);
        
        // Actualizar posición del canvas
        canvas.style.transform = `scale(${1})`;
        canvas.style.left = '0px';
        canvas.style.top = '0px';
    }
    
    // Función para actualizar posición del punto
    function actualizarPunto() {
        const zoom = zoomPorcentaje / 100;
        const lienzoVisualW = VISUAL_WIDTH / zoom;
        const lienzoVisualH = VISUAL_HEIGHT / zoom;
        const offsetX = (VISUAL_WIDTH - lienzoVisualW) / 2;
        const offsetY = (VISUAL_HEIGHT - lienzoVisualH) / 2;
        
        // Convertir coordenadas del lienzo a coordenadas visuales
        const escalaX = lienzoVisualW / lienzo_width;
        const escalaY = lienzoVisualH / lienzo_height;
        
        const visualX = offsetX + posX * escalaX;
        const visualY = offsetY + posY * escalaY;
        
        punto.style.left = visualX + 'px';
        punto.style.top = visualY + 'px';
        
        // Actualizar inputs
        input_x.value = Math.round(posX);
        input_y.value = Math.round(posY);
    }
    
    // Ajustar a la grilla discreta
    function ajustarAGrilla(x, y) {
        const pasoX = lienzo_width / pasos;
        const pasoY = lienzo_height / pasos;
        
        const gridX = Math.round(x / pasoX) * pasoX;
        const gridY = Math.round(y / pasoY) * pasoY;
        
        return { x: gridX, y: gridY };
    }
    
    // Variables de arrastre
    let isDragging = false;
    
    function iniciarArrastre(clientX, clientY) {
        isDragging = true;
        punto.style.cursor = 'grabbing';
    }
    
    function moverArrastre(clientX, clientY) {
    if (!isDragging) return;
    
    const rect = canvasContainer.getBoundingClientRect();
    const visualX = clientX - rect.left;
    const visualY = clientY - rect.top;
    
    const zoom = zoomPorcentaje / 100;
    const lienzoVisualW = VISUAL_WIDTH / zoom;
    const lienzoVisualH = VISUAL_HEIGHT / zoom;
    const offsetX = (VISUAL_WIDTH - lienzoVisualW) / 2;
    const offsetY = (VISUAL_HEIGHT - lienzoVisualH) / 2;
    
    // Convertir de coordenadas visuales a coordenadas del lienzo
    const escalaX = lienzo_width / lienzoVisualW;
    const escalaY = lienzo_height / lienzoVisualH;
    
    let nuevaPosX = (visualX - offsetX) * escalaX;
    let nuevaPosY = (visualY - offsetY) * escalaY;
    
    // Limitar el rango
    const minX = -lienzo_width / 2;
    const maxX = lienzo_width + lienzo_width / 2;
    const minY = -lienzo_height / 2;
    const maxY = lienzo_height + lienzo_height / 2;
    
    if (nuevaPosX >= minX && nuevaPosX <= maxX) {
        posX = nuevaPosX;
    }
    if (nuevaPosY >= minY && nuevaPosY <= maxY) {
        posY = nuevaPosY;
    }
    
    actualizarPunto();
}
    
    function finalizarArrastre() {
        if (!isDragging) return;
        isDragging = false;
        punto.style.cursor = 'grab';
        
        // Ajustar a grilla
        const ajustado = ajustarAGrilla(posX, posY);
        posX = ajustado.x;
        posY = ajustado.y;
        
        actualizarPunto();
        console.log('Posición final ajustada:', posX, posY);
    }
    function resetearPosicion() {
    posX = lienzo_width / 2;
    posY = lienzo_height / 2;
    
    // Calcular zoom necesario (debería ser 100% si está en el centro)
    zoomPorcentaje = calcularZoomNecesario(posX, posY);
    
    // Actualizar slider de zoom
    sliderZoom.value = zoomPorcentaje;
    displayZoom.value = Math.round(zoomPorcentaje) + '%';
    const percentage = zoomPorcentaje - 100;
    sliderZoom.style.background = `linear-gradient(to right, #7c55e6 0%, #7c55e6 ${percentage}%, rgba(255,255,255,0.2) ${percentage}%, rgba(255,255,255,0.2) 100%)`;
    
    // Redibujar y actualizar punto
    dibujar();
    actualizarPunto();
    
    console.log('Posición reseteada al centro:', posX, posY);
}
    
    // Eventos del punto (mouse)
    punto.addEventListener('mousedown', (e) => {
        iniciarArrastre(e.clientX, e.clientY);
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        moverArrastre(e.clientX, e.clientY);
    });
    
    document.addEventListener('mouseup', finalizarArrastre);
    
    // Eventos del punto (touch)
    punto.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        iniciarArrastre(touch.clientX, touch.clientY);
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        moverArrastre(touch.clientX, touch.clientY);
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchend', finalizarArrastre);
    document.addEventListener('touchcancel', finalizarArrastre);
    
    // Evento del slider de zoom
    sliderZoom.addEventListener('input', function() {
        zoomPorcentaje = parseFloat(this.value);
        displayZoom.value = Math.round(zoomPorcentaje) + '%';
        
        const percentage = zoomPorcentaje - 100;
        this.style.background = `linear-gradient(to right, #7c55e6 0%, #7c55e6 ${percentage}%, rgba(255,255,255,0.2) ${percentage}%, rgba(255,255,255,0.2) 100%)`;
        
        dibujar();
        actualizarPunto();
    });
    
    // Dibujo inicial
    dibujar();
    actualizarPunto();
    
    // Buscar y conectar el botón de reset
    const btnReset = document.querySelector('.reset_position_value');
    if (btnReset) {
    	btnReset.addEventListener('click', resetearPosicion);
    }
    console.log('Control de posición 2D creado correctamente');
}

 

function crearSelectorReveal(idInput) {
console.log("crearSelectorReveal");
    const input_original = document.getElementById(idInput);
    
    if (!input_original) {
        console.error('No se encontró el input con id:', idInput);
        return;
    }
    
    // Leer el valor original
    let valorActual = input_original.value || 'off';
    
    console.log('Valor leído:', valorActual);
    
    // Hacer el input visible pero no editable (solo muestra el valor)
    input_original.readOnly = true;
    input_original.style.cssText = `
        width: 100%;
        padding: 8px;
        font-size: 14px;
        border-radius: 6px;
        background-color: rgba(65,65,65,0.4);
        border: 1px solid rgba(124,85,230,0.2);
        color: #aaa;
        text-align: center;
        cursor: default;
        margin-bottom: 12px;
    `;
    
    // Crear contenedor para las opciones
    const contenedor = document.createElement('div');
    contenedor.style.cssText = 'display:flex; flex-direction:column; gap:8px; width:100%;';
    
    // Opciones disponibles
    const opciones = [
        { valor: 'off', texto: 'Off' },
        { valor: 'show', texto: 'Hidden to Visible' },
        { valor: 'hide', texto: 'Visible to Hidden' }
    ];
    
    // Crear cada opción
    opciones.forEach(opcion => {
        const fila = document.createElement('div');
        fila.style.cssText = `
            display: flex;
            align-items: center;
            padding: 10px 12px;
            border-radius: 8px;
            background-color: rgba(65,65,65,0.3);
            border: 2px solid ${valorActual === opcion.valor ? '#7c55e6' : 'rgba(255,255,255,0.1)'};
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'reveal_option';
        radio.value = opcion.valor;
        radio.checked = (valorActual === opcion.valor);
        radio.style.cssText = 'margin-right: 10px; cursor: pointer;';
        
        const label = document.createElement('span');
        label.textContent = opcion.texto;
        label.style.cssText = 'color: white; font-size: 14px; cursor: pointer;';
        
        fila.appendChild(radio);
        fila.appendChild(label);
        
        // Evento click en toda la fila
        fila.addEventListener('click', function() {
            // Desmarcar todas las opciones visualmente
            contenedor.querySelectorAll('div').forEach(f => {
                f.style.borderColor = 'rgba(255,255,255,0.1)';
            });
            
            // Marcar esta opción
            fila.style.borderColor = '#7c55e6';
            radio.checked = true;
            
            // Actualizar input original
            input_original.value = opcion.valor;
            
            console.log('Opción seleccionada:', opcion.valor);
        });
        
        contenedor.appendChild(fila);
    });
    
    // Insertar DESPUÉS del input original
    input_original.parentNode.insertBefore(contenedor, input_original.nextSibling);
    
    console.log('Selector de reveal creado correctamente');
}















function parseKeyframes(input) {
  // Regex global que detecta cada bloque sin depender de saltos de línea
  const regex = /time=([\d]+(?:\.\d+)?)\s+object=([^\s]+)\s+([a-zA-Z_]+)=((?:<[^>]*>)|(?:[^\s]+(?:\s[^\s]+)*?))\s+keyframe_type=([A-Z0-9]+)/g;

  const matches = [];
  let match;

  while ((match = regex.exec(input)) !== null) {
    const time = parseFloat(match[1]);
    const object = match[2];
    const property = match[3];
    let value = match[4].trim();
    const keyType = match[5];

    // Normalizar valores numéricos múltiples (ej: "255 0 0")
    /*
    if (!value.startsWith("<")) {
      if (value.includes(" ")) {
        value = value.split(/\s+/).map(v => {
          const n = Number(v);
          return isNaN(n) ? v : n;
        });
      } else {
        const n = Number(value);
        value = isNaN(n) ? value : n;
      }
    }
    */

    // Convertir todo a string
    if (!value.startsWith("<")) {
      value = value.trim().replace(/\s+/g, ",");
    } else {
      value = value.trim();
    }

    matches.push({
      time,
      object,
      property,
      value,
      keyType
    });
  }

  // Agrupar por object + property
  const groups = {};
  for (const kf of matches) {
    const key = `${kf.object}||${kf.property}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(kf);
  }

  const result = [];

  for (const key in groups) {
    const group = groups[key].sort((a, b) => a.time - b.time);
    const segments = [];

    for (let i = 0; i < group.length - 1; i++) {
      const current = group[i];
      const next = group[i + 1];

      const currentType = current.keyType;
      const nextType = next.keyType;

      // Segmentos Lineales (L1 -> L, L -> L2, etc.)
      if (currentType.startsWith("L") && nextType.startsWith("L")) {
        segments.push({
          object_name: current.object,
          property: current.property,
          start: current.time,
          end: next.time,
          start_value: current.value,
          end_value: next.value,
          segment_type: "L"
        });
      }

      // Segmentos Hold (H1 -> H2)
      if (currentType === "H1" && nextType === "H2") {
        segments.push({
          object_name: current.object,
          property: current.property,
          start: current.time,
          end: next.time,
          start_value: current.value,
          end_value: current.value,
          segment_type: "H"
        });
      }
    }

    if (segments.length > 0) {
      result.push(segments);
    }
  }

  return result;
}





function parseKeyframesByItems_old(input) {
  const regex = /time=([\d]+(?:\.\d+)?)\s+object=([^\s]+)\s+([a-zA-Z_]+)=((?:<[^>]*>)|(?:[^\s]+(?:\s[^\s]+)*?))\s+keyframe_type=([A-Z0-9]+)/g;
  const matches = [];
  let match;
  while ((match = regex.exec(input)) !== null) {
    const time = parseFloat(match[1]);
    const object = match[2];
    const property = match[3];
    let value = match[4].trim();
    const keyType = match[5];
    if (!value.startsWith("<")) {
      value = value.trim().replace(/\s+/g, ",");
    } else {
      value = value.trim();
    }
    matches.push({ time, object, property, value, keyType });
  }

  const groups = {};
  for (const kf of matches) {
    const key = `${kf.object}||${kf.property}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(kf);
  }

  const byObject = {};  // <-- nivel extra por objeto
  for (const key in groups) {
    const group = groups[key].sort((a, b) => a.time - b.time);
    const segments = [];
    for (let i = 0; i < group.length - 1; i++) {
      const current = group[i];
      const next = group[i + 1];
      const currentType = current.keyType;
      const nextType = next.keyType;
      if (currentType.startsWith("L") && nextType.startsWith("L")) {
        segments.push({
          object_name: current.object,
          property: current.property,
          start: current.time,
          end: next.time,
          start_value: current.value,
          end_value: next.value,
          segment_type: "L"
        });
      }
      if (currentType === "H1" && nextType === "H2") {
        segments.push({
          object_name: current.object,
          property: current.property,
          start: current.time,
          end: next.time,
          start_value: current.value,
          end_value: current.value,
          segment_type: "H"
        });
      }
    }
    if (segments.length > 0) {
      const objectName = key.split("||")[0];  // <-- extraer nombre del objeto
      if (!byObject[objectName]) byObject[objectName] = [];
      byObject[objectName].push(segments);    // <-- agrupar por objeto
    }
  }

  return Object.values(byObject);  // <-- [ [[...], [...]], [[...]], ... ]
}


/*
const input = `
time=0.00 object=circulo position=0 0 keyframe_type=L1
time=1.50 object=circulo position=5 8 keyframe_type=L
time=3.00 object=circulo position=10 0 keyframe_type=L2

time=0.00 object=circulo rotation=0 keyframe_type=L1
time=2 object=circulo rotation=180 keyframe_type=L
time=4.00 object=circulo rotation=360 keyframe_type=L2 




time=0.00 object=triangulo position=0 0 keyframe_type=L1
time=1.50 object=triangulo position=6 9 keyframe_type=L
time=3.00 object=triangulo position=10 0 keyframe_type=L2

time=0.00 object=triangulo rotation=0 keyframe_type=L1
time=2 object=triangulo rotation=100 keyframe_type=L
time=4.00 object=triangulo rotation=240 keyframe_type=L2 
 



time=0.00 object=cuadrado position=-1 -4 keyframe_type=L1
time=1.50 object=cuadrado position=-1 -9 keyframe_type=L
time=3.00 object=cuadrado position=1 -20 keyframe_type=L2

time=0.00 object=cuadrado rotation=0 keyframe_type=L1
time=2 object=cuadrado rotation=-10 keyframe_type=L
time=4.00 object=cuadrado rotation=-240 keyframe_type=L2 
 
`;
*/


function functionsToKeyframes(input, step = 0.2) {
console.log("input functionsToKeyframes:",input);
  if (!Number.isFinite(step) || step <= 0)
    throw new Error(`step debe ser un número positivo, recibido: ${step}`);

  const EPS = 1e-9;
  const lines = input
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/["""'']/g, "")
    .trim()
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const segments = [];

  for (let line of lines) {
    // Intenta match vectorial (x(t) e y(t))
    const vecMatch = line.match(
      /object\s*=\s*(\S+)\s+property\s*=\s*(\S+)\s+t_start\s*=\s*([\d.eE+\-]+)\s+t_end\s*=\s*([\d.eE+\-]+)\s+x\(t\)\s*=\s*(.+?)\s+y\(t\)\s*=\s*(.+?)\s*$/
    );
    // Intenta match escalar (f(t))
    const scaMatch = !vecMatch && line.match(
      /object\s*=\s*(\S+)\s+property\s*=\s*(\S+)\s+t_start\s*=\s*([\d.eE+\-]+)\s+t_end\s*=\s*([\d.eE+\-]+)\s+f\(t\)\s*=\s*(.+?)\s*$/
    );

    if (!vecMatch && !scaMatch) { console.warn("Línea ignorada:", line); continue; }

    if (vecMatch) {
      const [, object, property, tStartStr, tEndStr, xExpr, yExpr] = vecMatch;
      const tStart = parseFloat(tStartStr);
      const tEnd   = parseFloat(tEndStr);
      if (!Number.isFinite(tStart) || !Number.isFinite(tEnd))
        throw new Error(`t_start/t_end inválidos en: ${line}`);
      if (tStart >= tEnd)
        throw new Error(`t_start (${tStart}) >= t_end (${tEnd}) en object=${object}`);
      segments.push({ object, property, tStart, tEnd, type: "vector", xExpr, yExpr });
    } else {
      const [, object, property, tStartStr, tEndStr, fExpr] = scaMatch;
      const tStart = parseFloat(tStartStr);
      const tEnd   = parseFloat(tEndStr);
      if (!Number.isFinite(tStart) || !Number.isFinite(tEnd))
        throw new Error(`t_start/t_end inválidos en: ${line}`);
      if (tStart >= tEnd)
        throw new Error(`t_start (${tStart}) >= t_end (${tEnd}) en object=${object}`);
      segments.push({ object, property, tStart, tEnd, type: "scalar", fExpr });
    }
  }

  if (segments.length === 0)
    throw new Error("No se encontraron segmentos válidos en el input.");

  function compile(expr, objId) {
    try {
      return new Function("t", `"use strict";
        const {sin,cos,tan,asin,acos,atan,atan2,exp,log,log2,log10,sqrt,cbrt,
               pow,abs,sign,ceil,floor,round,min,max,hypot,PI,E,LN2,LN10,SQRT2} = Math;
        return (${expr});
      `);
    } catch (e) {
      throw new Error(`Expresión inválida "${expr}" en object=${objId}: ${e.message}`);
    }
  }

  const results = [];

  for (let seg of segments) {
    const { object, property, tStart, tEnd } = seg;

    const nSteps = Math.ceil((tEnd - tStart) / step - EPS);
    const tValues = [];
    for (let i = 0; i <= nSteps; i++) {
      const t = tStart + i * step;
      if (t > tEnd + EPS) break;
      tValues.push(Math.min(t, tEnd));
    }
    if (Math.abs(tValues[tValues.length - 1] - tEnd) > EPS)
      tValues.push(tEnd);

    if (seg.type === "vector") {
      const fx = compile(seg.xExpr, object);
      const fy = compile(seg.yExpr, object);

      tValues.forEach((t, idx) => {
        let x, y;
        try { x = fx(t); } catch (e) { throw new Error(`Error en x(t) object=${object} property=${property} t=${t}: ${e.message}`); }
        try { y = fy(t); } catch (e) { throw new Error(`Error en y(t) object=${object} property=${property} t=${t}: ${e.message}`); }
        if (!Number.isFinite(x) || !Number.isFinite(y))
          throw new Error(`Valor no finito en object=${object} property=${property} t=${t}: x=${x} y=${y}`);

        const ktype = idx === 0 ? "L1" : idx === tValues.length - 1 ? "L2" : "L";
        results.push(`time=${t.toFixed(2)} object=${object} property=${property} value=${x.toFixed(2)} ${y.toFixed(2)} keyframe_type=${ktype}`);
      });

    } else {
      const ff = compile(seg.fExpr, object);

      tValues.forEach((t, idx) => {
        let v;
        try { v = ff(t); } catch (e) { throw new Error(`Error en f(t) object=${object} property=${property} t=${t}: ${e.message}`); }
        if (!Number.isFinite(v))
          throw new Error(`Valor no finito en object=${object} property=${property} t=${t}: f=${v}`);

        const ktype = idx === 0 ? "L1" : idx === tValues.length - 1 ? "L2" : "L";
        results.push(`time=${t.toFixed(2)} object=${object} property=${property} value=${v.toFixed(2)} keyframe_type=${ktype}`);
      });
    }
  }

  return results.join("\n");
}



function parseKeyframesByItems(input) {

  const regex = /time=([\d]+(?:\.\d+)?)\s+object=([^\s]+)\s+property=([^\s]+)\s+value=(.*?)\s+keyframe_type=([A-Z0-9]+)/g;

  const matches = [];
  let match;

  while ((match = regex.exec(input)) !== null) {

    const time = parseFloat(match[1]);
    const object = match[2];
    const property = match[3];
    let value = match[4].trim();
    const keyType = match[5];

    value = value.replace(/\s+/g, ",");

    matches.push({ time, object, property, value, keyType });
  }

  const groups = {};

  for (const kf of matches) {
    const key = `${kf.object}||${kf.property}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(kf);
  }

  const byObject = {};

  for (const key in groups) {

    const group = groups[key].sort((a, b) => a.time - b.time);
    const segments = [];

    for (let i = 0; i < group.length - 1; i++) {

      const current = group[i];
      const next = group[i + 1];

      if (current.keyType.startsWith("L") && next.keyType.startsWith("L")) {

        segments.push({
          object_name: current.object,
          property: current.property,
          start: current.time,
          end: next.time,
          start_value: current.value,
          end_value: next.value,
          segment_type: "L"
        });

      }

      if (current.keyType === "H1" && next.keyType === "H2") {

        segments.push({
          object_name: current.object,
          property: current.property,
          start: current.time,
          end: next.time,
          start_value: current.value,
          end_value: current.value,
          segment_type: "H"
        });

      }
    }

    if (segments.length > 0) {

      const objectName = key.split("||")[0];

      if (!byObject[objectName]) byObject[objectName] = [];

      byObject[objectName].push(segments);
    }
  }

  return Object.values(byObject);
}

const input = `
time=0.00 object=esfera property=position value=-200 360 keyframe_type=L1
time=0.00 object=esfera property=scale value=0.60 keyframe_type=L1
time=0.00 object=esfera property=opacity value=0.00 keyframe_type=L1
time=0.00 object=cubo property=position value=1480 360 keyframe_type=L1
time=0.00 object=cubo property=scale value=0.60 keyframe_type=L1
time=0.00 object=cubo property=opacity value=0.00 keyframe_type=L1 
time=0.50 object=esfera property=opacity value=1.00 keyframe_type=L2
time=0.50 object=cubo property=opacity value=1.00 keyframe_type=L2
time=2.00 object=esfera property=position value=320 360 keyframe_type=L2
time=2.00 object=esfera property=scale value=0.60 keyframe_type=L2
time=2.00 object=cubo property=position value=960 360 keyframe_type=L2
time=2.00 object=cubo property=scale value=0.60 keyframe_type=L2 
`;

const result = parseKeyframesByItems(input);

console.log("AI_JSON:",JSON.stringify(result, null, 2));









function actualizarRectangulos(new_rectangles,item_name) { 
    //let lista_json = []; 
    new_rectangles.forEach(sublist => {
        if (!sublist || sublist.length === 0) return;
        const property = sublist[0].property;

        // Buscar el sublist correspondiente en unica_regla.rectangulos
        const sublistIndex = unica_regla.rectangulos.findIndex(sub =>
            sub.some(dic => dic.item_name === item_name && dic.property === property)
        );
        if (sublistIndex === -1) return;

        // Buscar el dic con property="filename" más cercano hacia atrás desde sublistIndex
        let referenciaFilename = null;
        for (let i = sublistIndex; i >= 0; i--) {
            const dicFilename = unica_regla.rectangulos[i].find(dic =>
                dic.item_name === item_name && dic.property === "filename"
            );
            if (dicFilename) {
                referenciaFilename = dicFilename;
                break;
            }
        }

        // Limpiar dics que estén dentro del intervalo [min_time, max_time)
        unica_regla.rectangulos[sublistIndex] = unica_regla.rectangulos[sublistIndex].filter(dic => {
            const dicStart = timeToSeconds(dic.start);
            const dicEnd = timeToSeconds(dic.end);
            return dicEnd <= min_time || dicStart >= max_time;
        });

        // Tomar valores por defecto del sublist actual (para filetype, color, etc.)
        const referencia = unica_regla.rectangulos[sublistIndex][0] || referenciaFilename || {};

        // El index_item viene del dic filename más cercano hacia atrás
        const index_item = referenciaFilename?.index_item ?? referencia.index_item ?? "2";

        // Crear nuevos dics a partir de new_rectangles sublist
        const nuevosDics = sublist.map(seg => {
            const esH = seg.segment_type === "H";
	    let start_time = formatearTiempoDecimal(seg.start);
	    let end_time = formatearTiempoDecimal(seg.end);	
	    if (Math.abs(parseFloat(seg.start) - parseFloat(seg.end)) < 0.05){
		end_time = last_end_timestamp;
	    }
            return {
		bg_id: referencia.bg_id, 	
                item_name: item_name,
                index_item: index_item,
                property: property,
                filetype: referencia.filetype ?? "image",
                start: formatearTiempoDecimal(seg.start),
                end: end_time,
                start_value: seg.start_value,
                //end_value: esH ? "off" : seg.end_value,
		end_value: seg.end_value,
                video_audio_value: referencia.video_audio_value ?? "",
                color: referencia.color ?? "rgb(195,136,35)",
                anchor_point: referencia.anchor_point ?? "0.5,0.5",
                color_rgb: referencia.color_rgb ?? "0,0,0",
                glow_color: referencia.glow_color ?? "255,255,255"
            };
        });

        // Insertar los nuevos dics y reordenar por start
        unica_regla.rectangulos[sublistIndex] = [
            ...unica_regla.rectangulos[sublistIndex],
            ...nuevosDics
        ].sort((a, b) => timeToSeconds(a.start) - timeToSeconds(b.start));
	//send_rectangles_by_ai("actualizarEstadoGlobal",item_name,property,unica_regla.rectangulos[sublistIndex]); 
	let json_2 = sub_json_to_send("actualizarEstadoGlobal",item_name,property,unica_regla.rectangulos[sublistIndex]); 
	lista_json_global.push(json_2);
    });
    //send_rectangles_by_ai_lista("actualizarEstadoGlobal",lista_json_global);
}
 

function duplicarGrupo(itemName) {
    rectangulos.push([]);
    const maxIndex = Math.max(...unica_regla.rectangulos.flat().map(dict => parseInt(dict.index_item)));
    const j = maxIndex + 1;
    const newItemName = `Timeline_${j}`;

    let startIndex = -1;
    let endIndex = -1;

    for (let idx = 0; idx < unica_regla.rectangulos.length; idx++) {
        const matches = unica_regla.rectangulos[idx].every(dict => dict.item_name === itemName);
        if (matches) {
            if (startIndex === -1) startIndex = idx;
            endIndex = idx;
        } else if (startIndex !== -1) {
            break;
        }
    }

    if (startIndex === -1) {
        console.warn(`No se encontró ningún grupo con item_name "${itemName}"`);
        return;
    }

    const grupoClonado = unica_regla.rectangulos
        .slice(startIndex, endIndex + 1)
        .map(sublist =>
            sublist.map(dict => ({
                ...dict,
                item_name: newItemName,
                index_item: String(j)
            }))
        );

    unica_regla.rectangulos.splice(endIndex + 1, 0, ...grupoClonado);
    return maxIndex + 1;
}


 
