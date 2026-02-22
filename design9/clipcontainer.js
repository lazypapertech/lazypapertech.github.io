
 
let timestamp_and_duration="00:00:00,0.2";//poner 00:00:00,0.4
let current_speed = 1;
let current_volume = 100;
let initialtimepoint1 = "00:00:00";
let initialtimepoint2 = "00:00:00.2";//poner 00:00:00.4 

function inicializar_rango(){
  if (selected_rect){
  const index = parseInt(selected_rect.dataset.indice); 
  const video_params = unica_regla.rectangulos[index].video_audio_value; 
    if (video_params!=""){ 
 	console.log("guardado:",video_params);
        initialtimepoint1 = video_params.split(",")[0];
	initialtimepoint2 = sumarTiempo(video_params.split(",")[0],video_params.split(",")[1],1); 
	current_speed = video_params.split(",")[2];
	current_volume = video_params.split(",")[3];
        timestamp_and_duration = video_params.split(",")[0]+","+video_params.split(",")[1];
	console.log("initialtimepoint2 initialtimepoint2:",initialtimepoint2); 
	console.log("current_volume current_volume:",current_volume); 
        // Control de volumen
	const videoClipperHiddenVideo = document.getElementById('videoClipperHiddenVideo');
	const videoClipperVolumeSlider = document.getElementById('videoClipperVolumeSlider');
	const videoClipperVolumeDisplay = document.getElementById('videoClipperVolumeDisplay');
 	if (videoClipperHiddenVideo && videoClipperVolumeSlider && videoClipperVolumeDisplay){
		videoClipperVolumeSlider.value = parseFloat(current_volume);
  		videoClipperHiddenVideo.volume = parseFloat(current_volume) / 100;
  		videoClipperVolumeDisplay.textContent = current_volume; 
	}
    }else{ 
	initialtimepoint1 = "00:00:00.0";
	initialtimepoint2 = "00:00:00.2";//poner 00:00:00.4  
	current_volume = 100;
	const videoClipperVolumeSlider = document.getElementById('videoClipperVolumeSlider'); 
 	if (videoClipperVolumeSlider){
  		videoClipperVolumeSlider.value = 100;
	}
    }	
  } 
}
 
 

function diffTime(t1, t2) { 
  function toSeconds(t) {
    const [hh, mm, ss] = t.split(':');
    return Number(hh) * 3600 + Number(mm) * 60 + Number(ss);
  }

  const s1 = toSeconds(t1);
  const s2 = toSeconds(t2);

  const totalSeg = Math.abs(s1 - s2); 

  return totalSeg;
}


