let blob;let O0OOO0OO00OO0O00O0OO00O000OO00O0O0OO0OOOO0O0O0O0O0O0O00O00O00OO00;let O0OOO0OOO0OO00O0O0OO000O00OOO00OO0OO0OOOO0OO000OO0OO0O0OO0OO00O0O0OOO0O000O0000OO0OO0OO000OO0O00O0OO00O0O0OO0OOO00OOO0O00;let text_voice="text_voice";let O0OOO00000OOO00O00OO0OOOO0OO00OOO0OOO00O00OO00O0O0OOO00OO0OOO00OO0O00O00O0OO0OOO00OOO0O000OO00O0O0OOO00O00OOO0OO00OO0000O0OO0OO00;let progress = 0;function O0OO00OOO0OO00O0O0OO0OOO00OO00O0O0OOO00O00OO0000O0OOO0O000OO00O0O0O0O00O00OO0000O0OO0OOO00OO00O000OO0OOOO0OO0OO0O0O0O0O0O0OOO00OO0OO00O0O0OOO00O00O00O00O0OO00O00() {const digits = '0123456789';let O0OOO0O0O0OOO00OO0OO00O0O0OOO00O00O00O00O0OO00O00 = '';for (let i = 0; i < 10; i++) {const randomIndex = Math.floor(Math.random() * digits.length);O0OOO0O0O0OOO00OO0OO00O0O0OOO00O00O00O00O0OO00O00 += digits[randomIndex];}return O0OOO0O0O0OOO00OO0OO00O0O0OOO00O00O00O00O0OO00O00;};let O0OOO0O0O0OOO00OO0OO00O0O0OOO00O00O00O00O0OO00O00 = localStorage.getItem('userid_videogenerator');if (!O0OOO0O0O0OOO00OO0OO00O0O0OOO00O00O00O00O0OO00O00) {O0OOO0O0O0OOO00OO0OO00O0O0OOO00O00O00O00O0OO00O00 = O0OO00OOO0OO00O0O0OO0OOO00OO00O0O0OOO00O00OO0000O0OOO0O000OO00O0O0O0O00O00OO0000O0OO0OOO00OO00O000OO0OOOO0OO0OO0O0O0O0O0O0OOO00OO0OO00O0O0OOO00O00O00O00O0OO00O00();localStorage.setItem('userid_videogenerator', O0OOO0O0O0OOO00OO0OO00O0O0OOO00O00O00O00O0OO00O00);};let images = [null, null, null, null, null, null];function O0OO000OO0OO0O0000OO0000O0OO0OOO00OO00OOO0OO00O0O0O0O0OO00OO0O00O0OO00O000OO00O0O0OO0OOOO0O0O00OO0OO0OOOO0OOO0O0O0OOO00O00OO000OO0OO00O0O(newSource) {const card_video = document.getElementById('card-video');const videoElement = document.getElementById('my-video-2');const sourceElement = videoElement.querySelector('source');const description_loading = document.getElementById('description-loading');description_loading.style.display="none";document.getElementById('loader-container').style.display = 'none';document.getElementById('downloadVideo').style.display = 'inline-block';const description_input = document.querySelectorAll('.description-input');if (description_input) {description_input.forEach(function (userItem) {userItem.style.display = 'none';});};const description_input_2=document.getElementById('description-input-2');description_input_2.style.display="block";if (sourceElement) {sourceElement.src = newSource;videoElement.load(); } else {console.error('No se encontró el elemento source.');};card_video.style.display="block";};function handleFileChange(event, index) {const file = event.target.files[0];if (file) {const reader = new FileReader();reader.onload = function(e) {images[index] = e.target.result;O0OOO0O0O0OOO00000OO00O000OO0000O0OOO0O000OO00O0O0O00O00O0OO0OO0O0OO0000O0OO00OOO0OO00O0O0O0000O00OO0OOOO0OOOO000(index);O0OO000OO0OO0O0000OO00O0O0OO000OO0OO0O0OO0O000OO00OO0OOOO0OOO00O00OO0OO0O0O0O0OO00OO0000O0OO0OO000OO0O00O0OO00O000OO0O00O0OOO0O000OOOO00O();};reader.readAsDataURL(file);}};function O0OOO0O0O0OOO00000OO00O000OO0000O0OOO0O000OO00O0O0O00O00O0OO0OO0O0OO0000O0OO00OOO0OO00O0O0O0000O00OO0OOOO0OOOO000(index) {const imageBox = document.querySelector(`.image-box[data-index="${index}"]`);const imgElement = document.createElement('img');imgElement.src = images[index];imageBox.innerHTML = '';imageBox.appendChild(imgElement);};function O0OO000OO0OO0O0000OO00O0O0OO000OO0OO0O0OO0O000OO00OO0OOOO0OOO00O00OO0OO0O0O0O0OO00OO0000O0OO0OO000OO0O00O0OO00O000OO0O00O0OOO0O000OOOO00O() {const textInput = document.getElementById('text-input');const isValidText = textInput.value.length >= 0 && textInput.value.length <= 650;const areAllImagesUploaded = images.every(image => image !== null);const submitButton = document.getElementById('submit-button');submitButton.disabled = !(isValidText && areAllImagesUploaded);if (!submitButton.disabled) {submitButton.style.backgroundColor = '#00ff00';} else {submitButton.style.backgroundColor = 'rgba(0, 128, 0, 0.5)';};text_voice=textInput.value;};let xx7_2="n";let xx8_2="i";let xx9_2="o";let O0OOOO0000OOOO00000OO000O00OO00000O0OOOOO00OO00O0="u";let xx1_2="s";let O0OOOO0000OOOO00000OO000O00OO0O0O0O0OOOOO00OO00O0=".me";let xx2_2="y";let xx3_2="m";let xx4_2="p";let O0OOOO0000OOOO00000OO000O00OO0O000O0OOOOO00OO00O0="tch";let xx5_2="h";let xx6_2="o";let O0OOOO0000OOOO00000OO000O00OO00OO0O0OOOOO00OO00O0="gli";let O0OOOO0000OOOO00000OO000O00OO000O0O0OOOOO00OO00O0="s";let O0OOOO0000OOOO00000OO000O00OO00O00O0OOOOO00OO00O0=".";let O0OOO0O0O0OOO00O00OO0OO000O0OOOOO0OOO0OOO0OO00O0O0OO000O00OOO00OO0OO0OOOO0OO000OO0OO0O0OO0OO00O0O0OOO0O000O0OOOOO00OO00O0=xx1_2+xx2_2+xx3_2+xx4_2+xx5_2+xx6_2+xx7_2+xx8_2+xx9_2+O0OOOO0000OOOO00000OO000O00OO00000O0OOOOO00OO00O0+O0OOOO0000OOOO00000OO000O00OO000O0O0OOOOO00OO00O0+"20"+O0OOOO0000OOOO00000OO000O00OO00O00O0OOOOO00OO00O0+O0OOOO0000OOOO00000OO000O00OO00OO0O0OOOOO00OO00O0+O0OOOO0000OOOO00000OO000O00OO0O000O0OOOOO00OO00O0+O0OOOO0000OOOO00000OO000O00OO0O0O0O0OOOOO00OO00O0;function O0OO000OO0OO0OOOO0OO0OOO00OO0OOO00OO00O0O0OO000OO0OOO0O00() {var user_id=localStorage.getItem('userid_videogenerator');O0OOO0OOO0OO00O0O0OO000O00OOO00OO0OO0OOOO0OO000OO0OO0O0OO0OO00O0O0OOO0O000O0000OO0OO0OO000OO0O00O0OO00O0O0OO0OOO00OOO0O00 = new WebSocket('wss://'+O0OOO0O0O0OOO00O00OO0OO000O0OOOOO0OOO0OOO0OO00O0O0OO000O00OOO00OO0OO0OOOO0OO000OO0OO0O0OO0OO00O0O0OOO0O000O0OOOOO00OO00O0+'/'+user_id);O0OOO0OOO0OO00O0O0OO000O00OOO00OO0OO0OOOO0OO000OO0OO0O0OO0OO00O0O0OOO0O000O0000OO0OO0OO000OO0O00O0OO00O0O0OO0OOO00OOO0O00.onopen = function() {O0OOO00OO0OOO0O000OO0000O0OOO00O00OOO0O000O0O00000OO0O00O0OO0OOO00OO00OOO0O00O00O0OO0OOO00OOO0O000OO00O0O0OOO00O00OOO0OO00OO0000O0OO0OO00();console.log("connected");};O0OOO0OOO0OO00O0O0OO000O00OOO00OO0OO0OOOO0OO000OO0OO0O0OO0OO00O0O0OOO0O000O0000OO0OO0OO000OO0O00O0OO00O0O0OO0OOO00OOO0O00.onmessage = function(event) {var message_result=event.data;if (typeof message_result==="object"){bad_connection_choose_file=0;bad_connection_create_video=0;waiting_video=0;blob = new Blob([event.data], { type: 'video/mp4' });O0OOO0OO00OO0O00O0OO00O000OO00O0O0OO0OOOO0O0O0O0O0O0O00O00O00OO00 = URL.createObjectURL(blob);O0OO000OO0OO0O0000OO0000O0OO0OOO00OO00OOO0OO00O0O0O0O0OO00OO0O00O0OO00O000OO00O0O0OO0OOOO0O0O00OO0OO0OOOO0OOO0O0O0OOO00O00OO000OO0OO00O0O(O0OOO0OO00OO0O00O0OO00O000OO00O0O0OO0OOOO0O0O0O0O0O0O00O00O00OO00);}};O0OOO0OOO0OO00O0O0OO000O00OOO00OO0OO0OOOO0OO000OO0OO0O0OO0OO00O0O0OOO0O000O0000OO0OO0OO000OO0O00O0OO00O0O0OO0OOO00OOO0O00.addEventListener('close', (event) => {document.getElementById('loader-container').style.display = 'none';document.getElementById('image-upload-container').style.display = 'flex';document.getElementById('text-container').style.display = 'block';document.getElementById('submit-button').style.display = 'inline-block';O0OOO00O00OO00O0O0OOO00OO0OO00O0O0OOO0O000O000OO00OO0OOOO0OOO00O00OO0OO0O();document.getElementById('downloadVideo').style.display = 'none';document.getElementById('description-input-2').style.display='none';document.getElementById('card-video').style.display='none';document.getElementById('description-loading').style.display='none';clearInterval(O0OOO00000OOO00O00OO0OOOO0OO00OOO0OOO00O00OO00O0O0OOO00OO0OOO00OO0O00O00O0OO0OOO00OOO0O000OO00O0O0OOO00O00OOO0OO00OO0000O0OO0OO00);document.querySelector('#error-creation').style.display = 'inline-block';if (event.wasClean) {console.log('Connection closed');} else {console.log('reconnecting...');setTimeout(() => {O0OO000OO0OO0OOOO0OO0OOO00OO0OOO00OO00O0O0OO000OO0OOO0O00();}, 5000);};console.log(`close error: ${event.code}, Razón: ${event.reason}`);});O0OOO0OOO0OO00O0O0OO000O00OOO00OO0OO0OOOO0OO000OO0OO0O0OO0OO00O0O0OOO0O000O0000OO0OO0OO000OO0O00O0OO00O0O0OO0OOO00OOO0O00.addEventListener('error', (error) => {console.error('Error connection:', error);});}document.getElementById('text-input').addEventListener('input', O0OO000OO0OO0O0000OO00O0O0OO000OO0OO0O0OO0O000OO00OO0OOOO0OOO00O00OO0OO0O0O0O0OO00OO0000O0OO0OO000OO0O00O0OO00O000OO0O00O0OOO0O000OOOO00O);document.getElementById('submit-button').addEventListener('click', function() {var user_id=localStorage.getItem('userid_videogenerator');var text_voice=document.getElementById('text-input').value;if (text_voice.length==0){text_voice="empty";}const data = {"videogenerator":1,"image1":images[0].substring(images[0].indexOf(',')+1,),"image2":images[1].substring(images[1].indexOf(',')+1,),"image3":images[2].substring(images[2].indexOf(',')+1,),"image4":images[3].substring(images[3].indexOf(',')+1,),"image5":images[4].substring(images[4].indexOf(',')+1,),"image6":images[5].substring(images[5].indexOf(',')+1,),"text_voice": text_voice,"user": user_id};console.log("data_length: ",data);const jsonData = JSON.stringify(data);O0OOO0OOO0OO00O0O0OO000O00OOO00OO0OO0OOOO0OO000OO0OO0O0OO0OO00O0O0OOO0O000O0000OO0OO0OO000OO0O00O0OO00O0O0OO0OOO00OOO0O00.send(jsonData);document.getElementById('image-upload-container').style.display = 'none';document.getElementById('text-container').style.display = 'none';document.getElementById('submit-button').style.display = 'none';document.getElementById('loader-container').style.display = 'flex';const description_loading = document.getElementById('description-loading');description_loading.style.display="block";document.querySelector('#error-creation').style.display = 'none';progress=0;O0OOO00000OOO00O00OO0OOOO0OO00OOO0OOO00O00OO00O0O0OOO00OO0OOO00OO0O00O00O0OO0OOO00OOO0O000OO00O0O0OOO00O00OOO0OO00OO0000O0OO0OO00 = setInterval(O0OOO0O0O0OOO00000OO00O000OO0000O0OOO0O000OO00O0O0O0O00000OOO00O00OO0OOOO0OO00OOO0OOO00O00OO00O0O0OOO00OO0OOO00OO, 2000);});function O0OOO00O00OO00O0O0OOO00OO0OO00O0O0OOO0O000O000OO00OO0OOOO0OOO00O00OO0OO0O() {images = [null, null, null, null, null, null];document.querySelectorAll('.image-box').forEach((box, index) => {box.innerHTML = '<input type="file" accept="image/*" onchange="handleFileChange(event, ' + index + ')" class="file-input"><span class="plus-symbol">+</span>';});document.getElementById('text-input').value = '';O0OO000OO0OO0O0000OO00O0O0OO000OO0OO0O0OO0O000OO00OO0OOOO0OOO00O00OO0OO0O0O0O0OO00OO0000O0OO0OO000OO0O00O0OO00O000OO0O00O0OOO0O000OOOO00O();}function O0OO0O00O0OOO00OO0O0O0OO00OO0000O0OO0OO000OO0O00O0OO00O000O0O0O0O0O0O00O00O00OO00(url) {try {new URL(url);return true;} catch (error) {return false;}};function downloadVideo() {if (O0OOO0OO00OO0O00O0OO00O000OO00O0O0OO0OOOO0O0O0O0O0O0O00O00O00OO00 && O0OO0O00O0OOO00OO0O0O0OO00OO0000O0OO0OO000OO0O00O0OO00O000O0O0O0O0O0O00O00O00OO00(O0OOO0OO00OO0O00O0OO00O000OO00O0O0OO0OOOO0O0O0O0O0O0O00O00O00OO00)) {const a = document.createElement('a');a.style.display = 'none';a.href = O0OOO0OO00OO0O00O0OO00O000OO00O0O0OO0OOOO0O0O0O0O0O0O00O00O00OO00;a.download = 'short_video.mp4';document.body.appendChild(a);a.click();} else {console.log('O0OOO0OO00OO0O00O0OO00O000OO00O0O0OO0OOOO0O0O0O0O0O0O00O00O00OO00 is not valid');}};function O0OOO00OO0OOO0O000OO0000O0OOO00O00OOO0O000O0O00000OO0O00O0OO0OOO00OO00OOO0O00O00O0OO0OOO00OOO0O000OO00O0O0OOO00O00OOO0OO00OO0000O0OO0OO00() {setInterval(() => {if (O0OOO0OOO0OO00O0O0OO000O00OOO00OO0OO0OOOO0OO000OO0OO0O0OO0OO00O0O0OOO0O000O0000OO0OO0OO000OO0O00O0OO00O0O0OO0OOO00OOO0O00.readyState === WebSocket.OPEN) {O0OOO0OOO0OO00O0O0OO000O00OOO00OO0OO0OOOO0OO000OO0OO0O0OO0OO00O0O0OOO0O000O0000OO0OO0OO000OO0O00O0OO00O0O0OO0OOO00OOO0O00.send("ping_2");}}, 50000);};O0OO000OO0OO0OOOO0OO0OOO00OO0OOO00OO00O0O0OO000OO0OOO0O00();function O0OOO0O0O0OOO00000OO00O000OO0000O0OOO0O000OO00O0O0O0O00000OOO00O00OO0OOOO0OO00OOO0OOO00O00OO00O0O0OOO00OO0OOO00OO() {progress++;if (progress > 99) {progress = 99; };const progressElement = document.querySelector('.percentage');progressElement.textContent = `${progress}%`;};document.getElementById('upload-description').innerHTML = 'Upload <span style="color:#1eff00;font-weight: bold;">rectangular</span> images in <span style="color:#1eff00;font-weight: bold;">horizontal</span> orientation.';document.getElementById('createdvideo-description').innerHTML = 'Advanced version available on our <span style="color:#1eff00;font-weight: bold;">Discord server</span> where it is possible to customize more details';document.getElementById('error-creation').innerHTML = 'Bad connection. Try it again';document.getElementById('time-description').innerHTML = 'Estimated time: 2 minutes';document.getElementById('pages').innerHTML = 'Pages';document.getElementById('privacy_policy').innerHTML = 'Privacy Policy';document.getElementById('company').innerHTML = 'Company';document.getElementById('terms_conditions').innerHTML = 'Terms & Conditions';document.querySelector('.copyright').innerHTML = '© 2024 manycaptions.com. All rights reserved';
