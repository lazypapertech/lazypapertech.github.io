/* ===========================
   CONFIGURACIÓN DE FRAMERATE
=========================== */

const TARGET_FPS = 25; 
const FRAME_DURATION = 1 / TARGET_FPS;

function cuantizarTiempo(tiempo) {
  return Math.floor(tiempo / FRAME_DURATION) * FRAME_DURATION;
}

const canvas_principal = document.getElementById('canvas');
const ctx_principal = canvas_principal.getContext('2d');

const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
const updateBtn = document.getElementById('update');
const timeline = document.getElementById('timeline');
const progress = document.getElementById('progress');
const handle = document.getElementById('handle');

let mediaPools = [];
let globalDuration = 0;
let globalTime = 0;
let playing = false;
let lastFrameTime = null;

/* ===========================
   UTILIDADES
=========================== */

function crearMedia(item) {
  const el = document.createElement(
    item.filename.match(/\.(mp3|wav)$/i) ? 'audio' : 'video'
  );
  
  // Usar Blob URL si existe, sino usar filename original
  el.src = filename_url[item.filename] || item.filename;
  
  el.preload = 'auto';
  el.style.display = 'none';
  el.volume = item.volume / 100;
  el.playbackRate = item.speed;
  
  if (el.tagName === 'VIDEO') {
    el.setAttribute('playsinline', '');
  }
  
  document.body.appendChild(el);
  return el;
}

/* ===========================
   ACTUALIZAR FLUJO GLOBAL
=========================== */ 

// Función separada para calcular globalDuration
function get_globalDuration() {
  const files_reproducir_0 = filtrarSublistasPorProperty_all_files();
  console.log("files_reproducir_2:", JSON.stringify(files_reproducir_0));
  
  const lista = transformList_all_files(files_reproducir_0); 
  console.log("files_reproducir_4:", JSON.stringify(lista)); 

    let duracion = 0;
    lista.forEach(linea => {
        linea.forEach(item => {
            // Cada clip termina en global_start + duration 
	    duracion = Math.max(duracion, item.global_start + parseFloat(item.duration));
	
        });
    });
    return duracion;
}


function actualizar_reproduccion_global(lista) {
  console.log('🧹 Iniciando limpieza...');
  
  // ===== PASO 1: CANCELAR ANIMACIONES =====
  cancelarTodasAnimaciones(); // ← ESTO ES CRÍTICO
  retrocediendoActivo = false;
  
  // ===== PASO 2: LIMPIEZA COMPLETA DE MEDIAS =====
  mediaPools.flat().forEach(o => {
    if (o.media) {
      // Pausar
      o.media.pause();
      
      // Guardar la URL para revocarla
      const blobUrl = o.media.src;
      
      // Limpiar source
      o.media.src = '';
      o.media.srcObject = null;
      o.media.load(); // Libera el buffer
        
      // Remover del DOM
      o.media.remove();
      o.media = null;
    }
  });
  
  mediaPools = [];
  const globalTimePrevio = globalTime;
  globalDuration = 0;
  globalDuration = get_globalDuration();
  console.log("globalDuration:",globalDuration);
  const promesasCarga = [];
  
  lista.forEach(linea => {
    const pool = [];
    linea.forEach(item => {
      const media = crearMedia(item);
      
      const promesaCarga = new Promise((resolve, reject) => {
        // ← TIMEOUT para evitar promesas colgadas
        const timeoutId = setTimeout(() => {
          reject(new Error(`Timeout cargando: ${item.filename}`));
        }, 10000);
        
        const onMetadata = () => {
          clearTimeout(timeoutId);
          media.currentTime = item.relative_start;
        };
        
        const onSeeked = () => {
          clearTimeout(timeoutId);
          resolve();
        };
        
        const onError = () => {
          clearTimeout(timeoutId);
          reject(new Error(`Error cargando: ${item.filename}`));
        };
        
        media.addEventListener('loadedmetadata', onMetadata, { once: true });
        media.addEventListener('seeked', onSeeked, { once: true });
        media.addEventListener('error', onError, { once: true });
      });
      
      promesasCarga.push(promesaCarga);
      
      pool.push({
        ...item,
        media,
        end: item.global_start + item.duration,
        started: false
      });
      //globalDuration = Math.max(globalDuration, item.global_start + item.duration);
    });
    mediaPools.push(pool);
  });
  
  if(globalTimePrevio < globalDuration) {
    globalTime = globalTimePrevio;
  }
  
  actualizarTimeline();
  
  return Promise.all(promesasCarga)
    .then(() => {
      console.log('✅ Flujo preparado:', mediaPools.length, 'líneas');
    })
    .catch(error => {
      console.error('❌ Error en carga:', error);
      throw error; // Re-lanzar para el .catch() externo
    });
}


/* ===========================
   VARIABLES GLOBALES PARA ANIMACIONES
=========================== */
let loopAnimationId = null;
let scrollAnimationId = null; 

function cancelarTodasAnimaciones() {
  if (loopAnimationId) {
    cancelAnimationFrame(loopAnimationId);
    loopAnimationId = null;
  }
  if (scrollAnimationId) {
    cancelAnimationFrame(scrollAnimationId);
    scrollAnimationId = null;
  }
  if (retrocediendoAnimationId) {
    cancelAnimationFrame(retrocediendoAnimationId);
    retrocediendoAnimationId = null;
  }
}
 
/* ===========================
   LOOP DE REPRODUCCIÓN
=========================== */
function loop(timestamp) {
  if (!playing) return;

  if (!lastFrameTime) lastFrameTime = timestamp;
  const delta = (timestamp - lastFrameTime) / 1000;
  lastFrameTime = timestamp;
  globalTime += delta; // ← Mantener sin cuantizar aquí
 
  if (globalTime >= globalDuration) {
    globalTime = globalDuration;
    pausar_video_global(); 
    pauseBtn.style.display = 'none';
    playBtn.style.display = 'inline';
    cancelAnimationFrame(animationId);  
    return;
  }  

  renderFrames();
  actualizarTimeline();
  actualizarScroll();
  requestAnimationFrame(loop);
}

/* ===========================
   RENDER FRAMES
=========================== */ 
 
let frame_indice = 0;
let ultimoTiempoCuantizado = null; 
let ultimoFrameDibujado = -1; 
 


async function renderFrames(previewOnly = false) {
  const frameIndex = Math.floor(globalTime / FRAME_DURATION);
  const segundo = Math.floor(frameIndex / TARGET_FPS);
  const frameEnSegundo = frameIndex % TARGET_FPS;
  
  console.log(`frameIndex: ${frameIndex}, segundo: ${segundo}, frame: ${frameEnSegundo}`);
  
  if (frameIndex !== ultimoFrameDibujado) {
    ultimoFrameDibujado = frameIndex;
    
    const rect = canvas_principal.getBoundingClientRect();
    canvas_principal.width = rect.width;
    canvas_principal.height = rect.height;
    
    // ✅ Reproducir trozo codificado
    if (trozos_guardados[segundo]) {
      const exito = await reproductorTrozos.reproducirFrame(segundo, frameEnSegundo);
      
      if (exito) {
        console.log(`✓ Frame ${frameIndex} reproducido`);
        return;
      } else {
        // Frame no listo - NO BORRAR CANVAS, mantener último frame
        console.log(`⏳ Frame ${frameIndex} cargando...`);
        return;
      }
    }
    
    // Solo limpiar si NO existe el trozo
    //ctx_principal.clearRect(0, 0, rect.width, rect.height);
    //draw_text("Updating frame...", rect);
  }

  // Videos originales
  let videoDibujado = false;
  mediaPools.forEach(linea => {
    linea.forEach(item => {
      const activo = globalTime >= item.global_start && globalTime < item.end;

      if (activo) {
        const tiempoEnClip = (globalTime - item.global_start) + item.relative_start;
        const tiempoCuantizado = cuantizarTiempo(tiempoEnClip);

        if (!item.started) {
          if (Math.abs(item.media.currentTime - tiempoCuantizado) > FRAME_DURATION) {
            item.media.currentTime = tiempoCuantizado;
          }
          item.started = true;
        }

        if (!previewOnly && playing && item.media.paused) {
          item.media.play().catch(e => console.log('Error al reproducir:', e));
        }

        if (!videoDibujado && item.media.tagName === 'VIDEO' && 
            tiempoCuantizado !== ultimoTiempoCuantizado) {
          ultimoTiempoCuantizado = tiempoCuantizado;

          if (!trozos_guardados[segundo]) {
            const rect = canvas_principal.getBoundingClientRect();
            canvas_principal.width = rect.width;
            canvas_principal.height = rect.height;
            
            ctx_principal.drawImage(item.media, 0, 0, rect.width, rect.height);
            draw_text("Updating frame...", rect);
          }

          videoDibujado = true;
        }

      } else {
        item.started = false;
        if (!previewOnly) item.media.pause();
      }
    });
  });
}
 