function createVideoClipperMainContainer(videoSrc) {
  const htmlString = `
    <div id="videoClipperMainContainer" style="max-width:550px; width:100%; border:none; padding:0; display:flex; flex-direction:column; gap:10px; font-family:sans-serif;">
      <canvas id="videoClipperCanvas" style="width:100%; aspect-ratio:16/9; border:1px solid #999; background:black;"></canvas>
	
	<p>Slide the circles to select a segment</p>

      <div id="videoClipperTimelineContainer" style="position:relative; width:100%; height:20px; background:#ccc; border-radius:10px; cursor:pointer;">
        <div id="videoClipperPurpleRange" style="position:absolute; height:100%; background:#7c55e6; top:0;"></div>
        <div class="videoClipperCircleMarker" id="videoClipperCircleStart" style="position:absolute; width:20px; height:20px; border-radius:50%; background:white; border:2px solid #7c55e6; top:50%; transform:translate(-50%,-50%); cursor:pointer;"></div>
        <div class="videoClipperCircleMarker" id="videoClipperCircleEnd" style="position:absolute; width:20px; height:20px; border-radius:50%; background:white; border:2px solid #7c55e6; top:50%; transform:translate(-50%,-50%); cursor:pointer;"></div>
      </div>
      
      <div id="videoClipperControlsWrapper" style="display:flex; flex-direction:column; gap:5px; width:100%;">
        <div id="videoClipperPlayPauseInterval" style="display:flex; align-items:center; gap:5px;">
          <button id="videoClipperPlayButton" style="font-size:20px; padding:3px 6px; border-radius:4px; cursor:pointer; user-select:none; background-color:#7c55e6; color:white; border:1px solid #7c55e6;">▶︎</button>
          <button id="videoClipperPauseButton" style="display:none;font-size:20px; padding:3px 6px; border-radius:4px; cursor:pointer; user-select:none; background-color:#7c55e6; color:white; border:1px solid #7c55e6;">❚❚</button>
          <div id="videoClipperIntervalDisplay" style="margin:0 5px; font-size:14px; font-weight:bold; font-family:Arial,sans-serif;"></div>
        </div>
 

        <div id="videoClipperSpeedControlBar" style="display:flex; flex-wrap:wrap; gap:5px;">
<!--
          <div class="videoClipperSpeedOptionButton" data-speed="0.25" style="font-size:14px; padding:3px 6px; border:1px solid #999; border-radius:4px; cursor:pointer; user-select:none;">0.25</div>
-->
          <div class="videoClipperSpeedOptionButton" data-speed="0.5" style="font-size:14px; padding:3px 6px; border:1px solid #999; border-radius:4px; cursor:pointer; user-select:none;">0.5</div>
          <div class="videoClipperSpeedOptionButton" data-speed="0.75" style="font-size:14px; padding:3px 6px; border:1px solid #999; border-radius:4px; cursor:pointer; user-select:none;">0.75</div>
          <div class="videoClipperSpeedOptionButton videoClipperSpeedActive" data-speed="1" style="font-size:14px; padding:3px 6px; border-radius:4px; cursor:pointer; user-select:none; background-color:#7c55e6; color:white; border:1px solid #7c55e6;">1</div>
          <div class="videoClipperSpeedOptionButton" data-speed="1.25" style="font-size:14px; padding:3px 6px; border:1px solid #999; border-radius:4px; cursor:pointer; user-select:none;">1.25</div>
          <div class="videoClipperSpeedOptionButton" data-speed="1.5" style="font-size:14px; padding:3px 6px; border:1px solid #999; border-radius:4px; cursor:pointer; user-select:none;">1.5</div>
          <div class="videoClipperSpeedOptionButton" data-speed="1.75" style="font-size:14px; padding:3px 6px; border:1px solid #999; border-radius:4px; cursor:pointer; user-select:none;">1.75</div>
          <div class="videoClipperSpeedOptionButton" data-speed="2" style="font-size:14px; padding:3px 6px; border:1px solid #999; border-radius:4px; cursor:pointer; user-select:none;">2</div>
        </div>

	<!-- NUEVA BARRA DE VOLUMEN -->
        <div id="videoClipperVolumeWrapper" style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:14px; font-family:Arial,sans-serif;">Vol:</span>
          <input type="range" id="videoClipperVolumeSlider" min="0" max="100" value="100" style="flex:1;  min-width:120px;cursor:pointer;">
          <span id="videoClipperVolumeDisplay" style="font-size:14px; font-weight:bold; font-family:Arial,sans-serif; min-width:35px;">100</span>
        </div> 

      </div>
    </div>

    <video id="videoClipperHiddenVideo" src="${videoSrc}" style="display:none;"></video>
  `;

  return htmlString;
}

function setSpeedActive(speed) {
  const bar = document.getElementById('videoClipperSpeedControlBar');
  if (!bar) return;

  // iterar solo los hijos de la barra
  [...bar.children].forEach(btn => {
    btn.classList.toggle(
      'videoClipperSpeedActive',
      btn.dataset.speed === speed
    );
  });
}

