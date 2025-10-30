function pauseVideoWhenWriting() {
  const container = document.getElementById("form-container");
  const videoElement = document.getElementById("my-video-2");

  if (!container || !videoElement) return;

  function checkActiveTextarea() {
    const activeTextarea = container.querySelector("textarea.flexible-input:focus");
    return !!activeTextarea;
  }

  function updateVideoState() {
    const writing = checkActiveTextarea();

    if (writing) {
      if (!videoElement.paused) videoElement.pause();
    } else {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const porcentaje = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

      if (!isNaN(videoElement.duration)) {
        videoElement.currentTime = videoElement.duration * porcentaje;
      }

      videoElement.play();
    }
  }

  container.addEventListener("focusin", updateVideoState);
  container.addEventListener("focusout", updateVideoState);
}

pauseVideoWhenWriting();
 