/* ===========================
   RESETEAR ESTADO
=========================== */
 
function resetearEstadoMedias() {
  mediaPools.flat().forEach(item => {
    item.started = false;
    item.media.pause();
  });
}

 

function reproducir_video_global() {
  console.log("retroceder_suavemente:",globalTime,globalDuration);
  if (globalTime >= globalDuration){ 
	console.log("retroceder_suavemente");
	retroceder_suavemente(15);  
  }
  playing = true;
  lastFrameTime = null;
  usuarioControlaScroll = false;  // ← AGREGAR
  cancelAnimationFrame(animationId);  // ← AGREGAR
  animationId = requestAnimationFrame(animarScroll);  // ← AGREGAR
  requestAnimationFrame(loop);


}
 
 
 
function pausar_video_global() {
  playing = false;
  mediaPools.flat().forEach(o => o.media.pause());
  cancelAnimationFrame(animationId);  // ← AGREGAR
  timelineControlaScroll = false;  // ← AGREGAR

  //videoPlayer.cleanup(); 
}
 

/* ===========================
   TIMELINE
=========================== */

function actualizarTimeline() {
  const percent = globalDuration ? Math.min((globalTime / globalDuration) * 100, 100) : 0; 
  progress.style.width = percent + '%';
  handle.style.left = percent + '%';
 
  const sec = Math.floor(globalTime);
  const h = String(Math.floor(sec / 3600)).padStart(2, '0');
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  document.getElementById('timestamp').textContent = `${h}:${m}:${s}`;
}

/* ===========================
   EVENTOS
=========================== */
  
// Variable global para almacenar el último estado
let ultimoFilesReproducir = null;

// Función para comparar si los arrays son diferentes
function sonDiferentes(array1, array2) {
  if (!array1 || !array2) return true;
  if (array1.length !== array2.length) return true;
  
  // Comparar el JSON stringificado
  return JSON.stringify(array1) !== JSON.stringify(array2);
}

// Función para esperar
function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

 

/*
playBtn.onclick = async () => {  
  if (unica_regla.rectangulos.length == 0) {
    console.log("NINGUN ARCHIVO SUBIDO");
    return;
  }
  
  frame_indice = 0;
  const all_files_0 = filtrarSublistasPorPropertyGeneral();
  const files_reproducir_0 = filtrarSublistasPorProperty();
  const files_reproducir = transformList(files_reproducir_0);
  
  const necesitaActualizar = sonDiferentes(files_reproducir, ultimoFilesReproducir);
  
  if (necesitaActualizar) {
    console.log('🔄 Detectados cambios, actualizando...');
    await actualizar_reproduccion_global(files_reproducir);
    ultimoFilesReproducir = JSON.parse(JSON.stringify(files_reproducir));
  }
 
  
  // ✅ REPRODUCIR INMEDIATAMENTE
  console.log('▶️ Iniciando reproducción...');
  reproducir_video_global();
  playBtn.style.display = 'none';
  pauseBtn.style.display = 'inline';
};
*/


/* ===========================
   BOTÓN PLAY MODIFICADO
=========================== */

/*
//funciona bien y esta asociado ala precarga de 2 segundos
playBtn.onclick = async () => {  
  if (unica_regla.rectangulos.length == 0) {
    console.log("NINGUN ARCHIVO SUBIDO");
    return;
  }
  
  frame_indice = 0;
  const all_files_0 = filtrarSublistasPorPropertyGeneral();
  const files_reproducir_0 = filtrarSublistasPorProperty();
  const files_reproducir = transformList(files_reproducir_0);
  
  const necesitaActualizar = sonDiferentes(files_reproducir, ultimoFilesReproducir);
  
  if (necesitaActualizar) {
    console.log('🔄 Detectados cambios, actualizando...');
    await actualizar_reproduccion_global(files_reproducir);
    ultimoFilesReproducir = JSON.parse(JSON.stringify(files_reproducir));
  }
  
  // ✅ PRECARGAR 5 sub-trozos desde la posición actual
  const segundoActual = Math.floor(globalTime);
  console.log(`⏸️ Pausado en segundo ${segundoActual}, precargando...`);
  
  try {
    await precargarSubTrozosIniciales(globalTime);
    console.log('✅ Precarga inicial completada');
  } catch (error) {
    console.error('❌ Error en precarga inicial:', error);
    // Continuar de todas formas
  }
  
  // ✅ REPRODUCIR
  console.log('▶️ Iniciando reproducción...');
  reproducir_video_global();
  playBtn.style.display = 'none';
  pauseBtn.style.display = 'inline';
};
*/
playBtn.onclick = async () => {  
  if (unica_regla.rectangulos.length == 0) {
    console.log("NINGUN ARCHIVO SUBIDO");
    return;
  }
  
  frame_indice = 0;
  const all_files_0 = filtrarSublistasPorPropertyGeneral();
  const files_reproducir_0 = filtrarSublistasPorProperty();
  const files_reproducir = transformList(files_reproducir_0);
  
  const necesitaActualizar = sonDiferentes(files_reproducir, ultimoFilesReproducir);
  
  if (necesitaActualizar) {
    console.log('🔄 Detectados cambios, actualizando...');
    await actualizar_reproduccion_global(files_reproducir);
    ultimoFilesReproducir = JSON.parse(JSON.stringify(files_reproducir));
  }
  
  // ✅ LIMPIEZA TOTAL DE DECODIFICACIONES
  console.log('🧹 Cancelando todas las decodificaciones en curso...');
  reproductorTrozos.cancelarTodasDecodificaciones();
  reproductorTrozos.cleanup();
  console.log('✅ Limpieza completada');
  
  // ✅ PRECARGAR 2 SEGUNDOS COMPLETOS (actual + siguiente)
  const segundoActual = Math.floor(globalTime);
  console.log(`📥 Precargando 2 segundos desde ${segundoActual}...`);
  
  try {
    await precargarDosSegundos(globalTime);
    console.log('✅ Precarga de 2 segundos completada');
  } catch (error) {
    console.error('❌ Error en precarga inicial:', error);
  }
  
  // ✅ REPRODUCIR
  console.log('▶️ Iniciando reproducción...');
  reproducir_video_global();
  playBtn.style.display = 'none';
  pauseBtn.style.display = 'inline';
};

 

pauseBtn.onclick = () => {
  pausar_video_global();
  pauseBtn.style.display = 'none';
  playBtn.style.display = 'inline'; 
};
 
 
 
 

/* ===========================
   MOVER HANDLE
=========================== */

 
let dragging = false;