function initVideoClipper() {
  const videoClipperHiddenVideo = document.getElementById('videoClipperHiddenVideo');
  const videoClipperCanvas = document.getElementById('videoClipperCanvas');
  const videoClipperCtx = videoClipperCanvas.getContext('2d');

  const videoClipperCircleStart = document.getElementById('videoClipperCircleStart');
  const videoClipperCircleEnd = document.getElementById('videoClipperCircleEnd');
  const videoClipperPurpleRange = document.getElementById('videoClipperPurpleRange');
  const videoClipperTimelineContainer = document.getElementById('videoClipperTimelineContainer');
  const videoClipperIntervalDisplay = document.getElementById('videoClipperIntervalDisplay');

  const videoClipperPlayButton = document.getElementById('videoClipperPlayButton');
  const videoClipperPauseButton = document.getElementById('videoClipperPauseButton');
  const videoClipperSpeedControlBar = document.getElementById('videoClipperSpeedControlBar');
  
  const index = parseInt(selected_rect.dataset.indice); 
  console.log("INDEX RECTANGLE 0: ",index,unica_regla.rectangulos[index].video_audio_value);
 
  const video_params = unica_regla.rectangulos[index].video_audio_value; 
  console.log("video_params video_params:",video_params);
  let speed = 1; 
  if (video_params!=""){ 
        speed = parseFloat(video_params.split(",")[2]);
	console.log("speed speed:",speed); 
  }	 
  videoClipperHiddenVideo.playbackRate = speed;

  let videoClipperDragging = null;
  const videoClipperStep = 0.2;
 

  let videoClipperTimepoint1 = initialtimepoint1;//"00:00:00" 
  let videoClipperTimepoint2 = initialtimepoint2;//"00:00:02" 

inicializar_rango();
videoClipperTimepoint2 = initialtimepoint2;

  const baseSpeedStyle = "font-size:14px; padding:3px 6px; border:1px solid #999; border-radius:4px; cursor:pointer; user-select:none;";
  const activeSpeedStyle = "font-size:14px; padding:3px 6px; border:1px solid #7c55e6; border-radius:4px; cursor:pointer; user-select:none; background-color:#7c55e6; color:white;";

  function videoClipperFormatTime_mal(sec) {
    sec = Math.round(sec * 10) / 10;
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    let sStr = (s % 1 === 0) ? String(Math.floor(s)).padStart(2, '0') : s.toFixed(1);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${sStr}`;
  }
function videoClipperFormatTime(sec) {
    sec = Math.round(sec * 10) / 10;

    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    let sStr;
    if (s % 1 === 0) {
        // segundos enteros
        sStr = String(Math.floor(s)).padStart(2, '0');
    } else {
        // segundos con 1 decimal
        sStr = s.toFixed(1).padStart(4, '0');
        //          "1.4"  -> "01.4"
    }

    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${sStr}`;
}


  function videoClipperRenderVideo() {
    videoClipperCtx.drawImage(videoClipperHiddenVideo, 0, 0, videoClipperCanvas.width, videoClipperCanvas.height);
    requestAnimationFrame(videoClipperRenderVideo);
  }

  function videoClipperStartDrag(e, c) {
    videoClipperDragging = c;
    if (!videoClipperHiddenVideo.paused) {
      videoClipperHiddenVideo.pause();
      videoClipperPauseButton.style.display = 'none';
      videoClipperPlayButton.style.display = 'inline';
    }
  }

  function handleMouseUp() {
    videoClipperDragging = null;
  }

  function handleMouseMove(e) {
    if (!videoClipperDragging) return;
    const rect = videoClipperTimelineContainer.getBoundingClientRect();
    let x = e.clientX - rect.left;
    x = Math.max(0, Math.min(videoClipperTimelineContainer.clientWidth, x));

    if (videoClipperDragging === videoClipperCircleStart) x = Math.min(x, videoClipperCircleEnd.offsetLeft - 10);
    if (videoClipperDragging === videoClipperCircleEnd) x = Math.max(x, videoClipperCircleStart.offsetLeft + 10);

    videoClipperDragging.style.left = x + 'px';

    const x1 = videoClipperCircleStart.offsetLeft;
    const x2 = videoClipperCircleEnd.offsetLeft;
    videoClipperPurpleRange.style.left = x1 + 'px';
    videoClipperPurpleRange.style.width = (x2 - x1) + 'px';

    const t1 = Math.round((x1 / videoClipperTimelineContainer.clientWidth) * videoClipperHiddenVideo.duration / videoClipperStep) * videoClipperStep;
    const t2 = Math.round((x2 / videoClipperTimelineContainer.clientWidth) * videoClipperHiddenVideo.duration / videoClipperStep) * videoClipperStep;
 
    videoClipperTimepoint1 = videoClipperFormatTime(t1);
    videoClipperTimepoint2 = videoClipperFormatTime(t2);
 

    videoClipperIntervalDisplay.textContent = `${videoClipperTimepoint1} - ${videoClipperTimepoint2}`; 
 
//initialtimepoint2 = videoClipperTimepoint2;//descomentar
//update_time(videoClipperTimepoint1,videoClipperTimepoint2);
timestamp_and_duration = videoClipperTimepoint1+","+diffTime(videoClipperTimepoint1, videoClipperTimepoint2).toString(); 
    //console.log(videoClipperTimepoint1, videoClipperTimepoint2," ",timestamp_and_duration);
  }

 
videoClipperHiddenVideo.addEventListener('loadeddata', () => {
  videoClipperCanvas.width = videoClipperHiddenVideo.videoWidth;
  videoClipperCanvas.height = videoClipperHiddenVideo.videoHeight;
  videoClipperRenderVideo();

  const duration = videoClipperHiddenVideo.duration;
  const width = videoClipperTimelineContainer.clientWidth;

  // Convertir initialtimepoint1 e initialtimepoint2 a segundos
  const startTime = parseTimeToSeconds(initialtimepoint1);
  const endTime = parseTimeToSeconds(initialtimepoint2);

  // Calcular posiciones proporcionales
  const startPosition = (startTime / duration) * width;
  const endPosition = (endTime / duration) * width;

  videoClipperCircleStart.style.left = startPosition + 'px';
  videoClipperCircleEnd.style.left = endPosition + 'px';

  videoClipperTimepoint1 = initialtimepoint1;
  videoClipperTimepoint2 = initialtimepoint2;

  // Actualizar rango púrpura
  videoClipperPurpleRange.style.left = startPosition + 'px';
  videoClipperPurpleRange.style.width = (endPosition - startPosition) + 'px';

  videoClipperIntervalDisplay.textContent = `${videoClipperTimepoint1} - ${videoClipperTimepoint2}`;
  //console.log(videoClipperTimepoint1, videoClipperTimepoint2);
});

  // Delegación: mousedown en timeline container
  videoClipperTimelineContainer.addEventListener('mousedown', e => {
    if (e.target === videoClipperCircleStart) {
      videoClipperStartDrag(e, videoClipperCircleStart);
    } else if (e.target === videoClipperCircleEnd) {
      videoClipperStartDrag(e, videoClipperCircleEnd);
    }
  });

  // Eventos en document (estos hay que limpiar)
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mousemove', handleMouseMove);

  // Delegación: click en controles (play/pause)
  document.getElementById('videoClipperPlayPauseInterval').addEventListener('click', e => {
    if (e.target === videoClipperPlayButton) {
      const start = (videoClipperCircleStart.offsetLeft / videoClipperTimelineContainer.clientWidth) * videoClipperHiddenVideo.duration;
      const end = (videoClipperCircleEnd.offsetLeft / videoClipperTimelineContainer.clientWidth) * videoClipperHiddenVideo.duration;
      videoClipperHiddenVideo.currentTime = start;
      videoClipperHiddenVideo.play();
      videoClipperPlayButton.style.display = 'none';
      videoClipperPauseButton.style.display = 'inline';

      function videoClipperCheckEnd() {
        if (videoClipperHiddenVideo.currentTime >= end) {
          videoClipperHiddenVideo.pause();
          videoClipperPauseButton.style.display = 'none';
          videoClipperPlayButton.style.display = 'inline';
          videoClipperHiddenVideo.removeEventListener('timeupdate', videoClipperCheckEnd);
        }
      }
      videoClipperHiddenVideo.addEventListener('timeupdate', videoClipperCheckEnd);

    } else if (e.target === videoClipperPauseButton) {
      videoClipperHiddenVideo.pause();
      videoClipperPauseButton.style.display = 'none';
      videoClipperPlayButton.style.display = 'inline';
    }
  });

  // Delegación: click en velocidades
  videoClipperSpeedControlBar.addEventListener('click', e => {
    if (e.target.classList.contains('videoClipperSpeedOptionButton')) {
      const allOptions = videoClipperSpeedControlBar.querySelectorAll('.videoClipperSpeedOptionButton');
      allOptions.forEach(o => o.style.cssText = baseSpeedStyle);
      e.target.style.cssText = activeSpeedStyle;

 
      const speed = parseFloat(e.target.dataset.speed);  
      videoClipperHiddenVideo.playbackRate = speed;
      console.log(speed);
      current_speed = speed;
 
    }
  });









function handleTouchStart(e) {
  const touch = e.touches[0];
  if (e.target === videoClipperCircleStart) {
    videoClipperStartDrag(touch, videoClipperCircleStart);
  } else if (e.target === videoClipperCircleEnd) {
    videoClipperStartDrag(touch, videoClipperCircleEnd);
  }
}

function handleTouchEnd() {
  videoClipperDragging = null;
}

 

function handleTouchMove(e) {
  if (!videoClipperDragging) return;
  e.preventDefault();
  const touch = e.touches[0];
  const rect = videoClipperTimelineContainer.getBoundingClientRect();
  let x = touch.clientX - rect.left;
  x = Math.max(0, Math.min(videoClipperTimelineContainer.clientWidth, x));

  if (videoClipperDragging === videoClipperCircleStart) x = Math.min(x, videoClipperCircleEnd.offsetLeft - 10);
  if (videoClipperDragging === videoClipperCircleEnd) x = Math.max(x, videoClipperCircleStart.offsetLeft + 10);

  videoClipperDragging.style.left = x + 'px';

  const x1 = videoClipperCircleStart.offsetLeft;
  const x2 = videoClipperCircleEnd.offsetLeft;
  videoClipperPurpleRange.style.left = x1 + 'px';
  videoClipperPurpleRange.style.width = (x2 - x1) + 'px';

  const t1 = Math.round((x1 / videoClipperTimelineContainer.clientWidth) * videoClipperHiddenVideo.duration / videoClipperStep) * videoClipperStep;
  const t2 = Math.round((x2 / videoClipperTimelineContainer.clientWidth) * videoClipperHiddenVideo.duration / videoClipperStep) * videoClipperStep;
  videoClipperTimepoint1 = videoClipperFormatTime(t1);
  videoClipperTimepoint2 = videoClipperFormatTime(t2);

  videoClipperIntervalDisplay.textContent = `${videoClipperTimepoint1} - ${videoClipperTimepoint2}`;
 
//initialtimepoint2 = videoClipperTimepoint2;//descomentar
//update_time(videoClipperTimepoint1,videoClipperTimepoint2);
timestamp_and_duration = videoClipperTimepoint1+","+diffTime(videoClipperTimepoint1, videoClipperTimepoint2).toString(); 
    //console.log(videoClipperTimepoint1, videoClipperTimepoint2," ",timestamp_and_duration);
}

function handleResize() {
  const duration = videoClipperHiddenVideo.duration;
  const width = videoClipperTimelineContainer.clientWidth;

  // Obtener tiempos actuales desde los textos
  const t1 = parseTimeToSeconds(videoClipperTimepoint1);
  const t2 = parseTimeToSeconds(videoClipperTimepoint2);

  // Recalcular posiciones
  const newX1 = (t1 / duration) * width;
  const newX2 = (t2 / duration) * width;

  videoClipperCircleStart.style.left = newX1 + 'px';
  videoClipperCircleEnd.style.left = newX2 + 'px';
  videoClipperPurpleRange.style.left = newX1 + 'px';
  videoClipperPurpleRange.style.width = (newX2 - newX1) + 'px';
}

function parseTimeToSeconds(timeStr) {
  const parts = timeStr.split(':');
  const h = parseFloat(parts[0]);
  const m = parseFloat(parts[1]);
  const s = parseFloat(parts[2]);
  return h * 3600 + m * 60 + s;
}

window.addEventListener('resize', handleResize);

// Agregar eventos touch
videoClipperTimelineContainer.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchend', handleTouchEnd);
document.addEventListener('touchmove', handleTouchMove, { passive: false });

// Control de volumen
const videoClipperVolumeSlider = document.getElementById('videoClipperVolumeSlider');
const videoClipperVolumeDisplay = document.getElementById('videoClipperVolumeDisplay');

videoClipperVolumeSlider.addEventListener('input', e => {
  const volume = e.target.value;
  videoClipperHiddenVideo.volume = volume / 100;
  videoClipperVolumeDisplay.textContent = volume;
  console.log("volume:",volume);
  current_volume = volume;
});

  // Retornar función de limpieza
  return function cleanupVideoClipper() {
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('touchend', handleTouchEnd);
  document.removeEventListener('touchmove', handleTouchMove);
window.removeEventListener('resize', handleResize);

    videoClipperHiddenVideo.pause();
    videoClipperHiddenVideo.src = '';
  };
}


