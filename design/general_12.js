 (function() { 
    const userAgent = navigator.userAgent || "";
    if (!userAgent.includes("Googlebot") && !userAgent.includes("Bingbot")) { 
        if (!window.location.search && !window.location.search.includes("t=")) {
            window.location.href = window.location.pathname + "?t=" + new Date().getTime();
        }
    }
})();

let pingInterval;
let missedPings = 0;  
 
function startPing() {
  stopPing();  
  pingInterval = setInterval(() => {
    if (websocketClient.readyState === WebSocket.OPEN) {
      websocketClient.send("ping");
      missedPings++;
 
      if (missedPings > 3 && current_step >= 1) { 
        websocketClient.close();
      }
    }
  }, 10000);
}
 
function stopPing() {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
    missedPings = 0; 
  }
}

let video_file;
 
function createCancelButton() {
  if (document.getElementById("cancel_task")) return;

  const container = document.createElement("div");
  container.id = "cancel_task";

  const button = document.createElement("button");
  button.textContent = "Cancel";
 
  button.addEventListener("click", () => {
    button.textContent = "Canceling...";
    websocketClient.send("cancel_task:"+userId);
    setTimeout(() => { 
        destroyCancelButton();
        waiting_video = 0; 
        frameIndex = 0;  
        globalBuffer = new Uint8Array(0);
        ocultarBarras();
        n_seg = 0;  
        show_step_1_2(captions_video,interval); 
    }, 4000); 
  });

  const paragraph = document.createElement("p");
  paragraph.textContent = "Press Cancel if the task freezes or to edit.";

  container.appendChild(button);
  container.appendChild(paragraph);
 
  const videoPreviewDiv = document.getElementById("video_preview");
  if (videoPreviewDiv) {
    videoPreviewDiv.appendChild(container);
  } 
} 

function destroyCancelButton() {
  const container = document.getElementById("cancel_task");
  if (container) {
    container.remove();
  }
}


let current_video_width = null;
let current_video_height = null;
let type_video = "video/webm";
let video_extension = ".webm";
let videoPreviewBlob = null;

let globalBuffer = new Uint8Array(0);
let suma_final = 0;
let current_fps = 10;
let n_seg = 0;

let startTime = performance.now();
let frameIndex = 0;
let currentTimestamp = 0; 
let video_tag = "mp4";
 

function checkSupport() {
  const video = document.createElement("video");

  const codecsToTest = [
    { type: "video/mp4", codecs: "avc1.42E01E" },
    { type: "video/webm", codecs: "vp8" },
  ];

  const supportedCodecs = [];

  for (const { type, codecs } of codecsToTest) {
    const canPlay = video.canPlayType(`${type}; codecs="${codecs}"`);

    if (canPlay === "probably") {
      supportedCodecs.push(type);
    }
  }

  if (supportedCodecs.includes("video/webm")) {
    VideoDecoder.isConfigSupported({ codec: "vp8" }).then((support) => {
      if (support.supported) {
        video_tag = "webm";
      }
    });
  }
}

 

function generarBarras(datos) {
  const loader = document.getElementById("video_preview");
 
  const existente = document.getElementById("barras");
  if (existente) loader.removeChild(existente);
 
  const contenedor = document.createElement("div");
  contenedor.id = "barras";

  datos.forEach(([valor, total, color]) => {
    const porcentaje = Math.min(100, (valor / total) * 100);

    const barraCont = document.createElement("div");
    barraCont.className = "barra-contenedor";

    const barra = document.createElement("div");
    barra.className = "barra";
    barra.style.width = porcentaje + "%";
    barra.style.backgroundColor = color;  
    barra.textContent = Math.round(porcentaje) + "%";

    barraCont.appendChild(barra);
    contenedor.appendChild(barraCont);
  });

  loader.appendChild(contenedor);
 
  loader.style.display = "block";
}

function ocultarBarras() {
  const loader = document.getElementById("video_preview");
  if (loader){
    const existente = document.getElementById("barras");
    if (existente) {
      loader.removeChild(existente);
    }
  } 
}

function downloadVideo() { 
  if (videoPreviewBlob) {
    const randomdownload = Math.floor(1000 + Math.random() * 9000);
    const randomstring = randomdownload.toString(); 
    const url = URL.createObjectURL(videoPreviewBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "manycaptions" + randomstring + video_extension;
    a.click();
    URL.revokeObjectURL(url);
  }
}

function getChunks(bytes) {
  
  const chunks = [];
  let offset = 0;

  while (offset + 4 <= bytes.length) {
    const size =
      bytes[offset] |
      (bytes[offset + 1] << 8) |
      (bytes[offset + 2] << 16) |
      (bytes[offset + 3] << 24);

    offset += 4;

    if (offset + size > bytes.length) {
      throw new Error("Trozo incompleto al final del buffer");
    }

    const chunk = bytes.slice(offset, offset + size);
    chunks.push(chunk);

    offset += size;
  }

  return chunks;
}

function feedFrames(frames, fps) {
  decoder.reset();
  decoder.configure({ codec: "vp8" });
  const frameDuration = 1e6 / fps;

  for (let i = 0; i < frames.length; i++) {
    const chunk = new EncodedVideoChunk({
      type: i === 0 ? "key" : "delta",
      timestamp: currentTimestamp,
      data: frames[i],
    });

    decoder.decode(chunk);

    currentTimestamp += frameDuration;
    frameIndex++;
  }
}

function watch() {
  current_step = 2; 
  type_download = 1; 
  bad_connection_choose_file = 0; 
  waiting_video = 0;
  const videoElement = document.getElementById("my-video-2"); 
  videoPreviewBlob = new Blob([globalBuffer], { type: type_video }); 
  videoElement.src = URL.createObjectURL(videoPreviewBlob);
  globalBuffer = new Uint8Array(0);
}

function resizeCanvas() {
  
  const dpr = 1;  

  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
 
  canvas.width = width * dpr;
  canvas.height = height * dpr;
 
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

let loadingAnimId = null;
let t = 0;

function drawLoading() {
  if (loadingAnimId==null){
    resizeCanvas(); 
  }
   

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);
 
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
 
  ctx.fillStyle = "#fff";
  ctx.font = Math.floor(h * 0.085) + "px Arial";  
  ctx.textAlign = "center";
  ctx.fillText("Rendering. . .", w / 2, h / 2 - h * 0.1);

   
  const numCircles = 5;
  const baseY = h / 2 + h * 0.05;
  const baseX = w / 2;
  const radius = w * 0.012;  

  for (let i = 0; i < numCircles; i++) {
    const offset = Math.sin(t + i * 0.6) * (w * 0.15);
    const x = baseX + offset;
    const y = baseY;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0f0";
    ctx.fill();
  }

  t += 0.05;
  loadingAnimId = requestAnimationFrame(drawLoading);
}

 
function start_loading() {
  if (!loadingAnimId) {
    drawLoading();
  }
}

 
function close_loading() { 
  if (loadingAnimId) {
    cancelAnimationFrame(loadingAnimId);
    loadingAnimId = null; 
    resizeCanvas();
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
  }
}

const canvas = document.getElementById("liveCanvas");
const ctx = canvas.getContext("2d");   
ctx.imageSmoothingEnabled = true;       
ctx.imageSmoothingQuality = "high";  
if (canvas){
      try {
          canvas.addEventListener("contextmenu", (event) => {
              event.preventDefault();   
          });
      } catch (error) {
          console.log("error:", error);
      }
    } 
 
  
window.addEventListener("resize", resizeCanvas);

 
 function adapt_frame_to_canvas(frame, canvasWidth, canvasHeight, frameWidth, frameHeight) { 
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const ctx = tempCanvas.getContext("2d");
 
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
 
    const canvasAspect = canvasWidth / canvasHeight;
    const frameAspect = frameWidth / frameHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (frameAspect > canvasAspect) { 
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / frameAspect;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
    } else { 
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * frameAspect;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
    }
 
    ctx.drawImage(frame, offsetX, offsetY, drawWidth, drawHeight);

    return tempCanvas;
}
 

const decoder = new VideoDecoder({
  output: (frame) => {
    try {
      if (frameIndex==0){
        resizeCanvas();
      }
      const processed_frame = adapt_frame_to_canvas(frame, canvas.width, canvas.height, current_video_width, current_video_height);
      ctx.drawImage(processed_frame, 0, 0, canvas.width, canvas.height);
    } catch (err) {
      console.error("Render error:", err);
    } finally {
      frame.close(); 
    }
  },
  error: (e) => {
    console.error("Decoder error:", e); 
    try {
      decoder.reset();  
      decoder.configure({ codec: "vp8" });  
      resizeCanvas();
    } catch (err) {
      console.error("Failed to reset decoder:", err);
    }
  }
});


decoder.configure({ codec: "vp8" });












 
 
let lastPressedButton = 0;
let caption_length = 0.5;
let interval;
let interval_2;
let captions_video = "";
let new_captions_video = "";
let websocketClient;
let send_new_captions = 0;

let custom_timestamp = 0;
let received_durations = -1;
let irregular_timestamp = [];

let blob;
let videoURL;
let first_url = "";

let final_lang = "";
let language_video = "";

let bad_connection_choose_file = 1; 
let waiting_video = 0;
let waiting_caption = 0;
let current_output_language = "Translate";

let type_download = 0;
let isLoading_mp4 = false;
let current_duration = 1;
let current_step = 0;

let selectedPositionSub = 1;
let selectedTextGlowSub = 1;
let selectedAudioSub = 1;
let extra_seconds = 0;
let selectedLanguageIndex = null;
let currentFile = null;

localStorage.setItem("selected-font", "9");
localStorage.setItem("selected-color", "FFFFFF");
localStorage.setItem("caption_length", 0.5);

const currentPath = window.location.pathname;

const settingsList = document.getElementById("settingsList");

if (settingsList) {
  const nuevoItem = `
        <li>
            <div id="settings-position-sub" class="settings-font-block"></div>
        </li>
    `;
  settingsList.insertAdjacentHTML("beforeend", nuevoItem);
}

const div_text = `<div id="positionModalSub" class="positionModalSub">
        <div class="position-modal-content-sub">
            <span class="position-close-btn-sub">&times;</span>

            <div id="position-sub-title" class="option-sub-title"></div>
            <div id="bar-position-container" class="bar-option-container">  
                 <div class="labels">
                    <div id="position-down" class="label"></div>
                    <div id="position-center" class="label"></div>
                    <div id="position-up" class="label"></div>
                </div>
                <div class="bar"></div>
                <div class="circle" id="position-circle"></div>    
            </div>


            <div id="textglow-sub-title" class="option-sub-title"></div>
            <div id="bar-textglow-container" class="bar-option-container">  
                 <div class="labels">
                    <div id="textglow-down" class="label"></div>
                    <div id="textglow-center" class="label"></div>
                    <div id="textglow-up" class="label"></div>
                </div>
                <div class="bar"></div>
                <div class="circle" id="textglow-circle"></div> 
            </div>
            

            <div id="audio-sub-title" class="option-sub-title"></div>
            <div id="bar-audio-container" class="bar-option-container">  
                 <div class="labels">
                    <div id="audio-down" class="label"></div>
                    <div id="audio-center" class="label"></div>
                    <div id="audio-up" class="label"></div>
                </div>
                <div class="bar"></div>
                <div class="circle" id="audio-circle"></div> 
            </div>

            


        </div>
    </div>`;
const principalContainer = document.querySelector(".card-container");
if (principalContainer) {
  principalContainer.insertAdjacentHTML("beforeend", div_text);
}

function generateRandomUserId() {
  const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
  let userId = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    userId += digits[randomIndex];
  }
  return userId;
}

