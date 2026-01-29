 
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
	const extra_params = "&start_value="+bossInterval.start_value+"&anchor_point="+bossInterval.anchor_point+"&color_rgb="+bossInterval.color_rgb;
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
 
  const result = [firstDict, secondDict];
  console.log("NEW SEGMENTS:",result);
  unica_regla.rectangulos[index_global_row].splice(index_dic, 1, ...result);

  unica_regla.scroll_x[current_view] = split_position_global;//current_scroll_x split_position_global
  deseleccionarRectangulo();
  inicializar(); 
  send_rectangles("dividir_segmento");
  return result;
}


function add_file(){
	const filetype = selected_rect.dataset.filetype;
	let rect_color = "#7c55e6";
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
		//rect_color = "rgb(104, 69, 119)";
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

	 			const new_rect = {"item_name":customName,"index_item":index_item,"property":"filename","filetype":filetype,"start":start_time,"end":end_time,"start_value":file_name,"end_value":"","video_audio_value":video_audio_value,color:rect_color,anchor_point:"0.5,0.5",color_rgb:"0,0,0"}; 
 
				unica_regla.rectangulos[index_global_row].push(new_rect);

  				unica_regla.scroll_x[current_view] = timeToSeconds(start_time); 
 
				inicializar();
				//resetear();

				send_rectangles("add_file_same_row");	
 
 

        		} else {
            			console.log("No se seleccionó ningún archivo.");
        		}
    		})
    		.catch(err => console.error(err));
}


function expandDicInput(dic_input) { 
    const dic1 = {
        "position": ["640,360", "640,360"],
        "scale": ["1"],
        "rotation": ["0"],
        "opacity": ["255"],
	"ratio": ["", ""]
    };

    const dic2 = {
        "image": ["position", "scale", "rotation", "opacity","ratio"],
        "video": ["position", "scale", "rotation"],
	"audio": [],
	"text": ["position", "scale", "rotation", "opacity"]
    };

    const filetype = dic_input.filetype;
    if (!dic2[filetype]) { 
        return [dic_input];
    }

    const propsList = dic2[filetype]; 
    unica_regla.rectangulos.push([dic_input]); 

    propsList.forEach(prop => {
        const newDic = { ...dic_input };  
        newDic.property = prop;

        const valores = dic1[prop] || ["", ""];  
        if (valores.length === 1) {
            newDic.start_value = valores[0];
            newDic.end_value = valores[0];
        } else {
            newDic.start_value = valores[0];
            newDic.end_value = valores[1];
        }
	newDic.end = "00:00:01.0";
 
	unica_regla.rectangulos.push([newDic]);
    });
    console.log("unica_regla.rectangulos error:",unica_regla.rectangulos);
 
}


