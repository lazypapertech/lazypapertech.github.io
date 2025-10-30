function syncScrollWithVideo() {
  const container = document.querySelector(".form-container");
  const videoElement = document.getElementById("my-video-2");

  if (!container || !videoElement) {
    console.error("No se encontró el contenedor o el video.");
    return;
  }

  let bloqueandoScroll = false;  
  let bloqueandoVideo = false;

   
  container.addEventListener("scroll", () => {
    if (bloqueandoVideo) return;  

    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const porcentaje = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

    if (!isNaN(videoElement.duration)) {
      bloqueandoScroll = true;
      videoElement.currentTime = videoElement.duration * porcentaje;
      bloqueandoScroll = false;
    }

    console.log(`Scroll: ${(porcentaje * 100).toFixed(2)}%`);
  });
 
  videoElement.addEventListener("timeupdate", () => {
    if (bloqueandoScroll) return;  

    const porcentaje = videoElement.currentTime / videoElement.duration;
    const scrollHeight = container.scrollHeight - container.clientHeight;

    bloqueandoVideo = true;
    container.scrollTop = scrollHeight * porcentaje;
    bloqueandoVideo = false;
  });
}
 
syncScrollWithVideo();
 
