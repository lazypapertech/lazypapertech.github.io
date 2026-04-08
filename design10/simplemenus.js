 
function transformList(input) {
  return input.map(sublist =>
    sublist.map(item => {
      const parts = item.video_audio_value.split(",");

      return {
        global_start: timeToSeconds(item.start),
        relative_start: timeToSeconds(parts[0]),
        duration: parseFloat(parts[1]),
        speed: parseFloat(parts[2]),
        volume: parseFloat(parts[3]),
        filename: item.start_value
      };
    })
  );
}


function filtrarSublistasPorProperty() {
    const listaDeSublistas = unica_regla.rectangulos;
    const clavesDeseadas = ['start', 'end', 'start_value', 'video_audio_value'];
    //el ultimo valor de video_audio_value no se usa
    const valorPropertyDeseado = 'filename';

    return listaDeSublistas
        .filter(sublista => sublista.length > 0 && sublista[0].property === valorPropertyDeseado && sublista[0].video_audio_value!="")
        .map(sublista => 
            sublista.map(dic => {
                const nuevoDic = {};
                for (const clave of clavesDeseadas) {
                    if (clave in dic) {
                        nuevoDic[clave] = dic[clave];
                    }
                } 
                return nuevoDic;
            })
        );
}


function transformList_all_files(input) {
  return input.map(sublist =>
    sublist.map(item => {
      const duration = diffTime(item.start, item.end).toString();
      let relative_start = item.video_audio_value.split(",")[0];
      if (item.video_audio_value==""){
	relative_start = "00:00:00";
      }				
      const parts = ["00:00:00",duration,"1","100"];

      return {
        global_start: timeToSeconds(item.start),
        relative_start: timeToSeconds(relative_start),//parts[0]
        duration: parseFloat(duration),
        speed: parseFloat(parts[2]),
        volume: parseFloat(parts[3]),
        filename: item.start_value,
	filetype: item.filetype
      };
    })
  );
}

function filtrarSublistasPorProperty_all_files() {
    const listaDeSublistas = unica_regla.rectangulos;
    const clavesDeseadas = ['start', 'end', 'start_value', 'video_audio_value','filetype'];
    //el ultimo valor de video_audio_value no se usa
    const valorPropertyDeseado = 'filename';

    return listaDeSublistas
        .filter(sublista => sublista.length > 0 && sublista[0].property === valorPropertyDeseado)
        .map(sublista => 
            sublista.map(dic => {
                const nuevoDic = {};
                for (const clave of clavesDeseadas) {
                    if (clave in dic) {
                        nuevoDic[clave] = dic[clave];
                    }
                } 
                return nuevoDic;
            })
        );
}


function filtrarSublistasPorProperty_all_files_no_audio() {
    const listaDeSublistas = unica_regla.rectangulos;
    const clavesDeseadas = ['start', 'end', 'start_value', 'video_audio_value','filetype'];
    //el ultimo valor de video_audio_value no se usa
    const valorPropertyDeseado = 'filename';

    return listaDeSublistas
        .filter(sublista => sublista.length > 0 && sublista[0].property === valorPropertyDeseado && sublista[0].filetype!="audio")
        .map(sublista => 
            sublista.map(dic => {
                const nuevoDic = {};
                for (const clave of clavesDeseadas) {
                    if (clave in dic) {
                        nuevoDic[clave] = dic[clave];
                    }
                } 
                return nuevoDic;
            })
        );
}

function filtrarSublistasPorPropertyGeneral() {
    let listaDeSublistas = unica_regla.rectangulos;
    //listaDeSublistas = agregarFiltroColorALosFilenames(listaDeSublistas);
    listaDeSublistas = agruparEmpleados(listaDeSublistas);
    const clavesDeseadas = ['start', 'end', 'filtro_color'];//filtro_color  hash
    const valorPropertyDeseado = 'filename';

    return listaDeSublistas
        .filter(sublista => sublista.length > 0 && sublista[0].property === valorPropertyDeseado && sublista[0].filetype!="audio")
        .map(sublista => 
            sublista.map(dic => {
                const nuevoDic = {};
                for (const clave of clavesDeseadas) {
                    if (clave in dic) {
			if (clave=="start" || clave=="end"){
			   nuevoDic[clave] = parseFloat(timeToSeconds(dic[clave]));
			   /*	
			   if (clave=="start"){
			   	nuevoDic[clave] = Math.floor(timeToSeconds(dic[clave]));
			   }
			   if (clave=="end"){
			   	nuevoDic[clave] = Math.ceil(timeToSeconds(dic[clave])); 
			   }	
			   */
			}else{
                           nuevoDic[clave] = dic[clave];
			}
                    }
                } 
		//console.log("nuevoDic:",nuevoDic);
                return nuevoDic;
            })
        );
}
 
/* 
function agregarFiltroColorALosFilenames(listaDeSublistas) {
    // Copiamos la lista para no modificar la original
    const resultado = listaDeSublistas.map(sublist => [...sublist]);

    let paisIndex = null; // índice del último sublist tipo "pais" encontrado
    let valorEndPais = null; // guardaremos el "end" del sublist pais para la comparación

    for (let i = 0; i < resultado.length; i++) {
        const sublist = resultado[i];
        const propertyDelSublist = sublist[0].property;

        if (propertyDelSublist === "filename") {
            // Encontramos un sublist tipo pais
            paisIndex = i;

            // Guardamos el "end" del primer dic del sublist pais
            valorEndPais = sublist[0].end;

            // Inicializamos la suma
            let suma = "";

            // Recorremos los sublists siguientes hasta el próximo "pais"
            for (let j = i + 1; j < resultado.length; j++) {
                const siguienteSublist = resultado[j];
                const propSiguiente = siguienteSublist[0].property;

                if (propSiguiente === "filename") break; // se rompe la cadena

                // Iteramos sobre los diccionarios del sublist no pais
                for (const dic of siguienteSublist) { 
                    if (timeToSeconds(dic.start) < timeToSeconds(valorEndPais)) {
                        if ("start_value" in dic) suma += dic.start_value;
                        if ("end_value" in dic) suma += dic.end_value; 
                    }
                }
            }

            // Agregamos el key "suma" al sublist tipo pais
            for (const dic of sublist) {  
                dic.filtro_color = suma;//hash
            }
        }
    }

    return resultado;
}
*/


function agruparEmpleados(data) {
  const bossKeyword = "filename";
  const result = [];
  let currentBoss = null;
  let currentEmployees = [];
/*
  // Función para determinar si dos intervalos se intersectan
  const intersecta = (start1, end1, start2, end2) => {
    // Intersección real: debe haber un trozo en común
    return Math.max(start1, start2) < Math.min(end1, end2);
  };
*/
  const intersecta = (start1, end1, start2, end2) => {
  return Math.max(timeToSeconds(start1), timeToSeconds(start2)) < 
         Math.min(timeToSeconds(end1), timeToSeconds(end2));
};


  for (let i = 0; i < data.length; i++) {
    const member = data[i];
    const isBoss = member.some(d => d.property === bossKeyword);

    if (isBoss) {
      // Si ya hay un jefe previo, procesamos su grupo antes de iniciar el siguiente
      if (currentBoss) {
        result.push(currentBoss);
      }

      // Iniciamos un nuevo jefe
      currentBoss = member.map(d => ({ ...d, filtro_color: [] }));
      currentEmployees = [];
    } else {
      // No es jefe → empleado
      currentEmployees.push(member);
    }

    // Si hay un jefe activo, agregamos empleados a cada intervalo del jefe
    if (currentBoss && !isBoss) {
      currentBoss.forEach(bossInterval => {
        const overlappingEmployees = currentEmployees.map(emp =>
          emp.filter(empInterval =>
            intersecta(bossInterval.start, bossInterval.end, empInterval.start, empInterval.end)
          )
        );
	console.log("bossInterval:",bossInterval.anchor_point);
	const extra_params = "&start_value="+bossInterval.start_value+"&anchor_point="+bossInterval.anchor_point+"&color_rgb="+bossInterval.color_rgb+"&glow_color="+bossInterval.glow_color;
        bossInterval.filtro_color = JSON.stringify(overlappingEmployees)+extra_params;
      });
    }
  }

  // Agregar el último jefe
  if (currentBoss) {
    result.push(currentBoss);
  }

  return result;
}




/*
  function timeToSeconds(t) {
    const [hh, mm, ss] = t.split(":");
    return parseFloat(hh) * 3600 + parseFloat(mm) * 60 + parseFloat(ss);
  }
*/


