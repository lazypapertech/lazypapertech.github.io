//esta version evita precargas repetidas

// Variables para debouncing del scroll
let scrollDebounceTimer = null;

// Variables para detección de saltos
let ultimoSegundoDecodificado = -1;

 
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
 
function mostrarIndicadorCarga() {
    const rect = canvas_principal.getBoundingClientRect();
    
    // Opción 1: Overlay semi-transparente
    ctx_principal.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx_principal.fillRect(0, 0, rect.width, rect.height);
    
    // Opción 2: Texto de carga
    ctx_principal.fillStyle = 'white';
    ctx_principal.font = '20px Arial';
    ctx_principal.textAlign = 'center';
    ctx_principal.fillText('⏳ Cargando...', rect.width / 2, rect.height / 2);
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

  
 
playBtn.onclick = async () => {  
  if (unica_regla.rectangulos.length == 0) {
    console.log("NINGUN ARCHIVO SUBIDO");
    return;
  }
  
  frame_indice = 0;
  const nuevo_estado = filtrarSublistasPorPropertyGeneral(); 
  const nuevos_valores = obtenerValoresPendientesDePintar(estado_actual,nuevo_estado);

  console.log("estado_anterior:",JSON.stringify(estado_actual));
  console.log("nuevo_estado:",JSON.stringify(nuevo_estado));
  console.log("nuevos_valores:",JSON.stringify(nuevos_valores));	
   

  //websocketClient.send
  add_valores_pendientes(nuevos_valores); 
 
  for (let i = 0; i < valores_pendientes.length; i++){
 	let valor_pendiente = parseFloat(valores_pendientes[i]); 	
	valores_pendientes[i] = String(Math.floor(valor_pendiente));
  } 
  console.log("valores_pendientes_globales:",JSON.stringify(valores_pendientes));

  estado_actual = nuevo_estado;
  if (valores_pendientes.length > 0){
  	request_render(valores_pendientes);
  } 

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
/*
handle.addEventListener('mousedown', e => {
  dragging = true;
  pausar_video_global();        // Pausar la reproducción
  pauseBtn.style.display = 'none'; // Mostrar botón play
  playBtn.style.display = 'inline'; 
  renderFrames(true);
});
*/
handle.addEventListener('mousedown', e => {
  dragging = true;
  pausar_video_global();
  pauseBtn.style.display = 'none';
  playBtn.style.display = 'inline';
  
  // Cancelar cualquier debounce pendiente
  if (handleDebounceTimer) {
    clearTimeout(handleDebounceTimer);
    handleDebounceTimer = null;
  }
  
  // No renderizar aquí, esperar al mousemove
});

//document.addEventListener('mouseup', e => dragging = false);
document.addEventListener('mouseup', e => {
  if (dragging) {
    dragging = false;
    
    // Forzar una decodificación final si hay un debounce pendiente
    if (handleDebounceTimer) {
      clearTimeout(handleDebounceTimer);
      handleDebounceTimer = null;
      
      sincronizarMedias();
      decodificarConSaltoInteligente();
    }
  }
});



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

/*
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
*/

timeline.addEventListener('click', e => {
  const rect = timeline.getBoundingClientRect();
  let percent = (e.clientX - rect.left) / rect.width;
  percent = Math.min(Math.max(percent, 0), 1);
  globalTime = cuantizarTiempo(percent * globalDuration);
  
  pausar_video_global();
  pauseBtn.style.display = 'none';
  playBtn.style.display = 'inline';
  
  // Cancelar cualquier debounce de scroll pendiente
  if (scrollDebounceTimer) {
    clearTimeout(scrollDebounceTimer);
    scrollDebounceTimer = null;
  }
  
  // Sincronizar y decodificar inmediatamente en clicks
  sincronizarMedias();
  decodificarConSaltoInteligente();
  actualizarTimeline();
});
 
 






updateBtn.onclick = () => { 
	request_render(["5","6","7"]);
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
/*
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
*/

 
 
//los frames ya decodificados no se ven fluidos
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
    
    // Actualizar UI inmediatamente (sin lag visual)
    const pasos = Math.floor(scrollWrapper.scrollLeft / pxPorIntervalo);
    const nuevoTiempo = pasos * intervalo;
    
    if (nuevoTiempo <= globalDuration) {
        globalTime = cuantizarTiempo(nuevoTiempo);
        actualizarTimeline();
        
        // Debounce para decodificación pesada (esperar a que usuario se detenga)
        clearTimeout(scrollDebounceTimer);
        scrollDebounceTimer = setTimeout(() => {
            sincronizarMedias();
            decodificarConSaltoInteligente();
        }, 200); // 200ms de espera tras último movimiento, si pongo 40ms aveces salen frames negros q nunca se actualizan
    }
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        usuarioControlaScroll = false;
    }, 120);
});
 
 

 
/*
//cuando muevo rapido el scroll se me ve negro
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
    
    // Actualizar UI inmediatamente (sin lag visual)
    const pasos = Math.floor(scrollWrapper.scrollLeft / pxPorIntervalo);
    const nuevoTiempo = pasos * intervalo;
    
    if (nuevoTiempo <= globalDuration) {
        globalTime = cuantizarTiempo(nuevoTiempo);
        sincronizarMedias();
        actualizarTimeline();
        
        // ✅ RENDERIZAR INMEDIATAMENTE (muestra frames ya decodificados)
        renderFrames(true);
        
        // Debounce solo para DECODIFICAR nuevos frames
        clearTimeout(scrollDebounceTimer);
        scrollDebounceTimer = setTimeout(() => {
            decodificarConSaltoInteligente();
        }, 200);
    }
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        usuarioControlaScroll = false;
    }, 120);
}); 
*/
 

