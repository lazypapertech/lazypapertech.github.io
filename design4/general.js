

  function watch() {
    current_step = 2;
    type_download = 1;
    bad_connection_choose_file = 0; 
    const videoElement = document.getElementById("my-video-2");
    videoPreviewBlob = new Blob([globalBuffer], { type: type_video });
    videoElement.src = URL.createObjectURL(videoPreviewBlob);
    globalBuffer = new Uint8Array(0);
  }


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
        frameIndex = 0;
        globalBuffer = new Uint8Array(0);
        ocultarBarras();
        n_seg = 0;
        show_step_1_2(captions_video, interval);
      }, 4000);
    });
  
    const paragraph = document.createElement("p");
    paragraph.textContent = "Press Cancel if the task freezes.";
  
    container.appendChild(button);
    container.appendChild(paragraph);
  
    const videoPreviewDiv = document.getElementById("stepPreviewContent");
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




function generarBarras(datos) {
    const loader = document.getElementById("stepPreviewContent");

 
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
      if (color=="#0000FF"){
      	barra.style.width = porcentaje + "%"; 
      }else{	
      	barra.style.width = "100%";//duracion indefinida
      }	
      barra.style.backgroundColor = color;
      barra.style.color = "white";

      // 🔹 Centrado vertical del texto
      barra.style.display = "flex";        // convierte la barra en flex container
      barra.style.textAlign = "center";
      barra.style.alignItems = "center";   // centra verticalmente
      barra.style.justifyContent = "center"; // opcional, alinea el texto a la izquierda 
      //barra.style.padding="2px";  

      if (color=="#0000FF"){
      	barra.textContent = Math.round(porcentaje) + "%";
      }else{
      	barra.textContent = "Rendering...";	
      }
  
      barraCont.appendChild(barra);
      contenedor.appendChild(barraCont);
    });
  
    loader.appendChild(contenedor);
  
    loader.style.display = "block";
  }

 

  
  function ocultarBarras() {
    const loader = document.getElementById("stepPreviewContent");
    if (loader) {
      const existente = document.getElementById("barras");
      if (existente) {
        loader.removeChild(existente);
      }
    }
  }











  let video_file;
    
 
  
  let current_video_width = 1280;
  let current_video_height = 720;
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
  let video_tag = "webm";
  
 
  
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
console.log("✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ closing loading");
    if (loadingAnimId) {
      cancelAnimationFrame(loadingAnimId);
      loadingAnimId = null;
      resizeCanvas();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  

 
  const canvas = document.getElementById("liveCanvas");
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  console.log("dpr principal: ", dpr);
  ctx.scale(dpr, dpr);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  if (canvas) {
 
/*
show_stepPreview();
const current_load = [
        [5, 10, "#0000FF"],
      ];
      generarBarras(current_load);
*/
 
 
    try {
      canvas.addEventListener("contextmenu", (event) => {
        event.preventDefault();
      });
    } catch (error) {
      console.log("error:", error);
    }
  }
  
  window.addEventListener("resize", resizeCanvas);
  
   
  
  function adapt_frame_to_canvas(
    frame,
    canvasWidth,
    canvasHeight,
    frameWidth,
    frameHeight
  ) {
    const dpr = window.devicePixelRatio || 1;
    console.log("dpr adapt: ", dpr);
    const tempCanvas = document.createElement("canvas");
  
    tempCanvas.width = canvasWidth * dpr;
    tempCanvas.height = canvasHeight * dpr;
  
    tempCanvas.style.width = canvasWidth + "px";
    tempCanvas.style.height = canvasHeight + "px";
  
    const ctx = tempCanvas.getContext("2d",{ alpha: true });
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
  
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
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




/*
const fotogramas_guardados = [];
 

function asegurarPendientesHasta(indiceFinal) {
  while (fotogramas_guardados.length < indiceFinal) {
    fotogramas_guardados.push("pendiente");
  }
} 


function decodeFrames(encodedFrames, fps) {
  return new Promise(async (resolve, reject) => {
    const rawFrames = [];

    let timestamp = 0;
    const frameDuration = 1e6 / fps;

    const decoder = new VideoDecoder({
      output: (videoFrame) => {
        rawFrames.push(videoFrame);
      },
      error: (e) => reject(e),
    });

    decoder.configure({ codec: "vp8" });

    for (let i = 0; i < encodedFrames.length; i++) {
      const chunk = new EncodedVideoChunk({
        type: i === 0 ? "key" : "delta",
        timestamp,
        data: encodedFrames[i],
      });

      decoder.decode(chunk);
      timestamp += frameDuration;
    }

    await decoder.flush();
    decoder.close();

    resolve(rawFrames); // 👈 aquí se resuelve
  });
}
*/



const PENDIENTE = Symbol("pendiente");

const fotogramas_guardados = []; // VideoFrame | PENDIENTE


function decodeFrames_0(encodedFrames, fps) {
  return new Promise(async (resolve, reject) => {
    const rawFrames = [];

    let timestamp = 0;
    const frameDuration = 1e6 / fps;

    const decoder = new VideoDecoder({
      output: (videoFrame) => {
        rawFrames.push(videoFrame);
      },
      error: reject,
    });

    decoder.configure({ codec: "vp8" });

    for (let i = 0; i < encodedFrames.length; i++) {
/*
      decoder.decode(new EncodedVideoChunk({
        type: i === 0 ? "key" : "delta",
        timestamp,
        data: encodedFrames[i],
      }));
*/
      // En lugar de asumir que el primero es key
decoder.decode(new EncodedVideoChunk({
  type: determinarTipoFrame(encodedFrames[i], i === 0),
  timestamp,
  data: encodedFrames[i],
}));

      timestamp += frameDuration;
    }

    await decoder.flush();
    decoder.close();

    resolve(rawFrames);
  });
}


// Usar un solo decoder con cola
let decoderGlobal = null;
let colaDecoding = [];
let decodificando = false;

async function inicializarDecoder_0() {
  if (decoderGlobal) return;
  
  decoderGlobal = new VideoDecoder({
    output: (videoFrame) => {
      const info = colaDecoding.shift();
      if (info) {
        info.frames.push(videoFrame);
        if (info.frames.length === info.total) {
          info.resolve(info.frames);
        }
      }
    },
    error: (error) => {
      console.error("Error decoder:", error);
      const info = colaDecoding.shift();
      if (info) info.reject(error);
    },
  });
  
  try {
    decoderGlobal.configure({ codec: "vp8" });
    console.log("Decoder inicializado correctamente");
  } catch (error) {
    console.error("Error configurando decoder:", error);
    decoderGlobal = null;
    throw error;
  }
}

function decodeFrames_00(encodedFrames, fps) {
  return new Promise(async (resolve, reject) => {
    try {
      await inicializarDecoder();
      
      const info = {
        frames: [],
        total: encodedFrames.length,
        resolve,
        reject
      };
      
      let timestamp = 0;
      const frameDuration = 1e6 / fps;
      
      for (let i = 0; i < encodedFrames.length; i++) {
        colaDecoding.push(info);
        
        decoderGlobal.decode(new EncodedVideoChunk({
          type: i === 0 ? "key" : "delta",
          timestamp,
          data: encodedFrames[i],
        }));
        
        timestamp += frameDuration;
      }
      
    } catch (error) {
      console.error("Error en decodeFrames:", error);
      reject(error);
    }
  });
}




function setFrameSeguro_0(indice, frame) {
  const anterior = fotogramas_guardados[indice];

  if (anterior instanceof VideoFrame) {
    anterior.close();
  }

  fotogramas_guardados[indice] = frame;
}



 

function determinarTipoFrame(data, esPrimero) {
  // VP8 keyframe tiene signature específica
  if (data.length > 3) {
    const firstByte = data[0];
    const isKeyframe = (firstByte & 0x01) === 0;
    return isKeyframe ? "key" : "delta";
  }
  return esPrimero ? "key" : "delta";
}


window.onerror = function(msg, url, line, col, error) {
  console.error('Error global:', msg, error);
  alert('ERROR: ' + msg); // Para ver en pantalla
};

window.addEventListener('unhandledrejection', function(event) {
  console.error('Promise rechazada:', event.reason);
  alert('Promise ERROR: ' + event.reason);
});











function decodeFrames_1(encodedFrames, fps) {
  return new Promise(async (resolve, reject) => {
    const rawFrames = [];
    let timestamp = 0;
    const frameDuration = 1e6 / fps;
    let processedCount = 0;
    const totalFrames = encodedFrames.length;
    
    const decoder = new VideoDecoder({
      output: async (videoFrame) => {
        try {
          // Convertir a ImageBitmap para poder cerrar el VideoFrame
          const bitmap = await createImageBitmap(videoFrame);
          rawFrames.push(bitmap);
          processedCount++;
          
          console.log(`Frame ${processedCount}/${totalFrames} procesado`);
          
          // Resolver cuando tengamos todos
          if (processedCount === totalFrames) {
            decoder.close();
            resolve(rawFrames);
          }
        } catch (err) {
          console.error("Error procesando frame:", err);
          reject(err);
        } finally {
          videoFrame.close(); // ✅ CRÍTICO - Cerrar siempre
        }
      },
      error: (e) => {
        console.error("Decoder error:", e);
        try {
          decoder.reset();
          decoder.configure({ codec: "vp8" });
        } catch (err) {
          console.error("Failed to reset decoder:", err);
        }
        reject(e);
      },
    });
    
    try {
      decoder.configure({ codec: "vp8" });
      
      console.log(`Decodificando ${totalFrames} frames a ${fps} fps`);
      
      for (let i = 0; i < encodedFrames.length; i++) {
        decoder.decode(new EncodedVideoChunk({
          type: i === 0 ? "key" : "delta",
          timestamp,
          data: encodedFrames[i],
        }));
        timestamp += frameDuration;
      }
      
      await decoder.flush();
      
    } catch (error) {
      console.error("Error configurando decoder:", error);
      try {
        decoder.close();
      } catch (e) {}
      reject(error);
    }
  });
}

function decodeFrames_muy_bien(encodedFrames, fps) {
  return new Promise(async (resolve, reject) => {
    const rawFrames = [];
    let timestamp = 0;
    const frameDuration = 1e6 / fps;
    let processedCount = 0;
    const totalFrames = encodedFrames.length;
    let decoderCerrado = false;
    
    const decoder = new VideoDecoder({
      output: async (videoFrame) => {
        try {
          const bitmap = await createImageBitmap(videoFrame);
          rawFrames.push(bitmap);
          processedCount++;
          
          console.log(`Frame ${processedCount}/${totalFrames} procesado`);
        } catch (err) {
          console.error("Error procesando frame:", err);
        } finally {
          videoFrame.close();
        }
      },
      error: (e) => {
        console.error("Decoder error:", e);
        if (!decoderCerrado) {
          cerrarDecoder();
        }
        reject(e);
      },
    });
    
    function cerrarDecoder() {
      if (!decoderCerrado) {
        try {
          decoder.close();
          decoderCerrado = true;
        } catch (e) {
          console.log("Decoder ya estaba cerrado");
        }
      }
    }
    
    try {
      decoder.configure({ codec: "vp8" });
      
      console.log(`Decodificando ${totalFrames} frames a ${fps} fps`);
      
      for (let i = 0; i < encodedFrames.length; i++) {
        decoder.decode(new EncodedVideoChunk({
          type: i === 0 ? "key" : "delta",
          timestamp,
          data: encodedFrames[i],
        }));
        timestamp += frameDuration;
      }
      
      await decoder.flush();
      cerrarDecoder();
      resolve(rawFrames);
      
    } catch (error) {
      console.error("Error en decoder:", error);
      cerrarDecoder();
      reject(error);
    }
  });
}

function decodeFrames(encodedFrames, fps) {
  return new Promise(async (resolve, reject) => {
    const rawFrames = [];
    const bitmapPromises = []; // ✅ Guardar las promesas
    let timestamp = 0;
    const frameDuration = 1e6 / fps;
    let processedCount = 0;
    const totalFrames = encodedFrames.length;
    let decoderCerrado = false;
    
    const decoder = new VideoDecoder({
      output: (videoFrame) => {
        try {
          // ✅ Guardar la promesa del bitmap
          const bitmapPromise = createImageBitmap(videoFrame)
            .then(bitmap => {
              rawFrames[processedCount] = bitmap; // Guardar en posición correcta
              processedCount++;
              console.log(`Frame ${processedCount}/${totalFrames} procesado`);
              return bitmap;
            })
            .catch(err => {
              console.error("Error procesando frame:", err);
              throw err;
            })
            .finally(() => {
              videoFrame.close();
            });
          
          bitmapPromises.push(bitmapPromise);
          
        } catch (err) {
          console.error("Error en output:", err);
          videoFrame.close();
        }
      },
      error: (e) => {
        console.error("Decoder error:", e);
        if (!decoderCerrado) {
          cerrarDecoder();
        }
        reject(e);
      },
    });
    
    function cerrarDecoder() {
      if (!decoderCerrado) {
        try {
          decoder.close();
          decoderCerrado = true;
        } catch (e) {
          console.log("Decoder ya estaba cerrado");
        }
      }
    }
    
    try {
      decoder.configure({ codec: "vp8" });
      
      console.log(`Decodificando ${totalFrames} frames a ${fps} fps`);
      
      for (let i = 0; i < encodedFrames.length; i++) {
        decoder.decode(new EncodedVideoChunk({
          type: i === 0 ? "key" : "delta",
          timestamp,
          data: encodedFrames[i],
        }));
        timestamp += frameDuration;
      }
      
      await decoder.flush();
      
      // ✅ ESPERAR a que TODOS los ImageBitmap estén listos
      await Promise.all(bitmapPromises);
      
      cerrarDecoder();
      
      console.log(`Todos los ${rawFrames.length} frames listos para usar`);
      resolve(rawFrames);
      
    } catch (error) {
      console.error("Error en decoder:", error);
      cerrarDecoder();
      reject(error);
    }
  });
}


function setFrameSeguro(indice, frame) {
  const anterior = fotogramas_guardados[indice];
  
  // Cerrar el anterior si existe (ImageBitmap tiene .close())
  if (anterior && typeof anterior.close === 'function' && anterior !== PENDIENTE) {
    anterior.close();
  }
  
  fotogramas_guardados[indice] = frame;
}

// Para usar los frames:
function renderFrame(indice, canvas) {
  const frame = fotogramas_guardados[indice];
  
  if (frame === PENDIENTE || !frame) {
    console.log("Frame no disponible:", indice);
    return;
  }
  
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
}

// Limpiar todo cuando termines
function limpiarTodosLosFrames() {
  fotogramas_guardados.forEach((frame, indice) => {
    if (frame && typeof frame.close === 'function' && frame !== PENDIENTE) {
      frame.close();
    }
  });
  fotogramas_guardados.length = 0;
  console.log("Todos los frames limpiados");
} 