function split_segment() {
 
  let simple_split=false;
  if (selected_rect.dataset.property!="filename"){
        simple_split=true;
	//return;
  }
  
  if (selected_rect.dataset.filetype=="image" || selected_rect.dataset.filetype=="text") {
	simple_split=true;
	//return;
  }

  const index_global_row = selected_rect.dataset.index_global_row;
  const index_dic = selected_rect.dataset.indice;
  const dic = unica_regla.rectangulos[index_global_row][index_dic];
  console.log("DIC segmento:",dic, index_global_row,index_dic);
  const split_time = formatearTiempoDecimal(split_position_global);//current_scroll_x split_position_global  

  // Convierte segundos a string con decimales
  function secondsToString(sec) {
    return sec.toFixed(3); // puedes ajustar precisión si quieres
  }

  const startGlobal = timeToSeconds(dic.start);
  const endGlobal = timeToSeconds(dic.end);
  const splitGlobal = timeToSeconds(split_time);

  // Validación del split
  if (
    splitGlobal <= startGlobal ||
    splitGlobal >= endGlobal
  ) {
    console.log("Ningun segmento detectado");
    return; 
  }

  const durationFirst = splitGlobal - startGlobal;
  const durationSecond = endGlobal - splitGlobal;
  console.log("dic.video_audio_value:",dic.video_audio_value);
  const audioParams = dic.video_audio_value.split(",");
  if (dic.video_audio_value==""){
	console.log("NOT MEDIA FILE");
        return;
  }

  const audioStartRelative = timeToSeconds(audioParams[0]);
  const audioDurationOriginal = parseFloat(audioParams[1]);

  // ---------- Primer dic ----------
  const firstDict = { ...dic };
  firstDict.start = dic.start;
  firstDict.end = split_time;

  const firstAudioParams = [...audioParams];
  firstAudioParams[1] = secondsToString(durationFirst);
  firstDict.video_audio_value = firstAudioParams.join(",");

  // ---------- Segundo dic ----------
  const secondDict = { ...dic };
  secondDict.start = split_time;
  secondDict.end = dic.end;

  const secondAudioParams = [...audioParams];
  
  console.log("audioStartRelative:",audioStartRelative);
  secondAudioParams[0] = sumarTiempo(audioParams[0],durationFirst);
  secondAudioParams[1] = secondsToString(durationSecond);
  secondDict.video_audio_value = secondAudioParams.join(",");

  if (simple_split){
	firstDict.video_audio_value = "";
	secondDict.video_audio_value = "";
  } 
  const result = [firstDict, secondDict];
  console.log("NEW SEGMENTS:",result);
  unica_regla.rectangulos[index_global_row].splice(index_dic, 1, ...result);

  unica_regla.scroll_x[current_view] = split_position_global;//current_scroll_x split_position_global
  deseleccionarRectangulo();
  inicializar(); 
  send_rectangles("dividir_segmento");
  return result;
}



function split_segment_no_duration() {
 
  let simple_split=false;
  if (selected_rect.dataset.property!="filename"){
        simple_split=true;
	//return;
  }
  
  if (selected_rect.dataset.filetype=="image" || selected_rect.dataset.filetype=="text") {
	simple_split=true;
	//return;
  }

  const index_global_row = selected_rect.dataset.index_global_row;
  const index_dic = selected_rect.dataset.indice;
  const dic = unica_regla.rectangulos[index_global_row][index_dic];
  console.log("DIC segmento:",dic, index_global_row,index_dic);
  const split_time = formatearTiempoDecimal(split_position_global);//current_scroll_x split_position_global 
  //split_position_global es mas preciso, usa round()
 
  // Convierte segundos a string con decimales
  function secondsToString(sec) {
    return sec.toFixed(3); // puedes ajustar precisión si quieres
  }

  const startGlobal = timeToSeconds(dic.start);
  const endGlobal = timeToSeconds(dic.end);
  const splitGlobal = timeToSeconds(split_time);

  // Validación del split
  if (
    splitGlobal <= startGlobal ||
    splitGlobal >= endGlobal
  ) {
    console.log("Ningun segmento detectado");
    return;
    //return [];
  }

  const durationFirst = splitGlobal - startGlobal;
  const durationSecond = endGlobal - splitGlobal; 

  // ---------- Primer dic ----------
  const firstDict = { ...dic };
  firstDict.start = dic.start;
  firstDict.end = split_time; 
  firstDict.start_value = dic.start_value;
  firstDict.end_value = dic.end_value;
  
  // ---------- Segundo dic ----------
  const secondDict = { ...dic };
  secondDict.start = split_time;
  secondDict.end = dic.end;
  secondDict.start_value = dic.start_value;//no end
  secondDict.end_value = dic.end_value;
 
  bg_id_total = bg_id_total + 1;
  secondDict.bg_id = bg_id_total;
 
  const result = [firstDict, secondDict];
  console.log("NEW SEGMENTS:",result);
  unica_regla.rectangulos[index_global_row].splice(index_dic, 1, ...result);
 
  unica_regla.scroll_x[current_view] = split_position_global;//current_scroll_x split_position_global
  deseleccionarRectangulo();
  inicializar(); 
  send_rectangles("dividir_segmento");
  return result;
}


let timeline_creado=false;
let bg_id_total = 0;

function add_file(){
console.log("add_file ERROR");
	const filetype = selected_rect.dataset.filetype;
	let rect_color = "rgb(189,32,41)";
	if (filetype=="image"){
		rect_color = "rgb(195,136,35)";
	}
	if (filetype=="video"){ 
		rect_color = "rgb(1, 140, 96)";
	}
	if (filetype=="audio"){ 
		rect_color = "rgb(7, 74, 145)";
	}
	if (filetype=="text"){ 
		rect_color = "#7c55e6";
	}

	get_duration_file(filetype)
    		.then(result => {
        		if (result) { 
 

				const index_global_row = selected_rect.dataset.index_global_row;

            			console.log("Nombre:", result[0]);
            			console.log("Duración:", result[1]);
				const file_name = result[0];
				  
				const customName =  unica_regla.rectangulos[index_global_row][unica_regla.rectangulos[index_global_row].length-1].item_name;
  
            			console.log('Tab creado con nombre:', customName); 
				 
				let start_time = "00:00:00";
				if (unica_regla.rectangulos[index_global_row].length > 0){
				   start_time = unica_regla.rectangulos[index_global_row][unica_regla.rectangulos[index_global_row].length-1].end;
				} 
	 
				let end_time = "00:00:01.0";
 				let video_audio_value = "";
				if (filetype=="video" || filetype=="audio"){ 
				   end_time = sumarTiempo(start_time,result[1]); 
				   video_audio_value="00:00:00,"+result[1]+",1,100,"+end_time;		
				   console.log("end_time:",end_time);
				}else{
				   end_time = sumarTiempo(start_time,1); 	
				}

				//const index_item = customNames.length.toString();
				const index_item = selected_rect.dataset.index_item;

				bg_id_total = bg_id_total + 1;
	 			const new_rect = {"bg_id":bg_id_total,"item_name":customName,"index_item":index_item,"property":"filename","filetype":filetype,"start":start_time,"end":end_time,"start_value":file_name,"end_value":"","video_audio_value":video_audio_value,color:rect_color,anchor_point:"0.5,0.5",color_rgb:"0,0,0",glow_color:"255,255,255","instruction_name":"","description":""}; 
 
				unica_regla.rectangulos[index_global_row].push(new_rect);

  				unica_regla.scroll_x[current_view] = timeToSeconds(start_time); 
 
				inicializar();
				//resetear();

				send_rectangles("add_file_same_row");	
 
 				undoRedoManager.saveState(unica_regla.rectangulos);
				 

        		} else {
            			console.log("No se seleccionó ningún archivo.");
        		}
    		})
    		.catch(err => console.error(err));
}


const dic1 = {
        "position": ["640,360", "640,360"],
        "scale": ["1"],
        "rotation": ["0"],
        "opacity": ["255"],
	"ratio": ["", ""],
	"item_reveal": ["off"],
	"glow": ["0.01"],
	"blur": ["0"],
	"ai_filter": ["off"],
	"ai_mask": ["off"],
    };

const dic2 = {
        "image": ["position", "scale", "rotation", "opacity","ratio","glow","blur","ai_filter","ai_mask"],
        "video": ["position", "scale", "rotation","ai_filter","ai_mask"],
	"audio": [],
	"text": ["position", "scale", "rotation", "opacity","item_reveal","glow","ai_filter","ai_mask"]
    };

