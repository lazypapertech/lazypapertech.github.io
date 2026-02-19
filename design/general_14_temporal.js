function isNotUser() {
    const botPattern =
      /bot|crawl|spider|slurp|facebookexternalhit|mediapartners/i;
    return botPattern.test(navigator.userAgent);
  }
  
  function redirect2() {
    if (isNotUser()) return;
  
    const path = window.location.pathname;
  
    if (path !== "/" && path !== "/index.html") {
      window.location.href = "/index.html?t=" + Date.now();
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
      websocketClient.send("cancel_task:" + userId);
      setTimeout(() => {
        destroyCancelButton();
        waiting_video = 0;
        frameIndex = 0;
        globalBuffer = new Uint8Array(0);
        ocultarBarras();
        n_seg = 0;
        show_step_1_2(captions_video, interval);
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
          //video_tag = "mp4";      
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
    if (loader) {
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
      if (websocketClient.readyState === WebSocket.OPEN) {
        websocketClient.send("exported");
      }
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
    const dpr = window.devicePixelRatio || 1;
  
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
  
    canvas.width = width * dpr;
    canvas.height = height * dpr;
  }
  
  let loadingAnimId = null;
  let t = 0;
  
  function drawLoading() {
    resizeCanvas();
  
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
  const ctx = canvas.getContext("2d", { alpha: true });
  const dpr = window.devicePixelRatio || 1;
  console.log("dpr principal: ", dpr);
  ctx.scale(dpr, dpr);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  if (canvas) {
    try {
      canvas.addEventListener("contextmenu", (event) => {
        event.preventDefault();
      });
    } catch (error) {
      console.log("error:", error);
    }
  }
  
  window.addEventListener("resize", resizeCanvas);
  
  function adapt_frame_to_canvas_0(
    frame,
    canvasWidth,
    canvasHeight,
    frameWidth,
    frameHeight
  ) {
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
  
  function adapt_frame_to_canvas(
    frame,
    canvasWidth,
    canvasHeight,
    frameWidth,
    frameHeight
  ) {
    const dpr = window.devicePixelRatio || 1;
    console.log("dpr: ", dpr);
    const tempCanvas = document.createElement("canvas");
  
    tempCanvas.width = canvasWidth * dpr;
    tempCanvas.height = canvasHeight * dpr;
  
    tempCanvas.style.width = canvasWidth + "px";
    tempCanvas.style.height = canvasHeight + "px";
  
    const ctx = tempCanvas.getContext("2d", { alpha: true });
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
  
    //ctx.fillStyle = "black";
    //ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
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
        if (frameIndex == 0) {
          resizeCanvas();
        }
        const processed_frame = adapt_frame_to_canvas(
          frame,
          canvas.width,
          canvas.height,
          current_video_width,
          current_video_height
        );
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
    },
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

  let session_is_duplicated = 0;
  
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
    const nuevoItem2 = `
            <li>
                <div id="settings-tutorial-sub" class="settings-font-block"></div>
            </li>
        `;
    settingsList.insertAdjacentHTML("beforeend", nuevoItem);
    settingsList.insertAdjacentHTML("afterbegin", nuevoItem2); 
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

  const div_tutorial = `<div id="tutorialModalSub" class="tutorialModalSub"> 
            <div class="tutorial-modal-content-sub">
 		  <span class="tutorial-close-btn-sub">&times;</span>
		  <div style="background-color:#7c55e6; padding:40px; text-align:center; font-family:Arial, sans-serif; border-radius:12px;">
 

    <p style="color:#000; font-size:16px; margin-bottom:30px; max-width:600px; margin-left:auto; margin-right:auto; line-height:1.6;">
    Video editor with
    <span style="font-weight:700; color:rgb(255,255,255) !important;">
        advanced features
    </span> 
    to improve the subtitles.
</p>


    <p>
        <a id="tutorial_button" href="https://www.youtube.com/watch?v=xzrvYINTVwY" target="_blank"
           style="background-color:#ffffff; 
                  color:#7c55e6; 
                  padding:14px 28px; 
                  text-decoration:none; 
                  font-weight:bold; 
                  border-radius:8px; 
                  font-size:16px; 
                  display:inline-block;
                  transition:0.3s;">
            Continue
        </a>
    </p>

</div>

	
            </div>
        </div>`;
  const principalContainer = document.querySelector(".card-container");
  if (principalContainer) {
    principalContainer.insertAdjacentHTML("beforeend", div_text); 
    principalContainer.insertAdjacentHTML("afterbegin", div_tutorial);
/*
    const contenidoOriginal = principalContainer.innerHTML; 
    principalContainer.innerHTML = div_tutorial + div_text + contenidoOriginal;
*/

  }
  
  const div_presentation = `<div class="start-video-preview">
                <div class="start-video-container">
                    <img src="https://raw.githubusercontent.com/manyresources/resourcespage/main/logos/preview_video.jpeg" alt="Video Preview" class="start-video-thumbnail">
                    <div class="start-play-wrapper" onclick="abrirVideo()">
                        <div class="start-pulse-circle"></div>
                        <div class="start-play-button">
                            <span class="start-play-icon"></span>
                        </div>
                    </div>
                </div>
            </div> `;
  const clip_container = document.querySelector(".clip-container");
  if (clip_container) {
    clip_container.insertAdjacentHTML("afterbegin", div_presentation);
  }
  
  const div_modal_video = `<div class="video-modal" id="videoModal"> 
            <div class="video-modal-header">
                <span class="video-close" onclick="cerrarVideo()">&times;</span>
            </div> 
            <div class="video-modal-content">
                <video id="miVideo" controls autoplay>
                    <source src="https://raw.githubusercontent.com/manyresources/resourcespage/main/videos/app_animation.mp4" type="video/mp4"> 
                </video>
            </div>
        </div>`;
  if (principalContainer) {
    principalContainer.insertAdjacentHTML("beforeend", div_modal_video);
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
  
  let userId = localStorage.getItem("useridManycaptions");
  
  if (!userId) {
    userId = generateRandomUserId();
    localStorage.setItem("useridManycaptions", userId);
  }
  
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
    let step0 = document.getElementById("step0");
    if (step0) {
      step0.style.display = "none";
    }
  }
  function hide_stepLoading() {
    let stepLoading = document.getElementById("stepLoading");
    if (stepLoading) {
      stepLoading.style.display = "none";
    }
  }
  function hide_stepPreview() {
    let stepPreview = document.getElementById("stepPreview");
    if (stepPreview) {
      stepPreview.style.display = "none";
    }
  }
  function hide_step_1_2() {
    let step_1_2 = document.getElementById("step_1_2");
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
    { id: "dropdown-btn", content: "Translate to  &#x025BE;" },
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
  
    { id: "settings-tutorial-sub", content: "Advanced" },
    { id: "settings-font", content: "Text font" },
    { id: "settings-color", content: "Text color" },
    { id: "settings-position-sub", content: "Text design" },
  
    { id: "position-down", content: "Down" },
    { id: "position-center", content: "Center" },
    { id: "position-up", content: "Up" },
  
    { id: "textglow-down", content: "Off" },
    { id: "textglow-center", content: "Thin" },
    { id: "textglow-up", content: "Thick" },
  
    { id: "audio-down", content: "1" },
    { id: "audio-center", content: "2" },
    { id: "audio-up", content: "3" },
     
    { id: "position-sub-title", content: "Position of subtitles" },
    { id: "textglow-sub-title", content: "Text Glow" },
    { id: "audio-sub-title", content: "Simultaneous lines" },
  
     
    { id: "monoColor", content: "Monocolor" },
    { id: "multiColor", content: "Multicolor" },
    { id: "saveColor", content: "Save" },
    { id: "save-lang", content: "Save" },
    { selector: ".ask-lang", content: "Select video language" },
    {
      id: "limit_size_message",
      content:
        "This video exceeds 350MB of free plan. Use an online video compressor",
    },
  ];
  
  start_elements.forEach((item) => {
    const el = item.id
      ? document.getElementById(item.id)
      : document.querySelector(item.selector);
  
    if (el) {
      el.innerHTML = item.content;
      el.classList.add("notranslate");
    }
  });
  
  let url_websocket = "rndomg84pbrg.onrender.com";
  
  function show_step0() {
    hide_stepLoading();
    hide_step_1_2();
    hide_stepPreview();
    let step0 = document.getElementById("step0");
    if (step0) {
      step0.style.display = "block";
    }
  }
  function show_stepLoading() {
    hide_step0();
    hide_step_1_2();
    hide_stepPreview();
    let stepLoading = document.getElementById("stepLoading");
    if (stepLoading) {
      stepLoading.style.display = "block";
    }
  }
  function show_stepPreview() {
    hide_step0();
    hide_step_1_2();
    hide_stepLoading();
    let stepPreview = document.getElementById("stepPreview");
    if (stepPreview) {
      stepPreview.style.display = "block";
    }
  }
  
  function update_languages() { 
    if (language_video == "2") {
      const temp_div = document.getElementById("spanish-dropdown");
      if (temp_div) {
        temp_div.style.display = "none";
      } else {
        console.log("element not found");
      }
    }
    if (language_video == "3") {
      const temp_div = document.getElementById("portuguese-dropdown");
      if (temp_div) {
        temp_div.style.display = "none";
      } else {
        console.log("element not found");
      }
    }
  }
  function show_step_1_2(captions_video, interval) {
    hide_step0();
    hide_stepLoading();
    hide_stepPreview();
    let step_1_2 = document.getElementById("step_1_2");
    if (step_1_2) {
      step_1_2.style.display = "flex";
      clearInterval(interval);
      reset_percentage();
      generarInputs_captions(captions_video);
    }
    let circular_animation = document.querySelector(".circular");
    if (circular_animation) {
      circular_animation.style.animation = "none";
    }
    toggleEditability(1);
    show_export_mp4();
    update_languages();
  }
  
  function show_export_mp4() {
    let button_export_mp4 = document.getElementById("exportDropdown-mp4");
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
    let container = document.querySelector(".form-container");
    if (container) {
      container.scrollTop =
        element.offsetTop -
        container.offsetTop -
        container.offsetHeight / 2 +
        element.offsetHeight / 2;
    }
  }
  
  let videoElement = document.getElementById("my-video-2");
  if (videoElement) {
    videoElement.setAttribute("controlsList", "nodownload");
  
    videoElement.addEventListener("timeupdate", function () {
      let currentTime = videoElement.currentTime;
  
      let hours = Math.floor(currentTime / 3600);
      let minutes = Math.floor((currentTime - hours * 3600) / 60);
      let seconds = Math.floor(currentTime - hours * 3600 - minutes * 60);
      let totalSeconds = Math.floor(currentTime);
  
      let index_irregular_timestamps = indiceAcumuladoHasta(
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
    let delta_seconds = 1200;
    let time_increment = 1;
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
    if (percentageEl && circle && radius && circumference) {
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
    const round_percentage = percentage_visible.toFixed(1) + "%";
  
    const timeRemaining = Math.max(0, Math.floor(1 + total - valor));
  
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  
    const percentageEl = document.querySelector(".percentage");
    if (percentageEl) {
      if (typeValue == "time") {
        percentageEl.textContent = formattedTime;
      } else {
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
  
    let offset = 0;
    let n = 0;
    let float_percentage = 0;
    while (offset < totalSize) {
      const end = offset + chunkSize;
      const chunk =
        end < totalSize
          ? selectedFile.slice(offset, end)
          : selectedFile.slice(offset);
      offset = end;
  
      await enviarMensaje(websocketClient, chunk);
  
      if (float_percentage <= 100) {
        let round_percentage = float_percentage.toFixed(1);
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
  
      let normal_size = 350000000;
  
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
          "This video exceeds 350MB of free plan. Use an online video compressor";
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
    let form = document.getElementById("form-container");
    form.innerHTML = "";
  
    let arrayFrases = frases.split("-o-");
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
      let rowDiv = document.createElement("div");
      rowDiv.style.display = "flex";
      rowDiv.style.marginBottom = "4px";
      rowDiv.style.marginRight = "4px";
      rowDiv.style.marginLeft = "4px";
      rowDiv.style.gap = "4px";
  
      let textarea1 = document.createElement("textarea");
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
    let form = document.getElementById("form-container");
  
    form.innerHTML = "";
  
    let arrayFrases = frases.split("-o-");
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
      let textarea = document.createElement("textarea");
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
  
  function generateSRT(phrases) {
    let srt = "";
    let startTime = 0;
    let step = 0.5;
    let step0 = parseFloat(localStorage.getItem("caption_length"));
    if (step) {
      step = step0;
    } else {
      step = 1;
    }
  
    phrases.forEach((phrase, index) => {
      let endTime = startTime + step;
  
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
    let current_captions_str = getTextareaValue();
    let phrases_list_str = current_captions_str.split("-o-");
    let randomdownload = Math.floor(1000 + Math.random() * 9000);
    let randomstring = randomdownload.toString();
    let filename_srt = "manycaptions" + randomstring + ".txt";
    let content_srt = generateSRT(phrases_list_str);
  
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
    let current_captions_str = getTextareaValue();
    let phrases_list_str = current_captions_str.split("-o-");
    let randomdownload = Math.floor(1000 + Math.random() * 9000);
    let randomstring = randomdownload.toString();
    let filename_srt = "manycaptions" + randomstring + extension;
    let content_srt = phrases_list_str.join(" ");
    if (extension == ".srt") {
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
  
/*
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
  
*/
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

 	editButton.style.display = "inline-block";
        saveButton.style.display = "none";	
      } else if (option === 1) {
console.log("EDIT 2");
        saveButton.style.color = "black";
        editButton.style.color = "white";
        lastPressedButton = 1;
        editButton.classList.remove("red-button");
        editButton.classList.add("lila-button");
        saveButton.classList.remove("lila-button");
        saveButton.classList.add("red-button");

	saveButton.style.display = "inline-block";
	editButton.style.display = "none";
        saveButton.style.backgroundColor = "#7c55e6";
	saveButton.style.color = "white";
      }
    }
  }

  let connectionTimeout;
  function check_edited_captions() {
    const btn = document.getElementById("createVideo");
    if (btn) {
      btn.disabled = true;
    }
  
    const mensaje = "request";
    websocketClient.send(mensaje + ":" + lastPressedButton);
  
    connectionTimeout = setTimeout(() => {
      console.log("exceeded time");
      btn.disabled = false;
      const error_connection = document.querySelector(".error-creation");
      if (error_connection) {
        error_connection.style.display = "block";
      }
      const error_connection_2 = document.querySelector(".error-creation-2");
      if (error_connection_2) {
        error_connection_2.style.display = "none";
      }
    }, 5000);
  }
  
  function handleServerResponse(data) {
    if (data === "1") {
      clearTimeout(connectionTimeout);
      console.log("connection true");
      const btn = document.getElementById("createVideo");
      if (btn) {
        btn.disabled = false;
      }
      check_edited_captions_next();
    }
  }
  
  function check_edited_captions_next() {
    new_captions_video = getTextareaValue();
  
    let modalContent = document.querySelector(".modal-content p");
    console.log("new_captions_video: ", new_captions_video);
    console.log("captions_video: ", captions_video);
    if (lastPressedButton == 1) {
      modalContent.textContent =
        "The changes have not been saved. Do you want to save them?";
      modal.style.display = "block";
    } else {
      request_create_video();
    }
  }
  
  function request_create_video() {
    const user_id = localStorage.getItem("useridManycaptions");
  
    const error_connection = document.querySelector(".error-creation");
    const error_connection_2 = document.querySelector(".error-creation-2");
    if (error_connection && error_connection_2) {
      error_connection.style.display = "none";
      error_connection_2.style.display = "none";
    }
  
    let sendFont = localStorage.getItem("selected-font");
    let sendColor = localStorage.getItem("selected-color");
    let sendPositionSub = selectedPositionSub;
    let sendTextGlowSub = selectedTextGlowSub;
    let sendAudioSub = selectedAudioSub;
  
    captions_video = new_captions_video;
  
    let send_settings =
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
      sendAudioSub +
      "_client_" +
      parametros_ia +
      "_client_"+
      video_tag	
      ;
    /*
    if (received_durations != -1) {
      let durations_string = received_durations.join("_");
      send_settings = send_settings + "_client_" + durations_string;
    }
    */
  
    websocketClient.send(send_settings);
  
    video_received = 0;
  
    show_export_mp4();
    if (video_tag == "webm") {
      show_stepPreview();
      start_loading();
      destroyCancelButton();
    } else {
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
    if (video) {
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
        const video_not_supported = document.getElementById(
          "video_not_supported"
        );
        if (video_not_supported) {
          video_not_supported.style.display = "block";
          video_not_supported.innerText =
            "Unplayable video. Press RENDER to repair it.";
        }
        console.log("Unplayable video. Press RENDER to repair it.");
      });
  
      videoElement.addEventListener("loadedmetadata", () => {
        console.log("Width:", videoElement.videoWidth);
        console.log("Height:", videoElement.videoHeight);
        current_video_width = videoElement.videoWidth;
        current_video_height = videoElement.videoHeight;
  
        if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
          const video_not_supported = document.getElementById(
            "video_not_supported"
          );
          if (video_not_supported) {
            video_not_supported.style.display = "block";
            video_not_supported.innerText =
              "Unplayable video. Press RENDER to repair it.";
          }
        }
      });
    } else {
      console.error("No se encontró el elemento source.");
    }
  }
  
  let current_chunk_size = 0;
  let videoChunks = [];
  


let reconnectTimeout = null;
let isReconnecting = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 120;
 
let parametros_ia = "";

function connect(type_connection) {

    if (websocketClient) {
      websocketClient.close();
      websocketClient = null;
    }

    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }

    isReconnecting = false; 


    const user_id = localStorage.getItem("useridManycaptions");
  
    websocketClient = new WebSocket("wss://" + url_websocket + "/" + user_id);
    websocketClient.binaryType = "arraybuffer";
  
    console.log("connecting...");
  
    websocketClient.addEventListener("open", () => {

      reconnectAttempts = 0; 
      isReconnecting = false;

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

      if (type_connection=="reconnecting"){
	procesarRespuestaPrompt("error");
      }	
    });
  
    websocketClient.addEventListener("message", (event) => {
      let message_result = event.data;
  
      if (typeof message_result === "string") { 
        handleServerResponse(message_result);

        if (message_result.includes("intensidad_resplandor")){
		console.log("parametros_ia:",message_result);
		if (message_result!="error:intensidad_resplandor"){
			parametros_ia = jsonToCustomString(message_result);
			console.log("parametros_ia 2:",parametros_ia);
			procesarRespuestaPrompt("completo");
		}else{
			procesarRespuestaPrompt("error");
			console.log("error instruction");
		}
	}
  
        if (message_result=="session_duplicated"){
            console.log("session_duplicated received");
            session_is_duplicated = 1;
            const session_duplicated = document.querySelector(".error-dimension"); 
            if (session_duplicated) { 
                session_duplicated.innerHTML = "Session duplicated. Connection closed. Please reload the page.";
                session_duplicated.style.display = "flex"; 
                websocketClient.close(4001, "Duplicate session");
            }
        }
  
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
          let translated_captions = message_result.split("_client_")[1];
          new_captions_video = translated_captions;
  
          generarInputs_captions(translated_captions);
          toggleEditability(0);
  
          let dropdownBtn = document.getElementById("dropdown-btn");
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
  
          show_step_1_2(captions_video, interval);
	  reajustarTextareas();
  
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
  
      if (
        event.data instanceof ArrayBuffer &&
        current_step > 0 &&
        waiting_video == 1
      ) {
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
  
          if (globalBuffer.length == 0) {
            destroyCancelButton();
          }
  
          //console.log("chunk: ", globalBuffer.length);
  
          const subBuffer = bytes.subarray(5);
          suma_final = suma_final + subBuffer.byteLength;
          const newBuffer = new Uint8Array(
            globalBuffer.length + subBuffer.length
          );
          newBuffer.set(globalBuffer, 0);
          newBuffer.set(subBuffer, globalBuffer.length);
  
          globalBuffer = newBuffer;
  
          if (video_tag == "webm") {
            const current_load = [
              [globalBuffer.length, Math.abs(firstInt), "#0000FF"],
            ];
            generarBarras(current_load);
          } else {
            const current_load = [
              [
                globalBuffer.length,
                Math.abs(firstInt),
                "percentage",
                "#0000FF",
                "Preparing video . . .",
              ],
            ];
            draw_percentage(current_load);
          }
  
          if (globalBuffer.length == Math.abs(firstInt)) {
            console.log("FULL_VIDEO_RECEIVED");
            ocultarBarras();
            n_seg = 0;
            watch();
            show_step_1_2(captions_video, interval);
            websocketClient.send("full_video_received_" + video_tag);
            const error_connection_2 =
              document.querySelector(".error-creation-2");
            if (error_connection_2) {
              error_connection_2.innerText = "Video rendered successfully";
              error_connection_2.style.display = "block";
            }
          }
        } else {
          const duracion_video = firstInt;
          const secondInt = (bytes[4] << 24) >> 24;
  
          //console.log("frameIndex: ", frameIndex);
          if (secondInt > 0) {
            if (frameIndex == 0) {
              close_loading();
              if (duracion_video >= 15) {
                createCancelButton();
              }
            }
  
            const current_load = [[n_seg, duracion_video, "#4caf50"]];
            generarBarras(current_load);
            const percentage = n_seg / duracion_video;
            if (percentage > 0.6) {
              destroyCancelButton();
            }
  
            const chunk_data = bytes.subarray(5);
            const frames = getChunks(chunk_data);
  
            feedFrames(frames, current_fps);
            if (current_fps < 17 && n_seg % 8 == 0) {
              current_fps = current_fps + 1;
            }
          } else {
            const current_load = [
              [n_seg, duracion_video, "time", "#4caf50", "Rendering video . . ."],
            ];
            draw_percentage(current_load);
            if (Math.abs(n_seg - duracion_video) <= 2) {
              clearCircle();
            }
          }
          n_seg = n_seg + 1;
        }
      }
    });
  
    websocketClient.addEventListener("close", (event) => {

      if (isReconnecting) return;
      isReconnecting = true;
 
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.warn("Límite de reconexiones alcanzado");
        return;
      }

      reconnectAttempts++; 
      console.log(`Reintentando conexión (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) en 5s...`);




      frameIndex = 0;
      globalBuffer = new Uint8Array(0);
      ocultarBarras();
      n_seg = 0;
  
      if (waiting_video == 1) {
        waiting_video = 0;
        const error_connection = document.querySelector(".error-creation");
        if (error_connection) {
          error_connection.style.display = "block";
        }
        show_step_1_2(captions_video, interval);
      }
  
      if (bad_connection_choose_file == 1) {
        inputFile.value = "";
  
        final_lang = "";
        console.log("listener close: bad connection");
        document.querySelector(".error-dimension").innerHTML =
          "Bad connection. Try it again";
        document.querySelector(".error-dimension").style.display = "flex";
      }

      if (event.code === 4001) {
            const session_duplicated = document.querySelector(".error-dimension"); 
            if (session_duplicated) { 
                session_duplicated.innerHTML = "Session duplicated. Connection closed. Please reload the page.";
                session_duplicated.style.display = "flex"; 
            }
            console.log("session duplicated");
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
      console.warn("Error connection:", error);
      scheduleReconnect();
    });
  }


function scheduleReconnect() {
 
  if (isReconnecting) return;
  isReconnecting = true;
 
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.warn("Límite de reconexiones alcanzado");
    return;
  }

  reconnectAttempts++;   
  console.log(`Reintentando conexión (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) en 5s...`);

  reconnectTimeout = setTimeout(() => {
    connect("reconnecting");
  }, 5000);
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

    const div_modal = `
<div id="modal_overlay_dinamico">
  <div id="modal_box_dinamico"> 
  </div>
</div>`; 
const principalContent = document.getElementById("content-enhanced");
  if (principalContent) {
	document.body.insertAdjacentHTML("beforeend", div_modal);
  }
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
    const myModal_limit_size = document.getElementById("myModal_limit_size");
    const settingsCloseBtn = document.querySelector(".settings-close-btn");
    const fontElement = document.getElementById("settings-font");
    const colorElement = document.getElementById("settings-color");
    const positionElementSub = document.getElementById("settings-position-sub");
    const tutorialElementSub = document.getElementById("settings-tutorial-sub");
  
    if (
      settingsOpenModalBtn &&
      settingsModal &&
      settingsCloseBtn &&
      fontElement &&
      colorElement &&
      positionElementSub &&
      tutorialElementSub	
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
      myModal_limit_size.addEventListener("click", function (event) {
        if (event.target === myModal_limit_size) {
          myModal_limit_size.style.display = "none";
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
      if (tutorialElementSub && settingsModal) {
        tutorialElementSub.addEventListener("click", function () {
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
  
      positionModalSub.addEventListener("click", function (event) {
        if (event.target === positionModalSub) {
          positionModalSub.style.display = "none";
        }
      });

      closeBtnPosition.addEventListener("click", function () {
        positionModalSub.style.display = "none";
      });
    }
  });

 
  document.addEventListener("DOMContentLoaded", function () {
    const openTutorialModalBtn = document.getElementById("settings-tutorial-sub");
    const tutorialModalSub = document.getElementById("tutorialModalSub");
    const closeBtnTutorial = document.querySelector(".tutorial-close-btn-sub");
  
    if (openTutorialModalBtn && tutorialModalSub && closeBtnTutorial) {
      openTutorialModalBtn.addEventListener("click", function () {
        tutorialModalSub.style.display = "block"; 
      }); 
 
      tutorialModalSub.addEventListener("click", function (event) {
        if (event.target === tutorialModalSub) {
          tutorialModalSub.style.display = "none";
        }
      });

      closeBtnTutorial.addEventListener("click", function () {
        tutorialModalSub.style.display = "none";
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
  
  let selectedColors = ["#0FF764", "#FFFF00", "#469AFA"];
  
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
  
  const languages = ["English (beta)", "Español", "Portuguese", "German", "Italian"];
  
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
      let dropdownContent = document.getElementById("dropdown-content");
      let dropdownBtn = document.getElementById("dropdown-btn");
  
      if (event.target !== dropdownContent && event.target !== dropdownBtn) {
        dropdownContent.style.display = "none";
      }
    });
 
    document.addEventListener("click", function (event) {
      let export_dropdownContent = document.getElementById(
        "exportDropdown-content"
      ); 
      //#exportDropdown-button	
      if (!event.target.closest(".exportDropdown")) { 
        if (export_dropdownContent){
		export_dropdownContent.style.display = "none";
		console.log("fuera");
	} 
      }
/*
      if (event.target.matches("#exportDropdown-button") || event.target.closest("#exportDropdown-button")){
          toggleExportDropdown(event);
      }  
*/
    });
 
  });
  
  function toggleDropdown(event) {
    let dropdownContent = document.getElementById("dropdown-content");
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";
    } else {
      dropdownContent.style.display = "block";
    }
  /*
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
*/
  }
 
  
  function toggleExportDropdown(event) {
return;
    let export_dropdownContent = document.getElementById(
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
    let text = getTextareaValue();
    const user_id = localStorage.getItem("useridManycaptions");
    websocketClient.send(
      "translate_client_" + user_id + "_client_" + text + "_client_" + lang
    );
  }

  function getTextareaValue_2() {  
    let list_captions = []
    const textareas = document.querySelectorAll(".flexible-captions");
    textareas.forEach((textarea) => {
        let new_line = textarea.value;  
        list_captions.push(new_line); 
    });
  
    return JSON.stringify(list_captions);
  }

  function send_to_ai(instruction) {
    let text = getTextareaValue();
    console.log("text:",text);
    const user_id = localStorage.getItem("useridManycaptions");
    websocketClient.send(
      "ai_option_client_" + user_id + "_client_" + text + "_client_" + instruction
    );
  }
  
  function selectOption(option) {
    let dropdownBtn = document.getElementById("dropdown-btn");
    let dropdownContent = document.getElementById("dropdown-content");
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
  
  function show_modal_error() {
    const modal_limit_size = document.getElementById("myModal_limit_size");
    const limitMessage = document.getElementById("limit_size_message");
  
    limitMessage.innerText =
      "Press render video before exporting.\n\nIMPORTANT:\nEach text entry represents 0.5 seconds, do not write too long text in a single box. Recommended maximum 15 characters in each entry.";
    modal_limit_size.style.display = "block";
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
        if (current_step == 2) {
          downloadVideo();
        } else {
          show_modal_error();
        }
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
  
  function redirect() {
    if (isNotUser()) return;
    window.location.href = "/?t=" + Date.now();
  }
  
  window.onerror = function (mensaje, url, linea, columna, error) {
    console.log("error");
    /*redirect();*/
  };
 
  window.addEventListener("unhandledrejection", function (event) {
    console.log("Unhandled promise rejection:");
     /*redirect(); */
  }); 
  
  function abrirVideo() {
    const modal = document.getElementById("videoModal");
    const video = document.getElementById("miVideo");
    modal.style.display = "flex";
    video.play();
  }
  
  function cerrarVideo() {
    const modal = document.getElementById("videoModal");
    const video = document.getElementById("miVideo");
    modal.style.display = "none";
    video.pause();
  }
  
  window.onclick = function (e) {
    const modal = document.getElementById("videoModal");
    const video = document.getElementById("miVideo");
    if (e.target === modal) {
      modal.style.display = "none";
      video.pause();
    }
  };
    


document.addEventListener("click", function (e) { 
if (e.target.matches(".exportDropdown") || e.target.closest(".exportDropdown")){
console.log("export presionado");
const content = document.getElementById('exportDropdown-content'); 
if (content){
content.style.display="block"; 
}
}
});
 
 


function iniciarAnimacionBoton() {
  const boton = document.getElementById('settings-openModalBtn');
  
  setInterval(() => {
    boton.classList.add('neon-glow');
    setTimeout(() => {
      boton.classList.remove('neon-glow');
    }, 1000);  
  }, 4000);
}

iniciarAnimacionBoton();



 
 

// Variable global
let prompt_actual = '';

function insertarBotonIA() {
  // Buscar el contenedor principal
  const subContainer = document.getElementById('sub-container');
  
  if (!subContainer) {
    console.error('No se encontró el elemento con id "sub-container"');
    return;
  }
  
  // Buscar el elemento con clase "dropdown" dentro del contenedor
  const dropdown = subContainer.querySelector('.dropdown');
  
  if (!dropdown) {
    console.error('No se encontró el elemento con clase "dropdown"');
    return;
  }
  
  // Crear el nuevo botón
  const botonIA = document.createElement('button');
  botonIA.id = 'ai_option';
  botonIA.className = 'custom-button';
  botonIA.innerHTML = "AI Editor";
  
  // Insertar el botón justo después del dropdown
  dropdown.parentNode.insertBefore(botonIA, dropdown.nextSibling);

  // Crear botón al inicio
const botonPrincipal = document.createElement('button');
botonPrincipal.id = 'principal_view_content';
botonPrincipal.className = 'custom-button';
botonPrincipal.style.display = 'none';
botonPrincipal.innerHTML = `
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-right: 4px;">
    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  Back
`;

// Insertar al inicio del sub-container
subContainer.insertBefore(botonPrincipal, subContainer.firstChild);
  
  // Crear el elemento ai_section
  const aiSection = document.createElement('div');
  aiSection.id = 'ai_section';
  aiSection.className = 'form-container';
  aiSection.style.display = 'none';
  
  // Crear el panel
  aiSection.innerHTML = `
    <style>
       
      #ai_section {
  display: flex;
  align-items: center;
  justify-content: center;
}
      
      #ai_chat_panel {
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 2px 12px rgba(124, 85, 230, 0.1);
        max-width: 600px;
        width: 100%;
      }
      
      #ai_header {
        text-align: center;
        margin-bottom: 24px;
        transition: all 0.3s ease;
      }
      
      #ai_header.hidden {
        display: none;
      }
      
      #ai_title {
        font-size: 20px;
        font-weight: 600;
        color: #333;
        margin: 0 0 8px 0;
      }
      
      #ai_description {
        font-size: 14px;
        color: rgb(40,40,40);
        margin: 0;
      }
      
      #ai_current_prompt {
  display: none;
  font-family: "Open Sans",sans-serif;
  background: transparent;
  border-radius: 12px;
  border: 1px solid #7c55e6;
  margin-bottom: 20px;
  color: white;
  font-size: 15px;
  box-shadow: 0 4px 12px rgba(124, 85, 230, 0.2);
  user-select: text;
  -webkit-user-select: text;
}

#ai_prompt_content {
  padding: 12px 16px;
  color: #000000;
  word-wrap: break-word;
  white-space: pre-wrap;
}

#ai_current_prompt::-webkit-scrollbar {
  width: 8px;
}

#ai_current_prompt::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

#ai_current_prompt::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

#ai_current_prompt::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
      
      #ai_current_prompt.visible {
        display: block;
      }
      
      #ai_input_container {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        background: #f8f8f8;
        border: 2px solid #e0e0e0;
        border-radius: 12px;
        padding: 10px 14px;
        transition: all 0.2s;
      }
      
      #ai_input_container:focus-within {
        border-color: #7c55e6;
        background: white;
        box-shadow: 0 0 0 3px rgba(124, 85, 230, 0.1);
      }
      
      #ai_prompt_input {
        flex: 1;
        border: none;
        background: transparent;
        outline: none;
        font-size: 14px;
        font-family: inherit;
        resize: none;
        max-height: 96px;
        min-height: 24px;
        line-height: 24px;
        overflow-y: auto;
      }
      
      #ai_prompt_input::placeholder {
        color: #999;
      }
      
      #ai_prompt_input::-webkit-scrollbar {
        width: 6px;
      }
      
      #ai_prompt_input::-webkit-scrollbar-thumb {
        background: #d0d0d0;
        border-radius: 3px;
      }
      
      #ai_send_btn {
        width: 36px;
        height: 36px;
        border: none;
        background: #7c55e6;
        cursor: pointer;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        padding: 0;
        flex-shrink: 0;
      }
      
      #ai_send_btn:hover {
        background: #6941d4;
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(124, 85, 230, 0.3);
      }
      
      #ai_send_btn:active {
        transform: scale(0.98);
      }
      
      #ai_send_btn svg {
        width: 20px;
        height: 20px;
        fill: white;
      }
      
      #ai_send_btn:disabled {
        background: #d0d0d0;
        cursor: not-allowed;
        transform: none;
      }
    </style>
    
    <div id="ai_chat_panel">
      <div id="ai_header">
        <h3 id="ai_title">Save many minutes of video editing time.</h3>
        <p id="ai_description">The written instructions will edit the source video.</p>
      </div>
      
      <div id="ai_current_prompt">
  <div id="ai_prompt_content"></div>
</div>
      
      <div id="ai_input_container">
        <textarea 
          id="ai_prompt_input" 
          placeholder="Type your instructions..."
          rows="1"
        ></textarea>
        
        <button id="ai_send_btn">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  
  // Insertar ai_section al final del sub-container
  subContainer.appendChild(aiSection);
  
  console.log('Botón de IA y sección insertados correctamente');
}



function procesarRespuestaPrompt(estado) {
  const input = document.getElementById('ai_prompt_input');
  const sendBtn = document.getElementById('ai_send_btn');
  const currentPromptDiv = document.getElementById('ai_current_prompt');
  const feedbackMsg = document.getElementById('ai_feedback_message');
  
  // Remover mensaje de loading del prompt
  const promptContent = currentPromptDiv?.querySelector('#ai_prompt_content');
  
  // Remover mensaje de feedback anterior si existe
  if (feedbackMsg) {
    feedbackMsg.remove();
  }
  
  // Reactivar botón de envío
  if (sendBtn) {
    sendBtn.disabled = false;
    sendBtn.style.opacity = '1';
  }
  
  if (estado === 'completo') {
    console.log('Prompt válido - mostrando en pantalla');
    
    // Mostrar el prompt en pantalla
    if (promptContent) {
      promptContent.textContent = prompt_actual;
    }
    if (currentPromptDiv) {
      currentPromptDiv.classList.add('visible');
    }
    
    // Crear mensaje de éxito PERMANENTE
    const mensajeExito = document.createElement('div');
    mensajeExito.id = 'ai_feedback_message';
    mensajeExito.style.cssText = `
      background: #4caf50;
      color: white;
      padding: 10px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 13px;
      text-align: center;
    `;
    mensajeExito.textContent = 'Instruction saved, press "render video" to continue';
    
    // Insertar después del prompt actual
    const chatPanel = document.getElementById('ai_chat_panel');
    const inputContainer = document.getElementById('ai_input_container');
    if (chatPanel && inputContainer) {
      chatPanel.insertBefore(mensajeExito, inputContainer);
    }
    
  } else if (estado === 'error') {
    console.log('Prompt inválido - mostrando error');
    
    // Ocultar el prompt
    if (currentPromptDiv) {
      currentPromptDiv.classList.remove('visible');
    }
    
    // Crear mensaje de error PERMANENTE
    const mensajeError = document.createElement('div');
    mensajeError.id = 'ai_feedback_message';
    mensajeError.style.cssText = `
      background: #f44336;
      color: white;
      padding: 10px 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 13px;
      text-align: center;
    `;
    mensajeError.textContent = 'Enter an instruction related to editing the subtitles';
    
    // Insertar antes del input
    const chatPanel = document.getElementById('ai_chat_panel');
    const inputContainer = document.getElementById('ai_input_container');
    if (chatPanel && inputContainer) {
      chatPanel.insertBefore(mensajeError, inputContainer);
    }
    
    // Restaurar el input con el prompt original para que el usuario pueda editarlo
    if (input) {
      input.value = prompt_actual;
      input.style.height = '24px';
      input.style.height = Math.min(input.scrollHeight, 96) + 'px';
    }
  }
  
  console.log('Procesamiento de respuesta completado:', estado);
}



let videoMP4BlobGlobal;
// Event delegation global
document.addEventListener('click', function(e) {

  if (e.target.closest('#exportDropdown-mp4')) { 
  	abrirModalDinamicoSimple(html_finish);
        renderPendientes(progress_visible_names); 
	show_percent_export(10);
  }
  if (e.target.closest('#update_video')) { 
  	 

  }
  if (e.target.closest('.close-export-btn')) { 
  	closeModalDinamico();
  }
   

  // Botón de envío 
  if (e.target.closest('#tutorial_button')) {
	websocketClient.send("tutorial_presionado");
  }
if (e.target.closest('#ai_send_btn')) {
	console.log("URL MP4 000000");
convertirWebMtoMP4(videoPreviewBlob).then(result => {
    const videoMP4Blob = result.blob;
    const mp4Url = result.url;

    console.log("URL MP4:", mp4Url);
    videoMP4BlobGlobal = videoMP4Blob; 
});
  console.log('Click en send button');
  const input = document.getElementById('ai_prompt_input');
  const header = document.getElementById('ai_header');
  const currentPromptDiv = document.getElementById('ai_current_prompt');
  const sendBtn = e.target.closest('#ai_send_btn');
  
  if (!input) return;
  
  const text = input.value.trim();
  if (text) {
    console.log('Enviando prompt:', text);
    websocketClient.send("ai_presionado:" + text);
    
    // Actualizar prompt actual
    prompt_actual = text;
    
    // Ocultar header si es el primer envío
    if (header && !header.classList.contains('hidden')) {
      header.classList.add('hidden');
      console.log('Header ocultado');
    }
    
    // Mostrar "Loading..." en lugar del prompt
    if (currentPromptDiv) {
      const promptContent = currentPromptDiv.querySelector('#ai_prompt_content');
      if (promptContent) {
        promptContent.textContent = 'Loading...';
      }
      currentPromptDiv.classList.add('visible');
    }
    
    // Desactivar botón de envío
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.style.opacity = '0.5';
    }
    
    // Limpiar input
    input.value = '';
    input.style.height = '24px';
    
    // Enviar a AI 
    const ai_feedback_message = document.getElementById('ai_feedback_message');
    if (ai_feedback_message){
	ai_feedback_message.style.display = "none";
    }
    send_to_ai(text);
    
  } else {
    console.log('Input vacío, no se envía');
  }
}
  if (e.target.closest('#ai_option')) {
	mostrarVistaAI();
  }
  if (e.target.closest('#principal_view_content')) {
     	mostrarVistaPrincipal();
  }
});

// Input event para auto-resize
document.addEventListener('input', function(e) {
  if (e.target.matches('#ai_prompt_input')) {
    console.log('Input en textarea');
    e.target.style.height = '24px';
    const newHeight = Math.min(e.target.scrollHeight, 96);
    e.target.style.height = newHeight + 'px';
    console.log('Textarea resized:', newHeight);
  }
});

// Keydown para Enter
document.addEventListener('keydown', function(e) {
  if (e.target.matches('#ai_prompt_input')) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const sendBtn = document.getElementById('ai_send_btn');
      if (sendBtn) {
        sendBtn.click();
        console.log('Enter presionado - enviando');
      }
    }
  }
});

// Llamar la función
insertarBotonIA();








function mostrarVistaAI() {
  console.log('Mostrando vista AI');
  
  // Mostrar
  const botonPrincipal = document.getElementById('principal_view_content');
  const aiSection = document.getElementById('ai_section');
  if (botonPrincipal) botonPrincipal.style.display = '';
  if (aiSection) aiSection.style.display = '';
  
  // Ocultar
  const editButton = document.getElementById('editButton');
  const saveButton = document.getElementById('saveButton');
  const dropdown = document.querySelector('.dropdown');
  const aiOption = document.getElementById('ai_option');
  const formContainer = document.getElementById('form-container');
  
  if (editButton) editButton.style.display = 'none';
  if (saveButton) saveButton.style.display = 'none';
  if (dropdown) dropdown.style.display = 'none';
  if (aiOption) aiOption.style.display = 'none';
  if (formContainer) formContainer.style.display = 'none';
  
  console.log('Vista AI mostrada');
}

function mostrarVistaPrincipal() {
  console.log('Mostrando vista principal');
  
  // Ocultar
  const botonPrincipal = document.getElementById('principal_view_content');
  const aiSection = document.getElementById('ai_section');
  if (botonPrincipal) botonPrincipal.style.display = 'none';
  if (aiSection) aiSection.style.display = 'none';
  
  // Mostrar 
  const saveButton = document.getElementById('saveButton');
  const dropdown = document.querySelector('.dropdown');
  const aiOption = document.getElementById('ai_option');
  const formContainer = document.getElementById('form-container');
   
  if (saveButton) saveButton.style.display = '';
  if (dropdown) dropdown.style.display = '';
  if (aiOption) aiOption.style.display = '';
  if (formContainer) formContainer.style.display = '';
  
  console.log('Vista principal mostrada');
  reajustarTextareas();
}


const miStringJSON = '[{"indice_original":4,"color_hex":"FF0000","intensidad_resplandor":"normal","size_preset":"normal","incremento_delta":0},{"indice_original":8,"color_hex":"FF0000","intensidad_resplandor":"normal","size_preset":"normal","incremento_delta":0}]';



function jsonToCustomString(jsonString) {
  if (typeof jsonString !== "string") {
    throw new Error("El input debe ser un string JSON");
  }

  const data = JSON.parse(jsonString);

  if (!Array.isArray(data)) {
    throw new Error("El JSON debe representar un array de objetos");
  }

  return data
    .map(obj => {
      return Object.entries(obj)
        .map(([key, value]) => `${key}:${value}`)
        .join("%element%");
    })
    .join("%json%");
}
 
function reajustarTextareas() {
  const textareas = document.querySelectorAll(".flexible-captions");

  textareas.forEach(textarea => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  });
}

 

function abrirModalDinamicoSimple(htmlString) { 
  const box = document.getElementById('modal_box_dinamico');
  box.innerHTML = htmlString; 
  document.getElementById('modal_overlay_dinamico').style.display = 'flex'; 
} 


const uploaded_names = [];       // archivos totalmente subidos (keys de visible_names)
const progress_visible_names = {};

function renderPendientes(diccionario) {
  const ul = document.getElementById("pendientes_de_subir");
  if (!ul){return;}	
  ul.style.display="block";
  // opcional: limpiar antes
  ul.innerHTML = "";

  const export_btn = document.getElementById("update_video");
  if (export_btn){
	export_btn.style.display="none";
  }
  if (Object.keys(diccionario).length == uploaded_names.length){
	ocultarPendientesYErrores();
	const export_btn = document.getElementById("update_video");
  	if (export_btn){
		export_btn.style.display="block";
  	}
  }		

  Object.keys(diccionario).forEach(key => {
    const value = diccionario[key]; // siempre string
    if (key!=value){	 
	console.log("key:",key,", value:",value);

    	const li = document.createElement("li");
    	li.textContent = value;
    	li.style.padding = "6px 4px";
    	li.style.borderBottom = "1px solid rgba(255,255,255,0.15)";

    	ul.appendChild(li);
    }	
  }); 
}

function ocultarPendientesYErrores() {
  const ids = ["error_subidas_pendientes", "pendientes_de_subir"];

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = "none";
    }
  });
  const export_btn = document.getElementById("update_video");
  if (export_btn){
	export_btn.style.display="block";
  }
}

function closeModalDinamico() { 
  document.getElementById('modal_overlay_dinamico').style.display = 'none';  	 
}




// Variables globales
let ready_to_download = false;
let progress_export = 0;

function check_last_video() {
    // Solo mostrar botón si está listo para descargar 
    if (!ready_to_download) {
        return;
    } 
    show_download_button();
}

function show_download_button() {
    const placeholder = document.querySelector('.video-preview-placeholder');
    if (placeholder) {
        placeholder.innerHTML = `
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <button class="btn-download" id="download_last_video">
                Download Video
            </button>
        `;
        
        // Agregar clase para estilos especiales
        placeholder.classList.add('has-video');
    }

    // Mostrar botón de render nuevamente
    const renderBtn = document.getElementById('update_video');
    if (renderBtn) {
        renderBtn.style.display = 'flex';
    }

    // Ocultar indicador de progreso si existe
    const progressIndicator = document.getElementById('export_progress');
    if (progressIndicator) {
        progressIndicator.style.display = 'none';
    }
}
function show_percent_export(total_progress) {
    // Incrementar progreso
    progress_export++;

    // Calcular porcentaje
    const percentage = Math.round((progress_export / total_progress) * 100);

    // Obtener o crear el contenedor de progreso
    let progressContainer = document.getElementById('export_progress');
    const renderBtn = document.getElementById('update_video');

    if (!progressContainer) {
        // Crear contenedor de progreso si no existe
        progressContainer = document.createElement('div');
        progressContainer.id = 'export_progress';
        progressContainer.className = 'export-progress-container';
	progressContainer.style.color = "#000000";

        
        // Insertar después del botón de render
        if (renderBtn && renderBtn.parentNode) {
            renderBtn.parentNode.insertBefore(progressContainer, renderBtn.nextSibling);
        }
    }

    // Ocultar botón de render
    if (renderBtn) {
        renderBtn.style.display = 'none';
    }

    // Mostrar contenedor de progreso
    progressContainer.style.display = 'flex';

    // Actualizar contenido del progreso
    progressContainer.innerHTML = ` 
      <div class="progress-info">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinner">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <span class="progress-text">Exporting video...</span>
            <span class="progress-percentage">${percentage}%</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%"></div>
        </div> 
    `;

    // Si llegamos al 100%, preparar para mostrar el botón de descarga
/*
    if (percentage >= 100) {
        setTimeout(() => {
            ready_to_download = true;
            show_download_button();
        }, 500);
    }
*/
}

const html_finish = `
<div class="export-container">
    <button id="close-export-modal" class="close-export-btn" aria-label="Close">
    ×
</button>
    <h2 class="export-title">Export Video</h2>
    
    <div id="error_subidas_pendientes" class="alert-error">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="min-width:20px;">
            <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" fill="currentColor"/>
        </svg>
        <span>There are still files that have not finished uploading.</span>
    </div>
    
    <div class="pending-files-section">
        <ul id="pendientes_de_subir" class="pending-files-list"></ul>
        
        <button class="btn-render" id="update_video"> 
            New Export
        </button>
    </div>
    
    <div class="last-video-section">
        <h3 class="section-subtitle">Last Video</h3>
        <div class="video-preview-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                <line x1="7" y1="2" x2="7" y2="22"></line>
                <line x1="17" y1="2" x2="17" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <line x1="2" y1="7" x2="7" y2="7"></line>
                <line x1="2" y1="17" x2="7" y2="17"></line>
                <line x1="17" y1="17" x2="22" y2="17"></line>
                <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>
            <p style="font-size:16px;">Your exported video will appear here</p>
        </div>
    </div>
</div>

<style>
.export-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px;
    /*background: rgba(255, 255, 255, 0.02);*/
    background: rgb(243, 245, 247);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    max-width: 480px;
    margin: 0 auto;
}

.export-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    color: rgba(0, 0, 0, 0.8);
    text-align: center;
    letter-spacing: -0.5px;
}

.alert-error {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.08));
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 12px;
    color: #fca5a5;
    font-size: 14px;
    line-height: 1.5;
    backdrop-filter: blur(8px);
}

.pending-files-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.pending-files-list {
    width: 100%;
    max-height: 160px;
    overflow-y: auto;
    margin: 0;
    padding: 16px;
    list-style: none;
    border-radius: 12px;
    border: 1px solid rgba(124, 85, 230, 0.15);
    background: rgba(124, 85, 230, 0.05);
    backdrop-filter: blur(8px);
}

.pending-files-list::-webkit-scrollbar {
    width: 6px;
}

.pending-files-list::-webkit-scrollbar-track {
    background: rgba(124, 85, 230, 0.08);
    border-radius: 3px;
}

.pending-files-list::-webkit-scrollbar-thumb {
    background: rgba(124, 85, 230, 0.3);
    border-radius: 3px;
}

.pending-files-list::-webkit-scrollbar-thumb:hover {
    background: rgba(124, 85, 230, 0.5);
}

.pending-files-list li {
    padding: 8px 0;
    color: rgba(255, 255, 255, 0.7);
    font-size: 14px;
    border-bottom: 1px solid rgba(124, 85, 230, 0.1);
}

.pending-files-list li:last-child {
    border-bottom: none;
}

.btn-render {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 14px 20px;
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
    border-radius: 12px;
    border: 1px solid rgba(124, 85, 230, 0.4);
    background: linear-gradient(
        135deg,
        rgba(124, 85, 230, 0.8) 0%,
        rgba(109, 70, 210, 0.9) 100%
    );
    box-shadow: 0 4px 12px rgba(124, 85, 230, 0.2);
    cursor: pointer;
    transition: all 0.3s ease;
    appearance: none;
}

.btn-render:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 85, 230, 0.3);
    background: linear-gradient(
        135deg,
        rgba(124, 85, 230, 0.9) 0%,
        rgba(109, 70, 210, 1) 100%
    );
}

.btn-render:active {
    transform: translateY(0);
}

.last-video-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.section-subtitle {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: rgba(0, 0, 0, 0.8);
}

.video-preview-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 15px 20px;
    border-radius: 12px;
    border: 2px dashed rgba(124, 85, 230, 0.25);
    background: rgba(124, 85, 230, 0.05);
    color: rgba(0, 0, 0, 0.7);
    text-align: center;
    min-height: 140px;
}

.video-preview-placeholder p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
}

.btn-download {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 24px;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    border-radius: 10px;
    border: 1px solid rgba(124, 85, 230, 0.4);
    background: linear-gradient(
        135deg,
        rgba(124, 85, 230, 0.8) 0%,
        rgba(109, 70, 210, 0.9) 100%
    );
    box-shadow: 0 4px 12px rgba(124, 85, 230, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
    appearance: none;
}

.btn-download:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(124, 85, 230, 0.4);
    background: linear-gradient(
        135deg,
        rgba(124, 85, 230, 0.9) 0%,
        rgba(109, 70, 210, 1) 100%
    );
}

.btn-download:active {
    transform: translateY(0);
}

.video-preview-placeholder.has-video {
    border-style: solid;
    border-color: rgba(124, 85, 230, 0.3);
    background: rgba(124, 85, 230, 0.05);
}



.export-container {
    position: relative; /* necesario para posicionar el botón */
}

.close-export-btn {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background-color: rgb(210,210,210);
    color: #000000;
    font-size: 25px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.close-export-btn:hover {
    background-color: #cfcfcf;
}

.close-export-btn:active {
    transform: scale(0.95);
}

</style>
`;






 


