let lastPressedButton=0;
let caption_length=0.5; 
let interval;
let interval_2;
let captions_video="";
let new_captions_video="";
let websocketClient;
let send_new_captions=0;

let blob;
let videoURL;
let first_url="";

let final_lang="";
let language_video="";

let bad_connection_choose_file=1;
let bad_connection_create_video=0;
let waiting_video=0;
let waiting_caption=0;
let current_output_language="Translate";

let type_download=0;
let isLoading_mp4 = false;
let current_duration=1;
let current_step=0;

let selectedPositionSub=1;
let selectedTextGlowSub=1;
let selectedAudioSub=1;
let extra_seconds=0;

 

localStorage.setItem('selected-font', '9');
localStorage.setItem('selected-color', 'FFFFFF');
localStorage.setItem('caption_length', 0.5);
 

  
const currentPath = window.location.pathname;
  
 


const settingsList = document.getElementById('settingsList');

if (settingsList) {
    const nuevoItem = `
        <li>
            <div id="settings-position-sub" class="settings-font-block"></div>
        </li>
    `;
    settingsList.insertAdjacentHTML('beforeend', nuevoItem);
}

const div_text=`<div id="positionModalSub" class="positionModalSub">
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
    </div>` ;
const principalContainer = document.querySelector('.card-container');
  if (principalContainer) {
        principalContainer.insertAdjacentHTML('beforeend', div_text);
  }


function generateRandomUserId() {
    const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
    let userId = '';
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      userId += digits[randomIndex];
    } 
    return userId;
  };
  
  let userId = localStorage.getItem('userid');
  
  if (!userId) {
    userId = generateRandomUserId();
    localStorage.setItem('userid', userId);
  };
  
  
  










function getTextareaValue() {
    let new_captions="";
    let index_captions=0;
    const textareas = document.querySelectorAll('.flexible-captions');
    textareas.forEach(textarea => {

        let new_line = textarea.value;
        new_captions=new_captions+new_line;

        if (index_captions<textareas.length-1)
        {
            new_captions=new_captions+"-o-";
        }
        index_captions=index_captions+1;
    });

    return new_captions;
};


function hide_choose_file() {
    var choose_file = document.querySelector('.chooseFile-container'); 
    
    if (choose_file) {
        choose_file.style.display = 'none';
    }
    
};
 

function hide_circle() {
    var elemento = document.querySelector('.loader-container');
    if (elemento) {
        elemento.style.display = 'none';
    }

    var elemento2 = document.querySelector('.loader-description');
    if (elemento2) {
        elemento2.style.display = 'none';
    }
};

function hide_circle_2() {
    var elemento_circle2 = document.querySelector('.loader-container-2');
    if (elemento_circle2) {
        elemento_circle2.style.display = 'none';
    }

    var elemento2_circle2 = document.querySelector('.loader-description-2');
    if (elemento2_circle2) {
        elemento2_circle2.style.display = 'none';
    }
};

function hide_card_captions() {
    var card_captions_1 = document.querySelector('.card-captions');
    if (card_captions_1) {
        card_captions_1.style.display = 'none';
    }
};

function hide_video_buttons() {
    var video_buttons = document.querySelector('.buttons-container');
    if (video_buttons) {
        video_buttons.style.display = 'none';
    }
};
function hide_video_container() {
    var video_container = document.querySelector('.video-container');
    if (video_container) {
        video_container.style.display = 'none';
    }
    
};

function hide_export_mp4() {
    var button_export_mp4 = document.getElementById('exportDropdown-mp4');
    if (button_export_mp4) {
        button_export_mp4.style.display = 'none';
    }
};
  
 
 

let xx1="s";
let xx2="y";
let xx3="m";
let xx4="p";
let xx5="h";
let xx6="o";
let xx7="n";
let xx8="i";
let xx9="o";
let xx10="u";
let xx11="s";
let xx12=".";
let xx13="gli";
let xx14="tch";
let xx15=".me";