handle.addEventListener('mousedown', e => {
  dragging = true;
  pausar_video_global();        // Pausar la reproducción
  pauseBtn.style.display = 'none'; // Mostrar botón play
  playBtn.style.display = 'inline'; 
  renderFrames(true);
});

document.addEventListener('mouseup', e => dragging = false);



/* ===========================
   SINCRONIZAR MEDIOS
=========================== */

function sincronizarMedias() {
  mediaPools.forEach(linea => {
    linea.forEach(item => {
      const activo = globalTime >= item.global_start && globalTime < item.end;
      
      if (activo) {
        // Calcular el tiempo correcto dentro del clip y cuantizarlo
        const tiempoEnClip = (globalTime - item.global_start) + item.relative_start;
        item.media.currentTime = cuantizarTiempo(tiempoEnClip); // ← Cuantizar aquí
        item.started = true;
      } else {
        item.started = false;
        item.media.pause();
      }
    });
  });
}

document.addEventListener('mousemove', e => {
  if (!dragging) return;
  const rect = timeline.getBoundingClientRect();
  let percent = (e.clientX - rect.left) / rect.width;
  percent = Math.min(Math.max(percent, 0), 1);
  globalTime = cuantizarTiempo(percent * globalDuration); // ← Cuantizar aquí
  sincronizarMedias();
  renderFrames(true);
  actualizarTimeline(); 
});

timeline.addEventListener('click', e => {
  const rect = timeline.getBoundingClientRect();
  let percent = (e.clientX - rect.left) / rect.width;
  percent = Math.min(Math.max(percent, 0), 1);
  globalTime = cuantizarTiempo(percent * globalDuration); // ← Cuantizar aquí
  sincronizarMedias();
  pausar_video_global();
  pauseBtn.style.display = 'none';
  playBtn.style.display = 'inline';
  renderFrames(true);
  actualizarTimeline();
});
 
 






updateBtn.onclick = () => { 
	request_render();
}; 






/* ===========================
   SINCRONIZACIÓN SCROLL <-> TIMELINE
=========================== */

const pxPorIntervalo = 5;//2
const intervalo = 0.025;//0.01
let animationId;
let timelineControlaScroll = false;   // El timeline mueve el scroll
let usuarioControlaScroll = false;    // El usuario mueve el scroll
let scrollTimeout;

// --- TIMELINE -> SCROLL ---
function actualizarScroll() {
    if (usuarioControlaScroll) return;
    const pasos = Math.floor(globalTime / intervalo);
    timelineControlaScroll = true;
    scrollWrapper.scrollLeft = pasos * pxPorIntervalo;
}

function animarScroll() {
    if (usuarioControlaScroll) return;
    const pasos = Math.floor(globalTime / intervalo);
    timelineControlaScroll = true;
    scrollWrapper.scrollLeft = pasos * pxPorIntervalo;
    if (playing) {
        animationId = requestAnimationFrame(animarScroll);
    }
}

// --- SCROLL -> TIMELINE ---
function actualizarTimelinePorScroll() {
    const pasos = Math.floor(scrollWrapper.scrollLeft / pxPorIntervalo);
    const nuevoTiempo = pasos * intervalo;
    if (nuevoTiempo <= globalDuration) {
        globalTime = cuantizarTiempo(nuevoTiempo); // ← Cuantizar aquí
        sincronizarMedias();
        renderFrames(true);
        actualizarTimeline();
    }
}
// --- EVENTOS SCROLL ---
scrollWrapper.addEventListener('scroll', () => {
    // Si el scroll fue causado por el timeline → ignorar
    if (timelineControlaScroll) {
        timelineControlaScroll = false;
        return;
    }
    
    // Desde aquí sí es scroll del usuario
    usuarioControlaScroll = true;
    
    // Pausar si estaba reproduciéndose
    if (playing) {
        pausar_video_global();
        pauseBtn.style.display = 'none';
        playBtn.style.display = 'inline';
    }
    
    actualizarTimelinePorScroll();
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        usuarioControlaScroll = false;
    }, 120);
});
  











/* ===========================
   DETECTOR DE TOUCH/TRACKPAD/MOUSE EN CONTENEDOR
=========================== */

const desplazamiento_pausa = 30;
let touchStartX = 0;
let touchStartY = 0;
let mouseStartX = 0;

// Para touch (móvil/tablet)
scrollWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

scrollWrapper.addEventListener('touchmove', (e) => {
    const touchCurrentX = e.touches[0].clientX;
    const touchCurrentY = e.touches[0].clientY;
    const deltaX = Math.abs(touchCurrentX - touchStartX);
    const deltaY = Math.abs(touchCurrentY - touchStartY);
     
    if (deltaX > desplazamiento_pausa && deltaX > deltaY && playing) {
        usuarioControlaScroll = true;
        pausar_video_global();
        pauseBtn.style.display = 'none';
        playBtn.style.display = 'inline';
    }
}, { passive: true });

// Para trackpad/mouse (escritorio)
scrollWrapper.addEventListener('mousedown', (e) => {
    mouseStartX = e.clientX;
});

scrollWrapper.addEventListener('mousemove', (e) => {
    // Solo si el botón está presionado (drag)
    if (e.buttons === 1) {
        const deltaX = Math.abs(e.clientX - mouseStartX);
        
        if (deltaX > desplazamiento_pausa && playing) {
            usuarioControlaScroll = true;
            pausar_video_global();
            pauseBtn.style.display = 'none';
            playBtn.style.display = 'inline';
        }
    }
});

// Para wheel (rueda del mouse/trackpad)
scrollWrapper.addEventListener('wheel', (e) => {
    // Detectar scroll horizontal
    if (Math.abs(e.deltaX) > desplazamiento_pausa && playing) {
        usuarioControlaScroll = true;
        pausar_video_global();
        pauseBtn.style.display = 'none';
        playBtn.style.display = 'inline';
    }
}, { passive: true });












/* ===========================
   RETROCEDER SUAVEMENTE
=========================== */

let retrocediendoAnimationId = null;
let retrocediendoActivo = false;
 
function retroceder_suavemente(velocidadMultiplicador = 1) { 
  // Si ya está retrocediendo, no hacer nada
  if (retrocediendoActivo) return;
  
  // Pausar reproducción normal si está activa
  if (playing) {
    pausar_video_global();
    pauseBtn.style.display = 'none';
    playBtn.style.display = 'inline';
  }
  
  retrocediendoActivo = true;
  let lastRetroTime = null;
  
  function loopRetroceso(timestamp) {
    if (!retrocediendoActivo) return;
    
    if (!lastRetroTime) lastRetroTime = timestamp;
    const delta = (timestamp - lastRetroTime) / 1000;
    lastRetroTime = timestamp;
    
    // Retroceder a la velocidad especificada
    const retroceso = delta * velocidadMultiplicador;
    
    // Si el retroceso nos llevaría más allá del inicio, ir exactamente a 0
    if (globalTime - retroceso <= 0) {
      globalTime = 0;
      sincronizarMedias();
      renderFrames(true);
      actualizarTimeline();
      actualizarScroll();
      detener_retroceso();
      return;
    }
    
    globalTime -= retroceso;
    
    // Actualizar vista
    sincronizarMedias();
    renderFrames(true);
    actualizarTimeline();
    actualizarScroll();
    
    retrocediendoAnimationId = requestAnimationFrame(loopRetroceso);
  }
  
  retrocediendoAnimationId = requestAnimationFrame(loopRetroceso);
}

function detener_retroceso() {
  retrocediendoActivo = false;
  if (retrocediendoAnimationId) {
    cancelAnimationFrame(retrocediendoAnimationId);
    retrocediendoAnimationId = null; 
  }
}

// Para detener el retroceso manualmente si es necesario
function pausar_retroceso() {
  detener_retroceso();
}






























 
//const cache_segundos = new Map(); // Cache actual (nueva versión)
//const cache_anterior = new Map(); // ✅ Cache de la versión anterior
//let precargaCompleta = false;
/* va muy rapido en telfono y si muevo lento el scroll se ven todos los frames*/


