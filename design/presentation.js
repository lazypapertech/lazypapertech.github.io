const pulse = document.querySelector('.start-pulse-circle');

function startPulseAnimation() {
  pulse.style.animation = 'none';         
  pulse.offsetHeight;                     
  pulse.style.animation = 'pulseWave 1s ease-out forwards';  
}

 startPulseAnimation();  
setInterval(startPulseAnimation, 3000);