function expandDicInput(dic_input) {  
 
    const filetype = dic_input.filetype;
    if (!dic2[filetype]) { 
        return [dic_input];
    }

    const propsList = dic2[filetype]; 
    console.log("propsList:",JSON.stringify(propsList));
    unica_regla.rectangulos.push([dic_input]); 
 
    propsList.forEach(prop => {
        const newDic = { ...dic_input };  
        newDic.property = prop;
        //newDic.start = dic_input.start;

	dic1["position"][0] = String(parseInt(resolution_scene.split("x")[0])/2)+","+String(parseInt(resolution_scene.split("x")[1])/2);
	dic1["position"][1] = String(parseInt(resolution_scene.split("x")[0])/2)+","+String(parseInt(resolution_scene.split("x")[1])/2);

        const valores = dic1[prop] || ["", ""];  
        console.log("valores:",valores);
        if (valores.length === 1) {
            newDic.start_value = valores[0];
            newDic.end_value = valores[0];
        } else {
            newDic.start_value = valores[0];
            newDic.end_value = valores[1];
        }
	//newDic.end = "00:00:01.0";
	//newDic.end = dic_input.end;
 
	unica_regla.rectangulos.push([newDic]);
    });
    console.log("unica_regla.rectangulos error:",unica_regla.rectangulos);
 
}

function addPropertyInTheSameRow(dic_input,index_global_row_input){
    const filetype = dic_input.filetype;
    if (!dic2[filetype]) { 
        return [dic_input];
    }

    const propsList = dic2[filetype]; 
    console.log("propsList:",JSON.stringify(propsList)); 
 
    propsList.forEach((prop, index) => { 
        const newDic = { ...dic_input };  
        newDic.property = prop; 

	dic1["position"][0] = String(parseInt(resolution_scene.split("x")[0])/2)+","+String(parseInt(resolution_scene.split("x")[1])/2);
	dic1["position"][1] = String(parseInt(resolution_scene.split("x")[0])/2)+","+String(parseInt(resolution_scene.split("x")[1])/2);
/*
        const valores = dic1[prop] || ["", ""];  
        console.log("valores:",valores);
        if (valores.length === 1) {
            newDic.start_value = valores[0];
            newDic.end_value = valores[0];
        } else {
            newDic.start_value = valores[0];
            newDic.end_value = valores[1];
        } 
*/
	let new_end_value = unica_regla.rectangulos[parseInt(index_global_row_input)+parseInt(index)+1].at(-1).end_value;
	console.log("new_end_value error:",new_end_value);
	newDic.start_value = new_end_value;
	newDic.end_value = new_end_value; 
        console.log("newDic error:",newDic,parseInt(index_global_row_input)+parseInt(index)+1,unica_regla.rectangulos);
 
	unica_regla.rectangulos[parseInt(index_global_row_input)+parseInt(index)+1].push(newDic);
    });
    console.log("addPropertyInTheSameRow:",JSON.stringify(unica_regla.rectangulos));
}