const trozos_guardados = [];
  
 
/* ===========================
   REPRODUCTOR CON DETECCIÓN Y REINTENTO
=========================== */

class ReproductorTrozos_bien {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.subTrozos = new Map();
    this.FRAMES_POR_SUBTROZO = 5;
    this.MAX_REINTENTOS = 5;
    this.segundoActualReproduciendo = null;
  }
  
  getSubTrozoKey(segundo, frameEnSegundo) {
    const subIndex = Math.floor(frameEnSegundo / this.FRAMES_POR_SUBTROZO);
    return `${segundo}-${subIndex}`;
  }
  
  async reproducirFrame(segundo, frameEnSegundo) {
    const subKey = this.getSubTrozoKey(segundo, frameEnSegundo);
    const frameEnSubTrozo = frameEnSegundo % this.FRAMES_POR_SUBTROZO;
    
    this.precargarSiguiente(segundo, frameEnSegundo);
    
    const data = this.subTrozos.get(subKey);
    
    if (data && data.frames && data.frames[frameEnSubTrozo]) {
      try {
        this.ctx.drawImage(
          data.frames[frameEnSubTrozo],
          0, 0,
          this.canvas.width,
          this.canvas.height
        );
        return true;
      } catch (err) {
        console.error("Error renderizando frame:", err);
        return false;
      }
    }
    
    if (!data || !data.cargando) {
      this.cargarSubTrozo(segundo, frameEnSegundo);
    }
    
    return false;
  }
  
  precargarSiguiente(segundo, frameEnSegundo) {
    let siguienteFrame = frameEnSegundo + this.FRAMES_POR_SUBTROZO;
    let siguienteSegundo = segundo;
    
    if (siguienteFrame >= TARGET_FPS) {
      siguienteFrame = 0;
      siguienteSegundo = segundo + 1;
    }
    
    const siguienteKey = this.getSubTrozoKey(siguienteSegundo, siguienteFrame);
    
    if (trozos_guardados[siguienteSegundo] && !this.subTrozos.has(siguienteKey)) {
      console.log(`🔄 Precargando sub-trozo ${siguienteKey}...`);
      this.cargarSubTrozo(siguienteSegundo, siguienteFrame);
    }
    
    const subActual = Math.floor(frameEnSegundo / this.FRAMES_POR_SUBTROZO);
    
    this.subTrozos.forEach((data, key) => {
      const [seg, sub] = key.split('-').map(Number);
      
      if (seg < segundo || (seg === segundo && sub < subActual - 5)) {
        console.log(`🗑️ Liberando sub-trozo ${key}`);
        if (data.frames) {
          data.frames.forEach(f => {
            if (f && f.close) f.close();
          });
        }
        this.subTrozos.delete(key);
      }
    });
  }
  
  // ✅ Detectar si un ImageBitmap es negro
  esFrameNegro(bitmap) {
    try {
      const testCanvas = new OffscreenCanvas(10, 10);
      const testCtx = testCanvas.getContext('2d');
      
      // Dibujar una muestra pequeña del bitmap
      testCtx.drawImage(bitmap, 0, 0, 10, 10);
      
      const imageData = testCtx.getImageData(0, 0, 10, 10);
      const data = imageData.data;
      
      // Verificar si la mayoría de píxeles son negros (RGB < 10)
      let pixelesNegros = 0;
      const totalPixeles = 100; // 10x10
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        if (r < 10 && g < 10 && b < 10) {
          pixelesNegros++;
        }
      }
      
      // Si más del 90% son negros, considerarlo negro
      return (pixelesNegros / totalPixeles) > 0.9;
      
    } catch (err) {
      console.error("Error detectando frame negro:", err);
      return false;
    }
  }
  
  async cargarSubTrozo(segundo, frameInicial, intento = 1) {
  if (!trozos_guardados[segundo]) {
    console.error(`❌ Trozo ${segundo} no disponible`);
    return;
  }
  
  const subIndex = Math.floor(frameInicial / this.FRAMES_POR_SUBTROZO);
  const subKey = `${segundo}-${subIndex}`;
  
  if (this.subTrozos.has(subKey) && this.subTrozos.get(subKey).cargando) {
    return;
  }
  
  this.subTrozos.set(subKey, { frames: [], cargando: true });
  const data = this.subTrozos.get(subKey);
  
  console.log(`🔄 Cargando sub-trozo ${subKey} (intento ${intento})...`);
  
  const chunk_data = trozos_guardados[segundo];
  const encodedFrames = getChunks(chunk_data);
  
  // ✅ VALIDAR que hay frames
  if (!encodedFrames || encodedFrames.length === 0) {
    console.error(`❌ No hay frames codificados en trozo ${segundo}`);
    data.cargando = false;
    this.subTrozos.delete(subKey);
    return;
  }
  
  const inicio = subIndex * this.FRAMES_POR_SUBTROZO;
  const fin = Math.min(inicio + this.FRAMES_POR_SUBTROZO, encodedFrames.length);
  
  console.log(`Decodificando frames 0 a ${fin - 1}, guardando ${inicio} a ${fin - 1}`);
  
  return new Promise((resolve) => { // ✅ Sin reject, manejamos todo internamente
    const frames = [];
    const bitmapPromises = [];
    let outputCount = 0;
    let decoderCerrado = false;
    
    const decoder = new VideoDecoder({
      output: (videoFrame) => {
        const frameIndex = outputCount++;
        
        if (frameIndex >= inicio && frameIndex < fin) {
          try {
            const canvas = new OffscreenCanvas(
              videoFrame.displayWidth,
              videoFrame.displayHeight
            );
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoFrame, 0, 0);
            
            const localIndex = frameIndex - inicio;
            
            const bitmapPromise = createImageBitmap(canvas)
              .then(bitmap => {
                if (this.esFrameNegro(bitmap)) {
                  console.warn(`⚠️ Frame ${frameIndex} detectado como NEGRO`);
                  bitmap.close();
                  return null;
                } else {
                  frames[localIndex] = bitmap;
                  console.log(`✓ Frame ${frameIndex} OK`);
                  return bitmap;
                }
              })
              .catch(err => {
                console.error(`❌ Error creando bitmap ${frameIndex}:`, err);
                return null;
              });
            
            bitmapPromises.push(bitmapPromise);
            
          } catch (err) {
            console.error(`❌ Error procesando frame ${frameIndex}:`, err);
          }
        }
        
        try {
          videoFrame.close();
        } catch (e) {
          console.error("Error cerrando videoFrame:", e);
        }
      },
      error: (e) => {
        console.error(`❌ DECODER ERROR en sub-trozo ${subKey}:`, e);
        console.error("Detalles:", e.message);
        
        data.cargando = false;
        
        // Cerrar decoder si no está cerrado
        if (!decoderCerrado) {
          try {
            decoder.close();
            decoderCerrado = true;
          } catch (err) {}
        }
        
        // ✅ REINTENTAR si hay error y no llegamos al máximo
        if (intento < this.MAX_REINTENTOS) {
          console.log(`🔄 Reintentando sub-trozo ${subKey} por error del decoder...`);
          
          setTimeout(() => {
            this.subTrozos.delete(subKey);
            this.cargarSubTrozo(segundo, frameInicial, intento + 1);
          }, 200 * intento);
        } else {
          console.error(`❌ Sub-trozo ${subKey}: Máximo de reintentos alcanzado por errores`);
          this.subTrozos.delete(subKey);
        }
        
        resolve(); // ✅ Resolver de todas formas para no dejar promesa colgada
      }
    });
    
    try {
      decoder.configure({ codec: "vp8" });
      
      let timestamp = 0;
      const frameDuration = 1e6 / TARGET_FPS;
      
      for (let i = 0; i < fin; i++) {
        // ✅ VALIDAR que el frame existe y tiene datos
        if (!encodedFrames[i] || encodedFrames[i].byteLength === 0) {
          console.error(`❌ Frame ${i} está vacío o corrupto`);
          continue;
        }
        
        try {
          decoder.decode(new EncodedVideoChunk({
            type: i === 0 ? "key" : "delta",
            timestamp,
            data: encodedFrames[i],
          }));
        } catch (decodeErr) {
          console.error(`❌ Error decodificando frame ${i}:`, decodeErr);
        }
        
        timestamp += frameDuration;
      }
      
      decoder.flush()
        .then(async () => {
          try {
            await Promise.all(bitmapPromises);
            
            // Verificar frames negros
            const framesNegros = [];
            for (let i = 0; i < frames.length; i++) {
              if (!frames[i]) {
                framesNegros.push(inicio + i);
              }
            }
            
            if (!decoderCerrado) {
              decoder.close();
              decoderCerrado = true;
            }
            
            if (framesNegros.length > 0) {
              console.error(`❌ Sub-trozo ${subKey}: ${framesNegros.length} frames negros:`, framesNegros);
              
              if (intento < this.MAX_REINTENTOS) {
                console.log(`🔄 Reintentando sub-trozo ${subKey} por frames negros...`);
                
                frames.forEach(f => {
                  if (f && f.close) f.close();
                });
                
                setTimeout(() => {
                  this.subTrozos.delete(subKey);
                  this.cargarSubTrozo(segundo, frameInicial, intento + 1);
                }, 100 * intento);
                
                data.cargando = false;
                resolve();
                return;
              } else {
                console.error(`❌ Sub-trozo ${subKey}: Máximo de reintentos alcanzado`);
              }
            }
            
            data.frames = frames;
            data.cargando = false;
            
            const framesValidos = frames.filter(f => f !== null && f !== undefined).length;
            console.log(`✅ Sub-trozo ${subKey}: ${framesValidos}/${fin - inicio} frames válidos`);
            
            resolve();
          } catch (err) {
            console.error(`❌ Error en Promise.all:`, err);
            data.cargando = false;
            resolve();
          }
        })
        .catch(err => {
          console.error(`❌ Error en flush de sub-trozo ${subKey}:`, err);
          data.cargando = false;
          
          if (!decoderCerrado) {
            try {
              decoder.close();
              decoderCerrado = true;
            } catch (e) {}
          }
          
          // Reintentar si es posible
          if (intento < this.MAX_REINTENTOS) {
            console.log(`🔄 Reintentando sub-trozo ${subKey} por error en flush...`);
            setTimeout(() => {
              this.subTrozos.delete(subKey);
              this.cargarSubTrozo(segundo, frameInicial, intento + 1);
            }, 200 * intento);
          }
          
          resolve();
        });
        
    } catch (error) {
      console.error(`❌ Error configurando decoder para sub-trozo ${subKey}:`, error);
      data.cargando = false;
      
      if (!decoderCerrado) {
        try {
          decoder.close();
          decoderCerrado = true;
        } catch (e) {}
      }
      
      // Reintentar
      if (intento < this.MAX_REINTENTOS) {
        console.log(`🔄 Reintentando sub-trozo ${subKey} por error en configuración...`);
        setTimeout(() => {
          this.subTrozos.delete(subKey);
          this.cargarSubTrozo(segundo, frameInicial, intento + 1);
        }, 200 * intento);
      }
      
      resolve(); // ✅ Siempre resolver
    }
  });
}
 
  cleanup() {
    this.subTrozos.forEach((data, key) => {
      if (data.frames) {
        data.frames.forEach(f => {
          if (f && f.close) f.close();
        });
      }
    });
    this.subTrozos.clear();
  }
}