function send_timestamp_video_audio(){
const timestamp_video_audio = timestamp_and_duration+","+current_speed+","+current_volume+","+initialtimepoint2; 
const duration = timestamp_and_duration.split(",")[1];
console.log("durationnnn: ",duration);
 

	const indice = parseInt(selected_rect.dataset.indice); 
 
	let end_ajustado = sumarTiempo(unica_regla.rectangulos[indice].start,duration,current_speed);  
console.log("BBBBBBB timestamp_video_audio: ",timestamp_video_audio,", end_ajustado: ",end_ajustado);
	
	if (end_ajustado == "00:00:00.1" || end_ajustado == "00:00:00"){
		end_ajustado = "00:00:00.2";
	}

	unica_regla.rectangulos[indice].end = end_ajustado;
	rectangulos[indice].end = end_ajustado;
	console.log("end_ajustado: ",end_ajustado);

	 


console.log("guardando... ",timestamp_video_audio); 

unica_regla.rectangulos[indice].video_audio_value = timestamp_video_audio; 
rectangulos[indice].video_audio_value = timestamp_video_audio; 

 

current_timeline[1]=rectangulos;



//unica_regla.selectedTab funciona mal
const json_data_2 =  {"service":"save_item_data","itemName":current_item,"property":current_timeline[2],"params":"empty", "rectangulos":unica_regla.rectangulos,"extra":"clip"}; 
        websocketClient.send(JSON.stringify(json_data_2)); 
 
if (current_timeline[2]=="filename"){ 
	create_buttons_properties(current_timeline[0]);  
    	inicializar(unica_regla.rectangulos);  
	activarBoton("filename");    
	//nuevo
	aplicarEmpujeRedimensionVideoAudio(indice);
	current_timeline[1]=rectangulos;  
} 
  
timestamp_and_duration=null; 
 
 
}