const start_elements = [ 
    { id: 'login-btn', content: 'Get started' }, 
    { id: 'li-home', content: 'Home' }, 
    { id: 'li-affiliates', content: 'Deals' },
    { id: 'li-features', content: 'Features' },
    { id: 'li-tutorial', content: 'How to use' },
    { id: 'li-questions', content: 'FAQ' },
    { id: 'dropdown-btn', content: 'Translate  &#x025BE;' },
    { id: 'reset-dropdown', content: 'Reset' },
    { id: 'english-dropdown', content: 'English' },
    { id: 'spanish-dropdown', content: 'Spanish' },
    { id: 'portuguese-dropdown', content: 'Portuguese' },
    { id: 'french-dropdown', content: 'French' },
    { id: 'german-dropdown', content: 'German' },
    { id: 'italian-dropdown', content: 'Italian' },
    { id: 'exportDropdown-mp4', content: 'MP4 Video' },
    { id: 'exportDropdown-srt', content: 'Transcription' },
    { id: 'choose_video_p', content: 'Choose video' },
    { id: 'selected-language', content: 'Language' },
    { id: 'change-language-a', content: 'change' }, 

    { selector: '.error-dimension', content: 'Something went wrong. Try it again' },
    { selector: '.percentage', content: '0%' },
    { selector: '.loader-description', content: 'Loading . . .' },

    { id: 'settings-openModalBtn', content: `<i class="fas fa-cog"></i> Customize` }, 
    { id: 'createVideo', content: `<i class="fas fa-film"></i> Subtitle video` }, 

    { selector: '.error-creation', content: 'Bad connection. Try it again' }, 

    { id: 'editButton', content: `<i class="fas fa-pencil-alt"></i> Edit` }, 
    { id: 'saveButton', content: `<i class="fas fa-check"></i> Save` }, 
    { id: 'exportDropdown-button', content: `<i class="fas fa-download"></i> Export` }, 

    { selector: '.close-yes', content: 'Yes' }, 
    { selector: '.close-no', content: 'No' }, 

    { id: 'pages', content: 'Pages' }, 
    { id: 'videogenerator', content: 'Video translator' }, 
    { id: 'privacy_policy', content: 'Privacy Policy' }, 
    { id: 'company', content: 'Company' }, 
    { id: 'terms_conditions', content: 'Terms & Conditions' }, 

    { selector: '.copyright', content: '© 2024 manycaptions.com. All rights reserved' }, 
    { selector: '.settings-title', content: 'Settings' }, 

    { id: 'settings-font', content: 'Text font' },
    { id: 'settings-color', content: 'Text color' },

    { id: 'position-down', content: 'Down' },
    { id: 'position-center', content: 'Center' },
    { id: 'position-up', content: 'Up' },

    { id: 'textglow-down', content: 'Off' },
    { id: 'textglow-center', content: 'Thin' },
    { id: 'textglow-up', content: 'Thick' },

    { id: 'audio-down', content: 'Off' },
    { id: 'audio-center', content: 'Low' },
    { id: 'audio-up', content: 'High' },

    { id: 'position-sub-title', content: 'Position of subtitles' },
    { id: 'textglow-sub-title', content: 'Text Glow' },
    { id: 'audio-sub-title', content: 'Audio enhacement' },

    { id: 'settings-position-sub', content: 'Text design' }, 
    { id: 'monoColor', content: 'Monocolor' },
    { id: 'multiColor', content: 'Multicolor' },
    { id: 'saveColor', content: 'Save' },
    { id: 'save-lang', content: 'Save' },
    { selector: '.ask-lang', content: 'Select video language' }, 
    { id: 'limit_size_message', content: 'This video exceeds 150MB of free plan. Use an online video compressor' } 

  ];
  
  start_elements.forEach(item => {
    const el = item.id
      ? document.getElementById(item.id)
      : document.querySelector(item.selector);
  
    if (el) {
      el.innerHTML = item.content;
    }
  });   
 




 
 let url_websocket="symphonious20.glitch.me";

 

function show_choose_file() {
    var elemento = document.querySelector('.chooseFile-container');
    if (elemento) {
        elemento.style.display = 'flex';
    }
};


function show_circle() {
    var loader_container = document.querySelector('.loader-container');
    if (loader_container) {
        loader_container.style.display = 'flex';
    }
    var elemento2 = document.querySelector('.loader-description');
    if (elemento2) {
        elemento2.style.display = 'flex';
    }
};
function show_circle_2() {
    var show_elemento_circle2 = document.querySelector('.loader-container-2');
    if (show_elemento_circle2) {
        show_elemento_circle2.style.display = 'flex';
    }

    var elemento2_circle2 = document.querySelector('.loader-description-2');
    if (elemento2_circle2) {
        elemento2_circle2.style.display = 'flex';
    }
};

function show_card_captions() {
    var card_captions_2 = document.querySelector('.card-captions');
    if (card_captions_2) {
        card_captions_2.style.display = 'flex';
    }
};
function show_video_buttons() {
    var video_buttons = document.querySelector('.buttons-container');
    if (video_buttons) {
        video_buttons.style.display = 'flex';
    }
};
function show_video_container() {
    var video_container = document.querySelector('.video-container');
    if (video_container) {
        video_container.style.display = 'flex';
    }

};
 
 

function show_exportDropdown() {
    var button_exportDropdown = document.querySelector('.exportDropdown');
    if (button_exportDropdown) {
        button_exportDropdown.style.display = 'inline-block';
    }
};

function show_export_mp4() {
    var button_export_mp4 = document.getElementById('exportDropdown-mp4');
    if (button_export_mp4) {
        button_export_mp4.style.display = 'inline-block';
    }
};

 





 

function scrollToElement(element) {
    var container = document.querySelector('.form-container');
    container.scrollTop = element.offsetTop - container.offsetTop - (container.offsetHeight / 2) + (element.offsetHeight / 2);
};



var videoElement = document.getElementById('my-video-2');
if (videoElement){
    videoElement.setAttribute('controlsList', 'nodownload');

    videoElement.addEventListener('timeupdate', function() {
        var currentTime = videoElement.currentTime;
        
        var hours = Math.floor(currentTime / 3600);
        var minutes = Math.floor((currentTime - hours * 3600) / 60);
        var seconds = Math.floor(currentTime - hours * 3600 - minutes * 60);
        var totalSeconds = Math.floor(currentTime);

        

        if (totalSeconds%caption_length==0){
            
            write_captions(totalSeconds/caption_length);
        };

        
        
    }); 
}
 


    function write_captions(indice) {
        const textareas = document.querySelectorAll('.flexible-captions');
        if (caption_length==1){ 
            if (indice<textareas.length){
                scrollToElement(textareas[indice]);
                textareas[indice].style.border = '2px solid rgb(119, 0, 255)';
                let suma=0;
                textareas.forEach(textarea => {
                    if (suma!=indice){
                        textarea.style.border = '1px solid rgb(177, 177, 177,0.5)';
                    }
                    suma=suma+1
                }); 
            } 
        }

        if (caption_length<0.9){
            if (indice < textareas.length) {
                 scrollToElement(textareas[indice]);
                textareas.forEach((textarea, i) => {
                    if (i === indice || i === indice + 1) {
                        textarea.style.border = '2px solid rgb(119, 0, 255)';
                    } else {
                        textarea.style.border = '1px solid rgba(177, 177, 177, 0.5)';
                    }
                });
            } 
        }

             

        if (indice==textareas.length-1){
            textareas[indice].style.border = '1px solid rgb(177, 177, 177,0.5)';
        }
 
    };
    






    


 

  