//const reproductorTrozos = new ReproductorTrozos(canvas_principal);










/* ===========================
   FUNCIÓN PARA PRECARGAR SUB-TROZOS INICIALES
=========================== */

async function precargarSubTrozosIniciales_1(segundoInicio) {
  console.log(`🔄 Precargando 5 sub-trozos desde segundo ${segundoInicio}...`);
  
  const frameInicio = Math.floor(segundoInicio * TARGET_FPS);
  const promesas = [];
  
  // Calcular los 5 sub-trozos a partir del frame inicial
  for (let i = 0; i < 5; i++) {
    const frameActual = frameInicio + (i * reproductorTrozos.FRAMES_POR_SUBTROZO);
    const segundo = Math.floor(frameActual / TARGET_FPS);
    const frameEnSegundo = frameActual % TARGET_FPS;
    
    // Verificar que el trozo existe
    if (!trozos_guardados[segundo]) {
      console.log(`⏭️ Trozo ${segundo} no disponible, deteniendo precarga`);
      break;
    }
    
    const subKey = reproductorTrozos.getSubTrozoKey(segundo, frameEnSegundo);
    
    // Solo cargar si no está ya cargado o cargando
    if (!reproductorTrozos.subTrozos.has(subKey)) {
      console.log(`📥 Precargando sub-trozo ${i + 1}/5: ${subKey}`);
      const promesa = reproductorTrozos.cargarSubTrozo(segundo, frameEnSegundo);
      promesas.push(promesa);
    } else {
      console.log(`✓ Sub-trozo ${subKey} ya está cargado`);
    }
  }
  
  // Esperar a que todos terminen
  await Promise.all(promesas);
  
  console.log(`✅ Precarga completada: ${promesas.length} sub-trozos cargados`);
}
 

















/* ===========================
   FUNCIÓN PARA PRECARGAR 2 SEGUNDOS COMPLETOS
=========================== */

async function precargarDosSegundos_1(tiempoInicio) {
  const segundoActual = Math.floor(tiempoInicio);
  const segundoSiguiente = segundoActual + 1;
  
  console.log(`🔄 Precargando segundos ${segundoActual} y ${segundoSiguiente}...`);
  
  const promesas = [];
  
  // Precargar todos los sub-trozos del segundo actual
  if (trozos_guardados[segundoActual]) {
    for (let subIndex = 0; subIndex < 5; subIndex++) {
      const frameInicio = subIndex * reproductorTrozos.FRAMES_POR_SUBTROZO;
      const subKey = reproductorTrozos.getSubTrozoKey(segundoActual, frameInicio);
      
      if (!reproductorTrozos.subTrozos.has(subKey)) {
        console.log(`📥 Precargando ${segundoActual}-${subIndex}`);
        promesas.push(reproductorTrozos.cargarSubTrozo(segundoActual, frameInicio));
      }
    }
  }
  
  // Precargar todos los sub-trozos del segundo siguiente
  if (trozos_guardados[segundoSiguiente]) {
    for (let subIndex = 0; subIndex < 5; subIndex++) {
      const frameInicio = subIndex * reproductorTrozos.FRAMES_POR_SUBTROZO;
      const subKey = reproductorTrozos.getSubTrozoKey(segundoSiguiente, frameInicio);
      
      if (!reproductorTrozos.subTrozos.has(subKey)) {
        console.log(`📥 Precargando ${segundoSiguiente}-${subIndex}`);
        promesas.push(reproductorTrozos.cargarSubTrozo(segundoSiguiente, frameInicio));
      }
    }
  }
  
  await Promise.all(promesas);
  console.log(`✅ ${promesas.length} sub-trozos precargados`);
}


/* ===========================
   REPRODUCTOR MODIFICADO - PRECARGA 10 SUB-TROZOS
=========================== */