let cleanupClipper = null;

function abrirModalConClipper(videoSrc) {
  timestamp_and_duration="00:00:00,0.2";//poner 00:00:00,0.4
  current_speed = 1;
  current_volume = 100;
  initialtimepoint1 = "00:00:00";
  initialtimepoint2 = "00:00:00.2";//poner 00:00:00.4  
  const html = createVideoClipperMainContainer(videoSrc);
  abrirModalDinamico(html);
  cleanupClipper = initVideoClipper();
}

function closeModalDinamico() {
 
  if (cleanupClipper) {
    cleanupClipper();
    cleanupClipper = null;
    console.log("ERROR timestamp_and_duration: ",timestamp_and_duration);
    if (timestamp_and_duration){ 
    	send_timestamp_video_audio();
    }
  }
  document.getElementById('modal_overlay_dinamico').style.display = 'none'; 
  console.log("GRILLA VIDEO SPEED");
  normalizarAGrillaVideoSpeed(); 
  show_vertical_line();

  deseleccionarRectangulo(); 	 
}


function get_interval_parameters_0(){
if (selected_rect){
    const indice = parseInt(selected_rect.dataset.indice); 
    if (unica_regla.rectangulos[indice]){
    	const interval_parameters = unica_regla.rectangulos[indice].video_audio_value;
    	if (interval_parameters){
 		console.log("ERROR interval_parameters: ",interval_parameters);
		const parameters_list = interval_parameters.split(",");
    		initialtimepoint1 = parameters_list[0]; 
		initialtimepoint2 = parameters_list[parameters_list.length-1];
		//update_time(parameters_list[parameters_list.length-1]);
    	}
    } 	
}
}