function start_percentage(type_loading) {
    var delta_seconds=1200;
    var time_increment=1;
    if (type_loading==1){
        delta_seconds=1000;
        if (current_duration<62){
            delta_seconds=2000;
        }

        if (current_duration>=62){
            delta_seconds=1000;
        }
        if (current_duration>180){
            delta_seconds=900;
            time_increment=2;
        }
        if (current_duration>300){
            delta_seconds=500;
            time_increment=4;
        }
    }else{
        delta_seconds=1200 + extra_seconds;
        if (current_duration>150){
            delta_seconds=1000;
        }
        if (current_duration>240){
            delta_seconds=700;
        }
        
    }
    let percentage = 0;
    let percentage_visible = 0;
    interval = setInterval(() => {
        percentage += time_increment;

         
        percentage_visible = 100*(percentage/current_duration); 
        const timeRemaining = Math.max(0, Math.floor(1+current_duration - percentage));
 
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
 

        document.querySelector('.percentage').textContent = `${formattedTime}`;
        const circle = document.querySelector('.path');
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage_visible / 100) * circumference;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
    
        if (percentage_visible >= 99) {
            clearInterval(interval);
        }
    }, delta_seconds); 
  
  };
  
  
  
  
  
  
  function reset_percentage() {
    let percentage = 0;
    document.querySelector('.percentage').textContent = `${percentage}%`;
      const circle = document.querySelector('.path');
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (percentage / 100) * circumference;
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = offset; 
  
  };

  

  


const selectImage = document.querySelector('.btn-upload');
const inputFile = document.querySelector('#file'); 

if (selectImage && inputFile){
    selectImage.addEventListener('click', function () {
        if (final_lang!=""){
            inputFile.click();
            
        }else{
            populateLanguageList();
            const languageModal = document.getElementById('languageModal');
            languageModal.style.display = 'block';
        }
    }); 
}

 


function enviarMensaje(websocket, mensaje) {
    return new Promise((resolve, reject) => {
        const listener = (event) => {
            resolve(event.data); 
            websocket.removeEventListener("message", listener); 
        };
        websocket.addEventListener("message", listener);
        
        websocket.send(mensaje);
    });
};




async function sendVideo(selectedFile){
    document.querySelector('.percentage').textContent = "0%";
    document.querySelector('.loader-description').innerHTML = 'Uploading video . . .';
    
    const chunkSize = 200 * 1000; 
    const totalSize = selectedFile.size;
    websocketClient.send("video_size:"+totalSize.toString());
    
    const delta_float_percent=100*chunkSize/totalSize;
    
    var offset = 0;
    var n=0;
    var float_percentage = 0;
    while (offset < totalSize) {
        
        
        const end = offset + chunkSize;
        const chunk = (end < totalSize) ? selectedFile.slice(offset, end) : selectedFile.slice(offset);
        offset = end;
  
        await enviarMensaje(websocketClient, chunk);
        


        if (float_percentage<=100){
            var round_percentage = float_percentage.toFixed(1);
            document.querySelector('.percentage').textContent = `${round_percentage}%`;
            float_percentage=float_percentage+delta_float_percent;
        };
        
        n=n+1;

        
    };
  };



 if (inputFile){

    inputFile.addEventListener('change', (event) => {

    

        const fileInputElement = document.getElementById('file');
        const selectedFile = fileInputElement.files[0];

        

        let video_file;
        video_file = event.target.files[0];

        const filePath = URL.createObjectURL(video_file);

        
        
        
        
        

        var normal_size=150000000;
        const user_id_size=localStorage.getItem('userid');
        if (user_id_size.includes("0x")){
            normal_size=500000000;
        }
        
        if(video_file.size < normal_size) {

            
            hide_choose_file();
            
            show_circle();
            changeVideoSource(filePath);

            const formData = new FormData();
            formData.append('file', selectedFile);

            

            

            

            

            
            sendVideo(selectedFile);
            
    

        } else {
            
            const modal_limit_size = document.getElementById('myModal_limit_size');
            modal_limit_size.style.display = 'block';
            inputFile.value='';
        }
    });

  } 

 