function handleSingleFileUpload(file) { 
  const files = [file];
  const filesToUpload = []; // Solo archivos que no sean duplicados
  for (const file of files) {
    const file_name = file.name.replace(/\s+/g, "");
    const fileIdentifier = `${file_name}-${file.size}-${file.lastModified}`;

    if (uniqueFiles.includes(fileIdentifier)) {
      console.log(`⚠️ Archivo duplicado, ya subido: ${file_name}`);
      continue; // No agregar ni a visible_names ni a filesToUpload
    }

    uniqueFiles.push(fileIdentifier);

    const baseName = file_name.replace(/\.[^/.]+$/, "");
    const extension = file_name.match(/\.[^/.]+$/)?.[0] || "";

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
 

  processNextUpload();
}


async function get_duration_file(selectedOption_item) {
    return new Promise((resolve, reject) => {
        // Crear input de tipo file
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = false; // solo un archivo

        // Filtrar por tipo
        switch (selectedOption_item) {
            case 'image':
                input.accept = 'image/*';
                break;
            case 'video':
                input.accept = 'video/*';
                break;
            case 'audio':
                input.accept = 'audio/*';
                break;
            case 'text':
                input.accept = 'text/*';
                break;
            default:
                reject('Tipo no soportado');
                return;
        }

         

        input.onchange = async () => {
            if (input.files.length === 0) {
                resolve(null); // no se seleccionó archivo
                return;
            }

            const file = input.files[0];

	    //let file_type = "text";

	    if (file.type.startsWith('image/')) {
		selectedOption_item = "image";
 	    }
	    if (file.type.startsWith('video/')) {
		selectedOption_item = "video";
 	    }
	    if (file.type.startsWith('audio/')) {
		selectedOption_item = "audio";
 	    }	
	
            if (selectedOption_item === 'video' || selectedOption_item === 'audio') {
                // Crear elemento temporal para calcular duración
                const media = document.createElement(selectedOption_item);
                media.preload = 'metadata';
                media.src = URL.createObjectURL(file);
		const file_name = file.name.replace(/\s+/g, "");
		filename_url[file_name] = media.src; 
		filename_dic_url[file_name] = {"blob_url":media.src,"filetype":selectedOption_item};

                media.onloadedmetadata = () => {
                    const duration = media.duration; // en segundos (con decimales)
		     
		    if (selectedOption_item === 'video'){	
 		    	let width = media.videoWidth;
        	    	let height = media.videoHeight; 
        	    	if (!width || !height) {
            	    		width = 1280;
            	    		height = 720;
        	    	}
			if (!timeline_creado){	 
		    		resolution_scene = String(width)+"x"+String(height);
			}
			console.log("NUEVA RESOLUCION:",resolution_scene);
		    } 
 		     	

                    //URL.revokeObjectURL(media.src);//Not allowed to load local resource
		    const file_name = file.name.replace(/\s+/g, "");	
                    resolve([file_name, duration,selectedOption_item]);
                };

                media.onerror = () => {
                    URL.revokeObjectURL(media.src);
                    reject('No se pudo leer la duración del archivo');
                };
            } else {
                // Para imagen 
		const blobUrl = URL.createObjectURL(file);
		const file_name = file.name.replace(/\s+/g, "");
  		filename_url[file_name] = blobUrl;
		//poner en la funcion "crearMedia" 
		filename_dic_url[file_name] = {"blob_url":blobUrl,"filetype":selectedOption_item};

    		const img = new Image();
    		img.src = blobUrl; 
    		img.onload = () => {
        		let width = img.naturalWidth;
        		let height = img.naturalHeight; 
        		if (!width || !height) {
            			width = 800;
            			height = 600;
        		}
			if (!timeline_creado){
				//resolution_scene = String(width)+"x"+String(height);
			}
			const file_name = file.name.replace(/\s+/g, "");
			resolve([file_name, "",selectedOption_item]); 
    		};
                //resolve([file.name, "",selectedOption_item]);
            }
	    handleSingleFileUpload(file);	 
        };

        // Abrir selector de archivos
        input.click();
    });
}


function current_full_keyframes(){ 
	unica_regla.scroll_x[current_view] = current_scroll_x;
	resetOverlay();	 
	deseleccionarRectangulo();
	hide_rect_extrems(selected_rect);
	current_view = "group"; 
	mostrarBotonPrincipalView(); 
	inicializar();    
}

function view_ai_segments(current_view_name){ 
	unica_regla.scroll_x[current_view] = current_scroll_x;
	resetOverlay();	 
	deseleccionarRectangulo();
	hide_rect_extrems(selected_rect);
	current_view = current_view_name; 
	mostrarBotonPrincipalView(); 
	inicializar();    
}

function eliminarSublistasVacias() {
  rectangulos = rectangulos.filter(sublista => sublista.length > 0);
}
 
function mostrarBotonPrincipalView() {
    const principal_view = document.getElementById('principal_view');
    const export_video = document.getElementById('export_video');
    const change_view = document.getElementById('change_view');
    const create_item = document.getElementById('create_item');
    const new_project = document.getElementById('new_project');
    const boton_update = document.getElementById('update'); 

    // Verificar que todos los elementos existan
    if (principal_view && export_video && change_view && create_item && new_project) {
        principal_view.style.display = 'flex';
        export_video.style.display = 'none';
        change_view.style.display = 'none';
        create_item.style.display = 'none';
        new_project.style.display = 'none';
	boton_update.style.display = 'none';
    }
    //console.log("rectangulos coord 2:",JSON.stringify(unica_regla.rectangulos)); 
     
}

function ocultarBotonPrincipalView() {
    const principal_view = document.getElementById('principal_view');
    const export_video = document.getElementById('export_video');
    const change_view = document.getElementById('change_view');
    const create_item = document.getElementById('create_item');
    const new_project = document.getElementById('new_project');
    const boton_update = document.getElementById('update');
    
    // Verificar que todos los elementos existan
    if (principal_view && export_video && change_view && create_item && new_project) {
        principal_view.style.display = 'none';
        
        // Solo mostrar export_video si su dataset.visible es "true"
        if (export_video.dataset.visible === 'true') {
            export_video.style.display = 'block';
        }
        if (window.innerWidth > 500) {
        change_view.style.display = 'block';
	}
        create_item.style.display = 'flex';
        //new_project.style.display = 'block'; 
        //boton_update.style.display = 'block'; 
    }
}

function mostrarVistaPrincipal(){
        unica_regla.scroll_x[current_view] = current_scroll_x;
	current_view = "filename";
	inicializar();  
  	ocultarBotonPrincipalView(); 
}

function contarSublistasConFilename() {
  return unica_regla.rectangulos.filter(sublista =>
    Array.isArray(sublista) &&
    sublista.some(obj => obj && obj.property === 'filename')
  ).length;
}


function forzarFondoTransparente() {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    canvas.style.setProperty("background", "transparent", "important");
}


function save_project() {
   console.log("SAVING PROJECT...");
   unica_regla.resolution_scene=resolution_scene;
   //const hjsonText = jsonToHjsonNoQuotes(unica_regla.rectangulos);
   const hjsonText = jsonToHjsonNoQuotes(unica_regla);
   console.log("hjsonText_2:",hjsonText);
  const json_data = {"service":"save_project","project_name":"cancion","json_text":hjsonText,"itemName":"empty","property":"empty","params":"empty","file_type":"empty","extra0":"","extra":""}; 
  safeSend(JSON.stringify(json_data)); 

   

}

function get_project() {
   console.log("RECEIVING PROJECT..."); 
  const json_data = {"service":"get_project","project_name":"cancion","itemName":"empty","property":"empty","params":"empty","file_type":"empty","extra0":"","extra":""}; 
  safeSend(JSON.stringify(json_data));  

}



function crear_nuevo_timeline(start_timestamp,end_timestamp,last_start_value,last_end_value){

				let rect_color = "#7c55e6";
				if (last_filetype=="image"){ 
					rect_color = "rgb(195,136,35)";
				}
				if (last_filetype=="video"){ 
					rect_color = "rgb(1, 140, 96)";
				}
				if (last_filetype=="audio"){ 
					rect_color = "rgb(7, 74, 145)";
				}
				rect_color = "rgb(189,32,41)";
			rectangulos.push([]);

			let max_index_item = contarSublistasConFilename();
			if (unica_regla.rectangulos.length > 0){
				max_index_item = unica_regla.rectangulos.at(-1)[0].index_item;
					console.log("indice mas grande:", unica_regla.rectangulos.at(-1)[0].index_item);
			}

			//let nuevo_indice = rectangulos.length.toString();//mal
 
			//let nuevo_indice = contarSublistasConFilename()+1;
			let nuevo_indice = parseInt(max_index_item)+1;
			const customName =  "Timeline_"+nuevo_indice.toString();
			//const index_item = rectangulos.length.toString();
			const index_item = nuevo_indice.toString();
crearReglaIndividual(parseInt(index_item)); 

			//trozo experimental
			let start_time = "00:00:00.0"; 
			start_time = formatearTiempoDecimal(current_scroll_x); 
			end_time = sumarTiempo(start_time,1); //00:00:01.0
			//

			bg_id_total = bg_id_total + 1;
			const first_rect = {"bg_id":bg_id_total,"item_name":customName,"index_item":index_item,"property":"filename","filetype":last_filetype,"start":start_timestamp,"end":end_timestamp,"start_value":last_start_value,"end_value":last_end_value,"video_audio_value":"",color:rect_color,anchor_point:"0.5,0.5",color_rgb:"0,0,0",glow_color:"255,255,255","instruction_name":"","description":""}; 

			expandDicInput(first_rect);   
			resetear(); 
			closeModalDinamico();

			if (!loaded_project && !timeline_creado && unica_regla.rectangulos.length>=0){
				//forzarFondoTransparente();
				console.log("SOLICITANDO NUEVO PROYECTO");
				//request_new_project();//no es necesario
			}
			timeline_creado = true;
			 

			const change_view = document.getElementById('change_view');
			if (change_view && change_view.style.display === 'none' && window.innerWidth > 500) {
    				change_view.style.display = 'block';
			} 

			const export_btn = document.getElementById('export-btn');
			const undo_redo_container_2 = document.getElementById('undo-redo-container-2');
    			if (export_btn && undo_redo_container_2 && window.innerWidth > 540){ 
				export_btn.style.display = "flex"; 
				undo_redo_container_2.style.display = "flex"; 
    			}
			const boton_update = document.getElementById('update');
				if (boton_update) {
    					//boton_update.style.display = 'block';
				}

			 
			let current_params = "filetype="+last_filetype; 
			const json_data = {"service":"change_item_view","itemName":customName,"property":"empty","params":current_params,"file_type":last_filetype,"resolution":resolution_scene,"extra0":"0","extra":"0"}; 
			lista_json_global_item_view.push(json_data); 
			//safeSend(JSON.stringify(json_data));
 			console.log("error item_view:", JSON.stringify(json_data));
			const json_data_2 =  {"service":"save_item_data","itemName":customName,"property":"filename","params":"empty", "rectangulos":[first_rect],"extra":"text"}; 
			 
			lista_json_global.push(json_data_2); 	
        		//safeSend(JSON.stringify(json_data_2));
				

			undoRedoManager.saveState(unica_regla.rectangulos); 
			 
return nuevo_indice;
}

let min_time = 0;
let max_time = 0;
let last_item_name = "-1";
let last_index_item = -1;
let last_filetype = "text";
let last_start_timestamp = "00:00:00";
let last_end_timestamp = "00:00:00.8";
let last_start_value = "";
let last_end_value = "";

function send_instruction(instruction_value){
    //const instruction_value = document.getElementById("input_dynamic_box_0").value; 
    const index_global_row = selected_rect.dataset.index_global_row;
    const indice = parseInt(selected_rect.dataset.indice);  
    const detalle = unica_regla.rectangulos[index_global_row][indice];
    const index_item = detalle.index_item;
    const item_name = detalle.item_name;
    const filetype = detalle.filetype;
    last_item_name = item_name;
    last_index_item = index_item;
    last_filetype = filetype; 
    last_start_timestamp = detalle.start;
    last_end_timestamp = detalle.end;
    last_start_value = detalle.start_value;
    last_end_value = detalle.end_value;

    const start = timeToSeconds(detalle.start);
    const end = timeToSeconds(detalle.end); 
    min_time = start;
    max_time = end;
    console.log("instruction_value:",instruction_value,"interval:",index_item,start,end);
    const instruction_to_send = "ai_instruction_segment: DIMENSION ESCENA:"+resolution_scene+". Intervalo_animacion_global:["+start+","+end+"]. Instruccion: "+instruction_value+". Dato extra: Todos los subintervalos deben estar dentro de Intervalo_animacion_global aunque la instruccion diga lo opuesto. Y recuerda que puedes usar segundos lotantes para crear 1 o mas sub intervalos si el intervalo global es muy estrecho.";
    console.log("instruction_to_send:",instruction_to_send); 
    websocketClient.send(instruction_to_send);
    //apply_ai_changes();
}

/*
function borrarSecundarios(index_global_row) {
  if (!unica_regla.rectangulos[index_global_row]?.[0]?.nombres_secundarios) {
    return;
  }

  const nombres_secundarios = unica_regla.rectangulos[index_global_row][0].nombres_secundarios;
  console.log("nombres_secundarios2:",nombres_secundarios);

  unica_regla.rectangulos = unica_regla.rectangulos.filter(sublista => 
    !nombres_secundarios.includes(sublista[0]?.item_name)
  );
  console.log("AI_JSON 55:",JSON.stringify(unica_regla.rectangulos, null, 2));
  resetear();
}
*/
function borrarSecundarios(index_global_row) {
  if (!unica_regla.rectangulos[index_global_row]?.[0]?.nombres_secundarios) {
    return;
  }

  const nombres_secundarios = unica_regla.rectangulos[index_global_row][0].nombres_secundarios;

  unica_regla.rectangulos = unica_regla.rectangulos.filter(sublista => {
    const seElimina = nombres_secundarios.includes(sublista[0]?.item_name);
    if (seElimina){
	console.log("Eliminando:", sublista[0]?.item_name); 
	if (sublista[0].property=="filename"){
		eliminarTimelinePorNombre(sublista[0].item_name);   
	}   
    }
    return !seElimina;
  });
 
  resetear();
 
lista_json_global_item_view = [];
}

function asignarNombresSecundarios(listaStrings) {
  const nombre_principal = listaStrings[0];

  const sublistaEncontrada = unica_regla.rectangulos.find(sublista =>
    sublista[0]?.item_name === nombre_principal &&
    sublista[0]?.property === "filename"
  );

  if (sublistaEncontrada) {
    sublistaEncontrada[0].nombres_secundarios = listaStrings.slice(1);
	console.log("sublistaEncontrada[0].nombres_secundarios:",sublistaEncontrada[0].nombres_secundarios);
  }
} 


let lista_json_global = [];
let lista_json_global_item_view = [];
function apply_ai_changes(input){
    let new_rectangles = parseKeyframesByItems(input); 
    let new_index = last_index_item;
    const items_asociados = [];
    for (let i = 0; i < new_rectangles.length; i++){
        let group = new_rectangles[i];
	 
        if (i > 0){ 
		new_index = crear_nuevo_timeline(last_start_timestamp,last_end_timestamp,last_start_value,last_end_value);
		//new_index = duplicarGrupo("Timeline_"+String(parseInt(new_index))); 
		actualizarRectangulos(group,"Timeline_"+String(new_index));
		console.log("AI_JSON 4:",JSON.stringify(unica_regla.rectangulos, null, 2));
		items_asociados.push("Timeline_"+String(new_index));
	}else{ 
		let current_item_name = "Timeline_"+String(parseInt(last_index_item));
		actualizarRectangulos(group,current_item_name);
		items_asociados.push(current_item_name);
	}  
    } 
    console.log("items_asociados:",items_asociados);
    asignarNombresSecundarios(items_asociados);
    console.log("actualizarEstadoGlobal lista_json_global_item_view error:",lista_json_global_item_view);
    send_change_item_view_lista("actualizarEstadoGlobal",lista_json_global_item_view);
    send_rectangles_by_ai_lista("actualizarEstadoGlobal",lista_json_global);
      
    console.log("AI_JSON 2:",JSON.stringify(unica_regla.rectangulos, null, 2));
    //actualizarEstadoGlobal(); 
    update_state(); 
    inicializar();
} 

let rewind_forward_activo=false;

document.addEventListener("click", function (e) { 
/*
  if (e.target.matches("#rewind") || e.target.closest("#rewind")){
	if (scrollWrapper.scrollLeft<200*10){
		scrollWrapper.scrollLeft = 0;
		return;
	}
     	scrollWrapper.scrollLeft = scrollWrapper.scrollLeft - 200*10;
  }
  if (e.target.matches("#forward") || e.target.closest("#forward")){
	scrollWrapper.scrollLeft = scrollWrapper.scrollLeft + 200*10;
  }
*/
if (e.target.matches("#rewind") || e.target.closest("#rewind")){
    rewind_forward_activo = true;
    if (scrollWrapper.scrollLeft < 200*10){
        scrollWrapper.scrollTo({
            left: 0,
            behavior: 'smooth'
        });
        return;
    }
    scrollWrapper.scrollTo({
        left: scrollWrapper.scrollLeft - 200*10,
        behavior: 'smooth'
    });
}
if (e.target.matches("#forward") || e.target.closest("#forward")){
    rewind_forward_activo = true;	
    scrollWrapper.scrollTo({
        left: scrollWrapper.scrollLeft + 400*10,
        behavior: 'smooth'
    });
}

  if (e.target.matches("#finish-btn")){
	console.log("uploadedFiles: ",uniqueFiles.length);
		if (check_conditions()) { 
    			abrirModalDinamicoSimple(html_finish);
			renderPendientes(progress_visible_names);
		}
  }
/*
  if (e.target.closest("#ai_instruction")){ 
	send_instruction();	
	closeModalDinamico();  
  }
*/
  if (e.target.closest("#ABBA") || e.target.closest("#zoom-in")){ 
	get_project();
  }

/* 
  if (e.target.matches("#undo") || e.target.closest("#undo")){
	console.log("undo_action");
	const estadoAnterior = undoRedoManager.undo_action();
  	if (estadoAnterior !== null) {
    		unica_regla.rectangulos = estadoAnterior; 
		resetear();
  	}
  }
  if (e.target.matches("#redo") || e.target.closest("#redo")) {
    const estadoSiguiente = undoRedoManager.redo_action();
    if (estadoSiguiente !== null) {
    	unica_regla.rectangulos = estadoSiguiente; 
    	console.log('Redo ejecutado'); 
    	resetear();
    } else {
    	console.log('No hay más acciones para rehacer');
    }
  }
*/
 

  if (e.target.matches("#principal_view") || e.target.closest("#principal_view")){
	 mostrarVistaPrincipal();
  }
  if (e.target.matches("#create_item") || e.target.closest("#create_item")){
	abrirModalDinamicoSimple(html_create_item);
	renderPendientesAddFile(progress_visible_names);
  }	
  if (e.target.matches("#change_view")){
	abrirModalDinamicoSimple(html_change_view);	 
  }
  if (e.target.matches(".btn-confirm") || e.target.closest(".btn-confirm")) {
	const btn = e.target.closest(".btn-confirm");  
    	const id = btn.id; 
    	console.log("Botón clickeado con id:", id);
 

	if (id=="image-item" || id=="video-item" || id=="audio-item" || id=="text-item"){

		let rect_color = "#7c55e6";
		if (id=="image-item"){
			selectedOption_item = "image";
			rect_color = "#7c55e6";
			rect_color = "rgb(208,148,36)";
			rect_color = "rgb(195,136,35)";
		}
		if (id=="video-item"){
			selectedOption_item = "video";
			rect_color = "#047954";
			rect_color = "rgb(1, 140, 96)";
		}
		if (id=="audio-item"){
			selectedOption_item = "audio";
			rect_color = "rgb(15,64,117)";
			rect_color = "rgb(7, 74, 145)";
		}
		if (id=="text-item"){
			selectedOption_item = "text";
			//rect_color = "rgb(104, 69, 119)";
		}
                current_filetype = selectedOption_item;

		if (selectedOption_item != "text"){
		get_duration_file(selectedOption_item)
    		.then(result => {
        		if (result) { 

            			console.log("Nombre:", result[0]);
            			console.log("Duración:", result[1]);
				const file_name = result[0];
				selectedOption_item = result[2];
				if (selectedOption_item=="image"){ 
					rect_color = "rgb(195,136,35)";
				}
				if (selectedOption_item=="video"){ 
					rect_color = "rgb(1, 140, 96)";
				}
				if (selectedOption_item=="audio"){ 
					rect_color = "rgb(7, 74, 145)";
				}
				  
				rectangulos.push([]);
				//let nuevo_indice = rectangulos.length.toString();//mal
				let max_index_item = contarSublistasConFilename();
				if (unica_regla.rectangulos.length > 0){
					max_index_item = unica_regla.rectangulos.at(-1)[0].index_item; 
				}

				//let nuevo_indice = contarSublistasConFilename()+1;
				let nuevo_indice = parseInt(max_index_item)+1;	
				const customName =  "Timeline_"+nuevo_indice.toString();
				//const index_item = rectangulos.length.toString();
				const index_item = nuevo_indice.toString();
				crearReglaIndividual(parseInt(index_item)); 
 
				const json_data_02 =  {"service":"save_item_data","itemName":current_item,"property":current_property_id,"params":"time="+current_scroll_x, "rectangulos":unica_regla.rectangulos,"extra":"change2"}; 
				//websocketClient.send(JSON.stringify(json_data_02));
            			//createTab(customName);
            			console.log('Tab creado con nombre:', customName); 

				let full_json = [];
				let new_project_required = false;
				if (!loaded_project && !timeline_creado && unica_regla.rectangulos.length>=0){
					//forzarFondoTransparente();
					console.log("SOLICITANDO NUEVO PROYECTO");
					//request_new_project();
					new_project_required = true;
				}
				timeline_creado = true;
		
				let end_time = "00:00:01.0";
				let video_audio_value = "";
				if (selectedOption_item=="video" || selectedOption_item=="audio"){
				   end_time = formatearTiempoDecimal(result[1]);
				   console.log("end_time:",end_time);
				   video_audio_value="00:00:00,"+result[1]+",1,100,"+end_time;	
				}
 

				//trozo experimental
				let start_time = "00:00:00"; 
				start_time = formatearTiempoDecimal(current_scroll_x); 
				end_time = sumarTiempo(start_time,1);
				if (selectedOption_item=="video" || selectedOption_item=="audio"){
					end_time = sumarTiempo(start_time,result[1]);
				} 
				//

				bg_id_total = bg_id_total + 1;
	 			const first_rect = {"bg_id":bg_id_total,"item_name":customName,"index_item":index_item,"property":"filename","filetype":selectedOption_item,"start":start_time,"end":end_time,"start_value":file_name,"end_value":"","video_audio_value":video_audio_value,color:rect_color,anchor_point:"0.5,0.5",color_rgb:"0,0,0",glow_color:"255,255,255","instruction_name":"","description":""}; 
				expandDicInput(first_rect); 
  
				resetear();

				closeModalDinamico();
				
				const change_view = document.getElementById('change_view');
				if (change_view && change_view.style.display === 'none' && window.innerWidth > 500) {
    					change_view.style.display = 'block';
				} 

				const export_btn = document.getElementById('export-btn'); 
				const undo_redo_container_2 = document.getElementById('undo-redo-container-2');
    				if (export_btn && undo_redo_container_2 && window.innerWidth > 540){ 
					export_btn.style.display = "flex"; 
					undo_redo_container_2.style.display = "flex"; 
    				}
				const boton_update = document.getElementById('update');
				if (boton_update) {
    					//boton_update.style.display = 'block';
				}


				let current_params = "filetype="+selectedOption_item; 

				const json_data = {"service":"change_item_view","itemName":customName,"property":"empty","params":current_params,"file_type":selectedOption_item,"resolution":resolution_scene,"extra0":"0","extra":"0"}; 
				//safeSend(JSON.stringify(json_data));

				if (true){
				 
				const json_data_2 =  {"service":"save_item_data","itemName":customName,"property":"filename","params":"empty", "rectangulos":[first_rect],"extra":"clip"}; 
        			//safeSend(JSON.stringify(json_data_2)); 
				console.log("ENVIADO4");
				}

				if (item_types[selectedOption_item]){
				    if (!item_types[selectedOption_item].includes(customName)){
					item_types[selectedOption_item].push(customName);	
				    }
				}

				full_json = {"service":"full_creation","itemName":customName,"property":"empty","params":current_params,"file_type":"text","resolution":resolution_scene,"rectangulos":[first_rect],"new_project":new_project_required,"extra0":"0","extra":"0"};
				 safeSend(JSON.stringify(full_json)); 
				 

				undoRedoManager.saveState(unica_regla.rectangulos);
				 

				 

        		} else {
            			console.log("No se seleccionó ningún archivo.");
        		}
    		})
    		.catch(err => console.error(err));
		}else{	
 
 
			rectangulos.push([]);
			//let nuevo_indice = rectangulos.length.toString();//mal

			let max_index_item = contarSublistasConFilename();
			if (unica_regla.rectangulos.length > 0){
				max_index_item = unica_regla.rectangulos.at(-1)[0].index_item;
					console.log("indice mas grande:", unica_regla.rectangulos.at(-1)[0].index_item);
			}

			//let nuevo_indice = contarSublistasConFilename()+1;
			let nuevo_indice = parseInt(max_index_item)+1;	
			const customName =  "Timeline_"+nuevo_indice.toString();
			//const index_item = rectangulos.length.toString();
			const index_item = nuevo_indice.toString();	
crearReglaIndividual(parseInt(index_item)); 

			//trozo experimental
			let start_time = "00:00:00.0"; 
			start_time = formatearTiempoDecimal(current_scroll_x); 
			end_time = sumarTiempo(start_time,1); //00:00:01.0
			//

			bg_id_total = bg_id_total + 1;
			const first_rect = {"bg_id":bg_id_total,"item_name":customName,"index_item":index_item,"property":"filename","filetype":selectedOption_item,"start":start_time,"end":end_time,"start_value":"","end_value":"","video_audio_value":"",color:rect_color,anchor_point:"0.5,0.5",color_rgb:"0,0,0",glow_color:"255,255,255","instruction_name":"","description":""}; 

			expandDicInput(first_rect);   
			resetear(); 
			closeModalDinamico();

			 
			let full_json = []; 
			let new_project_required = false;
			if (!loaded_project && !timeline_creado && unica_regla.rectangulos.length>=0){
				//forzarFondoTransparente();
				console.log("SOLICITANDO NUEVO PROYECTO");
				request_new_project();  
				new_project_required = true;
			}
			timeline_creado = true;
			 

			const change_view = document.getElementById('change_view');
			if (change_view && change_view.style.display === 'none' && window.innerWidth > 500) {
    				change_view.style.display = 'block';
			} 

			const export_btn = document.getElementById('export-btn');
			const undo_redo_container_2 = document.getElementById('undo-redo-container-2');
    			if (export_btn && undo_redo_container_2 && window.innerWidth > 540){ 
				export_btn.style.display = "flex"; 
				undo_redo_container_2.style.display = "flex"; 
    			}
			const boton_update = document.getElementById('update');
				if (boton_update) {
    					//boton_update.style.display = 'block';
				}

			 
			let current_params = "filetype="+selectedOption_item; 
			const json_data = {"service":"change_item_view","itemName":customName,"property":"empty","params":current_params,"file_type":"text","resolution":resolution_scene,"extra0":"0","extra":"0"}; 
			//safeSend(JSON.stringify(json_data)); 


 
			 
			const json_data_2 =  {"service":"save_item_data","itemName":customName,"property":"filename","params":"empty", "rectangulos":[first_rect],"extra":"text"}; 
			//safeSend(JSON.stringify(json_data_2)); 

  
			full_json = {"service":"full_creation","itemName":customName,"property":"empty","params":current_params,"file_type":"text","resolution":resolution_scene,"rectangulos":[first_rect],"new_project":new_project_required,"extra0":"0","extra":"0"};
			safeSend(JSON.stringify(full_json));



			undoRedoManager.saveState(unica_regla.rectangulos); 
			 
 
		}
 
		 	
	}


	if (id=="view-position" || id=="view-scale" || id=="view-rotation" || id=="view-opacity"){

		unica_regla.scroll_x[current_view] = current_scroll_x;

		if (id=="view-position"){
			current_view = "position"; 
		}
		if (id=="view-scale"){
			current_view = "scale"; 
		}
		if (id=="view-rotation"){
			current_view = "rotation"; 
		}
		if (id=="view-opacity"){
			current_view = "opacity"; 
		}
		inicializar(); 
		closeModalDinamico();
		mostrarBotonPrincipalView();
		deseleccionarRectangulo();
	}



	 
 
  
  }
 
  //repetido en responsive7_7
  if (e.target.matches(".btn-close") || e.target.closest(".btn-close")) { 
     console.log("CLOSING MODAL");
     closeModalDinamico();
  }
 
});

  
function send_rectangles_by_ai(extra,item_name,property,sublist){   
 
	const json_data_2 =  {"service":"save_item_data","itemName":item_name,"property":property,"params":"empty", "rectangulos":sublist,"extra":extra};  
	//safeSend(JSON.stringify(json_data_2));   
}
 
function sub_json_to_send(extra,item_name,property,sublist){   
	const json_data_2 =  {"service":"save_item_data","itemName":item_name,"property":property,"params":"empty", "rectangulos":sublist,"extra":extra};   
        return json_data_2;
} 
 
function send_rectangles_by_ai_lista(extra,lista_json){   
	const json_data_2 =  {"service":"save_item_data_lista","itemName":"empty","property":"empty","params":"empty", "lista_propiedades":lista_json,"extra":extra};  
	safeSend(JSON.stringify(json_data_2));  
}

function send_change_item_view_lista(extra,lista_json){   
	const json_data_2 =  {"service":"change_item_view_list","itemName":"empty","property":"empty","params":"empty", "lista_propiedades":lista_json,"extra":extra};  
	safeSend(JSON.stringify(json_data_2));  
}


   

 
			 
			 


 
function send_view_save_no_update(lista_json){  
        //envia 1 bloque "view_save", y solo ejecuta update_video al final, pero no se envia ningun service:update_video 
	const json_data_2 =  {"service":"view_save_update_automatico","itemName":"empty","property":"empty","params":"empty", "lista_propiedades":lista_json,"extra":"extra"};  
	safeSend(JSON.stringify(json_data_2));  
}
function send_view_save_list_no_update(lista_json){ 
	//envia lista de bloques "view_save", y solo ejecuta update_video al final, pero no se envia ningun service:update_video
	const json_data_2 =  {"service":"view_save_list_update_automatico","itemName":"empty","property":"empty","params":"empty", "lista_propiedades":lista_json,"extra":"extra"};  
	safeSend(JSON.stringify(json_data_2));  
}


//esto esta bien no es necesario optimizarlo
function send_rectangles(extra){ 
 
	const index_global_row = selected_rect.dataset.index_global_row;
	const item_name = selected_rect.dataset.item_name;
	const property = selected_rect.dataset.property;
//console.log("ERROR BUCLE",JSON.stringify(unica_regla.rectangulos[index_global_row]));
	const json_data_2 =  {"service":"save_item_data","itemName":item_name,"property":property,"params":"empty", "rectangulos":unica_regla.rectangulos[index_global_row],"extra":extra}; 
        //websocketClient.send(JSON.stringify(json_data_2));
	safeSend(JSON.stringify(json_data_2));  
}

function request_render(seconds_to_edit_str){   

    const seconds_to_edit = seconds_to_edit_str.join("-"); 
    console.log("✅REQUEST RENDER");
    const item_name = "random";
    const property = "filename";

    console.log("item_types:",item_types); 
    const items_with_audio = extraerListasComoString(item_types, ["video","audio"], "/separator/");	
    console.log("items_with_audio: ",items_with_audio);
 
    const json_data = {"service":"update_video","itemName":item_name,"property":property,"params":"empty","items_with_audio":items_with_audio,"seconds_to_edit":seconds_to_edit,"extra0":"","extra":""}; 
    websocketClient.send(JSON.stringify(json_data)); 
}
 

function request_export(){ 
    reset_export_progress(); 
    globalBuffer = new Uint8Array(0); 
    show_percent_export(100);
 
    console.log("✅Exporting video...");
    const item_name = "random";
    const property = "filename";
    const items_with_audio = extraerListasComoString(item_types, ["video","audio"], "/separator/");	
    console.log("items_with_audio: ",items_with_audio);
    console.log("item_types:",item_types);

    const expected_duration = get_globalDuration_no_audio();
    console.log("expected_duration:",expected_duration);
  
    const json_data = {"service":"export_video","itemName":item_name,"property":property,"params":"empty","items_with_audio":items_with_audio,"expected_duration":expected_duration,"extra0":"","extra":""}; 
    websocketClient.send(JSON.stringify(json_data)); 
}
 





 

/*
let lastScroll_Left = scrollWrapper.scrollLeft;
let rafActivo = false;

function detectarFinScrollMovimiento() {
    if (scrollWrapper.scrollLeft === lastScroll_Left && rewind_forward_activo) {
        console.log('detenido');
	rewind_forward_activo = false;
        const pauseBtn = document.getElementById('pause');
        pauseBtn.click(); 
        rafActivo = false; // permite volver a arrancar
        return;
    }

    lastScroll_Left = scrollWrapper.scrollLeft;
    requestAnimationFrame(detectarFinScrollMovimiento);
}
 
scrollWrapper.addEventListener('scroll', () => {
    if (!rafActivo) {
        rafActivo = true;
        lastScroll_Left = scrollWrapper.scrollLeft;
        requestAnimationFrame(detectarFinScrollMovimiento);
    }
});
*/



 
const change_view_2 = document.getElementById('zoom-out');
change_view_2.onclick = () => {
	const btn = document.getElementById('change_view'); 
	if (btn) {
  		btn.click();
	} 
}; 
 






function crearFrameRojo(width, height) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;

  const ctx = c.getContext("2d");
  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, width, height);

  return c;
}