function mostrarIndicadorCarga() {
    const rect = canvas_principal.getBoundingClientRect();
    
    // Opción 1: Overlay semi-transparente
    ctx_principal.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx_principal.fillRect(0, 0, rect.width, rect.height);
    
    // Opción 2: Texto de carga
    ctx_principal.fillStyle = 'white';
    ctx_principal.font = '20px Arial';
    ctx_principal.textAlign = 'center';
    ctx_principal.fillText('⏳ Cargando...', rect.width / 2, rect.height / 2);
}

function ocultarIndicadorCarga() {
    // No hacer nada, el próximo renderFrames limpiará el canvas
}


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














 
 
//los frames ya decodificados no se ven fluidos
async function decodificarConSaltoInteligente() {
  const segundoActual = Math.floor(globalTime);
  const salto = Math.abs(segundoActual - ultimoSegundoDecodificado);
  
  console.log(`📍 Salto detectado: ${salto} segundos (de ${ultimoSegundoDecodificado} a ${segundoActual})`);
  
  // Si el salto es grande (>3 segundos), solo decodificar destino
  if (salto > 3 || ultimoSegundoDecodificado === -1) {
    console.log('⚡ Salto grande: cancelando todo y decodificando solo destino');
    
    // Cancelar todas las decodificaciones en curso
    reproductorTrozos.cancelarTodasDecodificaciones();
    
    // Decodificar solo el segundo actual + siguiente
    try {
      await precargarDosSegundos(globalTime);
      console.log(`✅ Decodificado segundo ${segundoActual}`);
    } catch (error) {
      console.error('❌ Error en decodificación de salto:', error);
    }
    
    ultimoSegundoDecodificado = segundoActual;
    renderFrames(true);
    
  } else {
    // Salto pequeño: decodificar normalmente
    console.log('🚶 Salto pequeño: decodificación normal');
    
    // Cancelar solo los segundos que están fuera de rango
    cancelarSegundosIrrelevantes(segundoActual);
    
    try {
      await precargarDosSegundos(globalTime);
      console.log(`✅ Decodificado segundo ${segundoActual}`);
    } catch (error) {
      console.error('❌ Error en decodificación:', error);
    }
    
    ultimoSegundoDecodificado = segundoActual;
    renderFrames(true);
  }
}
 



 
/*
//cuando muevo rapido el scroll se me ve negro 
async function decodificarConSaltoInteligente() {
  const segundoActual = Math.floor(globalTime);
  const salto = Math.abs(segundoActual - ultimoSegundoDecodificado);
  
  console.log(`📍 Salto detectado: ${salto} segundos (de ${ultimoSegundoDecodificado} a ${segundoActual})`);
  
  // Si el salto es grande (>3 segundos), solo decodificar destino
  if (salto > 3 || ultimoSegundoDecodificado === -1) {
    console.log('⚡ Salto grande: cancelando todo y decodificando solo destino');
    
    // Cancelar todas las decodificaciones en curso
    reproductorTrozos.cancelarTodasDecodificaciones();
    
    // Decodificar solo el segundo actual + siguiente
    try {
      await precargarDosSegundos(globalTime);
      console.log(`✅ Decodificado segundo ${segundoActual}`);
      
      // ✅ Renderizar después de decodificar
      renderFrames(true);
    } catch (error) {
      console.error('❌ Error en decodificación de salto:', error);
    }
    
    ultimoSegundoDecodificado = segundoActual;
    
  } else {
    // Salto pequeño: decodificar normalmente
    console.log('🚶 Salto pequeño: decodificación normal');
    
    // Cancelar solo los segundos que están fuera de rango
    cancelarSegundosIrrelevantes(segundoActual);
    
    try {
      await precargarDosSegundos(globalTime);
      console.log(`✅ Decodificado segundo ${segundoActual}`);
      
      // ✅ Renderizar después de decodificar
      renderFrames(true);
    } catch (error) {
      console.error('❌ Error en decodificación:', error);
    }
    
    ultimoSegundoDecodificado = segundoActual;
  }
} 
*/


 