function handleSingleFileUpload(file) { 
  const files = [file];
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

            if (selectedOption_item === 'video' || selectedOption_item === 'audio') {
                // Crear elemento temporal para calcular duración
                const media = document.createElement(selectedOption_item);
                media.preload = 'metadata';
                media.src = URL.createObjectURL(file);
		filename_url[file.name] = media.src;
		filename_dic_url[file.name] = {"blob_url":media.src,"filetype":selectedOption_item};

                media.onloadedmetadata = () => {
                    const duration = media.duration; // en segundos (con decimales)
                    //URL.revokeObjectURL(media.src);//Not allowed to load local resource
                    resolve([file.name, duration]);
                };

                media.onerror = () => {
                    URL.revokeObjectURL(media.src);
                    reject('No se pudo leer la duración del archivo');
                };
            } else {
                // Para imagen 
		const blobUrl = URL.createObjectURL(file);
  		filename_url[file.name] = blobUrl;
		//poner en la funcion "crearMedia"
		filename_dic_url[file.name] = {"blob_url":blobUrl,"filetype":selectedOption_item};
                resolve([file.name, ""]);
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
        left: scrollWrapper.scrollLeft + 200*10,
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

  if (e.target.matches("#principal_view") || e.target.closest("#principal_view")){
	 mostrarVistaPrincipal();
  }
  if (e.target.matches("#create_item") || e.target.closest("#create_item")){
	abrirModalDinamicoSimple(html_create_item);
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
				  
				rectangulos.push([]);
				const customName =  "Timeline_"+rectangulos.length.toString();
				const index_item = rectangulos.length.toString();
				crearReglaIndividual(parseInt(index_item)); 
 
				const json_data_02 =  {"service":"save_item_data","itemName":current_item,"property":current_property_id,"params":"time="+current_scroll_x, "rectangulos":unica_regla.rectangulos,"extra":"change2"}; 
				//websocketClient.send(JSON.stringify(json_data_02));
            			//createTab(customName);
            			console.log('Tab creado con nombre:', customName); 
		
				let end_time = "00:00:01.0";
				let video_audio_value = "";
				if (selectedOption_item=="video" || selectedOption_item=="audio"){
				   end_time = formatearTiempoDecimal(result[1]);
				   console.log("end_time:",end_time);
				   video_audio_value="00:00:00,"+result[1]+",1,100,"+end_time;	
				}
 
				 

	 			const first_rect = {"item_name":customName,"index_item":index_item,"property":"filename","filetype":selectedOption_item,"start":"00:00:00.0","end":end_time,"start_value":file_name,"end_value":"","video_audio_value":video_audio_value,color:rect_color,anchor_point:"0.5,0.5",color_rgb:"0,0,0"}; 
				expandDicInput(first_rect); 
  
				resetear();

				closeModalDinamico();
				
				const change_view = document.getElementById('change_view');
				if (change_view && change_view.style.display === 'none' && window.innerWidth > 500) {
    					change_view.style.display = 'block';
				} 

				const export_btn = document.getElementById('export-btn'); 
				const undo_redo_container_2 = document.getElementById('undo-redo-container-2');
    				if (export_btn && undo_redo_container_2){ 
					export_btn.style.display = "flex"; 
					undo_redo_container_2.style.display = "flex"; 
    				}
				const boton_update = document.getElementById('update');
				if (boton_update) {
    					//boton_update.style.display = 'block';
				}


				let current_params = "filetype="+selectedOption_item; 

				const json_data = {"service":"change_item_view","itemName":customName,"property":"empty","params":current_params,"file_type":selectedOption_item,"resolution":resolution_scene,"extra0":"0","extra":"0"}; 
				websocketClient.send(JSON.stringify(json_data));

				if (true){
				 
				const json_data_2 =  {"service":"save_item_data","itemName":customName,"property":"filename","params":"empty", "rectangulos":[first_rect],"extra":"clip"}; 
        			websocketClient.send(JSON.stringify(json_data_2)); 
				console.log("ENVIADO4");
				}

				if (item_types[selectedOption_item]){
				    if (!item_types[selectedOption_item].includes(customName)){
					item_types[selectedOption_item].push(customName);	
				    }
				}

	

        		} else {
            			console.log("No se seleccionó ningún archivo.");
        		}
    		})
    		.catch(err => console.error(err));
		}else{	
 
			rectangulos.push([]);
			const customName =  "Timeline_"+rectangulos.length.toString();
			const index_item = rectangulos.length.toString();
crearReglaIndividual(parseInt(index_item)); 
			const first_rect = {"item_name":customName,"index_item":index_item,"property":"filename","filetype":selectedOption_item,"start":"00:00:00.0","end":"00:00:01.0","start_value":"","end_value":"","video_audio_value":"",color:rect_color,anchor_point:"0.5,0.5",color_rgb:"0,0,0"}; 

			expandDicInput(first_rect);  
			resetear(); 
			closeModalDinamico();

			 

			const change_view = document.getElementById('change_view');
			if (change_view && change_view.style.display === 'none' && window.innerWidth > 500) {
    				change_view.style.display = 'block';
			} 

			const export_btn = document.getElementById('export-btn');
			const undo_redo_container_2 = document.getElementById('undo-redo-container-2');
    			if (export_btn && undo_redo_container_2){ 
				export_btn.style.display = "flex"; 
				undo_redo_container_2.style.display = "flex"; 
    			}
			const boton_update = document.getElementById('update');
				if (boton_update) {
    					//boton_update.style.display = 'block';
				}

			 
			let current_params = "filetype="+selectedOption_item; 
			const json_data = {"service":"change_item_view","itemName":customName,"property":"empty","params":current_params,"file_type":"text","resolution":resolution_scene,"extra0":"0","extra":"0"}; 
			//websocketClient.send(JSON.stringify(json_data));
			safeSend(JSON.stringify(json_data));
			const json_data_2 =  {"service":"save_item_data","itemName":customName,"property":"filename","params":"empty", "rectangulos":[first_rect],"extra":"text"}; 
        		websocketClient.send(JSON.stringify(json_data_2));

			 
 
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
  if (e.target.matches(".btn-close") || e.target.closest(".btn-close")) { 
     console.log("CLOSING MODAL");
     closeModalDinamico();
  }
});


function send_rectangles(extra){ 
	const index_global_row = selected_rect.dataset.index_global_row;
	const item_name = selected_rect.dataset.item_name;
	const property = selected_rect.dataset.property;

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
 

function request_export(seconds_to_edit_str){ 
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