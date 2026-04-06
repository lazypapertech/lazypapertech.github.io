/* ===========================
   CONFIGURACIÓN DE FRAMERATE
=========================== */

const TARGET_FPS = 25; // Ajusta según tu video (24, 25, 30, etc.)
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

 

function actualizar_reproduccion_global_2(lista) {
  // ===== LIMPIEZA COMPLETA =====
  mediaPools.flat().forEach(o => {
    if (o.media) {
      // 1. Pausar y resetear
      o.media.pause();
      o.media.currentTime = 0;
      
      // 2. Remover todos los event listeners clonando el nodo
      const nuevoMedia = o.media.cloneNode(false);
      o.media.parentNode?.replaceChild(nuevoMedia, o.media);
      
      // 3. Limpiar source y eliminar del DOM
      o.media.src = '';
      o.media.load(); // Importante: libera el buffer
      o.media.remove();
      o.media = null; // Liberar referencia
    }
  });
  
  mediaPools = [];
  const globalTimePrevio = globalTime;
  globalDuration = 0;
  
  const promesasCarga = [];
  
  lista.forEach(linea => {
    const pool = [];
    linea.forEach(item => {
      const media = crearMedia(item);
      
      const promesaCarga = new Promise((resolve, reject) => {
        // Usar { once: true } para auto-remover listeners
        const onMetadata = () => {
          media.currentTime = item.relative_start;
        };
        
        const onSeeked = () => {
          media.removeEventListener('loadedmetadata', onMetadata);
          resolve();
        };
        
        const onError = () => {
          media.removeEventListener('loadedmetadata', onMetadata);
          media.removeEventListener('seeked', onSeeked);
          reject(new Error(`Error cargando media: ${item.src}`));
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
      globalDuration = Math.max(globalDuration, item.global_start + item.duration);
    });
    mediaPools.push(pool);
  });
  
  if(globalTimePrevio >= globalDuration) {
    //globalTime = 0;
  } else {
    globalTime = globalTimePrevio;
  }
  
  actualizarTimeline();
  
  return Promise.all(promesasCarga).then(() => {
    console.log('Flujo preparado y todos los medios cargados', mediaPools);
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
      
      // Revocar Blob URL si existe
      if (blobUrl && blobUrl.startsWith('blob:')) {
        //URL.revokeObjectURL(blobUrl); // ← ESTO LIBERA MEMORIA
      }
      
      // Remover del DOM
      o.media.remove();
      o.media = null;
    }
  });
  
  mediaPools = [];
  const globalTimePrevio = globalTime;
  globalDuration = 0;
  
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
      globalDuration = Math.max(globalDuration, item.global_start + item.duration);
    });
    mediaPools.push(pool);
  });
  
  if(globalTimePrevio >= globalDuration) {
    //globalTime = 0;
  } else {
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

function renderFrames_0(previewOnly = false) {
  let videoDibujado = false;
  mediaPools.forEach(linea => {
    linea.forEach(item => {
      const activo = globalTime >= item.global_start && globalTime < item.end;

      if (activo) {
        if (!item.started) {
          const tiempoEnClip = (globalTime - item.global_start) + item.relative_start;
          const tiempoCuantizado = cuantizarTiempo(tiempoEnClip);
          
          // Evitar seeks innecesarios
          if (Math.abs(item.media.currentTime - tiempoCuantizado) > FRAME_DURATION) {
            item.media.currentTime = tiempoCuantizado;
          }
          
          item.started = true;
        }

        // Solo reproducir si estamos en modo playing
        if (!previewOnly && playing && item.media.paused) {
          item.media.play().catch(e => console.log('Error al reproducir:', e));
        }

        if (!videoDibujado && item.media.tagName === 'VIDEO') {
          canvas_principal.width = item.media.videoWidth;
          canvas_principal.height = item.media.videoHeight;
          ctx_principal.drawImage(item.media, 0, 0);
          videoDibujado = true;
        }

      } else {
        item.started = false;
        if (!previewOnly) item.media.pause();
      }
    });
  });
}

let frame_indice = 0;
function renderFrames(previewOnly = false) {
  let videoDibujado = false;
  mediaPools.forEach(linea => {
    linea.forEach(item => {
      const activo = globalTime >= item.global_start && globalTime < item.end;

      if (activo) {
        if (!item.started) {
          const tiempoEnClip = (globalTime - item.global_start) + item.relative_start;
          const tiempoCuantizado = cuantizarTiempo(tiempoEnClip);
          
          // Evitar seeks innecesarios
          if (Math.abs(item.media.currentTime - tiempoCuantizado) > FRAME_DURATION) {
            item.media.currentTime = tiempoCuantizado;
          }
          
          item.started = true;
        }

        // Solo reproducir si estamos en modo playing
        if (!previewOnly && playing && item.media.paused) {
          item.media.play().catch(e => console.log('Error al reproducir:', e));
        }

        if (!videoDibujado && item.media.tagName === 'VIDEO') {
/*
	  console.log("item.media.videoWidth:",item.media.videoWidth);
          canvas_principal.width = item.media.videoWidth;
          canvas_principal.height = item.media.videoHeight;
          ctx_principal.drawImage(item.media, 0, 0);
          videoDibujado = true;
*/
	  const rect = canvas_principal.getBoundingClientRect();
          canvas_principal.width = rect.width;
          canvas_principal.height = rect.height;
          
          ctx_principal.drawImage(item.media, 0, 0, rect.width, rect.height);
	   
	  frame_indice = frame_indice + 1;
	  console.log("frame_indice:",frame_indice);
          videoDibujado = true; 
        }

      } else {
        item.started = false;
        if (!previewOnly) item.media.pause();
      }
    });
  });
  if (!videoDibujado) {
    ctx_principal.fillStyle = 'black';
    ctx_principal.fillRect(0, 0, canvas_principal.width, canvas_principal.height);
  }
}

/* ===========================
   CONTROLES GLOBALES
=========================== */

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
	//globalTime = 0;
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
 
/* 
playBtn.onclick = () => { 
  reproducir_video_global();
  playBtn.style.display = 'none';
  pauseBtn.style.display = 'inline'; 
};
*/ 

 
/*
playBtn.onclick = () => { 
  const files_reproducir_0 = filtrarSublistasPorProperty();
        console.log("files_reproducir:",JSON.stringify(files_reproducir_0));
	const files_reproducir = transformList(files_reproducir_0); 
	console.log("files_reproducir:",JSON.stringify(files_reproducir));
 
  actualizar_reproduccion_global(files_reproducir)
	  .then(() => {
	    console.log('Todo listo, iniciando reproducción...'); 
    	    reproducir_video_global(); 
  	    playBtn.style.display = 'none';
  	    pauseBtn.style.display = 'inline'; 
	  })
	  .catch(error => {
	    console.error('Error al cargar medios:', error);
	  }); 
};
*/


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

// Manejador del botón play mejorado
playBtn.onclick = () => { 
  const files_reproducir_0 = filtrarSublistasPorProperty();
  console.log("files_reproducir:", JSON.stringify(files_reproducir_0));
  
  const files_reproducir = transformList(files_reproducir_0); 
  console.log("files_reproducir:", JSON.stringify(files_reproducir));
  
  // Verificar si necesitamos actualizar
  const necesitaActualizar = sonDiferentes(files_reproducir, ultimoFilesReproducir);
  
  if (necesitaActualizar) {
    console.log('🔄 Detectados cambios, actualizando...');
    
    actualizar_reproduccion_global(files_reproducir)
      .then(() => {
        console.log('✅ Todo listo, esperando 2 segundos...'); 
        // Guardar el nuevo estado
        ultimoFilesReproducir = JSON.parse(JSON.stringify(files_reproducir));
         
      })
      .then(() => {
        console.log('▶️ Iniciando reproducción...'); 
        reproducir_video_global(); 
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline'; 
      })
      .catch(error => {
        console.error('❌ Error al cargar medios:', error);
      }); 
  } else {
    console.log('⏯️ Sin cambios, reproduciendo directamente...');
    
    reproducir_video_global(); 
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline';
  }
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

function update_reproduccion_timelines(){
	const files_reproducir_0 = filtrarSublistasPorProperty();
        console.log("files_reproducir:",JSON.stringify(files_reproducir_0));
	const files_reproducir = transformList(files_reproducir_0); 
	console.log("files_reproducir:",JSON.stringify(files_reproducir));

  	actualizar_reproduccion_global(files_reproducir);
/*
	actualizar_reproduccion_global(files_reproducir)
	  .then(() => {
	    console.log('Todo listo, iniciando reproducción...'); 
	  })
	  .catch(error => {
	    console.error('Error al cargar medios:', error);
	  });
*/
}

updateBtn.onclick = () => {
	update_reproduccion_timelines();
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

function retroceder_suavemente_0(velocidadMultiplicador = 1) {
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
    globalTime -= delta * velocidadMultiplicador;
    
    // Si llegamos al inicio, detenerse
    if (globalTime <= 0) {
      globalTime = 0;
      detener_retroceso();
      return;
    }
    
    // Actualizar vista
    sincronizarMedias();
    renderFrames(true);
    actualizarTimeline();
    actualizarScroll();
    
    retrocediendoAnimationId = requestAnimationFrame(loopRetroceso);
  }
  
  retrocediendoAnimationId = requestAnimationFrame(loopRetroceso);
}

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
    //update_reproduccion_timelines();
  }
}

// Para detener el retroceso manualmente si es necesario
function pausar_retroceso() {
  detener_retroceso();
}