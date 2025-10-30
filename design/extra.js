function pauseVideoWhenWriting() {
  const container = document.getElementById("form-container");
  const videoElement = document.getElementById("my-video-2");

  if (!container || !videoElement) return;

  let videoShouldBePlaying = true;

  function checkActiveTextarea() {
    return !!container.querySelector("textarea.flexible-captions:focus");
  }

  function updateVideoState() {
    const writing = checkActiveTextarea();

    if (writing) {
      if (!videoElement.paused) {
        videoElement.pause();
        videoShouldBePlaying = false;
      }
    } else {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const porcentaje = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

      if (!isNaN(videoElement.duration)) {
        videoElement.currentTime = videoElement.duration * porcentaje;
      }

      if (videoElement.paused && !videoShouldBePlaying) {
        videoShouldBePlaying = true;
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            if (err.name !== "AbortError") console.error(err);
          });
        }
      }
    }
  }

  container.addEventListener("focusin", (e) => {
  if (e.target.matches("textarea.flexible-input")) {
    e.preventDefault();
  }
  updateVideoState();
});
  container.addEventListener("focusout", updateVideoState);
}

pauseVideoWhenWriting();