function draw_text(text, rect) {
  // Configuración de la fuente y estilo
  ctx_principal.font = "bold 26px Arial";
  //ctx_principal.fillStyle = "#7c55e6"; // color semitransparente
  ctx_principal.fillStyle = "rgb(75, 27, 207,0.8)";
  ctx_principal.textAlign = "center";               // alineación horizontal
  ctx_principal.textBaseline = "middle";          // alineación vertical

  // Dibujar texto
  ctx_principal.fillText(text, rect.width/2, rect.height/2);
  //ctx_principal.fillText(text, 25, 25);
   
/* 
  ctx_principal.strokeStyle = "#3003a8";
  ctx_principal.lineWidth = 1;
  ctx_principal.strokeText(text, rect.width/2, rect.height/2);
*/
 
}



// Prevenir que el navegador abra el archivo
document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
});









// ===== Ejemplo completo =====
const jsonObj = {
  usuarios:  [[{"item_name":"Timeline_1","index_item":"1","property":"filename","filetype":"text","index_row":"0","index_global_row":"0","color":"#7c55e6","start":"00:00:01","end":"00:00:02","start_value":"jjuj","end_value":"jjuj","video_audio_value":"","color_rgb":"0,0,0","glow_color":"255,255,255","anchor_point":"0.5,0.5"},{"item_name":"Timeline_1","index_item":"1","property":"filename","filetype":"text","index_row":"0","index_global_row":"0","color":"#7c55e6","start":"00:00:02.1","end":"00:00:02.3","start_value":"ij9i89u9","end_value":"ij9i89u9","video_audio_value":"","color_rgb":"0,0,0","glow_color":"255,255,255","anchor_point":"0.5,0.5"}],[{"item_name":"Timeline_1","index_item":"1","property":"position","filetype":"text","start":"00:00:00.0","end":"00:00:01.0","start_value":"960,540","end_value":"960,540","video_audio_value":"","color":"#7c55e6","anchor_point":"0.5,0.5","color_rgb":"0,0,0","glow_color":"255,255,255"}],[{"item_name":"Timeline_1","index_item":"1","property":"scale","filetype":"text","start":"00:00:00.0","end":"00:00:01.0","start_value":"1","end_value":"1","video_audio_value":"","color":"#7c55e6","anchor_point":"0.5,0.5","color_rgb":"0,0,0","glow_color":"255,255,255"}],[{"item_name":"Timeline_1","index_item":"1","property":"rotation","filetype":"text","start":"00:00:00.0","end":"00:00:01.0","start_value":"0","end_value":"0","video_audio_value":"","color":"#7c55e6","anchor_point":"0.5,0.5","color_rgb":"0,0,0","glow_color":"255,255,255"}],[{"item_name":"Timeline_1","index_item":"1","property":"opacity","filetype":"text","start":"00:00:00.0","end":"00:00:01.0","start_value":"255","end_value":"255","video_audio_value":"","color":"#7c55e6","anchor_point":"0.5,0.5","color_rgb":"0,0,0","glow_color":"255,255,255"}],[{"item_name":"Timeline_1","index_item":"1","property":"item_reveal","filetype":"text","start":"00:00:00.0","end":"00:00:01.0","start_value":"off","end_value":"off","video_audio_value":"","color":"#7c55e6","anchor_point":"0.5,0.5","color_rgb":"0,0,0","glow_color":"255,255,255"}],[{"item_name":"Timeline_1","index_item":"1","property":"glow","filetype":"text","start":"00:00:00.0","end":"00:00:01.0","start_value":"0.01","end_value":"0.01","video_audio_value":"","color":"#7c55e6","anchor_point":"0.5,0.5","color_rgb":"0,0,0","glow_color":"255,255,255"}],[{"item_name":"Timeline_2","index_item":"2","property":"filename","filetype":"image","start":"00:00:00.0","end":"00:00:01.0","start_value":"motion_graphics.png","end_value":"","video_audio_value":"","color":"rgb(195,136,35)","anchor_point":"0.5,0.5","color_rgb":"0,0,0","glow_color":"255,255,255"}],[{"item_name":"Timeline_2","index_item":"2","property":"position","filetype":"image","start":"00:00:00.0","end":"00:00:01.0","start_value":"960,540","end_value":"960,540","video_audio_value":"","color":"rgb(195,136,35)","anchor_point":"0.5,0.5","color_rgb":"0,0,0","glow_color":"255,255,255"}],[{"item_name":"Timeline_2","index_item":"2","property":"scale","filetype":"image","start":"00:00:00.0","end":"00:00:01.0","start_value":"1","end_value":"1","video_audio_value":"","color":"rgb(195,136,35)","anchor_point":"0.5,0.5","color_rgb":"0,0,0","glow_color":"255,255,255"}],[{"item_name":"Timeline_2","index_item":"2","property":"rotation","filetype":"image","start":"00:00:00.0","end":"00:00:01.0","start_value":"0","end_value":"0","video_audio_value":"","color":"rgb(195,136,35)","anchor_point":"0.5,0.5","color_rgb":"0,0,0","glow_color":"255,255,255"}],[{"item_name":"Timeline_2","index_item":"2","property":"opacity","filetype":"image","start":"00:00:00.0","end":"00:00:01.0","start_value":"255","end_value":"255","video_audio_value":"","color":"rgb(195,136,35)","anchor_point":"0.5,0.5","color_rgb":"0,0,0","glow_color":"255,255,255"}],[{"item_name":"Timeline_2","index_item":"2","property":"ratio","filetype":"image","start":"00:00:00.0","end":"00:00:01.0","start_value":"","end_value":"","video_audio_value":"","color":"rgb(195,136,35)","anchor_point":"0.5,0.5","color_rgb":"0,0,0","glow_color":"255,255,255"}],[{"item_name":"Timeline_2","index_item":"2","property":"glow","filetype":"image","start":"00:00:00.0","end":"00:00:01.0","start_value":"0.01","end_value":"0.01","video_audio_value":"","color":"rgb(195,136,35)","anchor_point":"0.5,0.5","color_rgb":"0,0,0","glow_color":"255,255,255"}]]
};

 

 
/*
// ===== JSON → HJSON sin comillas =====
function jsonToHjsonNoQuotes(obj, indent = 0) {
  const space = '  '.repeat(indent);
  let result = '';
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (typeof item === 'object' && item !== null) {
        result += `${space}-|${jsonToHjsonNoQuotes(item, indent + 1)}`;
      } else {
        result += `${space}- ${item}|`;
      }
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      const value = obj[key];
      if (Array.isArray(value)) {
        result += `${space}${key}:|${jsonToHjsonNoQuotes(value, indent + 1)}`;
      } else if (typeof value === 'object' && value !== null) {
        result += `${space}${key}:|${jsonToHjsonNoQuotes(value, indent + 1)}`;
      } else {
        result += `${space}${key}: ${value}|`; 
      }
    }
  }
  return result;
}

// ===== HJSON sin comillas → JSON =====
function hjsonNoQuotesToJson(hjsonText) {
  const lines = hjsonText.split('|').filter(l => l.trim() !== '');
  function getIndent(line) {
    return line.match(/^(\s*)/)[1].length;
  }
  function parseValue(raw) {
    if (raw.startsWith('~')) return raw.slice(1);
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    if (raw === 'null') return null;
    return raw;
  }
  function parseBlock(lines, start, minIndent) {
    if (start >= lines.length) return [{}, start];
    const firstLine = lines[start].trim();
    const isArray = /^-/.test(firstLine);
    if (isArray) {
      const arr = [];
      let i = start;
      while (i < lines.length) {
        const line = lines[i];
        const ind = getIndent(line);
        if (ind < minIndent) break;
        const trimmed = line.trim();
        if (/^-\s*$/.test(trimmed)) {
          const [obj, next] = parseBlock(lines, i + 1, ind + 1);
          arr.push(obj);
          i = next;
        } else {
          const m = trimmed.match(/^-\s+(.+)$/);
          if (m) {
            arr.push(parseValue(m[1]));
            i++;
          } else {
            break;
          }
        }
      }
      return [arr, i];
    } else {
      const obj = {};
      let i = start;
      while (i < lines.length) {
        const line = lines[i];
        const ind = getIndent(line);
        if (ind < minIndent) break;
        const trimmed = line.trim();
        const keyOnly = trimmed.match(/^([^:]+):\s*$/); 
        const keyValue = trimmed.match(/^([^:]+):\s+(.+)$/);
        if (keyOnly) {
          const key = keyOnly[1].trim();
          const [child, next] = parseBlock(lines, i + 1, ind + 1);
          obj[key] = child;
          i = next;
        } else if (keyValue) {
          const key = keyValue[1].trim();
          obj[key] = parseValue(keyValue[2].trim());
          i++;
        } else {
          i++;
        }
      }
      return [obj, i];
    }
  }
  const [result] = parseBlock(lines, 0, 0);
  return result;
}
*/

