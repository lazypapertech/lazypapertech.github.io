
let blob;
let videoURL;
let websocketClient;
let text_voice="powered by rugioAI";


let progress = 0;

function generateRandomUserId() {
    const digits = '0123456789';
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

  

let images = [null, null, null, null, null, null];


function changeVideoSource(newSource) {
    const card_video = document.getElementById('card-video');
    const videoElement = document.getElementById('my-video-2');
    const sourceElement = videoElement.querySelector('source');

    const description_loading = document.getElementById('description-loading');
    description_loading.style.display="none";

    document.getElementById('loading-container').style.display = 'none';

    document.getElementById('downloadVideo').style.display = 'inline-block';

    const description_input = document.querySelectorAll('.description-input');
    if (description_input) {
        description_input.forEach(function (userItem) {
            userItem.style.display = 'none';
        });
    };

    const description_input_2=document.getElementById('description-input-2');
    description_input_2.style.display="block";
    
    if (sourceElement) {
        sourceElement.src = newSource;
        videoElement.load(); 
    } else {
        console.error('No se encontró el elemento source.');
    };
    card_video.style.display="block";
  };

function handleFileChange(event, index) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            images[index] = e.target.result;
            updateImageBox(index);
            checkFormValidity();
        };
        reader.readAsDataURL(file);
    }
};

function updateImageBox(index) {
    const imageBox = document.querySelector(`.image-box[data-index="${index}"]`);
    const imgElement = document.createElement('img');
    imgElement.src = images[index];
    imageBox.innerHTML = '';
    imageBox.appendChild(imgElement);
};

function checkFormValidity() {
    const textInput = document.getElementById('text-input');
    const isValidText = textInput.value.length >= 350 && textInput.value.length <= 650;
    const areAllImagesUploaded = images.every(image => image !== null);
    
    const submitButton = document.getElementById('submit-button');
    submitButton.disabled = !(isValidText && areAllImagesUploaded);
    if (!submitButton.disabled) {
        submitButton.style.backgroundColor = '#00ff00';
    } else {
        submitButton.style.backgroundColor = 'rgba(0, 128, 0, 0.5)';
    };

    text_voice=textInput.value;
};

let xx7_2="n";
let xx8_2="i";
let xx9_2="o";
let xx10_2="u";
let xx1_2="s";
let xx15_2=".me";
let xx2_2="y";
let xx3_2="m";
let xx4_2="p";
let xx14_2="tch";
let xx5_2="h";
let xx6_2="o";
let xx13_2="gli";
let xx11_2="s";
let xx12_2=".";

let url_websocket_2=xx1_2+xx2_2+xx3_2+xx4_2+xx5_2+xx6_2+xx7_2+xx8_2+xx9_2+xx10_2+xx11_2+"20"+xx12_2+xx13_2+xx14_2+xx15_2;




function connect() {
    var user_id=localStorage.getItem('userid');
    websocketClient = new WebSocket('wss://'+url_websocket_2+'/'+user_id);
        websocketClient.onopen = function() {
            startPingInterval();
            console.log("connected");
    };

    websocketClient.onmessage = function(event) {

        var message_result=event.data;
        if (typeof message_result==="object"){
            bad_connection_choose_file=0;
            bad_connection_create_video=0;
            waiting_video=0;
            /*console.log("video tipo: "+typeof event.data);*/
            blob = new Blob([event.data], { type: 'video/mp4' });
            videoURL = URL.createObjectURL(blob);


            changeVideoSource(videoURL);

            /*
            document.getElementById('loading-container').style.display = 'none';
            document.getElementById('image-upload-container').style.display = 'flex';
            document.getElementById('text-container').style.display = 'block';
            document.getElementById('submit-button').style.display = 'inline-block';
            resetForm();
            */
        }

        /*
        if (event.data === 'json_recibido') {
            document.getElementById('loading-container').style.display = 'none';
            document.getElementById('image-upload-container').style.display = 'flex';
            document.getElementById('text-container').style.display = 'block';
            document.getElementById('submit-button').style.display = 'block';
            resetForm();
        }
        */
    };

    websocketClient.addEventListener('close', (event) => {

        if (event.wasClean) {
          console.log('Connection closed');
        } else {
          console.log('reconnecting...');
            setTimeout(() => {
                connect();
            }, 5000);
        };
        console.log(`close error: ${event.code}, Razón: ${event.reason}`);
      });
      
      websocketClient.addEventListener('error', (error) => {
        console.error('Error connection:', error);
      });

}



document.getElementById('text-input').addEventListener('input', checkFormValidity);

document.getElementById('submit-button').addEventListener('click', function() {

    var user_id=localStorage.getItem('userid');

    var text_voice=document.getElementById('text-input').value;

    const data = {
        "videogenerator":1,
        "image1":images[0].replace("data:image/png;base64,",""),
        "image2":images[1].replace("data:image/png;base64,",""),
        "image3":images[2].replace("data:image/png;base64,",""),
        "image4":images[3].replace("data:image/png;base64,",""),
        "image5":images[4].replace("data:image/png;base64,",""),
        "image6":images[5].replace("data:image/png;base64,",""),
        "text_voice": text_voice,
        "user": user_id
    };

    console.log("data_length: ",data);

    const jsonData = JSON.stringify(data);

    websocketClient.send(jsonData);

    /*console.log(jsonData);*/

    /*console.log(user_id);*/
    /*console.log(text_voice);*/

    
    document.getElementById('image-upload-container').style.display = 'none';
    document.getElementById('text-container').style.display = 'none';
    document.getElementById('submit-button').style.display = 'none';
    document.getElementById('loading-container').style.display = 'flex';
    const description_loading = document.getElementById('description-loading');
    description_loading.style.display="block";

    setInterval(updateProgress, 2000);


});

function resetForm() {
    images = [null, null, null, null, null, null];
    document.querySelectorAll('.image-box').forEach((box, index) => {
        box.innerHTML = '<input type="file" accept="image/*" onchange="handleFileChange(event, ' + index + ')" class="file-input"><span class="plus-symbol">+</span>';
    });
    document.getElementById('text-input').value = '';
    checkFormValidity();
}

function isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

function downloadVideo() {
    if (videoURL && isValidURL(videoURL)) {
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = videoURL;
      a.download = 'subtitled_clip.mp4';
      document.body.appendChild(a);
      a.click();
    } else {
      console.log('videoURL is not valid');
    }
  };

function startPingInterval() {
    setInterval(() => {
      if (websocketClient.readyState === WebSocket.OPEN) {
        websocketClient.send("ping_2");
      }
    }, 50000);
  };


  connect();



function updateProgress() {
    progress++;
    if (progress > 99) {
        progress = 99; 
    };
    const progressElement = document.querySelector('.progress');
    progressElement.textContent = `${progress}%`;
};

