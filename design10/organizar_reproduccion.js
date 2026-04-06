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
    return;
  }

  renderFrames();
  actualizarTimeline();
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
  if (globalTime >= globalDuration) globalTime = 0; // empezar desde inicio si estaba al final
  playing = true;
  lastFrameTime = null;
  requestAnimationFrame(loop);
}

function pausar_video_global() {
  playing = false;
  mediaPools.flat().forEach(o => o.media.pause());
}

/* ===========================
   TIMELINE
=========================== */

function actualizarTimeline() {
  const percent = globalDuration ? Math.min((globalTime / globalDuration) * 100, 100) : 0;
  actualizarScroll_2();
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
usuarioControlaScroll = false;
};

pauseBtn.onclick = () => {
  pausar_video_global();
  pauseBtn.style.display = 'none';
  playBtn.style.display = 'inline';
videoControlaScroll = false;
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



// --- VIDEO -> SCROLL ---
function actualizarScroll_2() {
    if (usuarioControlaScroll) return; // <- no tocar scroll si el usuario está actuando
console.log("SCROLL AUTOMATICO");
    const pasos = Math.floor(globalTime / intervalo);
    videoControlaScroll = true;
    scrollWrapper.scrollLeft = pasos * pxPorIntervalo;
}


function actualizarVideoPorScroll_2() {
    const pasos = Math.floor(scrollWrapper.scrollLeft / pxPorIntervalo);
    const nuevoTiempo = pasos * intervalo;

    if (nuevoTiempo <= globalDuration) {
        globalTime = nuevoTiempo;
    }
  
}

scrollWrapper.addEventListener('scroll', () => {

    // Si el scroll fue causado por el video → ignorar
    if (videoControlaScroll) {
        videoControlaScroll = false; // limpiar la bandera
        return;
    }

    // Desde aquí sí es scroll del usuario
    usuarioControlaScroll = true;
if (dragging){ 
  pausar_video_global();        // Pausar la reproducción
  pauseBtn.style.display = 'none'; // Mostrar botón play
  playBtn.style.display = 'inline';  
}

    actualizarVideoPorScroll_2();
sincronizarMedias();  // ← AGREGAR ESTA LÍNEA
  renderFrames(true);   // Cambiar a true para no reproducir durante arrastre
  actualizarTimeline();

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        usuarioControlaScroll = false;
    }, 120);
});


 