// ===== JSON → HJSON sin comillas =====
function jsonToHjsonNoQuotes(obj, indent = 0) {
  const space = '  '.repeat(indent);
  let result = '';
  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (typeof item === 'object' && item !== null) {
        result += `${space}-|${jsonToHjsonNoQuotes(item, indent + 1)}`;
      } else {
        result += `${space}- ${item === '' ? '__EMPTY__' : item}|`;
      }
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      const value = obj[key];
      if (Array.isArray(value)) {
        result += `${space}${key}:|${jsonToHjsonNoQuotes(value, indent + 1)}`;
      } else if (typeof value === 'object' && value !== null) {
        result += `${space}${key}:|${jsonToHjsonNoQuotes(value, indent + 1)}`;
      } else {
        result += `${space}${key}: ${value === '' ? '__EMPTY__' : value}|`;
      }
    }
  }
  return result;
}

// ===== HJSON sin comillas → JSON =====
function hjsonNoQuotesToJson(hjsonText) {
  const lines = hjsonText.split('|').filter(l => l.trim() !== '');
  function getIndent(line) {
    return line.match(/^(\s*)/)[1].length;
  }
  function parseValue(raw) {
    if (raw === '__EMPTY__') return '';
    if (raw.startsWith('~')) return raw.slice(1);
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    if (raw === 'null') return null;
    return raw;
  }
  function parseBlock(lines, start, minIndent) {
    if (start >= lines.length) return [{}, start];
    const firstLine = lines[start].trim();
    const isArray = /^-/.test(firstLine);
    if (isArray) {
      const arr = [];
      let i = start;
      while (i < lines.length) {
        const line = lines[i];
        const ind = getIndent(line);
        if (ind < minIndent) break;
        const trimmed = line.trim();
        if (/^-\s*$/.test(trimmed)) {
          const [obj, next] = parseBlock(lines, i + 1, ind + 1);
          arr.push(obj);
          i = next;
        } else {
          const m = trimmed.match(/^-\s+(.+)$/);
          if (m) {
            arr.push(parseValue(m[1]));
            i++;
          } else {
            break;
          }
        }
      }
      return [arr, i];
    } else {
      const obj = {};
      let i = start;
      while (i < lines.length) {
        const line = lines[i];
        const ind = getIndent(line);
        if (ind < minIndent) break;
        const trimmed = line.trim();
        const keyOnly = trimmed.match(/^([^:]+):$/);
        const keyValue = trimmed.match(/^([^:]+):\s+(.*)$/);
        if (keyOnly) {
          const key = keyOnly[1].trim();
          const [child, next] = parseBlock(lines, i + 1, ind + 1);
          obj[key] = child;
          i = next;
        } else if (keyValue) {
          const key = keyValue[1].trim();
          obj[key] = parseValue(keyValue[2].trim());
          i++;
        } else {
          i++;
        }
      }
      return [obj, i];
    }
  }
  const [result] = parseBlock(lines, 0, 0);
  return result;
}
 