function generarInputs_captions(frases){
    if (caption_length==1){
        return generarInputs_captions_1seg(frases);
    }
    if (caption_length<0.9){
        return generarInputs_captions_05seg(frases);
    }
}


 function generarInputs_captions_05seg(frases) {
    var form = document.getElementById("form-container");
    form.innerHTML = "";

    var arrayFrases = frases.split("-o-");
    while (arrayFrases.length > 0 && arrayFrases[arrayFrases.length - 1] === '') {
        arrayFrases.pop();
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
    while (arrayFrases.length > 0 && arrayFrases[arrayFrases.length - 1] === '') {
        arrayFrases.pop();
    }

    arrayFrases.forEach(function(frase,index) {
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
};

function autoResize(textarea) {
    textarea.style.height = 'auto';  
    textarea.style.height = (textarea.scrollHeight) + 'px';
};


toggleEditability(1);



function isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  

  function downloadVideo_stream() {
    const downloadLink = document.createElement('a');
      downloadLink.href = 'https://symphonious20.glitch.me/download/'+userId+'/export'; 
      var randomdownload = Math.floor(1000 + Math.random() * 9000);
      var randomstring = randomdownload.toString();
      downloadLink.download = 'clip_manycaptions'+randomstring+'.mp4'; 
      downloadLink.click(); 
  };

  function downloadVideo_2() {
     const timestamp_download = Date.now();
                

    if (type_download==0){
        console.log("download type 0");
        const downloadLink = document.createElement('a');
        
	downloadLink.href = `https://symphonious20.glitch.me/download/${userId}/export?ts=${timestamp_download}`; 
        var randomdownload = Math.floor(1000 + Math.random() * 9000);
        var randomstring = randomdownload.toString();
        downloadLink.download = 'clip_manycaptions'+randomstring+'.mp4'; 
        downloadLink.click();
        document.body.removeChild(downloadLink);
        console.log("exported");
    }else{
        console.log("download type 1");
        if (videoURL && isValidURL(videoURL)) {
            const a_static_download = document.createElement('a');
            a_static_download.style.display = 'none';
            a_static_download.href = videoURL;
            var randomdownload = Math.floor(1000 + Math.random() * 9000);
            var randomstring = randomdownload.toString();
            a_static_download.download = 'manycaptions'+randomstring+'.mp4';
            document.body.appendChild(a_static_download);
            a_static_download.click();
            document.body.removeChild(a_static_download);
            
          } else {
            console.log('videoURL is not valid');
          }
    }
    
  };


  function downloadVideo(){
    console.log("exporting video...");
  }
  

 

function generateSRT(phrases) {
    var srt = '';
    var startTime = 0;
    var step = 0.5; 
    var step0 = parseFloat(localStorage.getItem('caption_length'));
    if (step){
        step=step0;
    }else{
        step=1;
    }
    console.log("step",step); 

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
    return String(num).padStart(2, '0');
}

function padMillis(num) {
    return String(num).padStart(3, '0');
}


function correctUTF8_0(str) {
    const encoder = new TextEncoder('iso-8859-1');
    const encodedBytes = encoder.encode(str);
    const utf8Text = new TextDecoder('utf-8').decode(encodedBytes);
    return utf8Text;
}

function correctUTF8(str) {
    const latin1Bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        latin1Bytes[i] = str.charCodeAt(i);
    }
    const utf8Text = new TextDecoder('utf-8').decode(latin1Bytes);
    return utf8Text;
}




  function downloadTXT() {
    var current_captions_str=getTextareaValue();
    var phrases_list_str = current_captions_str.split("-o-");
    var randomdownload = Math.floor(1000 + Math.random() * 9000);
    var randomstring = randomdownload.toString();
    var filename_srt="manycaptions"+randomstring+".txt";
    var content_srt = generateSRT(phrases_list_str);
    

    const blob_str = new Blob([content_srt], { type: 'text/plain;charset=iso-8859-1' });
    const url_str = URL.createObjectURL(blob_str);

    const a_str = document.createElement('a');
    a_str.href = url_str;
    a_str.download = filename_srt;
    document.body.appendChild(a_str);
    a_str.click();
    document.body.removeChild(a_str);
    URL.revokeObjectURL(url_str);
};
function downloadSRT_2() {
    var current_captions_str=getTextareaValue();
    var phrases_list_str = current_captions_str.split("-o-");
    var randomdownload = Math.floor(1000 + Math.random() * 9000);
    var randomstring = randomdownload.toString();
    var filename_srt="manycaptions"+randomstring+".txt";
    var content_srt = generateSRT(phrases_list_str);
    

    const blob_str = new Blob(["\uFEFF"+content_srt], { type: 'application/octet-stream' });
    const url_str = URL.createObjectURL(blob_str);

    const a_str = document.createElement('a');
    a_str.href = url_str;
    a_str.download = filename_srt;
    document.body.appendChild(a_str);
    a_str.click();
    document.body.removeChild(a_str);
    URL.revokeObjectURL(url_str);
};

function downloadSRT(){
    console.log("exporting srt...");
}

  function changeVideoSource_2() {

    const sourceElement = videoElement.querySelector('source');

    if (sourceElement) {
        sourceElement.src = 'https://symphonious20.glitch.me/download/'+userId+'/watch'; 
        videoElement.load(); 
    } else {
        console.error('No se encontró el elemento source.');
    }

};

function request_video_mp4() {
    
    if (isLoading_mp4) {
        console.log('La solicitud de carga ya está en curso.');
        return; 
    }

    isLoading_mp4 = true; 

    const sourceElement = videoElement.querySelector('source');

    videoElement.currentTime = 0;
    if (sourceElement) {
	    
        const userId = userId; 

        if (!userId) {
            console.error('El userId es inválido.');
            isLoading_mp4 = false; 
            return; 
        }

        
        sourceElement.src = 'https://symphonious20.glitch.me/download/'+userId+'/watch'; 
        videoElement.load(); 
        isLoading_mp4 = false;

    } else {
        console.error('No se encontró el elemento <source>.');
        isLoading_mp4 = false; 
    }
};

function request_video_mp4_2() {
	
            const videoElement = document.getElementById('my-video-2');
            const sourceElement = videoElement.querySelector('source');
            if (videoElement) {
                videoElement.pause(); 
                sourceElement.src = ''; 
		videoElement.currentTime = 0;
                videoElement.load();
            }
            if (sourceElement) {
		const timestamp_new = Date.now();
                sourceElement.src = `https://symphonious20.glitch.me/download/${userId}/watch?ts=${timestamp_new}`; 
                videoElement.currentTime = 0;
		videoElement.load();
            }
        };


function toggleEditability(option) {
    const textareas = document.querySelectorAll('.flexible-captions');  

    if (option==0){
        textareas.forEach(textarea => {
            textarea.readOnly = true;  
            textarea.style.border = '1px solid rgba(177, 177, 177,0.2)';
            textarea.style.color = 'rgba(50, 50, 50,1)';
        });
    }else{
        textareas.forEach(textarea => {
            textarea.readOnly = false;  
            textarea.style.border = '1px solid #7c55e6';
            textarea.style.color = 'rgba(0, 0, 0,1)';
        });
    };

    const saveButton = document.getElementById("saveButton");
    const editButton = document.getElementById("editButton");

    if (saveButton && editButton){
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
};


 


let connectionTimeoutCreation;
function check_edited_captions() {
    
    if (bad_connection_create_video==0 && waiting_video==0){
        websocketClient.send("request");
        
        bad_connection_create_video=1;
        connectionTimeoutCreation = setTimeout(function() {
            
            document.querySelector('.error-creation').style.display = 'block';
        }, 5000);
    }else{
        
        document.querySelector('.error-creation').style.display = 'block';
    }
};
function handleServerResponse(data) {
    if (data === '1') {
        
        clearTimeout(connectionTimeoutCreation);
        check_edited_captions_next();
    }
};

function check_edited_captions_next() {
    const user_id=localStorage.getItem('userid');
    new_captions_video=getTextareaValue();
    
    
    var modalContent = document.querySelector('.modal-content p');
    if (new_captions_video==captions_video && send_new_captions==0)
    {
        modalContent.textContent = 'The subtitles have not been edited. Do you want to continue?';
        modal.style.display = "block";
        bad_connection_create_video=0;  
    }else{

        if (lastPressedButton==1){
            modalContent.textContent = 'The changes have not been saved. Do you want to save them?';
            modal.style.display = "block";
            bad_connection_create_video=0;
        }else{
            if (true){

                show_export_mp4();

                document.querySelector('.error-creation').style.display = 'none';
                
                var sendFont = localStorage.getItem('selected-font');
                var sendColor = localStorage.getItem('selected-color');
                var sendPositionSub = selectedPositionSub;
                var sendTextGlowSub = selectedTextGlowSub;
                var sendAudioSub = selectedAudioSub;

                 
            
                captions_video=new_captions_video; 
                
                websocketClient.send("tocreate_client_"+user_id+"_client_"+new_captions_video+"_client_"+first_url+"_client_"+sendFont+"_client_"+sendColor+"_client_"+sendPositionSub+"_client_"+sendTextGlowSub+"_client_"+sendAudioSub);

                
                video_received=0;
                
                hide_card_captions();
                hide_video_buttons();
                hide_video_container();
                start_percentage(2);
                show_circle();

                waiting_video=1;
            };
        };
 
    };
    
};












const videoPlayer = document.getElementById('videoPlayer');

function changeVideoSource(newSource) {
  const sourceElement = videoElement.querySelector('source');
  
  if (sourceElement) {
      sourceElement.src = newSource;
      videoElement.load(); 
      videoElement.onloadedmetadata = function () { 
        current_duration = Math.round(videoElement.duration);
        console.log('Duración del video:', current_duration, 'segundos');
       };
  } else {
      console.error('No se encontró el elemento source.');
  }
};


 












let current_chunk_size=0;
let videoChunks = [];



function connect(type_connection) {

    const user_id=localStorage.getItem('userid');

    websocketClient = new WebSocket("wss://"+url_websocket+"/"+user_id);
  
    
    console.log("connecting...");
    
      websocketClient.addEventListener('open', () => {
        console.log("Client connected"); 
        const send_type_connection = "type_connection=="+type_connection+"=="+currentPath+"=="+user_id;
        websocketClient.send(send_type_connection);

        if (waiting_caption==1){
            websocketClient.send("check_captions");
        };

        bad_connection_create_video=0;

        const error_creation = document.querySelector('.error-creation');
        if (error_creation){
            error_creation.style.display = 'none';
        }
          

        if (bad_connection_choose_file==1){
            hide_circle();
            show_choose_file();
        };
        
        
 

        let referralCode = localStorage.getItem('referralCode');
        if (referralCode !== null && referralCode !== '') {
            websocketClient.send("code:"+referralCode);
        };
        
        
        

        
    });
   

      
  
      websocketClient.addEventListener('message', (event) => {

        handleServerResponse(event.data);

        var message_result = event.data;

        if (typeof message_result==="string"){

 
            if (message_result.includes("affiliate_message:")){
                if (message_result.includes("20% discount applied")){
                    const aff_message=message_result.split(":")[1];
                    const aff_code=message_result.split(":")[2];
                    document.getElementById("discountMessage").innerHTML = aff_message;
                    document.getElementById("discountMessage").style.display = "flex";
                    localStorage.setItem('referralCode', aff_code);
                }
                if (message_result.includes("This discount code does not exist")){
                    document.getElementById("discountMessage").style.display = "none";
                    localStorage.setItem('referralCode', '');
                }
            }
            

            if (message_result.split("_client_")[0]=="translated"){
                
                var translated_captions=message_result.split("_client_")[1];
                new_captions_video=translated_captions;
                
                generarInputs_captions(translated_captions);
                toggleEditability(0);

                var dropdownBtn = document.getElementById("dropdown-btn");
                dropdownBtn.innerHTML =  current_output_language + " &#x025BE;";
                dropdownBtn.disabled = false;

                
            }


            if (message_result.split("_client_")[0]=="enviar"){

                current_step=1;

                waiting_video=0;

                waiting_caption=0;
                bad_connection_choose_file=0;
                captions_video=message_result.split("_client_")[2];
                first_url="none";
                caption_length=message_result.split("_client_")[4]; 
                localStorage.setItem('caption_length', caption_length);
                
                clearInterval(interval);
                reset_percentage();
                
                show_card_captions();
                generarInputs_captions(captions_video);
                toggleEditability(1);
                hide_choose_file();
                hide_circle();
                show_video_buttons();
                show_video_container();
 

                document.querySelector('.loader-description').innerHTML = 'Subtitling video . . .';
            }

            if (message_result=="good_file"){
                waiting_caption=1;
                bad_connection_choose_file=0;

                clearInterval(interval);
                start_percentage(1); 
                document.querySelector('.loader-description').innerHTML = 'Transcribing video . . .';
                document.querySelector('.percentage').style.display = 'flex';  
            }

             

            if (message_result=="wrong_premium"){
                inputFile.value='';
                hide_circle();
                show_choose_file();
                document.querySelector('.error-dimension').innerHTML = 'This file exceeds 100MB';
                document.querySelector('.loader-description').innerHTML = 'Uploading video . . .';
                document.querySelector('.error-dimension').style.display = 'flex';  

            }

            if (message_result=="check_captions_false"){
                waiting_caption=0; 
            }

            if (message_result.includes("wrong_file:")){
                inputFile.value='';
                hide_circle();
                show_choose_file();
                document.querySelector('.loader-description').innerHTML = 'Uploading video . . .';
                if (message_result.split(":")[1]=="bad_connection")
                {
                    document.querySelector('.error-dimension').innerHTML = 'Bad connection. Try it again';
                    final_lang="";
                }
                if (message_result.split(":")[1]=="bad_file")
                {
                    document.querySelector('.error-dimension').innerHTML = 'This file could not be uploaded. Try it with another file'; 
                }
                if (message_result.split(":")[1]=="random_error")
                {
                    document.querySelector('.error-dimension').innerHTML = 'Something went wrong. Try it again'; 
                };
                
                document.querySelector('.error-dimension').style.display = 'flex'; 
            }


            
            if (message_result.split("_client_")[0]=="created_video"){
                bad_connection_choose_file=0;
                bad_connection_create_video=0;
                waiting_video=0;
                videoURL=message_result.split("_client_")[2];
                

                clearInterval(interval);
                reset_percentage();

                changeVideoSource(videoURL);
                show_card_captions();
                toggleEditability(1);
                hide_choose_file();
                hide_circle();
                show_video_buttons();
                show_video_container();
 
                show_export_mp4();
                
            }


            if (message_result==="watch_video" && current_step>0){

                type_download=0;
                
                bad_connection_choose_file=0;
                bad_connection_create_video=0;
                waiting_video=0;

                clearInterval(interval);
                reset_percentage(); 
                show_card_captions();
                generarInputs_captions(captions_video);
                toggleEditability(1);
                hide_choose_file();
                hide_circle();
                show_video_buttons();
                show_video_container();
    
                 

		        request_video_mp4_2();
                

                websocketClient.send("video_received_good:"+userId);

                
                
            }


            

            
        }


        

        
        

        
        if (typeof message_result==="object" && current_step>0){

            current_step=2;

            type_download=1;

            bad_connection_choose_file=0;
            bad_connection_create_video=0;
            waiting_video=0;
 
            generarInputs_captions(captions_video);
            show_card_captions();

            blob = new Blob([event.data], { type: 'video/mp4' });
            videoURL = URL.createObjectURL(blob);

            clearInterval(interval);
            reset_percentage();

            changeVideoSource(videoURL);
             
             
            
            toggleEditability(1);
            hide_choose_file();
            hide_circle();
            show_video_buttons();
            show_video_container();
  
            

            websocketClient.send("video_received_good:"+userId);
        }
        

        
        

        
        
        
        

      });
    

    websocketClient.addEventListener('close', (event) => {

        bad_connection_create_video=1;

        if (waiting_video==1){
            waiting_video=0;
            document.querySelector('.error-creation').style.display = 'block';
            clearInterval(interval);
            reset_percentage();
                
            show_card_captions();
            generarInputs_captions(captions_video);
            toggleEditability(1);
            hide_choose_file();
            hide_circle();
            show_video_buttons();
            show_video_container();
        }

        if (bad_connection_choose_file==1){
            inputFile.value='';
            
            
            
            
            

            final_lang="";
            document.querySelector('.error-dimension').innerHTML = 'Bad connection. Try it again'; 
            document.querySelector('.error-dimension').style.display = 'flex'; 
        }
        


        if (event.wasClean) {
          console.log('Connection closed');
        } else {
          console.log('reconnecting...');
            setTimeout(() => {
                connect("reconnecting");
            }, 5000);
        };
        console.log(`close error: ${event.code}, Razón: ${event.reason}`);
      });
      
      websocketClient.addEventListener('error', (error) => {
        console.error('Error connection:', error);
      });



    };


    connect("connected");

    
     
    






let modal = document.getElementById("myModal");

let close_yes = document.getElementsByClassName("close-yes")[0];
let close_no = document.getElementsByClassName("close-no")[0];


close_yes.onclick = function() {
  toggleEditability(0);
  send_new_captions=1;
  modal.style.display = "none";
};
close_no.onclick = function() {
  modal.style.display = "none"; 
};

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};



document.addEventListener("DOMContentLoaded", function () {
    hide_circle();
    hide_video_buttons();
    hide_video_container(); 
    hide_circle_2();


    show_circle();
    hide_choose_file();

    show_exportDropdown();
    hide_export_mp4(); 
  });
  



document.addEventListener("DOMContentLoaded", function() {
    const settingsOpenModalBtn = document.getElementById('settings-openModalBtn');
    const settingsModal = document.getElementById('settingsModal');
    const settingsCloseBtn = document.querySelector('.settings-close-btn');
    const fontElement = document.getElementById('settings-font');
    const colorElement = document.getElementById('settings-color');
    const positionElementSub = document.getElementById('settings-position-sub');
 

    if (settingsOpenModalBtn && settingsModal && settingsCloseBtn && fontElement && colorElement && positionElementSub){
        settingsOpenModalBtn.addEventListener('click', function() {
            settingsModal.style.display = 'block';
        });

        settingsCloseBtn.addEventListener('click', function() {
            settingsModal.style.display = 'none';
        });

        settingsModal.addEventListener('click', function(event) {
            if (event.target === settingsModal) {
                settingsModal.style.display = 'none';
            }
        });

        fontElement.addEventListener('click', function() {
            
            settingsModal.style.display = 'none';
        });

        colorElement.addEventListener('click', function() {
            
            settingsModal.style.display = 'none';
        });

        if (positionElementSub && settingsModal){
            positionElementSub.addEventListener('click', function() {
                
                settingsModal.style.display = 'none';
            }); 
        }
    } 
});







document.addEventListener("DOMContentLoaded", function () {
    const textglowPercent = [0, 50, 100];
    const textglowClasses = ['pos-0', 'pos-1', 'pos-2'];

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
            circle.style.transform = 'none';
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
            circle.style.left = '';
            circle.style.transform = '';
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
        selectedPositionSub=index + 1;  
    });

    initSlider("textglow", (index) => {
        selectedTextGlowSub=index + 1;  
    });

    initSlider("audio", (index) => {
        selectedAudioSub=index + 1;  
    });
 
});


 
 document.addEventListener("DOMContentLoaded", function() {
    const openPositionModalBtn = document.getElementById('settings-position-sub');
    const positionModalSub = document.getElementById('positionModalSub');
    const closeBtnPosition = document.querySelector('.position-close-btn-sub');

    if (openPositionModalBtn && positionModalSub && closeBtnPosition){

  
        openPositionModalBtn.addEventListener('click', function() {
            positionModalSub.style.display = 'block';
        });

        closeBtnPosition.addEventListener('click', function() {
            positionModalSub.style.display = 'none';
        });

        positionModalSub.addEventListener('click', function(event) {
            if (event.target === positionModalSub) {
            positionModalSub.style.display = 'none';
            }
        }); 
    }
});