let userId = localStorage.getItem("userid");

if (!userId) {
  userId = generateRandomUserId();
  localStorage.setItem("userid", userId);
}
localStorage.setItem("userid", "admin12345");

function getTextareaValue() {
  let new_captions = "";
  let index_captions = 0;
  const textareas = document.querySelectorAll(".flexible-captions");
  textareas.forEach((textarea) => {
    let new_line = textarea.value;
    new_captions = new_captions + new_line;

    if (index_captions < textareas.length - 1) {
      new_captions = new_captions + "-o-";
    }
    index_captions = index_captions + 1;
  });

  return new_captions;
}
 

function hide_step0() { 
  var step0 = document.getElementById("step0");
  if (step0) {
    step0.style.display = "none";
  }
}
function hide_stepLoading() {
  var stepLoading = document.getElementById("stepLoading");
  if (stepLoading) {
    stepLoading.style.display = "none";
  }
}
function hide_stepPreview() {
  var stepPreview = document.getElementById("stepPreview");
  if (stepPreview) {
    stepPreview.style.display = "none";
  }
}
function hide_step_1_2() {
  var step_1_2 = document.getElementById("step_1_2");
  if (step_1_2) {
    step_1_2.style.display = "none";
  }
}

 
 

const start_elements = [
  { id: "login-btn", content: "Get started" },
  { id: "li-home", content: "Home" },
  { id: "li-affiliates", content: "Deals" },
  { id: "li-features", content: "Features" },
  { id: "li-tutorial", content: "How to use" },
  { id: "li-questions", content: "FAQ" },
  { id: "dropdown-btn", content: "Translate  &#x025BE;" },
  { id: "reset-dropdown", content: "Reset" },
  { id: "english-dropdown", content: "English" },
  { id: "spanish-dropdown", content: "Spanish" },
  { id: "portuguese-dropdown", content: "Portuguese" },
  { id: "french-dropdown", content: "French" },
  { id: "german-dropdown", content: "German" },
  { id: "italian-dropdown", content: "Italian" },
  { id: "exportDropdown-mp4", content: "Video" },
  { id: "exportDropdown-srt", content: "SRT File" },
  { id: "exportDropdown-txt", content: "Transcription" },
  { id: "choose_video_p", content: "Choose video" },
  { id: "selected-language", content: "Language" },
  { id: "change-language-a", content: "change" },
  { id: "preview_description", content: "Audio available when render finish" },
   

  {
    selector: ".error-dimension",
    content: "Something went wrong. Try it again",
  },
  { selector: ".percentage", content: "0%" },
  { selector: ".loader-description", content: "Loading . . ." },

  {
    id: "settings-openModalBtn",
    content: `<i class="fas fa-cog"></i> Customize`,
  },
  { id: "createVideo", content: `<i class="fas fa-film"></i> Render video` },

  { selector: ".error-creation", content: "Connection lost. Try again" },
  { selector: ".error-creation-2", content: "Connection restored" },

  { id: "editButton", content: `<i class="fas fa-pencil-alt"></i> Edit` },
  { id: "saveButton", content: `<i class="fas fa-check"></i> Save` },
  {
    id: "exportDropdown-button",
    content: `<i class="fas fa-download"></i> Export`,
  },

  { selector: ".close-yes", content: "Yes" },
  { selector: ".close-no", content: "No" },

  { id: "pages", content: "Pages" },
  { id: "videogenerator", content: "Video translator" },
  { id: "privacy_policy", content: "Privacy Policy" },
  { id: "company", content: "Company" },
  { id: "terms_conditions", content: "Terms & Conditions" },

  {
    selector: ".copyright",
    content: "© 2024 manycaptions.com. All rights reserved",
  },
  { selector: ".settings-title", content: "Settings" },

  { id: "settings-font", content: "Text font" },
  { id: "settings-color", content: "Text color" },

  { id: "position-down", content: "Down" },
  { id: "position-center", content: "Center" },
  { id: "position-up", content: "Up" },

  { id: "textglow-down", content: "Off" },
  { id: "textglow-center", content: "Thin" },
  { id: "textglow-up", content: "Thick" },

  { id: "audio-down", content: "Off" },
  { id: "audio-center", content: "Low" },
  { id: "audio-up", content: "High" },

  { id: "position-sub-title", content: "Position of subtitles" },
  { id: "textglow-sub-title", content: "Text Glow" },
  { id: "audio-sub-title", content: "Noise reduction" },

  { id: "settings-position-sub", content: "Text design" },
  { id: "monoColor", content: "Monocolor" },
  { id: "multiColor", content: "Multicolor" },
  { id: "saveColor", content: "Save" },
  { id: "save-lang", content: "Save" },
  { selector: ".ask-lang", content: "Select video language" },
  {
    id: "limit_size_message",
    content:
      "This video exceeds 150MB of free plan. Use an online video compressor",
  },
];

start_elements.forEach((item) => {
  const el = item.id
    ? document.getElementById(item.id)
    : document.querySelector(item.selector);

  if (el) {
    el.innerHTML = item.content;
  }
});

let url_websocket = "rndomg84pbrg.onrender.com";
 

