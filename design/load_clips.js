const videoUrls = [
    "https://raw.githubusercontent.com/manyresources/resourcespage/main/videos/clip6.mp4",
    "https://raw.githubusercontent.com/manyresources/resourcespage/main/videos/clip8.mp4",
    "https://raw.githubusercontent.com/manyresources/resourcespage/main/videos/clip3.mp4"
];

function updateVideoSource(videoElement, blob) {
    const videoURL = URL.createObjectURL(blob);
    videoElement.querySelector('source').src = videoURL;
    videoElement.load(); // Recargar el video para aplicar la nueva fuente
}

async function downloadAndSetVideoSource(videoUrl, videoElement, index) {
    try {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        
        const reader = new FileReader();
        reader.onloadend = function() {
            localStorage.setItem(`savedVideo${index}`, reader.result);
            updateVideoSource(videoElement, blob);
        };

        reader.readAsDataURL(blob);
    } catch (error) {
        console.error('Error al descargar el video:', error);
    }
}

function loadVideoFromLocalStorage(videoElement, index) {
    const savedVideoDataUrl = localStorage.getItem(`savedVideo${index}`);

    if (savedVideoDataUrl) {
        const videoBlob = dataURLToBlob(savedVideoDataUrl);
        updateVideoSource(videoElement, videoBlob);
    } else {
        downloadAndSetVideoSource(videoUrls[index], videoElement, index);
    }
}

function dataURLToBlob(dataURL) {
    const binary = atob(dataURL.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'video/mp4' });
}

const videoElements = document.querySelectorAll('.sub-container-clip video');

videoElements.forEach((videoElement, index) => {
    if (videoUrls[index]) {
        loadVideoFromLocalStorage(videoElement, index);
    }
});