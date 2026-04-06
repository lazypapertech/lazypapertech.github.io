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

function renderFrames_0(previewOnly = false) {

  // 1️⃣ Calcular el índice de frame global desde el tiempo global
  const frameIndex = Math.floor(globalTime / FRAME_DURATION);
  console.log("frameIndex:", frameIndex);
  let frame_dibujado=false;

  // 2️⃣ Dibujar siempre el fotograma correspondiente, aunque no haya video
  if (frameIndex !== ultimoFrameDibujado) {
    ultimoFrameDibujado = frameIndex;

    const rect = canvas_principal.getBoundingClientRect();
    canvas_principal.width = rect.width;
    canvas_principal.height = rect.height;

    const frame = fotogramas_guardados[frameIndex]; 
    if (
	frame &&
    (
      frame instanceof HTMLImageElement ||
      frame instanceof HTMLVideoElement ||
      frame instanceof HTMLCanvasElement ||
      frame instanceof ImageBitmap ||
      frame instanceof OffscreenCanvas ||
      frame instanceof SVGImageElement ||
      (typeof frame === 'object' && 'close' in frame) // Para VideoFrame en ciertos entornos
    )
   ) {
      ctx_principal.drawImage(frame, 0, 0, rect.width, rect.height); 
	frame_dibujado = true;
	console.log("frame_dibujado:",frame_dibujado);
    } else { 
      ctx_principal.clearRect(0, 0, rect.width, rect.height);
      draw_text("Not valid frame...", rect);	
    }
  }
   
 



  
  let videoDibujado = false; 
  mediaPools.forEach(linea => {
    linea.forEach(item => {
      const activo = globalTime >= item.global_start && globalTime < item.end;

      if (activo) {

        const tiempoEnClip = (globalTime - item.global_start) + item.relative_start;
        const tiempoCuantizado = cuantizarTiempo(tiempoEnClip);

        if (!item.started) {
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

        // 🎯 DIBUJO CONTROLADO POR FRAME LÓGICO
        if (
          !videoDibujado &&
          item.media.tagName === 'VIDEO' &&
          tiempoCuantizado !== ultimoTiempoCuantizado
        ) {
          ultimoTiempoCuantizado = tiempoCuantizado;

          const rect = canvas_principal.getBoundingClientRect();
          canvas_principal.width = rect.width;
          canvas_principal.height = rect.height;

	  console.log("fotogramas_guardados.length:",fotogramas_guardados.length);
	  if (frameIndex < fotogramas_guardados.length){
		if (fotogramas_guardados[frameIndex]!=PENDIENTE){
			console.log("frame guardado"); 
			ctx_principal.drawImage(fotogramas_guardados[frameIndex], 0, 0, rect.width, rect.height); 
		}else{
			ctx_principal.drawImage(item.media, 0, 0, rect.width, rect.height);
	  		draw_text("Updating frame...", rect);
		}
	  }else{
		ctx_principal.drawImage(item.media, 0, 0, rect.width, rect.height);
	  	draw_text("Updating frame...", rect);
	  }  

          frame_indice++;
          console.log("frame_indice:", frame_indice); 

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
   RENDER FRAMES ADAPTADO
=========================== */


async function renderFrames(previewOnly = false) {
  const frameIndex = Math.floor(globalTime / FRAME_DURATION);
  const segundo = Math.floor(frameIndex / TARGET_FPS);
  const frameEnSegundo = frameIndex % TARGET_FPS;
  
  // Llamar en renderFrames
if (frameEnSegundo === 20) { // A los 20 frames, precargar siguiente
  precargarSiguiente(segundo);
}
  console.log(`frameIndex: ${frameIndex}, segundo: ${segundo}, frame: ${frameEnSegundo}`);

  // 2️⃣ Renderizar frame del trozo codificado
  if (frameIndex !== ultimoFrameDibujado) {
    ultimoFrameDibujado = frameIndex;
    
    const rect = canvas_principal.getBoundingClientRect();
    canvas_principal.width = rect.width;
    canvas_principal.height = rect.height;

    // ✅ Verificar si hay trozo disponible
    if (trozos_guardados[segundo]) {
      // Cargar el segundo si no está cargado
      if (videoPlayer.segundoActual !== segundo) {
        await videoPlayer.cargarSegundo(segundo);
      }
      
      // Renderizar el frame específico
      const rendered = videoPlayer.renderFrame(frameEnSegundo);
      
      if (rendered) {
        console.log(`✓ Frame ${frameIndex} renderizado`);
      } else {
        ctx_principal.clearRect(0, 0, rect.width, rect.height);
        draw_text("Loading frame...", rect);
      }
    } else {
      // Trozo no descargado
      ctx_principal.clearRect(0, 0, rect.width, rect.height);
      draw_text("Updating frame...", rect);
    }
  }

  // 3️⃣ Resto de tu código de videos
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

          // Solo usar el video local si no hay trozo del servidor
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

 
// Manejador del botón play mejorado
playBtn.onclick = () => {  
  if (unica_regla.rectangulos.length==0){
     console.log("NINGUN ARCHIVO SUBIDO");
     return;
  }
  frame_indice = 0; 
  const all_files_0 = filtrarSublistasPorPropertyGeneral();
  console.log("all_files_0:", JSON.stringify(all_files_0));

  const files_reproducir_0 = filtrarSublistasPorProperty();
  console.log("files_reproducir_0:", JSON.stringify(files_reproducir_0));
  
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
































const trozos_guardados = [];

class VideoPlayer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.segundoActual = -1;
    this.framesDelSegundo = [];
    this.decodificando = false;
  }
  
  async cargarSegundo(second) {
    if (this.segundoActual === second && this.framesDelSegundo.length > 0) {
      return true;
    }
    
    if (!trozos_guardados[second]) {
      console.error(`Trozo ${second} no disponible`);
      return false;
    }
    
    if (this.decodificando) {
      console.log("Ya está decodificando, esperando...");
      return false;
    }
    
    console.log(`🔄 Cargando segundo ${second}...`);
    this.decodificando = true;
    
    // Limpiar frames anteriores
    this.framesDelSegundo.forEach(f => {
      if (f && f.close) f.close();
    });
    this.framesDelSegundo = [];
    
    const chunk_data = trozos_guardados[second];
    const encodedFrames = getChunks(chunk_data);
    
    return new Promise((resolve, reject) => {
      const bitmapPromises = []; // ✅ Guardar todas las promesas
      let outputCallCount = 0;
      
      const decoder = new VideoDecoder({
        output: (videoFrame) => {
          const frameIndex = outputCallCount++;
          
          try {
            const canvas = new OffscreenCanvas(
              videoFrame.displayWidth,
              videoFrame.displayHeight
            );
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoFrame, 0, 0);
            videoFrame.close();
            
            // ✅ Guardar la promesa
            const bitmapPromise = createImageBitmap(canvas).then(bitmap => {
              this.framesDelSegundo[frameIndex] = bitmap;
              return bitmap;
            });
            
            bitmapPromises.push(bitmapPromise);
            
          } catch (err) {
            console.error(`Error procesando frame ${frameIndex}:`, err);
            videoFrame.close();
          }
        },
        error: (e) => {
          console.error("Decoder error:", e);
          this.decodificando = false;
          try {
            decoder.close();
          } catch (err) {}
          reject(e);
        }
      });
      
      try {
        decoder.configure({ codec: "vp8" });
        
        let timestamp = 0;
        const frameDuration = 1e6 / TARGET_FPS;
        
        for (let i = 0; i < encodedFrames.length; i++) {
          decoder.decode(new EncodedVideoChunk({
            type: i === 0 ? "key" : "delta",
            timestamp,
            data: encodedFrames[i],
          }));
          timestamp += frameDuration;
        }
        
        // ✅ ESPERAR flush Y bitmaps
        decoder.flush().then(async () => {
          // Esperar a que TODOS los bitmaps estén listos
          await Promise.all(bitmapPromises);
          
          // AHORA sí cerrar
          decoder.close();
          
          this.segundoActual = second;
          this.decodificando = false;
          console.log(`✅ Segundo ${second} cargado (${this.framesDelSegundo.length} frames)`);
          resolve(true);
        }).catch(err => {
          console.error("Error en flush:", err);
          this.decodificando = false;
          try {
            decoder.close();
          } catch (e) {}
          reject(err);
        });
        
      } catch (error) {
        console.error("Error decodificando:", error);
        this.decodificando = false;
        try {
          decoder.close();
        } catch (e) {}
        reject(error);
      }
    });
  }
  
  renderFrame(frameIndexInSecond) {
    if (this.framesDelSegundo[frameIndexInSecond]) {
      this.ctx.drawImage(
        this.framesDelSegundo[frameIndexInSecond],
        0, 0,
        this.canvas.width,
        this.canvas.height
      );
      return true;
    }
    return false;
  }
  
  cleanup() {
    this.framesDelSegundo.forEach(f => {
      if (f && f.close) f.close();
    });
    this.framesDelSegundo = [];
    this.segundoActual = -1;
  }
}

// Crear instancia global
const videoPlayer = new VideoPlayer(canvas_principal);



async function precargarSiguiente(segundoActual) {
  const siguienteSegundo = segundoActual + 1;
  if (trozos_guardados[siguienteSegundo] && videoPlayer.segundoActual !== siguienteSegundo) {
    // Decodificar en background sin bloquear
    setTimeout(async () => {
      await videoPlayer.cargarSegundo(siguienteSegundo);
    }, 100);
  }
}
 




  