function show_step0() {
  hide_stepLoading();
  hide_step_1_2();
  hide_stepPreview();
  var step0 = document.getElementById("step0");
  if (step0) {
    step0.style.display = "block";
  }
}
function show_stepLoading() {
   hide_step0();
   hide_step_1_2();
   hide_stepPreview();
  var stepLoading = document.getElementById("stepLoading");
  if (stepLoading) {
    stepLoading.style.display = "block";
  }
}
function show_stepPreview() {
   hide_step0();
   hide_step_1_2();
   hide_stepLoading();
  var stepPreview = document.getElementById("stepPreview");
  if (stepPreview) {
    stepPreview.style.display = "block";
  } 
}
function show_step_1_2(captions_video,interval) {  
  hide_step0();
  hide_stepLoading();
  hide_stepPreview();
  var step_1_2 = document.getElementById("step_1_2");
  if (step_1_2) {
    step_1_2.style.display = "flex";
    clearInterval(interval);
    reset_percentage(); 
    generarInputs_captions(captions_video);
  }
  var circular_animation = document.querySelector('.circular');
  if (circular_animation){
    circular_animation.style.animation = 'none';
  }  
  toggleEditability(1);
}

 

function show_export_mp4() {
  var button_export_mp4 = document.getElementById("exportDropdown-mp4");
  if (button_export_mp4) {
    button_export_mp4.style.display = "flex";
  }
}




function hasValueNotEqualToOne(list) {
  return list.some((element) => element !== 1);
}

function indiceAcumuladoHasta(entero, lista) {
  let acumulado = 0;
  for (let i = 0; i < lista.length; i++) {
    acumulado += lista[i];
    if (acumulado >= entero) {
      return i;
    }
  }
  return -1;
}

function scrollToElement(element) {
  var container = document.querySelector(".form-container");
  if (container) {
    container.scrollTop =
      element.offsetTop -
      container.offsetTop -
      container.offsetHeight / 2 +
      element.offsetHeight / 2;
  }
}

var videoElement = document.getElementById("my-video-2");
if (videoElement) {
  videoElement.setAttribute("controlsList", "nodownload");

  videoElement.addEventListener("timeupdate", function () {
    var currentTime = videoElement.currentTime;

    var hours = Math.floor(currentTime / 3600);
    var minutes = Math.floor((currentTime - hours * 3600) / 60);
    var seconds = Math.floor(currentTime - hours * 3600 - minutes * 60);
    var totalSeconds = Math.floor(currentTime);

    var index_irregular_timestamps = indiceAcumuladoHasta(
      totalSeconds + 1,
      irregular_timestamp
    );

    if (totalSeconds % 1 == 0) {
      if (true) {
        write_captions(index_irregular_timestamps);
      }
    }
  });
}

function write_captions(indice) {
  const textareas = document.querySelectorAll(".flexible-captions");
  if (textareas && textareas[indice]) {
    if (caption_length == 1) {
      if (indice < textareas.length) {
        scrollToElement(textareas[indice]);
        textareas[indice].style.border = "2px solid rgb(119, 0, 255)";
        let suma = 0;
        textareas.forEach((textarea) => {
          if (suma != indice) {
            textarea.style.border = "1px solid rgb(177, 177, 177,0.5)";
          }
          suma = suma + 1;
        });
      }
    }
  }
  if (textareas && textareas[2 * indice]) {
    if (caption_length < 0.9) {
      if (indice < textareas.length) {
        if (true) {
          scrollToElement(textareas[2 * indice]);

          textareas.forEach((textarea, i) => {
            if (i < textareas.length - 1) {
              if (i % 2 == 0) {
                if (i === 2 * indice) {
                  textareas[i].style.border = "2px solid rgb(119, 0, 255)";
                  textareas[i + 1].style.border = "2px solid rgb(119, 0, 255)";
                } else {
                  textareas[i].style.border =
                    "1px solid rgba(177, 177, 177, 0.5)";
                  textareas[i + 1].style.border =
                    "1px solid rgba(177, 177, 177, 0.5)";
                }
              }
            }
          });
        }
      }
    }

    if (indice == textareas.length - 1) {
      textareas[indice].style.border = "1px solid rgb(177, 177, 177,0.5)";
    }
  }
}

function start_percentage(type_loading) {
  var delta_seconds = 1200;
  var time_increment = 1;
  if (type_loading == 1) {
    delta_seconds = 1000;
    if (current_duration < 62) {
      delta_seconds = 2000;
    }

    if (current_duration >= 62) {
      delta_seconds = 1000;
    }
    if (current_duration > 180) {
      delta_seconds = 900;
      time_increment = 2;
    }
    if (current_duration > 300) {
      delta_seconds = 500;
      time_increment = 4;
    }
  } else {
    delta_seconds = 1200 + extra_seconds;
    if (current_duration > 150) {
      delta_seconds = 1000;
    }
    if (current_duration > 240) {
      delta_seconds = 700;
    }
  }
  let percentage = 0;
  let percentage_visible = 0;
  interval = setInterval(() => {
    percentage += time_increment;

    percentage_visible = 100 * (percentage / current_duration);
    const timeRemaining = Math.max(
      0,
      Math.floor(1 + current_duration - percentage)
    );

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    document.querySelector(".percentage").textContent = `${formattedTime}`;
    const circle = document.querySelector(".path");
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage_visible / 100) * circumference;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;

    if (percentage_visible >= 99) {
      clearInterval(interval);
    }
  }, delta_seconds);
}

function reset_percentage() {
  let percentage = 0;
  document.querySelector(".percentage").textContent = `${percentage}%`;
  const circle = document.querySelector(".path");
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = offset;
}

function clearCircle() {
  const percentage = 0;
  const percentageEl = document.querySelector(".percentage");  
  const circle = document.querySelector(".path");
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  if (percentageEl && circle && radius && circumference){
    percentageEl.textContent = `${percentage}%`;
    const offset = circumference - (percentage / 100) * circumference;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
  } 
}



function draw_percentage(data) {  

  if (!data || data.length === 0) return;
 
  const [valor, total, typeValue, color, textDescription] = data[0];
  
  const percentage_visible = (valor / total) * 100;
  const round_percentage = percentage_visible.toFixed(1)+"%";

  const timeRemaining = Math.max(0, Math.floor(1 + total - valor));

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
 
  const percentageEl = document.querySelector(".percentage");
  if (percentageEl) {
    if (typeValue=="time"){
      percentageEl.textContent = formattedTime;
    }else{
      percentageEl.textContent = round_percentage; 
    } 
  }
 
  const loader_description = document.querySelector(".loader-description");
  const circle = document.querySelector(".path");
  if (circle) { 
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage_visible / 100) * circumference;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
    circle.style.stroke = color;
    loader_description.innerText = textDescription;
  }
 
}

 



function generarBarras(datos) {
  const loader = document.getElementById("video_preview");
 
  const existente = document.getElementById("barras");
  if (existente) loader.removeChild(existente);
 
  const contenedor = document.createElement("div");
  contenedor.id = "barras";

  datos.forEach(([valor, total, color]) => {
    const porcentaje = Math.min(100, (valor / total) * 100);

    const barraCont = document.createElement("div");
    barraCont.className = "barra-contenedor";

    const barra = document.createElement("div");
    barra.className = "barra";
    barra.style.width = porcentaje + "%";
    barra.style.backgroundColor = color; 
    barra.textContent = Math.round(porcentaje) + "%";

    barra.style.paddingTop = "5px";
    barra.style.paddingBottom = "5px";
 
    barra.style.marginTop = "5px";
    barra.style.marginBottom = "5px";

    barraCont.appendChild(barra);
    contenedor.appendChild(barraCont);
  });

  loader.appendChild(contenedor);
 
  loader.style.display = "block";
}



const selectImage = document.querySelector(".btn-upload");
const inputFile = document.querySelector("#file");

if (selectImage && inputFile) {
  selectImage.addEventListener("click", function () {
    if (final_lang != "") {
      inputFile.click();
    } else {
      populateLanguageList();
      const languageModal = document.getElementById("languageModal");
      languageModal.style.display = "block";
    }
  });
}

function enviarMensaje_0(websocket, mensaje) {
  return new Promise((resolve, reject) => {
    const listener = (event) => {
      resolve(event.data);
      websocket.removeEventListener("message", listener);
    };
    websocket.addEventListener("message", listener);

    websocket.send(mensaje);
  });
}