document.addEventListener("DOMContentLoaded", function() { 
    const openModalBtn = document.getElementById('settings-font');
    const fontModal = document.getElementById('fontModal');
    const closeBtn = document.querySelector('.font-close-btn');
    const fontList = document.getElementById('fontList');

    const fonts = [
        'font1', 
        'font2', 
        'font3', 
        'font4', 
        'font5', 
        'font6', 
        'font7', 
        'font8', 
        'font9', 
        'font10'
    ];

    openModalBtn.addEventListener('click', function() {
        populateFontList();
        fontModal.style.display = 'block';
    });

    closeBtn.addEventListener('click', function() {
        fontModal.style.display = 'none';
    });

    fontModal.addEventListener('click', function(event) {
        if (event.target === fontModal) {
            fontModal.style.display = 'none';
        }
    });

    function populateFontList() {
        fontList.innerHTML = '';

        fonts.forEach(function(font, index) {
            const listItem = document.createElement('li');
            const fontBlock = document.createElement('div');
            
            fontBlock.classList.add('font-block');
            fontBlock.style.fontFamily = font;
            fontBlock.textContent = `${index + 1}. Subtitle`; 
            fontBlock.style.paddingTop = '5px';
            fontBlock.style.paddingRight = '0';
            fontBlock.style.paddingBottom = '5px';
            fontBlock.style.paddingLeft = '0';
            
            fontBlock.addEventListener('click', function() {
                
                
                fontModal.style.display = 'none';
                openModalBtn.textContent = `Font (${index + 1})`;

                localStorage.setItem('selected-font', (index+1).toString());
            });

            listItem.appendChild(fontBlock);
            fontList.appendChild(listItem);
        });
    };
});