class ReproductorTrozos_1 {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.subTrozos = new Map();
    this.FRAMES_POR_SUBTROZO = 5;
    this.MAX_REINTENTOS = 5;
    this.segundoActualReproduciendo = null;
  }
  
  getSubTrozoKey(segundo, frameEnSegundo) {
    const subIndex = Math.floor(frameEnSegundo / this.FRAMES_POR_SUBTROZO);
    return `${segundo}-${subIndex}`;
  }
  
  async reproducirFrame(segundo, frameEnSegundo) {
    const subKey = this.getSubTrozoKey(segundo, frameEnSegundo);
    const frameEnSubTrozo = frameEnSegundo % this.FRAMES_POR_SUBTROZO;
    
    // ✅ NUEVA LÓGICA: Precargar S+1 y S+2 (10 sub-trozos en total)
    this.precargarSiguientesSegundos(segundo);
    
    const data = this.subTrozos.get(subKey);
    
    if (data && data.frames && data.frames[frameEnSubTrozo]) {
      try {
        this.ctx.drawImage(
          data.frames[frameEnSubTrozo],
          0, 0,
          this.canvas.width,
          this.canvas.height
        );
        return true;
      } catch (err) {
        console.error("Error renderizando frame:", err);
        return false;
      }
    }
    
    if (!data || !data.cargando) {
      this.cargarSubTrozo(segundo, frameEnSegundo);
    }
    
    return false;
  }
  
  // ✅ NUEVA FUNCIÓN: Precargar 10 sub-trozos (S+1 y S+2)
  precargarSiguientesSegundos(segundoActual) {
    const segundoS1 = segundoActual + 1;
    const segundoS2 = segundoActual + 2;
    
    // Precargar 5 sub-trozos de S+1
    if (trozos_guardados[segundoS1]) {
      for (let subIndex = 0; subIndex < 5; subIndex++) {
        const frameInicio = subIndex * this.FRAMES_POR_SUBTROZO;
        const subKey = this.getSubTrozoKey(segundoS1, frameInicio);
        
        if (!this.subTrozos.has(subKey)) {
          console.log(`🔄 Precargando S+1: ${subKey}`);
          this.cargarSubTrozo(segundoS1, frameInicio);
        }
      }
    }
    
    // Precargar 5 sub-trozos de S+2
    if (trozos_guardados[segundoS2]) {
      for (let subIndex = 0; subIndex < 5; subIndex++) {
        const frameInicio = subIndex * this.FRAMES_POR_SUBTROZO;
        const subKey = this.getSubTrozoKey(segundoS2, frameInicio);
        
        if (!this.subTrozos.has(subKey)) {
          console.log(`🔄 Precargando S+2: ${subKey}`);
          this.cargarSubTrozo(segundoS2, frameInicio);
        }
      }
    }
    
    // Limpieza: eliminar sub-trozos antiguos (más de 2 segundos atrás)
    this.subTrozos.forEach((data, key) => {
      const [seg] = key.split('-').map(Number);
      
      if (seg < segundoActual - 2) {
        console.log(`🗑️ Liberando sub-trozo ${key}`);
        if (data.frames) {
          data.frames.forEach(f => {
            if (f && f.close) f.close();
          });
        }
        this.subTrozos.delete(key);
      }
    });
  }
  
  esFrameNegro(bitmap) {
    try {
      const testCanvas = new OffscreenCanvas(10, 10);
      const testCtx = testCanvas.getContext('2d');
      testCtx.drawImage(bitmap, 0, 0, 10, 10);
      
      const imageData = testCtx.getImageData(0, 0, 10, 10);
      const data = imageData.data;
      
      let pixelesNegros = 0;
      const totalPixeles = 100;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        if (r < 10 && g < 10 && b < 10) {
          pixelesNegros++;
        }
      }
      
      return (pixelesNegros / totalPixeles) > 0.9;
    } catch (err) {
      console.error("Error detectando frame negro:", err);
      return false;
    }
  }
  
  async cargarSubTrozo(segundo, frameInicial, intento = 1) {
    if (!trozos_guardados[segundo]) {
      console.error(`❌ Trozo ${segundo} no disponible`);
      return;
    }
    
    const subIndex = Math.floor(frameInicial / this.FRAMES_POR_SUBTROZO);
    const subKey = `${segundo}-${subIndex}`;
    
    if (this.subTrozos.has(subKey) && this.subTrozos.get(subKey).cargando) {
      return;
    }
    
    this.subTrozos.set(subKey, { frames: [], cargando: true });
    const data = this.subTrozos.get(subKey);
    
    console.log(`🔄 Cargando sub-trozo ${subKey} (intento ${intento})...`);
    
    const chunk_data = trozos_guardados[segundo];
    const encodedFrames = getChunks(chunk_data);
    
    if (!encodedFrames || encodedFrames.length === 0) {
      console.error(`❌ No hay frames codificados en trozo ${segundo}`);
      data.cargando = false;
      this.subTrozos.delete(subKey);
      return;
    }
    
    const inicio = subIndex * this.FRAMES_POR_SUBTROZO;
    const fin = Math.min(inicio + this.FRAMES_POR_SUBTROZO, encodedFrames.length);
    
    return new Promise((resolve) => {
      const frames = [];
      const bitmapPromises = [];
      let outputCount = 0;
      let decoderCerrado = false;
      
      const decoder = new VideoDecoder({
        output: (videoFrame) => {
          const frameIndex = outputCount++;
          
          if (frameIndex >= inicio && frameIndex < fin) {
            try {
              const canvas = new OffscreenCanvas(
                videoFrame.displayWidth,
                videoFrame.displayHeight
              );
              const ctx = canvas.getContext('2d');
              ctx.drawImage(videoFrame, 0, 0);
              
              const localIndex = frameIndex - inicio;
              
              const bitmapPromise = createImageBitmap(canvas)
                .then(bitmap => {
                  if (this.esFrameNegro(bitmap)) {
                    console.warn(`⚠️ Frame ${frameIndex} detectado como NEGRO`);
                    bitmap.close();
                    return null;
                  } else {
                    frames[localIndex] = bitmap;
                    return bitmap;
                  }
                })
                .catch(err => {
                  console.error(`❌ Error creando bitmap ${frameIndex}:`, err);
                  return null;
                });
              
              bitmapPromises.push(bitmapPromise);
            } catch (err) {
              console.error(`❌ Error procesando frame ${frameIndex}:`, err);
            }
          }
          
          try {
            videoFrame.close();
          } catch (e) {}
        },
        error: (e) => {
          console.error(`❌ DECODER ERROR en sub-trozo ${subKey}:`, e.message);
          data.cargando = false;
          
          if (!decoderCerrado) {
            try {
              decoder.close();
              decoderCerrado = true;
            } catch (err) {}
          }
          
          if (intento < this.MAX_REINTENTOS) {
            setTimeout(() => {
              this.subTrozos.delete(subKey);
              this.cargarSubTrozo(segundo, frameInicial, intento + 1);
            }, 200 * intento);
          }
          
          resolve();
        }
      });
      
      try {
        decoder.configure({ codec: "vp8" });
        
        let timestamp = 0;
        const frameDuration = 1e6 / TARGET_FPS;
        
        for (let i = 0; i < fin; i++) {
          if (!encodedFrames[i] || encodedFrames[i].byteLength === 0) {
            console.error(`❌ Frame ${i} está vacío`);
            continue;
          }
          
          decoder.decode(new EncodedVideoChunk({
            type: i === 0 ? "key" : "delta",
            timestamp,
            data: encodedFrames[i],
          }));
          
          timestamp += frameDuration;
        }
        
        decoder.flush()
          .then(async () => {
            await Promise.all(bitmapPromises);
            
            const framesNegros = frames.filter(f => !f).length;
            
            if (!decoderCerrado) {
              decoder.close();
              decoderCerrado = true;
            }
            
            if (framesNegros > 0 && intento < this.MAX_REINTENTOS) {
              console.log(`🔄 Reintentando ${subKey} por ${framesNegros} frames negros`);
              frames.forEach(f => { if (f && f.close) f.close(); });
              
              setTimeout(() => {
                this.subTrozos.delete(subKey);
                this.cargarSubTrozo(segundo, frameInicial, intento + 1);
              }, 100 * intento);
              
              data.cargando = false;
              resolve();
              return;
            }
            
            data.frames = frames;
            data.cargando = false;
            
            const framesValidos = frames.filter(f => f).length;
            console.log(`✅ Sub-trozo ${subKey}: ${framesValidos}/${fin - inicio} frames`);
            
            resolve();
          })
          .catch(err => {
            console.error(`❌ Error en flush:`, err);
            data.cargando = false;
            
            if (!decoderCerrado) {
              try {
                decoder.close();
                decoderCerrado = true;
              } catch (e) {}
            }
            
            resolve();
          });
      } catch (error) {
        console.error(`❌ Error configurando decoder:`, error);
        data.cargando = false;
        resolve();
      }
    });
  }
  
  cleanup() {
    this.subTrozos.forEach((data) => {
      if (data.frames) {
        data.frames.forEach(f => {
          if (f && f.close) f.close();
        });
      }
    });
    this.subTrozos.clear();
  }
}
 