async function sendTotalSize(selectedFile) {
  document.querySelector(".percentage").textContent = "0%";
  document.querySelector(".loader-description").innerHTML =
    "Uploading video . . . ";
  writeLanguageInLoadingCircle(languages[selectedLanguageIndex]);

  const totalSize = selectedFile.size;
  websocketClient.send("video_size:" + totalSize.toString());
}

async function sendVideo_0(selectedFile) {
  const chunkSize = 200 * 1000;
  const totalSize = selectedFile.size;

  const delta_float_percent = (100 * chunkSize) / totalSize;

  var offset = 0;
  var n = 0;
  var float_percentage = 0;
  while (offset < totalSize) {
    const end = offset + chunkSize;
    const chunk =
      end < totalSize
        ? selectedFile.slice(offset, end)
        : selectedFile.slice(offset);
    offset = end;

    await enviarMensaje(websocketClient, chunk);

    if (float_percentage <= 100) {
      var round_percentage = float_percentage.toFixed(1);
      document.querySelector(
        ".percentage"
      ).textContent = `${round_percentage}%`;
      float_percentage = float_percentage + delta_float_percent;
    }

    console.log(n);

    n = n + 1;
  }
}

function enviarMensaje(websocket, mensaje) {
  return new Promise((resolve, reject) => {
    const listener = (event) => {
      websocket.removeEventListener("message", listener);
      resolve(event.data);
    };

    const errorListener = (err) => {
      websocket.removeEventListener("message", listener);
      reject(err);
    };

    websocket.addEventListener("message", listener, { once: true });
    websocket.addEventListener("error", errorListener, { once: true });
    websocket.addEventListener("close", errorListener, { once: true });

    try {
      websocket.send(mensaje);
    } catch (err) {
      websocket.removeEventListener("message", listener);
      reject(err);
    }
  });
}

async function sendVideo(selectedFile) {
  const totalSize = selectedFile.size;

  let chunkKB = 125;
  const maxKB = 2000;
  const stepKB = 10;

  let offset = 0;
  let n = 0;

  while (offset < totalSize) {
    let chunkSize = chunkKB * 1024;
    if (chunkSize > maxKB * 1024) {
      chunkSize = maxKB * 1024;
    }

    const end = Math.min(offset + chunkSize, totalSize);
    const chunk = selectedFile.slice(offset, end);
    offset = end;

    await enviarMensaje(websocketClient, chunk);

    const percent = ((offset / totalSize) * 100).toFixed(1);
    document.querySelector(".percentage").textContent = `${percent}%`;

    n++;

    if (chunkKB < maxKB) {
      chunkKB += stepKB;
      if (chunkKB > maxKB) chunkKB = maxKB;
    }
  }
}

if (inputFile) {
  inputFile.addEventListener("change", (event) => {
    const fileInputElement = document.getElementById("file");
    const selectedFile = fileInputElement.files[0];
    currentFile = selectedFile;

     
    video_file = event.target.files[0];

    const filePath = URL.createObjectURL(video_file);

    var normal_size = 150000000;

    if (video_file.size < normal_size) {
      if (!selectedFile.name.toLowerCase().endsWith(".mp4")) {
        const modal_limit_size = document.getElementById("myModal_limit_size");
        const limitMessage = document.getElementById("limit_size_message");

        limitMessage.innerText =
          "Only MP4 videos can be uploaded. Use an online converter.";
        modal_limit_size.style.display = "block";
        inputFile.value = "";
      } else {
        show_stepLoading();
        changeVideoSource(filePath);

        const formData = new FormData();
        formData.append("file", selectedFile);

        sendTotalSize(selectedFile);
      }
    } else {
      const modal_limit_size = document.getElementById("myModal_limit_size");
      const limitMessage = document.getElementById("limit_size_message");
      limitMessage.innerText =
        "This video exceeds 150MB of free plan. Use an online video compressor";
      modal_limit_size.style.display = "block";
      inputFile.value = "";
    }
  });
}

function generarInputs_captions(frases) {
  if (caption_length == 1) {
    return generarInputs_captions_1seg(frases);
  }
  if (caption_length < 0.9) {
    return generarInputs_captions_05seg(frases);
  }
}

function generarInputs_captions_05seg(frases) {
  var form = document.getElementById("form-container");
  form.innerHTML = "";

  var arrayFrases = frases.split("-o-");
  while (arrayFrases.length > 0 && arrayFrases[arrayFrases.length - 1] === "") {
    arrayFrases.pop();
  }

  const N_frases = arrayFrases.length;
  irregular_timestamp = [];

  if (received_durations == -1) {
    for (let i = 0; i < N_frases; i++) {
      irregular_timestamp.push(1);
    }
  } else {
    irregular_timestamp = received_durations;
  }

  for (let i = 0; i < arrayFrases.length; i += 2) {
    var rowDiv = document.createElement("div");
    rowDiv.style.display = "flex";
    rowDiv.style.marginBottom = "4px";
    rowDiv.style.marginRight = "4px";
    rowDiv.style.marginLeft = "4px";
    rowDiv.style.gap = "4px";

    var textarea1 = document.createElement("textarea");
    textarea1.classList.add("flexible-captions");
    textarea1.setAttribute("rows", "1");
    textarea1.setAttribute("cols", "50");
    textarea1.setAttribute("oninput", "autoResize(this)");
    textarea1.textContent = arrayFrases[i];
    textarea1.id = "text_" + i;
    textarea1.style.flex = "1";

    rowDiv.appendChild(textarea1);

    let textarea2 = null;

    if (i + 1 < arrayFrases.length) {
      textarea2 = document.createElement("textarea");
      textarea2.classList.add("flexible-captions");
      textarea2.setAttribute("rows", "1");
      textarea2.setAttribute("cols", "50");
      textarea2.setAttribute("oninput", "autoResize(this)");
      textarea2.textContent = arrayFrases[i + 1];
      textarea2.id = "text_" + (i + 1);
      textarea2.style.flex = "1";

      rowDiv.appendChild(textarea2);
    } else {
      textarea1.style.flex = "1 1 100%";
    }

    form.appendChild(rowDiv);

    autoResize(textarea1);
    if (textarea2) {
      autoResize(textarea2);
    }
  }
}

function generarInputs_captions_1seg(frases) {
  var form = document.getElementById("form-container");

  form.innerHTML = "";

  var arrayFrases = frases.split("-o-");
  while (arrayFrases.length > 0 && arrayFrases[arrayFrases.length - 1] === "") {
    arrayFrases.pop();
  }

  const N_frases = arrayFrases.length;
  irregular_timestamp = [];

  if (received_durations == -1) {
    for (let i = 0; i < N_frases; i++) {
      irregular_timestamp.push(1);
    }
  } else {
    irregular_timestamp = received_durations;
  }

  arrayFrases.forEach(function (frase, index) {
    var textarea = document.createElement("textarea");
    textarea.classList.add("flexible-captions");
    textarea.setAttribute("rows", "1");
    textarea.setAttribute("cols", "50");
    textarea.setAttribute("oninput", "autoResize(this)");

    textarea.textContent = frase;
    textarea.id = "text_" + index;
    form.appendChild(textarea);

    autoResize(textarea);
  });
}

function autoResize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
}

toggleEditability(1);

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}



function downloadVideo_0() {
  const timestamp_download = Date.now();

  if (type_download == 0) {
    console.log("download type 0");
    const downloadLink = document.createElement("a");

    downloadLink.href = `https://rndomg84pbrg.onrender.com/download/${userId}/export?ts=${timestamp_download}`;
    var randomdownload = Math.floor(1000 + Math.random() * 9000);
    var randomstring = randomdownload.toString();
    downloadLink.download = "clip_manycaptions" + randomstring + ".mp4";
    downloadLink.click();
    document.body.removeChild(downloadLink);
    console.log("exported");
  } else {
    console.log("download type 1");
    if (videoURL && isValidURL(videoURL)) {
      const a_static_download = document.createElement("a");
      a_static_download.style.display = "none";
      a_static_download.href = videoURL;
      var randomdownload = Math.floor(1000 + Math.random() * 9000);
      var randomstring = randomdownload.toString();
      a_static_download.download = "manycaptions" + randomstring + ".mp4";
      document.body.appendChild(a_static_download);
      a_static_download.click();
      document.body.removeChild(a_static_download);
    } else {
      console.log("videoURL is not valid");
    }
  }
}
 
