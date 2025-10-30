function syncScrollWithVideo() { 
  const container = document.querySelector(".form-container");
  const videoElement = document.getElementById("my-video-2");

  if (!container || !videoElement) {
    console.error("No se encontró el contenedor o el video.");
    return;
  }
 
  container.addEventListener("scroll", () => {
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;
 
    const porcentaje = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
 
    const nuevoTiempo = videoElement.duration * porcentaje;
 
    if (!isNaN(videoElement.duration)) {
      videoElement.currentTime = nuevoTiempo;
    }
 
    console.log(`Scroll: ${(porcentaje * 100).toFixed(2)}%`);
  });
}
 
syncScrollWithVideo();