/* ===========================
   FUNCIÓN PARA PRECARGAR 2 SEGUNDOS COMPLETOS
=========================== */

async function precargarDosSegundos(tiempoInicio) {
  const segundoActual = Math.floor(tiempoInicio);
  const segundoSiguiente = segundoActual + 1;
  
  console.log(`🔄 Precargando segundos ${segundoActual} y ${segundoSiguiente}...`);
  
  const promesas = [];
  
  // Precargar todos los sub-trozos del segundo actual
  if (trozos_guardados[segundoActual]) {
    for (let subIndex = 0; subIndex < 5; subIndex++) {
      const frameInicio = subIndex * reproductorTrozos.FRAMES_POR_SUBTROZO;
      const subKey = reproductorTrozos.getSubTrozoKey(segundoActual, frameInicio);
      
      if (!reproductorTrozos.subTrozos.has(subKey)) {
        console.log(`📥 Precargando ${segundoActual}-${subIndex}`);
        promesas.push(reproductorTrozos.cargarSubTrozo(segundoActual, frameInicio));
      }
    }
  }
  
  // Precargar todos los sub-trozos del segundo siguiente
  if (trozos_guardados[segundoSiguiente]) {
    for (let subIndex = 0; subIndex < 5; subIndex++) {
      const frameInicio = subIndex * reproductorTrozos.FRAMES_POR_SUBTROZO;
      const subKey = reproductorTrozos.getSubTrozoKey(segundoSiguiente, frameInicio);
      
      if (!reproductorTrozos.subTrozos.has(subKey)) {
        console.log(`📥 Precargando ${segundoSiguiente}-${subIndex}`);
        promesas.push(reproductorTrozos.cargarSubTrozo(segundoSiguiente, frameInicio));
      }
    }
  }
  
  await Promise.all(promesas);
  console.log(`✅ ${promesas.length} sub-trozos precargados`);
}


/* ===========================
   REPRODUCTOR MODIFICADO - PRECARGA 10 SUB-TROZOS
=========================== */