function generateSRT(phrases) {
  var srt = "";
  var startTime = 0;
  var step = 0.5;
  var step0 = parseFloat(localStorage.getItem("caption_length"));
  if (step) {
    step = step0;
  } else {
    step = 1;
  } 

  phrases.forEach((phrase, index) => {
    var endTime = startTime + step;

    srt += `${index + 1}\n`;
    srt += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`;
    srt += `${phrase}\n\n`;

    startTime = endTime;
  });

  return srt;
}

function formatTime(seconds) {
  let totalMilliseconds = Math.floor(seconds * 1000);
  let hours = Math.floor(totalMilliseconds / 3600000);
  let minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
  let secs = Math.floor((totalMilliseconds % 60000) / 1000);
  let millis = totalMilliseconds % 1000;

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${padMillis(millis)}`;
}

function pad(num) {
  return String(num).padStart(2, "0");
}

function padMillis(num) {
  return String(num).padStart(3, "0");
}


function downloadTXT() {
  var current_captions_str = getTextareaValue();
  var phrases_list_str = current_captions_str.split("-o-");
  var randomdownload = Math.floor(1000 + Math.random() * 9000);
  var randomstring = randomdownload.toString();
  var filename_srt = "manycaptions" + randomstring + ".txt";
  var content_srt = generateSRT(phrases_list_str);

  const blob_str = new Blob([content_srt], {
    type: "text/plain;charset=iso-8859-1",
  });
  const url_str = URL.createObjectURL(blob_str);

  const a_str = document.createElement("a");
  a_str.href = url_str;
  a_str.download = filename_srt;
  document.body.appendChild(a_str);
  a_str.click();
  document.body.removeChild(a_str);
  URL.revokeObjectURL(url_str);
}
function downloadSRT(extension) {
  var current_captions_str = getTextareaValue();
  var phrases_list_str = current_captions_str.split("-o-");
  var randomdownload = Math.floor(1000 + Math.random() * 9000);
  var randomstring = randomdownload.toString();
  var filename_srt = "manycaptions" + randomstring + extension;
  var content_srt = phrases_list_str.join(" ");
  if (extension==".srt"){ 
    content_srt = generateSRT(phrases_list_str);
  }

  const blob_str = new Blob(["\uFEFF" + content_srt], {
    type: "application/octet-stream",
  });
  const url_str = URL.createObjectURL(blob_str);

  const a_str = document.createElement("a");
  a_str.href = url_str;
  a_str.download = filename_srt;
  document.body.appendChild(a_str);
  a_str.click();
  document.body.removeChild(a_str);
  URL.revokeObjectURL(url_str);
}
 

function toggleEditability(option) {
  const textareas = document.querySelectorAll(".flexible-captions");

  if (option == 0) {
    textareas.forEach((textarea) => {
      textarea.readOnly = true;
      textarea.style.border = "1px solid rgba(177, 177, 177,0.2)";
      textarea.style.color = "rgba(50, 50, 50,1)";
    });
  } else {
    textareas.forEach((textarea) => {
      textarea.readOnly = false;
      textarea.style.border = "1px solid #7c55e6";
      textarea.style.color = "rgba(0, 0, 0,1)";
    });
  }

  const saveButton = document.getElementById("saveButton");
  const editButton = document.getElementById("editButton");

  if (saveButton && editButton) {
    if (option === 0) {
      saveButton.style.color = "white";
      editButton.style.color = "black";
      lastPressedButton = 0;
      saveButton.classList.remove("red-button");
      saveButton.classList.add("lila-button");
      editButton.classList.remove("lila-button");
      editButton.classList.add("red-button");
    } else if (option === 1) {
      saveButton.style.color = "black";
      editButton.style.color = "white";
      lastPressedButton = 1;
      editButton.classList.remove("red-button");
      editButton.classList.add("lila-button");
      saveButton.classList.remove("lila-button");
      saveButton.classList.add("red-button");
    }
  }
}
 
let connectionTimeout;
function check_edited_captions() {
      const btn = document.getElementById("createVideo");
      if (btn){
        btn.disabled = true; 
      } 

      const mensaje = "request";
      websocketClient.send(mensaje);
 
      connectionTimeout = setTimeout(() => {
        console.log("exceeded time");
        btn.disabled = false;  
        const error_connection = document.querySelector(".error-creation"); 
        if (error_connection){
          error_connection.style.display = "block";
        } 
        const error_connection_2 = document.querySelector(".error-creation-2"); 
          if (error_connection_2){
            error_connection_2.style.display = "none"; 
          } 
      }, 5000);
    }

function handleServerResponse(data) {
  if (data === "1") {
    clearTimeout(connectionTimeout); 
    console.log("connection true");
    const btn = document.getElementById("createVideo");
    if (btn){
      btn.disabled = false;  
    } 
    check_edited_captions_next();
  }
}

function check_edited_captions_next() {
   
  new_captions_video = getTextareaValue();

  var modalContent = document.querySelector(".modal-content p");
  if (new_captions_video == captions_video && send_new_captions == 0) {
    modalContent.textContent =
      "The subtitles have not been edited. Do you want to continue?";
    modal.style.display = "block"; 
  } else {
    console.log("new_captions_video: ",new_captions_video);
    console.log("captions_video: ",captions_video);
    if (lastPressedButton == 1) {
      modalContent.textContent =
        "The changes have not been saved. Do you want to save them?";
      modal.style.display = "block"; 
    } else {
      request_create_video();
    }
  }
}

function request_create_video(){

  const user_id = localStorage.getItem("userid");

      const error_connection = document.querySelector(".error-creation");
      const error_connection_2 = document.querySelector(".error-creation-2");
      if (error_connection && error_connection_2){
        error_connection.style.display = "none";
        error_connection_2.style.display = "none";
      } 

        var sendFont = localStorage.getItem("selected-font");
        var sendColor = localStorage.getItem("selected-color");
        var sendPositionSub = selectedPositionSub;
        var sendTextGlowSub = selectedTextGlowSub;
        var sendAudioSub = selectedAudioSub;

        captions_video = new_captions_video;

        var send_settings =
          "tocreate_client_" +
          user_id +
          "_client_" +
          new_captions_video +
          "_client_" +
          first_url +
          "_client_" +
          sendFont +
          "_client_" +
          sendColor +
          "_client_" +
          sendPositionSub +
          "_client_" +
          sendTextGlowSub +
          "_client_" +
          sendAudioSub+
          "_client_" +
          video_tag;

        if (received_durations != -1) {
          var durations_string = received_durations.join("_");
          send_settings = send_settings + "_client_" + durations_string;
        }

        websocketClient.send(send_settings);

        video_received = 0;

        show_export_mp4();
        if (video_tag=="webm"){
          show_stepPreview();
          start_loading(); 
          destroyCancelButton();
        }else{
          const loader_description = document.querySelector(".loader-description");
          loader_description.innerText = "Rendering video . . .";
          show_stepLoading();
        }
        
        frameIndex = 0; 
        waiting_video = 1;

        const video_not_supported = document.getElementById("video_not_supported");
        if (video_not_supported) {
          video_not_supported.innerText = "";
          video_not_supported.style.display = "none"; 
        }
        const video = document.getElementById("my-video-2");
        if (video){
          video.pause();
        }
         
}

 

const videoPlayer = document.getElementById("videoPlayer");

function changeVideoSource(newSource) {
  const videoElement = document.getElementById("my-video-2");
  const sourceElement = videoElement.querySelector("source");
 

  if (sourceElement) {
    sourceElement.src = newSource;
    videoElement.load();
    videoElement.onloadedmetadata = function () {
      current_duration = Math.round(videoElement.duration);
    };

    videoElement.addEventListener("error", () => {
      const video_not_supported = document.getElementById("video_not_supported");
        if (video_not_supported) {
          video_not_supported.style.display = "block";
          video_not_supported.innerText = "Unplayable video. Press RENDER to repair it."
        }
        console.log("Unplayable video. Press RENDER to repair it.");
    });
 
    videoElement.addEventListener("loadedmetadata", () => { 
      console.log("Width:", videoElement.videoWidth);
      console.log("Height:", videoElement.videoHeight); 
      current_video_width = videoElement.videoWidth;
      current_video_height = videoElement.videoHeight;

      if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) { 
        const video_not_supported = document.getElementById("video_not_supported");
        if (video_not_supported) {
          video_not_supported.style.display = "block";
          video_not_supported.innerText = "Unplayable video. Press RENDER to repair it."
        } 
      }
    });
  } else {
    console.error("No se encontró el elemento source.");
  }
}

let current_chunk_size = 0;
let videoChunks = [];

function connect(type_connection) {
  const user_id = localStorage.getItem("userid");

  websocketClient = new WebSocket("wss://" + url_websocket + "/" + user_id);
  websocketClient.binaryType = "arraybuffer";

  console.log("connecting...");

  websocketClient.addEventListener("open", () => {  

    console.log("Client connected");
    const send_type_connection =
      "type_connection==" +
      type_connection +
      "==" +
      currentPath +
      "==" +
      user_id;
    websocketClient.send(send_type_connection);

    if (waiting_caption == 1) {
      websocketClient.send("check_captions");
    }
 

     

    if (bad_connection_choose_file == 1) {
      show_step0();
    }

    let referralCode = localStorage.getItem("referralCode");
    if (referralCode !== null && referralCode !== "") {
      websocketClient.send("code:" + referralCode);
    }

    startPing();
  });

  websocketClient.addEventListener("message", (event) => {
    handleServerResponse(event.data);

    var message_result = event.data;

    if (event.data.toString().trim() === "ping_received") {
      missedPings = 0; 
    }
 
    if (typeof message_result === "string") {
      if (message_result.includes("affiliate_message:")) {
        if (message_result.includes("20% discount applied")) {
          const aff_message = message_result.split(":")[1];
          const aff_code = message_result.split(":")[2];
          document.getElementById("discountMessage").innerHTML = aff_message;
          document.getElementById("discountMessage").style.display = "flex";
          localStorage.setItem("referralCode", aff_code);
        }
        if (message_result.includes("This discount code does not exist")) {
          document.getElementById("discountMessage").style.display = "none";
          localStorage.setItem("referralCode", "");
        }
      }

      if (message_result.split("_client_")[0] == "translated") {
        var translated_captions = message_result.split("_client_")[1];
        new_captions_video = translated_captions;

        generarInputs_captions(translated_captions);
        toggleEditability(0);

        var dropdownBtn = document.getElementById("dropdown-btn");
        dropdownBtn.innerHTML = current_output_language + " &#x025BE;";
        dropdownBtn.disabled = false;
      }

      if (message_result.split("_client_")[0] == "enviar") {
        const message_result_split = message_result.split("_client_");
        current_step = 1; 

        waiting_caption = 0;
        bad_connection_choose_file = 0;
        captions_video = message_result_split[2];
        first_url = "none";
        caption_length = message_result_split[4];
        localStorage.setItem("caption_length", caption_length);

        if (message_result_split.length == 6) {
          custom_timestamp = 1;
          received_durations = JSON.parse(message_result_split[5]);
        }

         
        show_step_1_2(captions_video,interval);
          

        websocketClient.send("captions_received:" + userId);
      }

      if (message_result == "all_chunks_received") {
        waiting_caption = 1;
        bad_connection_choose_file = 0;

        clearInterval(interval);
        start_percentage(1);
        document.querySelector(".loader-description").innerHTML =
          "Transcribing video . . .";
        document.querySelector(".percentage").style.display = "flex";
      }
 

      if (message_result == "check_captions_false") {
        waiting_caption = 0;
      }

      if (message_result.includes("wrong_file:")) {
        inputFile.value = "";
        show_step0();
        document.querySelector(".loader-description").innerHTML =
          "Uploading video . . .";
        if (message_result.split(":")[1] == "bad_connection") {
          console.log("wrong file bad_connection");
          document.querySelector(".error-dimension").innerHTML =
            "Bad connection. Try it again";
          final_lang = "";
        }
        if (message_result.split(":")[1] == "bad_file") {
          document.querySelector(".error-dimension").innerHTML =
            "This file could not be uploaded. Try it with another file";
        }
        if (message_result.split(":")[1] == "random_error") {
          document.querySelector(".error-dimension").innerHTML =
            "Something went wrong. Try it again";
        }

        document.querySelector(".error-dimension").style.display = "flex";
      }

      
      if (message_result === "ready_to_upload") {
        console.log("message: ", message_result);
        sendVideo(currentFile);
      }
    }

    if (event.data instanceof ArrayBuffer && current_step > 0) {

      const bytes = new Uint8Array(event.data);

      let firstInt =
        bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24);

      if (firstInt < 0) {
        const secondInt = (bytes[4] << 24) >> 24;

        if (secondInt >= 0) {
          type_video = "video/webm";
          video_extension = ".webm";
        } else {
          type_video = "video/mp4";
          video_extension = ".mp4";
        }

        if (globalBuffer.length==0){
          destroyCancelButton(); 
        }

        console.log("chunk: ",globalBuffer.length); 
          
        const subBuffer = bytes.subarray(5); 
        suma_final = suma_final + subBuffer.byteLength;
        const newBuffer = new Uint8Array(globalBuffer.length + subBuffer.length);
        newBuffer.set(globalBuffer, 0);
        newBuffer.set(subBuffer, globalBuffer.length);

        globalBuffer = newBuffer; 
         
        if (video_tag == "webm") {  
          const current_load = [[globalBuffer.length, Math.abs(firstInt), "#0000FF"]];
          generarBarras(current_load);
        }else{ 
          const current_load = [[globalBuffer.length, Math.abs(firstInt), "percentage","#0000FF","Preparing video . . ."]];
          draw_percentage(current_load);  
        } 
         

        if (globalBuffer.length == Math.abs(firstInt)) { 
          console.log("FULL_VIDEO_RECEIVED");
          ocultarBarras();
          n_seg = 0; 
          watch();
          show_step_1_2(captions_video,interval);
          websocketClient.send("full_video_received_"+video_tag);
          const error_connection_2 = document.querySelector(".error-creation-2");
          if (error_connection_2){ 
            error_connection_2.innerText = "Video rendered successfully";
            error_connection_2.style.display = "block";
          } 
        }
      } else {
        const duracion_video = firstInt;   
        const secondInt = (bytes[4] << 24) >> 24;

        console.log("frameIndex: ",frameIndex);
        if (secondInt > 0) {  
          if (frameIndex == 0){
            close_loading(); 
            if (duracion_video>=15){
                createCancelButton();
            } 
          } 

          const current_load = [[n_seg, duracion_video, "#4caf50"]];
          generarBarras(current_load);  
          const percentage = n_seg/duracion_video;
          if (percentage>0.6){
            destroyCancelButton();
          }

          const chunk_data = bytes.subarray(5); 
          const frames = getChunks(chunk_data); 
 
          feedFrames(frames, current_fps);
          if (current_fps < 17 && n_seg % 8 == 0) {
            current_fps = current_fps + 1;
          }

           
        }else{ 
          const current_load = [[n_seg, duracion_video, "time","#4caf50","Rendering video . . ."]]; 
          draw_percentage(current_load);   
          if (Math.abs(n_seg-duracion_video)<=2){
            clearCircle();
          } 
        }
        n_seg = n_seg + 1;
      }



 
    }
  });

 

  
  websocketClient.addEventListener("close", (event) => {

    stopPing();
    
    frameIndex = 0;
    globalBuffer = new Uint8Array(0);
    ocultarBarras();
    n_seg = 0;
 

    if (waiting_video == 1) {
      waiting_video = 0; 
      const error_connection = document.querySelector(".error-creation"); 
      if (error_connection){
        error_connection.style.display = "block"; 
      } 
      show_step_1_2(captions_video,interval);
    }

    if (bad_connection_choose_file == 1) {
      inputFile.value = "";

      final_lang = "";
      console.log("listener close: bad connection");
      document.querySelector(".error-dimension").innerHTML =
        "Bad connection. Try it again";
      document.querySelector(".error-dimension").style.display = "flex";
       
    }

    if (event.wasClean) {
      console.log("Connection closed");
    } else {
      console.log("reconnecting...");
      setTimeout(() => {
        connect("reconnecting");
      }, 5000);
    }
    console.log(`close error: ${event.code}, Razón: ${event.reason}`);
  });

  websocketClient.addEventListener("error", (error) => {
    console.error("Error connection:", error);
  }); 
}

 