function get_interval_parameters(indice){
  
    if (unica_regla.rectangulos[indice]){
    	const interval_parameters = unica_regla.rectangulos[indice].video_audio_value;
    	if (interval_parameters!=""){
 		console.log("ERROR interval_parameters: ",interval_parameters);
		const parameters_list = interval_parameters.split(",");
    		initialtimepoint1 = parameters_list[0]; 
		//initialtimepoint2 = parameters_list[parameters_list.length-1];
		initialtimepoint2 = sumarTiempo(parameters_list[0],parameters_list[1],1);
                console.log("initialtimepoint2 SUMA:",initialtimepoint2);
		//update_time(parameters_list[parameters_list.length-1]);
    	}else{
		initialtimepoint1 = "00:00:00.0";
		initialtimepoint2 = "00:00:00.2";//poner 00:00:00.4 
	}
    } 	
 
}

//unica_regla.rectangulos[0].end="00:00:04.4";
function new_update(){  
 	update_rectangles(); 
        actualizarPosicionesVisuales(); 
	actualizarEstadoGlobal();
}



 
/*
function update_rectangles() {

  const BASE_X = 40;      // x cuando t = 0
  const PX_PER_SEC = 200; // (80 - 40) / 0.2

  function timeToSeconds(t) {
    const [hh, mm, ss] = t.split(":");
    return (
      Number(hh) * 3600 +
      Number(mm) * 60 +
      Number(ss)
    );
  }

  for (let i = 0; i < unica_regla.rectangulos.length; i++) {

    const src = unica_regla.rectangulos[i];

    const tStart = timeToSeconds(src.start);
    const tEnd   = timeToSeconds(src.end);

    const xStart = BASE_X + PX_PER_SEC * tStart;
    const xEnd   = BASE_X + PX_PER_SEC * tEnd;

    // Aseguramos que exista el objeto destino
    if (!rectangulos[i]) rectangulos[i] = {};

    rectangulos[i].posicion = xStart;
    rectangulos[i].ancho    = xEnd - xStart;
    rectangulos[i].elemento.dataset.xReal = rectangulos[i].posicion; 
    rectangulos[i].elemento.dataset.widthReal = rectangulos[i].ancho; 
  }   
}
 





function ajustarRectangulosMove() {

  // Convierte "HH:MM:SS.s" -> segundos (número)
  function parseTime(t) {
    const [h, m, s] = t.split(":");
    return (
      Number(h) * 3600 +
      Number(m) * 60 +
      Number(s)
    );
  }

  // Convierte segundos -> "HH:MM:SS.s"
  function formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = (sec % 60).toFixed(1); // conserva décima

    const pad = n => String(n).padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  const rects = unica_regla?.rectangulos;
  if (!Array.isArray(rects)) return;

  for (let i = 1; i < rects.length; i++) {
    const prev = rects[i - 1];
    const curr = rects[i];

    if (!curr || typeof curr !== "object") continue;

    const key4 = curr["start_value"];
    if (typeof key4 !== "string" || !key4.includes("bounce")) continue;

    const start = parseTime(curr.start);
    const endPrev = parseTime(prev.end);

    // Sólo ajustamos si el start actual es mayor que el end anterior
    if (start > endPrev) {
      const delta = start - endPrev;

      const newStart = start - delta;
      const newEnd = parseTime(curr.end) - delta;

      curr.start = formatTime(newStart);
      curr.end   = formatTime(newEnd);
    }
  }
  new_update();
}
*/




