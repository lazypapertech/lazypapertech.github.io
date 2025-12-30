// =====================
// Gestión de archivos
// =====================
const uniqueFiles = [];          // identificadores únicos (name-size-lastModified) files seleccionados (no subidos)
const visible_names = {};        // { "displayName.ext": "fileIdentifier" }
const nameCounters = {};         // contador por baseName
const uploaded_names = [];       // archivos totalmente subidos (keys de visible_names)
const progress_visible_names = {};
 

 
// =====================
// Manejo de selección de archivos
// =====================
function handleFileUpload_mal(event) {
  const files = event.target.files;

  for (const file of files) {
    const fileIdentifier = `${file.name}-${file.size}-${file.lastModified}`;
    if (uniqueFiles.includes(fileIdentifier)){
	console.log(`⚠️ Archivo duplicado, ya subido: ${file.name}`);
	continue;
    }
    uniqueFiles.push(fileIdentifier);

    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const extension = file.name.match(/\.[^/.]+$/)?.[0] || "";

    if (!nameCounters[baseName]) nameCounters[baseName] = 1;

    let displayName = baseName;
    if (nameCounters[baseName] > 1) {
      displayName = `${baseName}(${nameCounters[baseName]})`;
    }
    displayName += extension;

    visible_names[displayName] = fileIdentifier;
    nameCounters[baseName]++;
    progress_visible_names[displayName] = displayName;	
  }

   

  // Prepara la cola de subidas en orden
  uploadQueue.push(...files);
// Limpia el input file para evitar que se vuelvan a cargar los mismos archivos
  event.target.value = "";
 
  processNextUpload();
}



function handleFileUpload(event) {
  const files = event.target.files;
  const filesToUpload = []; // Solo archivos que no sean duplicados

  for (const file of files) {
    const fileIdentifier = `${file.name}-${file.size}-${file.lastModified}`;

    if (uniqueFiles.includes(fileIdentifier)) {
      console.log(`⚠️ Archivo duplicado, ya subido: ${file.name}`);
      continue; // No agregar ni a visible_names ni a filesToUpload
    }

    uniqueFiles.push(fileIdentifier);

    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const extension = file.name.match(/\.[^/.]+$/)?.[0] || "";

    if (!nameCounters[baseName]) nameCounters[baseName] = 1;

    let displayName = baseName;
    if (nameCounters[baseName] > 1) {
      displayName = `${baseName}(${nameCounters[baseName]})`;
    }
    displayName += extension;

    visible_names[displayName] = fileIdentifier;
    nameCounters[baseName]++;
    
    //solo se mostrara en files pendientes los que key!=valor
    const displayName_2 = displayName.replace(/(\.[^/.]+$)/, `(${0}%)$1`);
    progress_visible_names[displayName] = displayName_2;

    // Solo agregamos este archivo a la cola si no es duplicado
    filesToUpload.push(file);
  }

  // Prepara la cola de subidas en orden
  uploadQueue.push(...filesToUpload);

  // Limpia el input file
  event.target.value = "";

  processNextUpload();
}






// =====================
// Cola de subida secuencial
// =====================
const uploadQueue = [];
let isUploading = false;
let currentFile = null;

// Procesa el siguiente archivo en la cola
function processNextUpload() { 
 
  if (isUploading || uploadQueue.length === 0) return;
  currentFile = uploadQueue.shift();
  isUploading = true;
 
  sendTotalSize(currentFile); // informa el tamaño antes de enviar fragmentos
}

// =====================
// Envío de información previa
// =====================
function sendTotalSize(selectedFile) {
  const totalSize = selectedFile.size;

  // Identificador único del archivo
  const fileIdentifier = `${selectedFile.name}-${selectedFile.size}-${selectedFile.lastModified}`;

  // Buscar el nombre visible (key) que corresponde a este fileIdentifier
  const visibleKey = Object.keys(visible_names).find(
    key => visible_names[key] === fileIdentifier
  );
 
  // Enviar al servidor tanto el tamaño como el nombre visible 
const payload = {"service":"upload_file", "total_size":totalSize.toString(),"filename":visibleKey};
  websocketClient.send(JSON.stringify(payload));
console.log("✅ ",JSON.stringify(payload));
console.log("visible_names: ",visible_names);
console.log("uniqueFiles:",uniqueFiles);
}

