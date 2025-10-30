function autoPauseVideoOnInput() {
  const container = document.getElementById("form-container");
  const videoElement = document.getElementById("my-video-2");

  if (!container || !videoElement) {
    console.error("No se encontró el contenedor o el video.");
    return;
  }

  let bloqueandoScroll = false;
  let bloqueandoVideo = false;
  let videoPausedByInput = false;

  function checkFocus() {
    const focusedTextarea = container.querySelector("textarea.flexible-captions:focus");
    if (focusedTextarea) {
      if (!videoPausedByInput) {
        videoElement.pause();
        videoPausedByInput = true;
      }
    } else {
      if (videoPausedByInput) {
        videoPausedByInput = false;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight - container.clientHeight;
        const porcentaje = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

        if (!isNaN(videoElement.duration)) {
          bloqueandoScroll = true;
          videoElement.currentTime = videoElement.duration * porcentaje;
          bloqueandoScroll = false;
        }

        videoElement.play();
      }
    }
  }

  container.addEventListener("focusin", checkFocus);
  container.addEventListener("focusout", () => {
    setTimeout(checkFocus, 0);  
  });

  container.addEventListener("scroll", () => {
    if (videoPausedByInput) return;

    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const porcentaje = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

    if (!isNaN(videoElement.duration)) {
      bloqueandoScroll = true;
      videoElement.currentTime = videoElement.duration * porcentaje;
      bloqueandoScroll = false;
    }
  });

  videoElement.addEventListener("timeupdate", () => {
    if (videoPausedByInput || bloqueandoScroll) return;

    const porcentaje = videoElement.currentTime / videoElement.duration;
    const scrollHeight = container.scrollHeight - container.clientHeight;

    bloqueandoVideo = true;
    container.scrollTop = scrollHeight * porcentaje;
    bloqueandoVideo = false;
  });
}

autoPauseVideoOnInput();
 