function update_rectangles_0() {

  const BASE_X = 40;
  const PX_PER_SEC = 200;

  function timeToSeconds(t) {
    const [hh, mm, ss] = t.split(":");
    return Number(hh) * 3600 + Number(mm) * 60 + Number(ss);
  }

  for (let g = 0; g < unica_regla.rectangulos.length; g++) {

    const grupoSrc = unica_regla.rectangulos[g];

    // asegurar sublista destino
    if (!rectangulos[g]) rectangulos[g] = [];

    for (let i = 0; i < grupoSrc.length; i++) {

      const src = grupoSrc[i];

      const tStart = timeToSeconds(src.start);
      const tEnd   = timeToSeconds(src.end);

      const xStart = BASE_X + PX_PER_SEC * tStart;
      const xEnd   = BASE_X + PX_PER_SEC * tEnd;

      if (!rectangulos[g][i]) rectangulos[g][i] = {};

      const dst = rectangulos[g][i];

      dst.posicion = xStart;
      dst.ancho    = xEnd - xStart;

      if (dst.elemento) {
        dst.elemento.dataset.xReal     = dst.posicion;
        dst.elemento.dataset.widthReal = dst.ancho;
      }
    }
  }
}


function ajustarRectangulosMove_0() {

  // Convierte "HH:MM:SS.s" -> segundos (número)
  function parseTime(t) {
    const [h, m, s] = t.split(":");
    return (
      Number(h) * 3600 +
      Number(m) * 60 +
      Number(s)
    );
  }

  // Convierte segundos -> "HH:MM:SS.s"
  function formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = (sec % 60).toFixed(1); // conserva décima

    const pad = n => String(n).padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  const grupos = unica_regla?.rectangulos;
  if (!Array.isArray(grupos)) return;

  // Recorre cada sublista
  for (let g = 0; g < grupos.length; g++) {

    const rects = grupos[g];
    if (!Array.isArray(rects)) continue;

    // Recorre elementos del grupo desde el 2º en adelante
    for (let i = 1; i < rects.length; i++) {

      const prev = rects[i - 1];
      const curr = rects[i];

      if (!curr || typeof curr !== "object") continue;

      const key4 = curr["start_value"];
      if (typeof key4 !== "string" || !key4.includes("bounce")) continue;

      const start = parseTime(curr.start);
      const endPrev = parseTime(prev.end);

      // Sólo ajustamos si el start actual es mayor que el end anterior
      if (start > endPrev) {

        const delta = start - endPrev;

        const newStart = start - delta;
        const newEnd = parseTime(curr.end) - delta;

        curr.start = formatTime(newStart);
        curr.end   = formatTime(newEnd);
      }
    }
  }

  new_update();
}







function update_rectangles_00() {

  const BASE_X = 40;      // x cuando t = 0
  const PX_PER_SEC = 200; // (80 - 40) / 0.2

  function timeToSeconds(t) {
    const [hh, mm, ss] = t.split(":");
    return (
      Number(hh) * 3600 +
      Number(mm) * 60 +
      Number(ss)
    );
  }

  const index_row = selected_rect.dataset.index_row; 
  const index_global_row = selected_rect.dataset.index_global_row; 

  for (let i = 0; i < unica_regla.rectangulos[index_global_row].length; i++) {

    const src = unica_regla.rectangulos[index_global_row][i];

    const tStart = timeToSeconds(src.start);
    const tEnd   = timeToSeconds(src.end);

    const xStart = BASE_X + PX_PER_SEC * tStart;
    const xEnd   = BASE_X + PX_PER_SEC * tEnd;

    // Aseguramos que exista el objeto destino
    if (!rectangulos[index_row][i]) rectangulos[index_row][i] = {};

    rectangulos[index_row][i].posicion = xStart;
    rectangulos[index_row][i].ancho    = xEnd - xStart;
    rectangulos[index_row][i].elemento.dataset.xReal = rectangulos[index_row][i].posicion; 
    rectangulos[index_row][i].elemento.dataset.widthReal = rectangulos[index_row][i].ancho; 
  }   
}