function cancelarSegundosIrrelevantes(segundoActual, ventana = 3) {
  if (!reproductorTrozos.decodificacionesEnCurso) {
    return;
  }
  
  // Recorrer todas las decodificaciones en curso
  reproductorTrozos.decodificacionesEnCurso.forEach((decodificacion, segundo) => {
    // Si el segundo está fuera de la ventana relevante, cancelarlo
    if (Math.abs(segundo - segundoActual) > ventana) {
      console.log(`🗑️ Cancelando segundo ${segundo} (fuera de ventana)`);
      
      if (decodificacion.controller) {
        decodificacion.controller.abort();
      }
      
      reproductorTrozos.decodificacionesEnCurso.delete(segundo);
    }
  });
}







 
/* va muy rapido en telfono y si muevo lento el scroll se ven todos los frames*/


const trozos_guardados = [];
   
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
    this.decodificacionesEnCurso = new Map();
    this.segundosPrecargados = new Set();
  }
  
  // ✅ NUEVA FUNCIÓN: Cancelar todas las decodificaciones
  cancelarTodasDecodificaciones() {
  console.log(`🛑 Cancelando decodificaciones en curso`);
  
  this.decodificacionesEnCurso.forEach((dec, segundo) => {
    if (dec.controller) {
      dec.controller.abort();
    }
  });
  
  this.decodificacionesEnCurso.clear();
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
    
    // ✅ SOLO precargar si cambiamos de segundo
    if (this.segundoActualReproduciendo !== segundo) {
      this.segundoActualReproduciendo = segundo;
      this.precargarSiguientesSegundos(segundo);
    }
    
    const data = this.subTrozos.get(subKey);
    
    if (data && data.frames && data.frames[frameEnSubTrozo]) {
      try {
        this.ctx.drawImage(
          data.frames[frameEnSubTrozo],
          0, 0,
          this.canvas.width,
          this.canvas.height
        );
        if (valores_pendientes.includes(String(segundo))){ 
		const frameIndexGlobal = segundo * TARGET_FPS + frameEnSegundo;
  		this.dibujarLoadingAnimado(frameIndexGlobal);
	}
        return true;
      } catch (err) {
        console.error("Error renderizando frame:", err);
        return false;
      }
    }
    
    if (!data || !data.cargando) {
      this.cargarSubTrozo(segundo, frameEnSegundo);
    }
    
    // Si no hay frame disponible, mostrar loading animado
    const frameIndexGlobal = segundo * TARGET_FPS + frameEnSegundo;
    this.dibujarLoadingAnimado(frameIndexGlobal);
    
    return false;
  }

   

  dibujarWatermark() {
  // Guardar el estado actual del contexto
  this.ctx.save();
  
  // Dibujar watermark
  this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  this.ctx.font = 'bold 30px Arial';
  this.ctx.textAlign = 'center';
  this.ctx.textBaseline = 'middle';
  this.ctx.fillText('⏳ Cargando...', this.canvas.width / 2, this.canvas.height / 2);
  
  // Restaurar el estado
  this.ctx.restore();
}

  dibujarLoadingAnimado(frameIndex) {
  this.ctx.save();
  
  // ✅ Oscurecer el frame anterior (si existe)
  this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
  // ✅ Configuración del círculo
  const centerX = this.canvas.width / 2;
  const centerY = this.canvas.height / 2;
  const radius = 40;
  const lineWidth = 6;
  
  // ✅ Calcular rotación basada en frameIndex (12 frames por rotación completa)
  const rotacion = (frameIndex % 12) * (Math.PI / 6); // 30 grados por frame
  
  // ✅ Dibujar círculo base (gris oscuro)
  this.ctx.beginPath();
  this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  this.ctx.strokeStyle = 'rgb(45, 45, 45)';
  this.ctx.lineWidth = lineWidth;
  this.ctx.stroke();
  
  // ✅ Dibujar arco animado (blanco, 315 grados = 7/8 del círculo)
  this.ctx.beginPath();
  const startAngle = -Math.PI / 2 + rotacion; // Empezar desde arriba y rotar
  const endAngle = startAngle + (Math.PI * 1.5); // 270 grados
  this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  this.ctx.strokeStyle = 'rgb(250, 250, 250)';
  this.ctx.lineWidth = lineWidth;
  this.ctx.lineCap = 'round'; // Bordes redondeados
  this.ctx.stroke();
  
  // ✅ Dibujar texto "Loading" debajo
  this.ctx.fillStyle = 'rgb(250, 250, 250)';
  this.ctx.font = 'bold 20px Arial';
  this.ctx.textAlign = 'center';
  this.ctx.textBaseline = 'top';
  this.ctx.fillText('Loading', centerX, centerY + radius + 15);
  
  this.ctx.restore();
}
  
  // ✅ FUNCIÓN MODIFICADA: Solo precargar si no está ya en cache
  precargarSiguientesSegundos(segundoActual) {
    let segundo1, segundo2;
    
    if (this.direccion === 1) {
      segundo1 = segundoActual + 1;
      segundo2 = segundoActual + 2;
    } else {
      segundo1 = segundoActual - 1;
      segundo2 = segundoActual - 2;
    }
    
    // ✅ Construir clave única para esta precarga
    const clavePrecarga = `${segundo1}-${segundo2}`;
    
    // ✅ Si ya precargamos estos segundos, SALIR
    if (this.segundosPrecargados.has(clavePrecarga)) {
      return;
    }
    
    console.log(`➡️ Precargando ${this.direccion === 1 ? 'adelante' : 'atrás'}: ${segundo1} y ${segundo2}`);
    
    // ✅ Marcar como precargados
    this.segundosPrecargados.add(clavePrecarga);
    
    // Precargar 5 sub-trozos del primer segundo
    if (segundo1 >= 0 && trozos_guardados[segundo1]) {
      for (let subIndex = 0; subIndex < 5; subIndex++) {
        const frameInicio = subIndex * this.FRAMES_POR_SUBTROZO;
        const subKey = this.getSubTrozoKey(segundo1, frameInicio);
        
        if (!this.subTrozos.has(subKey)) {
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
          this.cargarSubTrozo(segundo2, frameInicio);
        }
      }
    }
    
    // ✅ Limpieza: eliminar sub-trozos lejanos Y limpiar cache de precarga
    this.subTrozos.forEach((data, key) => {
      const [seg] = key.split('-').map(Number);
      
      let debeEliminar = false;
      
      if (this.direccion === 1) {
        debeEliminar = seg < segundoActual - 2;
      } else {
        debeEliminar = seg > segundoActual + 2;
      }
      
      if (debeEliminar) {
        if (data.frames) {
          data.frames.forEach(f => {
            if (f && f.close) f.close();
          });
        }
        this.subTrozos.delete(key);
      }
    });
    
    // ✅ Limpiar cache de precarga para segundos lejanos
    const clavesAEliminar = [];
    this.segundosPrecargados.forEach(clave => {
      const [s1, s2] = clave.split('-').map(Number);
      
      if (this.direccion === 1) {
        if (s1 < segundoActual - 2 || s2 < segundoActual - 2) {
          clavesAEliminar.push(clave);
        }
      } else {
        if (s1 > segundoActual + 2 || s2 > segundoActual + 2) {
          clavesAEliminar.push(clave);
        }
      }
    });
    
    clavesAEliminar.forEach(clave => this.segundosPrecargados.delete(clave));
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
 
//esta version evita precargas repetidas