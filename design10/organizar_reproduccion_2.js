const canvas_principal = document.getElementById('canvas');
const ctx_principal = canvas_principal.getContext('2d');

const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
const updateBtn = document.getElementById('update');
const timeline = document.getElementById('timeline');
const progress = document.getElementById('progress');
const handle = document.getElementById('handle');

let video_principal;
let segments = [];
let globalDuration = 0;

let playing = false;
let rafId = null;
let activeSegment = null;
let globalTime = 0;
let lastFrameTime = null;

/* ===========================
   ACTUALIZAR REPRODUCCIÓN GLOBAL
=========================== */

function actualizar_reproduccion_global(config) {
  if (video_principal) video_principal.remove();

  video_principal = document.createElement('video');
  video_principal.src = filename_url[config[0][0].filename];
  video_principal.preload = 'auto';
  video_principal.muted = false;
  video_principal.playsInline = true;
  video_principal.style.display = 'none';
  document.body.appendChild(video_principal);

  segments = config[0];
  globalDuration = Math.max(...segments.map(s => s.global_start + s.duration));

  globalTime = 0;
  activeSegment = null;
  lastFrameTime = null;

  actualizarTimeline(globalTime);
  ctx_principal.clearRect(0, 0, canvas_principal.width, canvas_principal.height);
}

/* ===========================
   PLAY / PAUSE
=========================== */

function reproducir_video_global() {
  if (playing) return;

  if (globalTime >= globalDuration) {
    globalTime = 0;
    activeSegment = null;
  }

  playing = true;
  lastFrameTime = null;
  rafId = requestAnimationFrame(loop);

  video_principal.play();

  playBtn.style.display = 'none';
  pauseBtn.style.display = 'inline';
}

function pausar_video_global() {
  playing = false;
  video_principal.pause();
  cancelAnimationFrame(rafId);

  playBtn.style.display = 'inline';
  pauseBtn.style.display = 'none';
}

/* ===========================
   LOOP PRINCIPAL
=========================== */

function loop(timestamp) {
  if (!playing) return;

  if (!lastFrameTime) lastFrameTime = timestamp;
  const delta = (timestamp - lastFrameTime) / 1000;
  lastFrameTime = timestamp;

  globalTime += delta;

  if (globalTime >= globalDuration) {
    globalTime = globalDuration;
    // detener exactamente el último segmento
    const lastSeg = segments[segments.length - 1];
    video_principal.currentTime = lastSeg.relative_start + lastSeg.duration;
    canvas_principal.width = video_principal.videoWidth;
    canvas_principal.height = video_principal.videoHeight;
    ctx_principal.drawImage(video_principal, 0, 0);

    pausar_video_global();
    return;
  }

  // segmento activo según globalTime
  const seg = segments.find(
    s => globalTime >= s.global_start && globalTime < s.global_start + s.duration
  );

  if (seg) {
    if (activeSegment !== seg) {
      activeSegment = seg;
      video_principal.currentTime = seg.relative_start + (globalTime - seg.global_start);
      canvas_principal.width = video_principal.videoWidth;
      canvas_principal.height = video_principal.videoHeight;
      ctx_principal.drawImage(video_principal, 0, 0);
    } else {
      canvas_principal.width = video_principal.videoWidth;
      canvas_principal.height = video_principal.videoHeight;
      ctx_principal.drawImage(video_principal, 0, 0);
    }
  } else {
    // vacío
    ctx_principal.clearRect(0, 0, canvas_principal.width, canvas_principal.height);
    activeSegment = null;
  }

  actualizarTimeline(globalTime);
  rafId = requestAnimationFrame(loop);
}

/* ===========================
   TIMELINE
=========================== */

function actualizarTimeline(time) {
  const percent = globalDuration ? Math.min((time / globalDuration) * 100, 100) : 0;
const pxPorIntervalo = 2;
const intervalo = 0.01;
const pasos = Math.floor(time / intervalo); 
    scrollWrapper.scrollLeft = pasos * pxPorIntervalo;
  progress.style.width = percent + '%';
  handle.style.left = percent + '%';
}

/* ===========================
   HANDLE
=========================== */

let dragging = false;

handle.addEventListener('mousedown', () => {
  dragging = true;
  pausar_video_global();
});

document.addEventListener('mouseup', () => dragging = false);

document.addEventListener('mousemove', e => {
  if (!dragging) return;
  const rect = timeline.getBoundingClientRect();
  let percent = (e.clientX - rect.left) / rect.width;
  percent = Math.min(Math.max(percent, 0), 1);

  globalTime = percent * globalDuration;

  const seg = segments.find(
    s => globalTime >= s.global_start && globalTime < s.global_start + s.duration
  );

  if (seg) {
    video_principal.currentTime = seg.relative_start + (globalTime - seg.global_start);
    activeSegment = seg;
    canvas_principal.width = video_principal.videoWidth;
    canvas_principal.height = video_principal.videoHeight;
    ctx_principal.drawImage(video_principal, 0, 0);
  } else {
    activeSegment = null;
    ctx_principal.clearRect(0, 0, canvas_principal.width, canvas_principal.height);
  }

  actualizarTimeline(globalTime);
});

timeline.addEventListener('click', e => {
  const rect = timeline.getBoundingClientRect();
  let percent = (e.clientX - rect.left) / rect.width;
  percent = Math.min(Math.max(percent, 0), 1);

  globalTime = percent * globalDuration;

  const seg = segments.find(
    s => globalTime >= s.global_start && globalTime < s.global_start + s.duration
  );

  if (seg) {
    video_principal.currentTime = seg.relative_start + (globalTime - seg.global_start);
    activeSegment = seg;
    canvas_principal.width = video_principal.videoWidth;
    canvas_principal.height = video_principal.videoHeight;
    ctx_principal.drawImage(video_principal, 0, 0);
  } else {
    activeSegment = null;
    ctx_principal.clearRect(0, 0, canvas_principal.width, canvas_principal.height);
  }

  pausar_video_global();
  actualizarTimeline(globalTime);
});

/* ===========================
   BOTONES
=========================== */

playBtn.onclick = reproducir_video_global;
pauseBtn.onclick = pausar_video_global;

updateBtn.onclick = () => {
const files_reproducir_0 = filtrarSublistasPorProperty();
	const config = transformList(files_reproducir_0);
	console.log("files_reproducir:",JSON.stringify(files_reproducir_0));
	console.log("files_reproducir:",JSON.stringify(config));
  actualizar_reproduccion_global(config);
  pausar_video_global();
};