function update_rectangles() {

  const index_row = selected_rect.dataset.index_row; 
  const index_global_row = selected_rect.dataset.index_global_row; 
  console.log("MAL update:",index_row,index_global_row);

  const BASE_X = 40;      // x cuando t = 0
  const PX_PER_SEC = 200; // (80 - 40) / 0.2

  function timeToSeconds(t) {
    const [hh, mm, ss] = t.split(":");
    return Number(hh) * 3600 + Number(mm) * 60 + Number(ss);
  }

  // ---- obtenemos el grupo origen ----
  const srcGroup = unica_regla?.rectangulos?.[index_global_row];
  if (!Array.isArray(srcGroup)) return;

  // ---- aseguramos grupo destino ----
  if (!rectangulos[index_row])
    rectangulos[index_row] = [];

  const dstGroup = rectangulos[index_row];

  // ---- recorremos solo esa fila ----
  for (let i = 0; i < srcGroup.length; i++) {

    const src = srcGroup[i];

    const tStart = timeToSeconds(src.start);
    const tEnd   = timeToSeconds(src.end);

    const xStart = BASE_X + PX_PER_SEC * tStart;
    const xEnd   = BASE_X + PX_PER_SEC * tEnd;

    // aseguramos objeto destino
    if (!dstGroup[i]) dstGroup[i] = {};

    const dst = dstGroup[i];

    dst.posicion = xStart;
    dst.ancho    = xEnd - xStart;

    // si el elemento DOM existe, actualizamos dataset
    if (dst.elemento) {
      dst.elemento.dataset.xReal = dst.posicion;
      dst.elemento.dataset.widthReal = dst.ancho;
    }
  }
}



function ajustarRectangulosMove_bien() {

  // Convierte "HH:MM:SS.s" -> segundos (número)
  function parseTime(t) {
    const [h, m, s] = t.split(":");
    return (
      Number(h) * 3600 +
      Number(m) * 60 +
      Number(s)
    );
  }

  // Convierte segundos -> "HH:MM:SS.s"
  function formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = (sec % 60).toFixed(1); // conserva décima

    const pad = n => String(n).padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  const index_global_row = selected_rect.dataset.index_global_row; 

  const rects = unica_regla.rectangulos[index_global_row];
  if (!Array.isArray(rects)) return;

  for (let i = 1; i < rects.length; i++) {
    const prev = rects[i - 1];
    const curr = rects[i];

    if (!curr || typeof curr !== "object") continue;

    const key4 = curr["start_value"];
    if (typeof key4 !== "string" || !key4.includes("bounce")) continue;

    const start = parseTime(curr.start);
    const endPrev = parseTime(prev.end);

    // Sólo ajustamos si el start actual es mayor que el end anterior
    if (start > endPrev) {
      const delta = start - endPrev;

      const newStart = start - delta;
      const newEnd = parseTime(curr.end) - delta;

      curr.start = formatTime(newStart);
      curr.end   = formatTime(newEnd);
    }
  }
  new_update();
}


function ajustarRectangulosMove() {

  const index_row = selected_rect.dataset.index_row; 
  const index_global_row = selected_rect.dataset.index_global_row; 

  // Convierte "HH:MM:SS.s" -> segundos
  function parseTime(t) {
    const [h, m, s] = t.split(":");
    return Number(h) * 3600 + Number(m) * 60 + Number(s);
  }

  // Convierte segundos -> "HH:MM:SS.s"
  function formatTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = (sec % 60).toFixed(1);   // conserva décima
    const pad = n => String(n).padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  // ---- obtenemos solo el grupo origen ----
  const group = unica_regla?.rectangulos?.[index_global_row];
  if (!Array.isArray(group)) return;

  // si el grupo tiene 0 o 1 rectángulo no hay nada que ajustar
  if (group.length < 2) {
    new_update();
    return;
  }

  // ---- recorremos la fila indicada ----
  for (let i = 1; i < group.length; i++) {

    const prev = group[i - 1];
    const curr = group[i];

    if (!curr || typeof curr !== "object") continue;

    const key4 = curr["start_value"];
    if (typeof key4 !== "string" || !key4.includes("bounce")) continue;

    const start   = parseTime(curr.start);
    const endPrev = parseTime(prev.end);

    // Sólo ajustamos si existe hueco entre rectángulos
    if (start > endPrev) {

      const delta = start - endPrev;

      const newStart = start - delta;
      const newEnd   = parseTime(curr.end) - delta;

      curr.start = formatTime(newStart);
      curr.end   = formatTime(newEnd);
    }
  }

  // 🔁 solo repinta la fila afectada
  new_update();
}