const hjsonText = jsonToHjsonNoQuotes(jsonObj);
console.log("HJSON sin comillas:\n" + hjsonText);

const parsedJson = hjsonNoQuotesToJson(hjsonText);
console.log("JSON parseado:", JSON.stringify(parsedJson, null, 2));







/*
// Prevenir drop en toda la página
document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
});

 
scrollWrapper.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

scrollWrapper.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("checking...");
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    
    const file = files[0];
 
    const fileType = check_file_type(file);
    
    if (!fileType) return; // Si no es video, audio o imagen
    
    let result = [];
    if (fileType === 'video' || fileType === 'audio') {
        // Crear elemento temporal para calcular duración
        const media = document.createElement(fileType);
        media.preload = 'metadata';
        media.src = URL.createObjectURL(file);
        filename_url[file.name] = media.src;
        console.log("file.name2:",file.name);	
        media.onloadedmetadata = () => {
            const duration = media.duration; // en segundos (con decimales)
            // Aquí puedes hacer lo que necesites con el archivo
            console.log('Archivo:', file.name, 'Duración:', duration);
            result = [file.name,duration];
        };
        
        media.onerror = () => {
            URL.revokeObjectURL(media.src);
            console.error('No se pudo leer la duración del archivo');
        };
    } else {
        // Para imagen
        const src = URL.createObjectURL(file);
        filename_url[file.name] = src;
        console.log('Imagen:', file.name);
	result = [file.name,""]; 
    }


    		let rect_color = "#7c55e6";
		if (fileType=="image"){ 
			rect_color = "rgb(195,136,35)";
		}
		if (fileType=="video"){ 
			rect_colo = "rgb(1, 140, 96)";
		}
		if (fileType=="audio"){ 
			rect_color = "rgb(7, 74, 145)";
		}

    				console.log("Nombre:", result[0]);
            			console.log("Duración:", result[1]);
				const file_name = result[0];
				  
				rectangulos.push([]);
				const customName =  "Timeline_"+rectangulos.length.toString();
				const index_item = rectangulos.length.toString();
 
				const json_data_02 =  {"service":"save_item_data","itemName":current_item,"property":current_property_id,"params":"time="+current_scroll_x, "rectangulos":unica_regla.rectangulos,"extra":"change2"}; 
				//websocketClient.send(JSON.stringify(json_data_02));
            			//createTab(customName);
            			console.log('Tab creado con nombre:', customName); 
		
				let end_time = "00:00:01.0";
				let video_audio_value = "";
				if (fileType=="video" || fileType=="audio"){
				   end_time = formatearTiempoDecimal(result[1]);
				   console.log("end_time:",end_time);
				   video_audio_value="00:00:00,"+result[1]+",1,100,"+end_time;	
				}
 
				 

	 			const first_rect = {"item_name":customName,"index_item":index_item,"property":"filename","filetype":fileType,"start":"00:00:00.0","end":end_time,"start_value":file_name,"end_value":"","video_audio_value":video_audio_value,color:rect_color}; 
				expandDicInput(first_rect); 
  
				resetear();

				closeModalDinamico();
				
				const change_view = document.getElementById('change_view');
				if (change_view && change_view.style.display === 'none') {
    					change_view.style.display = 'block';
				}
				 
});

// Función para detectar tipo de archivo
function check_file_type(file) {
    const type = file.type;
    
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.startsWith('image/')) return 'image';
    
    return null; // No es ninguno de los tres
}
*/ 
