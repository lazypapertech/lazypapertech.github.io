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
  el.src = item.filename;
  el.preload = 'auto';
  el.style.display = 'none';
  el.volume = item.volume / 100;
  el.playbackRate = item.speed;
  document.body.appendChild(el);
  return el;
}

/* ===========================
   ACTUALIZAR FLUJO GLOBAL
=========================== */

function actualizar_reproduccion_global(lista) {
  // limpiar medias previas
  mediaPools.flat().forEach(o => o.media.remove());

  mediaPools = [];
  globalDuration = 0;

  lista.forEach(linea => {
    const pool = [];
    linea.forEach(item => {
      const media = crearMedia(item);
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

  // ajustar globalTime si estaba al final
  if(globalTime >= globalDuration) globalTime = 0;

  actualizarTimeline();
  console.log('Flujo preparado', mediaPools);
}

/* ===========================
   LOOP DE REPRODUCCIÓN
=========================== */

function loop(timestamp) {
  if (!playing) return;

  if (!lastFrameTime) lastFrameTime = timestamp;
  const delta = (timestamp - lastFrameTime) / 1000;
  lastFrameTime = timestamp;
  globalTime += delta;

  if (globalTime >= globalDuration) {
    globalTime = globalDuration;
    pausar_video_global();
    pauseBtn.style.display = 'none';
    playBtn.style.display = 'inline';
    cancelAnimationFrame(animationId);  // ← AGREGAR
    return;
  }

  renderFrames();
  actualizarTimeline();
  actualizarScroll();  // ← AGREGAR: actualizar scroll mientras reproduce
  requestAnimationFrame(loop);
}

/* ===========================
   RENDER FRAMES
=========================== */

function renderFrames(previewOnly = false) {
  let videoDibujado = false;
  mediaPools.forEach(linea => {
    linea.forEach(item => {
      const activo = globalTime >= item.global_start && globalTime < item.end;

      if (activo) {
        if (!item.started) {
          item.media.currentTime = (globalTime - item.global_start) + item.relative_start;
          item.started = true;
        }

        // Solo reproducir si estamos en modo playing
        if (!previewOnly && playing && item.media.paused) {
          item.media.play();
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
  


/* ===========================
   CONTROLES GLOBALES
=========================== */

function reproducir_video_global() {
  if (globalTime >= globalDuration) globalTime = 0;
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
 
playBtn.onclick = () => {
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
        // Calcular el tiempo correcto dentro del clip
        const tiempoEnClip = (globalTime - item.global_start) + item.relative_start;
        item.media.currentTime = tiempoEnClip;
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
  globalTime = percent * globalDuration;
  sincronizarMedias();  // ← AGREGAR ESTA LÍNEA
  renderFrames(true);   // Cambiar a true para no reproducir durante arrastre
  actualizarTimeline(); 
});

timeline.addEventListener('click', e => {
  const rect = timeline.getBoundingClientRect();
  let percent = (e.clientX - rect.left) / rect.width;
  percent = Math.min(Math.max(percent, 0), 1);
  globalTime = percent * globalDuration;
  sincronizarMedias();  // ← AGREGAR ESTA LÍNEA
  pausar_video_global();
  pauseBtn.style.display = 'none';
  playBtn.style.display = 'inline';
  renderFrames(true);   // Cambiar a true
  actualizarTimeline();
});


updateBtn.onclick = () => {
const files_reproducir_0 = filtrarSublistasPorProperty();
	const files_reproducir = transformList(files_reproducir_0);
	console.log("files_reproducir:",JSON.stringify(files_reproducir_0));
	console.log("files_reproducir:",JSON.stringify(files_reproducir));

  actualizar_reproduccion_global(files_reproducir);
}; 


 
/* ===========================
   SINCRONIZACIÓN SCROLL <-> TIMELINE
=========================== */

const pxPorIntervalo = 2;
const intervalo = 0.01;
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
        globalTime = nuevoTiempo;
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