let modal = document.getElementById("myModal");

let close_yes = document.getElementsByClassName("close-yes")[0];
let close_no = document.getElementsByClassName("close-no")[0];

close_yes.onclick = function () {
  toggleEditability(0);
  send_new_captions = 1;
  modal.style.display = "none";
  request_create_video();
};
close_no.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", function () {
    checkSupport(); 
    show_stepLoading(); 
    connect("connected");
    monoColorButton.click();  
});
 
 
window.addEventListener("beforeunload", () => {
  if (websocketClient && websocketClient.readyState === WebSocket.OPEN) {
    console.log("conection closed");
    websocketClient.close(1000, "Page unloading");
  }
}); 


document.addEventListener("DOMContentLoaded", function () {
  const settingsOpenModalBtn = document.getElementById("settings-openModalBtn");
  const settingsModal = document.getElementById("settingsModal");
  const settingsCloseBtn = document.querySelector(".settings-close-btn");
  const fontElement = document.getElementById("settings-font");
  const colorElement = document.getElementById("settings-color");
  const positionElementSub = document.getElementById("settings-position-sub");

  if (
    settingsOpenModalBtn &&
    settingsModal &&
    settingsCloseBtn &&
    fontElement &&
    colorElement &&
    positionElementSub
  ) {
    settingsOpenModalBtn.addEventListener("click", function () {
      settingsModal.style.display = "block";
    });

    settingsCloseBtn.addEventListener("click", function () {
      settingsModal.style.display = "none";
    });

    settingsModal.addEventListener("click", function (event) {
      if (event.target === settingsModal) {
        settingsModal.style.display = "none";
      }
    });

    fontElement.addEventListener("click", function () {
      settingsModal.style.display = "none";
    });

    colorElement.addEventListener("click", function () {
      settingsModal.style.display = "none";
    });

    if (positionElementSub && settingsModal) {
      positionElementSub.addEventListener("click", function () {
        settingsModal.style.display = "none";
      });
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const textglowPercent = [0, 50, 100];
  const textglowClasses = ["pos-0", "pos-1", "pos-2"];

  function initSlider(name, onChangeCallback = null) {
    const container = document.getElementById(`bar-${name}-container`);
    const circle = document.getElementById(`${name}-circle`);
    let currentPos = 0;
    let dragging = false;
    let offsetX = 0;

    function setPosition(index) {
      circle.classList.remove(...textglowClasses);
      circle.classList.add(textglowClasses[index]);
      currentPos = index;

      if (onChangeCallback) {
        onChangeCallback(index);
      }
    }

    setPosition(currentPos);

    circle.addEventListener("mousedown", function (e) {
      dragging = true;
      const circleRect = circle.getBoundingClientRect();
      offsetX = e.clientX - circleRect.left;
    });

    document.addEventListener("mousemove", function (e) {
      if (!dragging) return;

      const containerRect = container.getBoundingClientRect();
      let x = e.clientX - containerRect.left - offsetX;
      x = Math.max(0, Math.min(x, containerRect.width - circle.offsetWidth));

      circle.style.left = x + "px";
      circle.style.transform = "none";
    });

    document.addEventListener("mouseup", function () {
      if (!dragging) return;
      dragging = false;

      const containerRect = container.getBoundingClientRect();
      const circleRect = circle.getBoundingClientRect();
      const x = circleRect.left - containerRect.left + circle.offsetWidth / 2;

      const width = containerRect.width;
      let nearestIndex = 0;
      let minDist = Math.abs(x - (textglowPercent[0] / 100) * width);

      for (let i = 1; i < textglowPercent.length; i++) {
        const posX = (textglowPercent[i] / 100) * width;
        const dist = Math.abs(x - posX);
        if (dist < minDist) {
          minDist = dist;
          nearestIndex = i;
        }
      }

      setPosition(nearestIndex);
      circle.style.left = "";
      circle.style.transform = "";
    });

    container.addEventListener("click", function (e) {
      if (dragging) return;

      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;

      let nearestIndex = 0;
      let minDist = Math.abs(clickX - (textglowPercent[0] / 100) * width);

      for (let i = 1; i < textglowPercent.length; i++) {
        const posX = (textglowPercent[i] / 100) * width;
        const dist = Math.abs(clickX - posX);
        if (dist < minDist) {
          minDist = dist;
          nearestIndex = i;
        }
      }

      setPosition(nearestIndex);
    });
  }

  initSlider("position", (index) => {
    selectedPositionSub = index + 1;
  });

  initSlider("textglow", (index) => {
    selectedTextGlowSub = index + 1;
  });

  initSlider("audio", (index) => {
    selectedAudioSub = index + 1;
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const openPositionModalBtn = document.getElementById("settings-position-sub");
  const positionModalSub = document.getElementById("positionModalSub");
  const closeBtnPosition = document.querySelector(".position-close-btn-sub");

  if (openPositionModalBtn && positionModalSub && closeBtnPosition) {
    openPositionModalBtn.addEventListener("click", function () {
      positionModalSub.style.display = "block";
    });

    closeBtnPosition.addEventListener("click", function () {
      positionModalSub.style.display = "none";
    });

    positionModalSub.addEventListener("click", function (event) {
      if (event.target === positionModalSub) {
        positionModalSub.style.display = "none";
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const openModalBtn = document.getElementById("settings-font");
  const fontModal = document.getElementById("fontModal");
  const closeBtn = document.querySelector(".font-close-btn");
  const fontList = document.getElementById("fontList");

  const fonts = [
    "font1",
    "font2",
    "font3",
    "font4",
    "font5",
    "font6",
    "font7",
    "font8",
    "font9",
    "font10",
  ];

  openModalBtn.addEventListener("click", function () {
    populateFontList();
    fontModal.style.display = "block";
  });

  closeBtn.addEventListener("click", function () {
    fontModal.style.display = "none";
  });

  fontModal.addEventListener("click", function (event) {
    if (event.target === fontModal) {
      fontModal.style.display = "none";
    }
  });

  function populateFontList() {
    fontList.innerHTML = "";

    fonts.forEach(function (font, index) {
      const listItem = document.createElement("li");
      const fontBlock = document.createElement("div");

      fontBlock.classList.add("font-block");
      fontBlock.style.fontFamily = font;
      fontBlock.textContent = `${index + 1}. Subtitle`;
      fontBlock.style.paddingTop = "5px";
      fontBlock.style.paddingRight = "0";
      fontBlock.style.paddingBottom = "5px";
      fontBlock.style.paddingLeft = "0";

      fontBlock.addEventListener("click", function () {
        fontModal.style.display = "none";
        openModalBtn.textContent = `Font (${index + 1})`;

        localStorage.setItem("selected-font", (index + 1).toString());
      });

      listItem.appendChild(fontBlock);
      fontList.appendChild(listItem);
    });
  }
});

saveColorsToLocalStorageMono("#FFFFFF");

var selectedColors = ["#0FF764", "#FFFF00", "#469AFA"];

saveColorsToLocalStorage({ multiColor: selectedColors });

const colorButton = document.getElementById("settings-color");

const colorModal = document.getElementById("colorModal");
const colorCloseModal = document.getElementById("closeModalColor");
const monoColorButton = document.getElementById("monoColor");
const multiColorButton = document.getElementById("multiColor");
const saveButton = document.getElementById("saveColor");
const colorOptions = document.getElementById("colorOptions");
const colorCount = document.getElementById("colorCount");

colorButton.addEventListener("click", () => {
  colorModal.style.display = "flex";
});

colorCloseModal.addEventListener("click", function () {
  colorModal.style.display = "none";
});

colorModal.addEventListener("click", function (event) {
  if (event.target === colorModal) {
    colorModal.style.display = "none";
  }
});

function setActiveButton(button) {
  [monoColorButton, multiColorButton].forEach((btn) => {
    btn.classList.remove("active");
  });
  button.classList.add("active");
}

function saveColorsToLocalStorageMono(color) {
  localStorage.setItem("selectedColor", color);
}

function saveColorsToLocalStorage(colors) {
  localStorage.setItem("selectedColors", JSON.stringify(colors));
}

function getColorsFromLocalStorageMono() {
  const savedColor = localStorage.getItem("selectedColor");
  return savedColor;
}

function getColorsFromLocalStorage() {
  const savedColors = localStorage.getItem("selectedColors");
  return savedColors ? JSON.parse(savedColors) : null;
}

monoColorButton.addEventListener("click", () => {
  setActiveButton(monoColorButton);
  const savedColor = getColorsFromLocalStorageMono();
  colorOptions.innerHTML = `<input type="color" id="monoPalette" value="${savedColor}">`;
  colorCount.textContent = "One single color in all subtitles";
});

multiColorButton.addEventListener("click", () => {
  setActiveButton(multiColorButton);
  const savedColors = getColorsFromLocalStorage()?.multiColor || [
    "#15ED64",
    "#FFFF00",
    "#FF951C",
  ];
  colorOptions.innerHTML = `
            <input type="color" id="multiPalette1" value="${savedColors[0]}">
            <input type="color" id="multiPalette2" value="${savedColors[1]}">
            <input type="color" id="multiPalette3" value="${savedColors[2]}">
        `;
  colorCount.textContent =
    "Colors will alternate randomly across all subtitles";
});

saveButton.addEventListener("click", () => {
  colorModal.style.display = "none";
  if (multiColorButton.classList.contains("active")) {
    const selectedColors = [
      document.getElementById("multiPalette1").value,
      document.getElementById("multiPalette2").value,
      document.getElementById("multiPalette3").value,
    ];
    saveColorsToLocalStorage({ multiColor: selectedColors });

    const selected_color = selectedColors
      .join("-")
      .replace(/#/g, "")
      .toUpperCase();

    localStorage.setItem("selected-color", selected_color);
  } else if (monoColorButton.classList.contains("active")) {
    const selectedColor = document.getElementById("monoPalette").value;
    saveColorsToLocalStorageMono(selectedColor);

    const selected_color = selectedColor.replace(/#/g, "").toUpperCase();

    localStorage.setItem("selected-color", selected_color);
  }
});

 

function writeLanguageInLoadingCircle(texto) {
  const div = document.querySelector(".loader-description");
  if (div) {
    div.appendChild(document.createElement("br"));
    const text = document.createTextNode("Video language: " + texto);
    div.appendChild(text);
  }
}

function writeUpdatingMessage(texto) {
  const div = document.querySelector(".error-dimension");
  div.innerHTML = texto;
  div.style.display = "block";
}

const languages = ["English (beta)", "Español"];

function populateLanguageList() {
  const languageList = document.getElementById("languageList");

  languageList.innerHTML = "";

  languages.forEach(function (font, index) {
    const listItem = document.createElement("li");
    const fontBlock = document.createElement("div");

    fontBlock.classList.add("language-block");
    fontBlock.style.fontFamily = "Arial";
    fontBlock.textContent = font;

    fontBlock.addEventListener("click", function () {
      language_video = (index + 1).toString();

      const allFontBlocks = document.querySelectorAll(".language-block");
      allFontBlocks.forEach((block) => {
        block.style.backgroundColor = "";
        block.style.color = "";
      });

      fontBlock.style.backgroundColor = "#7c55e6";
      fontBlock.style.color = "#ffffff";

      selectedLanguageIndex = index;
      console.log(index);
    });

    listItem.appendChild(fontBlock);
    languageList.appendChild(listItem);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const selectedLanguage = document.getElementById("selected-language");
  const openLanguageModalBtn = document.getElementById("change-language");
  const languageModal = document.getElementById("languageModal");
  const languageCloseBtn = document.querySelector(".language-close-btn");
  const languageSaveBtn = document.getElementById("save-lang");

  if (
    selectedLanguage &&
    openLanguageModalBtn &&
    languageModal &&
    languageCloseBtn &&
    languageSaveBtn
  ) {
    openLanguageModalBtn.addEventListener("click", function () {
      populateLanguageList();
      languageModal.style.display = "block";
    });

    languageCloseBtn.addEventListener("click", function () {
      languageModal.style.display = "none";
    });

    languageSaveBtn.addEventListener("click", function () {
      languageModal.style.display = "none";
      final_lang = language_video;
      websocketClient.send("lang_client_" + userId + "_client_" + final_lang);
      selectedLanguage.textContent = `${languages[parseInt(final_lang) - 1]}`;
    });
  }

  const myModal_limit_size = document.getElementById("myModal_limit_size");
  const closeBtn_limit_size = document.querySelector(".close_limit_size");

  if (myModal_limit_size && closeBtn_limit_size) {
    closeBtn_limit_size.addEventListener("click", function () {
      myModal_limit_size.style.display = "none";
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    var dropdownContent = document.getElementById("dropdown-content");
    var dropdownBtn = document.getElementById("dropdown-btn");

    if (event.target !== dropdownContent && event.target !== dropdownBtn) {
      dropdownContent.style.display = "none";
    }
  });

  document.addEventListener("click", function (event) {
    var export_dropdownContent = document.getElementById(
      "exportDropdown-content"
    );
    var export_dropdownBtn = document.getElementById("exportDropdown-button");

    if (
      event.target !== export_dropdownContent &&
      event.target !== export_dropdownBtn
    ) {
      export_dropdownContent.style.display = "none";
    }
  });
});

function toggleDropdown(event) {
  var dropdownContent = document.getElementById("dropdown-content");
  if (dropdownContent.style.display === "block") {
    dropdownContent.style.display = "none";
  } else {
    dropdownContent.style.display = "block";
  }

  if (event && event.stopPropagation) {
    event.stopPropagation();
  }
}

function toggleExportDropdown(event) {
  var export_dropdownContent = document.getElementById(
    "exportDropdown-content"
  );
  if (export_dropdownContent.style.display === "block") {
    export_dropdownContent.style.display = "none";
  } else {
    export_dropdownContent.style.display = "block";
  }

  if (event && event.stopPropagation) {
    event.stopPropagation();
  }
}

let output_language = {
  Reset: "Reset",
  English: "en",
  Spanish: "es",
  Portuguese: "pt",
  French: "fr",
  German: "de",
  Italian: "it",
};

function send_to_translate(lang) {
  var text = getTextareaValue();
  const user_id = localStorage.getItem("userid");
  websocketClient.send(
    "translate_client_" + user_id + "_client_" + text + "_client_" + lang
  );
}

function selectOption(option) {
  var dropdownBtn = document.getElementById("dropdown-btn");
  var dropdownContent = document.getElementById("dropdown-content");
  dropdownContent.style.display = "none";

  dropdownBtn.disabled = true;

  if (option != "Reset") {
    current_output_language = option;
    dropdownBtn.innerHTML = "Loading..." + " &#x025BE;";
    send_to_translate(output_language[option]);
  } else {
    dropdownBtn.innerHTML = option + " &#x025BE;";
    generarInputs_captions(captions_video);
    dropdownBtn.disabled = false;
  }
}

const dropZone = document.getElementById("dropZone");
const inputFile_drag = document.getElementById("file");

if (dropZone && inputFile_drag) {
  inputFile_drag.addEventListener("change", (event) => {
    const files_drag = event.target.files;
    if (files_drag.length > 0) {
      if (!files_drag[0].name.toLowerCase().endsWith(".mp4")) {
        const modal_limit_size = document.getElementById("myModal_limit_size");
        const limitMessage = document.getElementById("limit_size_message");
        limitMessage.innerText =
          "Only MP4 videos can be uploaded. Use an online converter.";
        modal_limit_size.style.display = "block";
        inputFile_drag.value = "";
      }
    }
  });

  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragover");
    const files_drop = event.dataTransfer.files;
    if (files_drop.length) {
      inputFile_drag.files = files_drop;

      if (final_lang != "") {
        const changeEvent = new Event("change");
        inputFile_drag.dispatchEvent(changeEvent);
      } else {
        populateLanguageList();
        const languageModal = document.getElementById("languageModal");
        languageModal.style.display = "block";
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const exportDropdown_txt = document.getElementById("exportDropdown-txt");
  const exportDropdown_srt = document.getElementById("exportDropdown-srt");
  const exportDropdown_mp4 = document.getElementById("exportDropdown-mp4");

  if (exportDropdown_srt && exportDropdown_mp4 && exportDropdown_txt) {
    exportDropdown_srt.addEventListener("click", () => {
      downloadSRT(".srt");
    });
    exportDropdown_mp4.addEventListener("click", () => {
      downloadVideo();
    });
    exportDropdown_txt.addEventListener("click", () => {
      downloadSRT(".txt");
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const settingsOption = document.querySelectorAll(".settings-font-block");
  if (settingsOption) {
    settingsOption.forEach((elemOption) => {
      elemOption.style.paddingTop = "10px";
      elemOption.style.paddingRight = "0";
      elemOption.style.paddingBottom = "10px";
      elemOption.style.paddingLeft = "0";
    });
  }
});
  
 
 
  