saveColorsToLocalStorageMono('#FFFFFF');
 
    var selectedColors = [
        "#0FF764",
        "#FFFF00",
        "#469AFA"
    ]; 

    saveColorsToLocalStorage({ multiColor: selectedColors });

    const colorButton = document.getElementById('settings-color');

    const colorModal = document.getElementById('colorModal');
    const colorCloseModal = document.getElementById('closeModalColor');
    const monoColorButton = document.getElementById('monoColor');
    const multiColorButton = document.getElementById('multiColor');
    const saveButton = document.getElementById('saveColor');
    const colorOptions = document.getElementById('colorOptions');
    const colorCount = document.getElementById('colorCount');


    colorButton.addEventListener('click', () => {
        colorModal.style.display = 'flex';
    });

    colorCloseModal.addEventListener('click', function() {
        colorModal.style.display = 'none';
    });

    colorModal.addEventListener('click', function(event) {
        if (event.target === colorModal) {
            colorModal.style.display = 'none';
        }
    });


    function setActiveButton(button) {
        [monoColorButton, multiColorButton].forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
    };

    function saveColorsToLocalStorageMono(color) {
        localStorage.setItem('selectedColor', color);
    };

    function saveColorsToLocalStorage(colors) {
        localStorage.setItem('selectedColors', JSON.stringify(colors));
    };


    function getColorsFromLocalStorageMono() {
        const savedColor = localStorage.getItem('selectedColor');
        return savedColor;
    };

    function getColorsFromLocalStorage() {
        const savedColors = localStorage.getItem('selectedColors');
        return savedColors ? JSON.parse(savedColors) : null;
    };

    monoColorButton.addEventListener('click', () => {
        setActiveButton(monoColorButton);
        const savedColor = getColorsFromLocalStorageMono();
        colorOptions.innerHTML = `<input type="color" id="monoPalette" value="${savedColor}">`;
        colorCount.textContent = "One single color in all subtitles";
    });

    multiColorButton.addEventListener('click', () => {
        setActiveButton(multiColorButton);
        const savedColors = getColorsFromLocalStorage()?.multiColor || ["#15ED64", "#FFFF00", "#FF951C"];
        colorOptions.innerHTML = `
            <input type="color" id="multiPalette1" value="${savedColors[0]}">
            <input type="color" id="multiPalette2" value="${savedColors[1]}">
            <input type="color" id="multiPalette3" value="${savedColors[2]}">
        `;
        colorCount.textContent = "Colors will alternate randomly across all subtitles";
    });

    saveButton.addEventListener('click', () => {
        colorModal.style.display = 'none';
        if (multiColorButton.classList.contains('active')) {
            const selectedColors = [
                document.getElementById('multiPalette1').value,
                document.getElementById('multiPalette2').value,
                document.getElementById('multiPalette3').value
            ];
            saveColorsToLocalStorage({ multiColor: selectedColors });

            const selected_color=selectedColors.join('-').replace(/#/g, "").toUpperCase();
            
            localStorage.setItem('selected-color', selected_color);

        } else if (monoColorButton.classList.contains('active')) {
            const selectedColor = document.getElementById('monoPalette').value;
            saveColorsToLocalStorageMono(selectedColor);

            const selected_color=selectedColor.replace(/#/g, "").toUpperCase();
            
            localStorage.setItem('selected-color', selected_color);
        }
    });
 
    monoColorButton.click();







const languages = [
    'English', 
    'Español' 
];

function populateLanguageList() {
    const languageList = document.getElementById('languageList');

    

    let selectedLanguageIndex = null;

    languageList.innerHTML = '';

    languages.forEach(function(font, index) { 
        const listItem = document.createElement('li');
        const fontBlock = document.createElement('div');
        
        
        fontBlock.classList.add('language-block');
        fontBlock.style.fontFamily = 'Arial';
        fontBlock.textContent = font;  
        
        fontBlock.addEventListener('click', function() {
            
            
            language_video=(index+1).toString();

            const allFontBlocks = document.querySelectorAll('.language-block');
            allFontBlocks.forEach(block => {
                block.style.backgroundColor = '';
                block.style.color = '';
            });

            fontBlock.style.backgroundColor = "#7c55e6";
            fontBlock.style.color = "#ffffff";

            selectedLanguageIndex = index;
            console.log(index);
        });

        listItem.appendChild(fontBlock);
        languageList.appendChild(listItem);
    });
};

document.addEventListener("DOMContentLoaded", function() {
    const selectedLanguage = document.getElementById('selected-language');
    const openLanguageModalBtn = document.getElementById('change-language');
    const languageModal = document.getElementById('languageModal');
    const languageCloseBtn = document.querySelector('.language-close-btn');
    const languageSaveBtn = document.getElementById('save-lang');


    if (selectedLanguage && openLanguageModalBtn && languageModal && languageCloseBtn && languageSaveBtn){
        openLanguageModalBtn.addEventListener('click', function() {
            populateLanguageList();
            languageModal.style.display = 'block';
        });
        

        languageCloseBtn.addEventListener('click', function() {
            languageModal.style.display = 'none';
        });

        languageSaveBtn.addEventListener('click', function() {
            languageModal.style.display = 'none';
            final_lang=language_video;
            websocketClient.send("lang_client_"+userId+"_client_"+final_lang);
            selectedLanguage.textContent = `${languages[parseInt(final_lang)-1]}`;
        });
    }
     
    const myModal_limit_size = document.getElementById('myModal_limit_size');
    const closeBtn_limit_size = document.querySelector('.close_limit_size');

    if (myModal_limit_size && closeBtn_limit_size){
        closeBtn_limit_size.addEventListener('click', function() {
            myModal_limit_size.style.display = 'none';
        });
    }
            
    
});



document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("click", function(event) {
        var dropdownContent = document.getElementById("dropdown-content");
        var dropdownBtn = document.getElementById("dropdown-btn");

        if (event.target !== dropdownContent && event.target !== dropdownBtn) {
            dropdownContent.style.display = "none";
        }
    });

    
    document.addEventListener("click", function(event) {
        var export_dropdownContent = document.getElementById("exportDropdown-content");
        var export_dropdownBtn = document.getElementById("exportDropdown-button");
    
        if (event.target !== export_dropdownContent && event.target !== export_dropdownBtn) {
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
};


function toggleExportDropdown(event) {
    var export_dropdownContent = document.getElementById("exportDropdown-content");
    if (export_dropdownContent.style.display === "block") {
        export_dropdownContent.style.display = "none";
    } else {
        export_dropdownContent.style.display = "block";
    }

    if (event && event.stopPropagation) {
        event.stopPropagation();
    }
};


let output_language={"Reset":"Reset","English":"en","Spanish":"es","Portuguese":"pt","French":"fr","German":"de","Italian":"it"};

function send_to_translate(lang){
    var text=getTextareaValue();
    const user_id=localStorage.getItem('userid');
    websocketClient.send("translate_client_"+user_id+"_client_"+text+"_client_"+lang);
    
};



function selectOption(option) {
    var dropdownBtn = document.getElementById("dropdown-btn");
    var dropdownContent = document.getElementById("dropdown-content");
    dropdownContent.style.display = "none";

    dropdownBtn.disabled = true;

    if (option!="Reset"){
        current_output_language=option;
        dropdownBtn.innerHTML =  "Loading..." + " &#x025BE;";
        send_to_translate(output_language[option]);
    }else{
        dropdownBtn.innerHTML =  option + " &#x025BE;";
        generarInputs_captions(captions_video);
        dropdownBtn.disabled = false;
    }

};



const dropZone = document.getElementById('dropZone');
const inputFile_drag = document.getElementById('file');

if (dropZone && inputFile_drag){
    inputFile_drag.addEventListener('change', (event) => {
        const files_drag = event.target.files;
        if (files_drag.length > 0) {
            console.log("File selected: " + files_drag[0].name);
        }
    });

        dropZone.addEventListener('dragover', (event) => {
            event.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (event) => {
            event.preventDefault();
            dropZone.classList.remove('dragover');
            const files_drop = event.dataTransfer.files;
            if (files_drop.length) {
                inputFile_drag.files = files_drop;
                
                if (final_lang!=""){
                    const changeEvent = new Event('change');
                    inputFile_drag.dispatchEvent(changeEvent);
                }else{
                    populateLanguageList();
                    const languageModal = document.getElementById('languageModal');
                    languageModal.style.display = 'block';
                }
            }
        });

}

 

         




document.addEventListener('DOMContentLoaded', () => {
    const exportDropdown_srt = document.getElementById('exportDropdown-srt');
    const exportDropdown_mp4 = document.getElementById('exportDropdown-mp4');

    if (exportDropdown_srt && exportDropdown_mp4){
        exportDropdown_srt.addEventListener('click', () => {
        downloadSRT_2();
        });  
        exportDropdown_mp4.addEventListener('click', () => {
        downloadVideo_2();
        }); 
    } 
  });


        
    document.addEventListener("DOMContentLoaded", function() {  
        const settingsOption = document.querySelectorAll('.settings-font-block');
        if (settingsOption){
            settingsOption.forEach(elemOption => {
                elemOption.style.paddingTop = '10px';
                elemOption.style.paddingRight = '0';
                elemOption.style.paddingBottom = '10px';
                elemOption.style.paddingLeft = '0';
            });  
        } 
    });
        
 