// =====================
// Subida por fragmentos
// =====================
async function sendFile(selectedFile) {
  const totalSize = selectedFile.size;
  let chunkKB = 125;
  const maxKB = 2000;
  const stepKB = 10;

  let offset = 0;
  let n = 0;

  while (offset < totalSize) {
    let chunkSize = chunkKB * 1024;

    // Si el archivo es más pequeño que 125 KB, enviar todo de una vez
    if (totalSize < 125 * 1024) {
      chunkSize = totalSize;
    } else if (chunkSize > maxKB * 1024) {
      chunkSize = maxKB * 1024;
    }

    const end = Math.min(offset + chunkSize, totalSize);
    const chunk = selectedFile.slice(offset, end);
    offset = end;

    if (websocketClient.readyState !== WebSocket.OPEN) {
  	console.warn("Socket no está abierto, no envío chunk");
  	break; 
    }
    // Envía el fragmento
    try {	
        await enviarChunk(websocketClient, chunk);
    }catch (err) {
    	console.warn('Error al enviar chunk:', err);
    	break; 
    }
    //console.log("progress_visible_names: ",JSON.stringify(progress_visible_names));
    renderPendientes(progress_visible_names);
	 

    // Calcula porcentaje y actualiza el nombre visible
    const percent = ((offset / totalSize) * 100).toFixed(1); 
    //updateVisibleNameProgress(selectedFile.name, percent);
    const baseName = selectedFile.name.replace(/\.[^/.]+$/, "");
const extension = selectedFile.name.match(/\.[^/.]+$/)?.[0] || "";

// Busca la key correspondiente en progress_visible_names
const currentKey = Object.keys(progress_visible_names).find(k =>
  k.startsWith(baseName) && k.endsWith(extension)
);

if (currentKey) {
  // Genera el value con el porcentaje antes de la extensión, manteniendo índices
  const newValue = currentKey.replace(/(\.[^/.]+$)/, `(${percent}%)$1`);
  progress_visible_names[currentKey] = newValue;

  console.log(`📤 Progreso ${percent}%: ${newValue}`);
}




    n++;
    if (chunkKB < maxKB) {
      chunkKB += stepKB;
      if (chunkKB > maxKB) chunkKB = maxKB;
    }
  }
}

// =====================
// Actualización del nombre con porcentaje
// =====================
function updateVisibleNameProgress_mal(originalName, percent) {
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  const extension = originalName.match(/\.[^/.]+$/)?.[0] || "";

  // Buscar la key correspondiente (podría ser baseName o baseName(2), etc.)
  const currentKey = Object.keys(visible_names).find(k =>
    k.startsWith(baseName) && k.endsWith(extension)
  );
  if (!currentKey) return;

  const fileIdentifier = visible_names[currentKey];
  delete visible_names[currentKey];

  const newKey = insertPercentInName(currentKey, percent);
  visible_names[newKey] = fileIdentifier;

  console.log(`📤 Progreso ${percent}%: ${newKey}`);
} 




// Inserta "(xx%)" antes de la extensión
function insertPercentInName_mal(nameWithExt, percent) {
  return nameWithExt.replace(/(\.[^/.]+$)/, `(${percent}% )$1`).replace(" %", "%"); 
}
 



// =====================
// función para enviar fragmentos  
// =====================  
async function enviarChunk(websocket, mensaje) {
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
 

// Quita el (xx%) del nombre visible
function removeProgressFromVisibleName_mal(originalName) {
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  const extension = originalName.match(/\.[^/.]+$/)?.[0] || "";

  const currentKey = Object.keys(visible_names).find(k =>
    k.startsWith(baseName) && k.endsWith(extension)
  );
  if (!currentKey) return;

  const cleanKey = currentKey.replace(/\(\d+(\.\d+)?%\)/, "").replace(/\s+/g, "");
  const fileIdentifier = visible_names[currentKey];
  delete visible_names[currentKey];
  visible_names[cleanKey] = fileIdentifier;
}

 













// Actualiza el porcentaje para el archivo correcto
function updateVisibleNameProgress(selectedFile, percent) {
  const fileIdentifier = `${selectedFile.name}-${selectedFile.size}-${selectedFile.lastModified}`;

  // Busca el nombre visible correspondiente a este archivo
  const currentKey = Object.keys(visible_names).find(k => visible_names[k] === fileIdentifier);
  if (!currentKey) return;

  delete visible_names[currentKey];

  const newKey = insertPercentInName(currentKey, percent);
  visible_names[newKey] = fileIdentifier;

  console.log(`📤 Progreso ${percent}%: ${newKey}`);
}

// Inserta el porcentaje sin tocar el índice existente
function insertPercentInName(nameWithExt, percent) {
  const extension = nameWithExt.match(/\.[^/.]+$/)?.[0] || "";
  let nameWithoutExt = nameWithExt.replace(extension, "");

  // Quita cualquier porcentaje previo
  nameWithoutExt = nameWithoutExt.replace(/\(\d+(\.\d+)?%\)/g, "").trim();

  return `${nameWithoutExt}(${percent}%)${extension}`;
}

// Quita solo el porcentaje al terminar
function removeProgressFromVisibleName(originalName) {
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  const extension = originalName.match(/\.[^/.]+$/)?.[0] || "";

  const currentKey = Object.keys(visible_names).find(k =>
    k.startsWith(baseName) && k.endsWith(extension)
  );
  if (!currentKey) return;

  const cleanKey = currentKey.replace(/\(\d+(\.\d+)?%\)/g, "");
  const fileIdentifier = visible_names[currentKey];
  delete visible_names[currentKey];
  visible_names[cleanKey] = fileIdentifier;

  return cleanKey;
}


 
  