class ReproductorTrozos {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.subTrozos = new Map();
    this.FRAMES_POR_SUBTROZO = 5;
    this.MAX_REINTENTOS = 5;
    this.segundoActualReproduciendo = null;
    this.decodersActivos = new Set(); // ✅ Rastrear decoders activos
    this.direccion = 1; // ✅ 1 = derecha (adelante), -1 = izquierda (atrás)
    this.ultimoSegundo = null; // ✅ Para detectar cambios de dirección
  }
  
  // ✅ NUEVA FUNCIÓN: Cancelar todas las decodificaciones
  cancelarTodasDecodificaciones() {
    console.log(`🛑 Cancelando ${this.decodersActivos.size} decoders activos...`);
    
    // Cerrar todos los decoders activos
    this.decodersActivos.forEach(decoder => {
      try {
        if (decoder.state !== 'closed') {
          decoder.close();
        }
      } catch (e) {
        console.log('Decoder ya cerrado:', e.message);
      }
    });
    
    this.decodersActivos.clear();
    
    // Limpiar todos los sub-trozos que están cargando
    this.subTrozos.forEach((data, key) => {
      if (data.cargando) {
        console.log(`🗑️ Cancelando carga de ${key}`);
        data.cargando = false;
      }
    });
    
    console.log('✅ Todas las decodificaciones canceladas');
  }
  
  // ✅ NUEVA FUNCIÓN: Detectar dirección del movimiento
  detectarDireccion(segundoActual) {
    if (this.ultimoSegundo !== null) {
      const diferencia = segundoActual - this.ultimoSegundo;
      
      if (diferencia > 0) {
        this.direccion = 1; // Adelante
        console.log('➡️ Dirección: ADELANTE');
      } else if (diferencia < 0) {
        this.direccion = -1; // Atrás
        console.log('⬅️ Dirección: ATRÁS');
      }
      // Si diferencia === 0, mantener dirección actual
    }
    
    this.ultimoSegundo = segundoActual;
  }
  
  // ✅ NUEVA FUNCIÓN: Forzar dirección adelante (para play)
  forzarDireccionAdelante() {
    this.direccion = 1;
    console.log('➡️ Dirección forzada: ADELANTE');
  }
  
  getSubTrozoKey(segundo, frameEnSegundo) {
    const subIndex = Math.floor(frameEnSegundo / this.FRAMES_POR_SUBTROZO);
    return `${segundo}-${subIndex}`;
  }
  
  async reproducirFrame(segundo, frameEnSegundo) {
    const subKey = this.getSubTrozoKey(segundo, frameEnSegundo);
    const frameEnSubTrozo = frameEnSegundo % this.FRAMES_POR_SUBTROZO;
    
    // ✅ Detectar dirección del movimiento
    this.detectarDireccion(segundo);
    
    // ✅ Precargar según dirección (S+1/S+2 o S-1/S-2)
    this.precargarSiguientesSegundos(segundo);
    
    const data = this.subTrozos.get(subKey);
    
    if (data && data.frames && data.frames[frameEnSubTrozo]) {
      try {
        this.ctx.drawImage(
          data.frames[frameEnSubTrozo],
          0, 0,
          this.canvas.width,
          this.canvas.height
        );
        return true;
      } catch (err) {
        console.error("Error renderizando frame:", err);
        return false;
      }
    }
    
    if (!data || !data.cargando) {
      this.cargarSubTrozo(segundo, frameEnSegundo);
    }
    
    return false;
  }
  
  // ✅ FUNCIÓN MODIFICADA: Precargar según dirección
  precargarSiguientesSegundos(segundoActual) {
    let segundo1, segundo2;
    
    if (this.direccion === 1) {
      // ➡️ ADELANTE: S+1 y S+2
      segundo1 = segundoActual + 1;
      segundo2 = segundoActual + 2;
      console.log(`➡️ Precargando adelante: ${segundo1} y ${segundo2}`);
    } else {
      // ⬅️ ATRÁS: S-1 y S-2
      segundo1 = segundoActual - 1;
      segundo2 = segundoActual - 2;
      console.log(`⬅️ Precargando atrás: ${segundo1} y ${segundo2}`);
    }
    
    // Precargar 5 sub-trozos del primer segundo
    if (segundo1 >= 0 && trozos_guardados[segundo1]) {
      for (let subIndex = 0; subIndex < 5; subIndex++) {
        const frameInicio = subIndex * this.FRAMES_POR_SUBTROZO;
        const subKey = this.getSubTrozoKey(segundo1, frameInicio);
        
        if (!this.subTrozos.has(subKey)) {
          console.log(`🔄 Precargando ${subKey}`);
          this.cargarSubTrozo(segundo1, frameInicio);
        }
      }
    }
    
    // Precargar 5 sub-trozos del segundo segundo
    if (segundo2 >= 0 && trozos_guardados[segundo2]) {
      for (let subIndex = 0; subIndex < 5; subIndex++) {
        const frameInicio = subIndex * this.FRAMES_POR_SUBTROZO;
        const subKey = this.getSubTrozoKey(segundo2, frameInicio);
        
        if (!this.subTrozos.has(subKey)) {
          console.log(`🔄 Precargando ${subKey}`);
          this.cargarSubTrozo(segundo2, frameInicio);
        }
      }
    }
    
    // Limpieza: eliminar sub-trozos lejanos según dirección
    this.subTrozos.forEach((data, key) => {
      const [seg] = key.split('-').map(Number);
      
      let debeEliminar = false;
      
      if (this.direccion === 1) {
        // Adelante: eliminar lo que está muy atrás
        debeEliminar = seg < segundoActual - 2;
      } else {
        // Atrás: eliminar lo que está muy adelante
        debeEliminar = seg > segundoActual + 2;
      }
      
      if (debeEliminar) {
        console.log(`🗑️ Liberando sub-trozo ${key}`);
        if (data.frames) {
          data.frames.forEach(f => {
            if (f && f.close) f.close();
          });
        }
        this.subTrozos.delete(key);
      }
    });
  }
  
  esFrameNegro(bitmap) {
    try {
      const testCanvas = new OffscreenCanvas(10, 10);
      const testCtx = testCanvas.getContext('2d');
      testCtx.drawImage(bitmap, 0, 0, 10, 10);
      
      const imageData = testCtx.getImageData(0, 0, 10, 10);
      const data = imageData.data;
      
      let pixelesNegros = 0;
      const totalPixeles = 100;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        if (r < 10 && g < 10 && b < 10) {
          pixelesNegros++;
        }
      }
      
      return (pixelesNegros / totalPixeles) > 0.9;
    } catch (err) {
      console.error("Error detectando frame negro:", err);
      return false;
    }
  }
  
  async cargarSubTrozo(segundo, frameInicial, intento = 1) {
    if (!trozos_guardados[segundo]) {
      console.error(`❌ Trozo ${segundo} no disponible`);
      return;
    }
    
    const subIndex = Math.floor(frameInicial / this.FRAMES_POR_SUBTROZO);
    const subKey = `${segundo}-${subIndex}`;
    
    if (this.subTrozos.has(subKey) && this.subTrozos.get(subKey).cargando) {
      return;
    }
    
    this.subTrozos.set(subKey, { frames: [], cargando: true });
    const data = this.subTrozos.get(subKey);
    
    console.log(`🔄 Cargando sub-trozo ${subKey} (intento ${intento})...`);
    
    const chunk_data = trozos_guardados[segundo];
    const encodedFrames = getChunks(chunk_data);
    
    if (!encodedFrames || encodedFrames.length === 0) {
      console.error(`❌ No hay frames codificados en trozo ${segundo}`);
      data.cargando = false;
      this.subTrozos.delete(subKey);
      return;
    }
    
    const inicio = subIndex * this.FRAMES_POR_SUBTROZO;
    const fin = Math.min(inicio + this.FRAMES_POR_SUBTROZO, encodedFrames.length);
    
    return new Promise((resolve) => {
      const frames = [];
      const bitmapPromises = [];
      let outputCount = 0;
      let decoderCerrado = false;
      
      const decoder = new VideoDecoder({
        output: (videoFrame) => {
          const frameIndex = outputCount++;
          
          if (frameIndex >= inicio && frameIndex < fin) {
            try {
              const canvas = new OffscreenCanvas(
                videoFrame.displayWidth,
                videoFrame.displayHeight
              );
              const ctx = canvas.getContext('2d');
              ctx.drawImage(videoFrame, 0, 0);
              
              const localIndex = frameIndex - inicio;
              
              const bitmapPromise = createImageBitmap(canvas)
                .then(bitmap => {
                  if (this.esFrameNegro(bitmap)) {
                    console.warn(`⚠️ Frame ${frameIndex} detectado como NEGRO`);
                    bitmap.close();
                    return null;
                  } else {
                    frames[localIndex] = bitmap;
                    return bitmap;
                  }
                })
                .catch(err => {
                  console.error(`❌ Error creando bitmap ${frameIndex}:`, err);
                  return null;
                });
              
              bitmapPromises.push(bitmapPromise);
            } catch (err) {
              console.error(`❌ Error procesando frame ${frameIndex}:`, err);
            }
          }
          
          try {
            videoFrame.close();
          } catch (e) {}
        },
        error: (e) => {
          console.error(`❌ DECODER ERROR en sub-trozo ${subKey}:`, e.message);
          data.cargando = false;
          
          if (!decoderCerrado) {
            try {
              decoder.close();
              decoderCerrado = true;
              this.decodersActivos.delete(decoder); // ✅ Remover de activos
            } catch (err) {}
          }
          
          if (intento < this.MAX_REINTENTOS) {
            setTimeout(() => {
              this.subTrozos.delete(subKey);
              this.cargarSubTrozo(segundo, frameInicial, intento + 1);
            }, 200 * intento);
          }
          
          resolve();
        }
      });
      
      this.decodersActivos.add(decoder); // ✅ Registrar decoder activo
      
      try {
        decoder.configure({ codec: "vp8" });
        
        let timestamp = 0;
        const frameDuration = 1e6 / TARGET_FPS;
        
        for (let i = 0; i < fin; i++) {
          if (!encodedFrames[i] || encodedFrames[i].byteLength === 0) {
            console.error(`❌ Frame ${i} está vacío`);
            continue;
          }
          
          decoder.decode(new EncodedVideoChunk({
            type: i === 0 ? "key" : "delta",
            timestamp,
            data: encodedFrames[i],
          }));
          
          timestamp += frameDuration;
        }
        
        decoder.flush()
          .then(async () => {
            await Promise.all(bitmapPromises);
            
            const framesNegros = frames.filter(f => !f).length;
            
            if (!decoderCerrado) {
              decoder.close();
              decoderCerrado = true;
              this.decodersActivos.delete(decoder); // ✅ Remover de activos
            }
            
            if (framesNegros > 0 && intento < this.MAX_REINTENTOS) {
              console.log(`🔄 Reintentando ${subKey} por ${framesNegros} frames negros`);
              frames.forEach(f => { if (f && f.close) f.close(); });
              
              setTimeout(() => {
                this.subTrozos.delete(subKey);
                this.cargarSubTrozo(segundo, frameInicial, intento + 1);
              }, 100 * intento);
              
              data.cargando = false;
              resolve();
              return;
            }
            
            data.frames = frames;
            data.cargando = false;
            
            const framesValidos = frames.filter(f => f).length;
            console.log(`✅ Sub-trozo ${subKey}: ${framesValidos}/${fin - inicio} frames`);
            
            resolve();
          })
          .catch(err => {
            console.error(`❌ Error en flush:`, err);
            data.cargando = false;
            
            if (!decoderCerrado) {
              try {
                decoder.close();
                decoderCerrado = true;
                this.decodersActivos.delete(decoder); // ✅ Remover de activos
              } catch (e) {}
            }
            
            resolve();
          });
      } catch (error) {
        console.error(`❌ Error configurando decoder:`, error);
        data.cargando = false;
        resolve();
      }
    });
  }
  
  cleanup() {
    this.subTrozos.forEach((data) => {
      if (data.frames) {
        data.frames.forEach(f => {
          if (f && f.close) f.close();
        });
      }
    });
    this.subTrozos.clear();
  }
}


const reproductorTrozos = new ReproductorTrozos(canvas_principal);
 