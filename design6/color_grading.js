document.addEventListener('DOMContentLoaded', () => {
  const preview = document.getElementById('preview');

  // Función que actualiza la previsualización
  function updatePreview() {
    const temp = Number(document.getElementById('temp')?.value || 6500);
    const hue = Number(document.getElementById('hue')?.value || 0);
    const sat = Number(document.getElementById('saturation')?.value || 100);
    const bright = Number(document.getElementById('brightness')?.value || 100);
    const contrast = Number(document.getElementById('contrast')?.value || 100);
    const highlight = Number(document.getElementById('highlight')?.value || 100);
    const shadow = Number(document.getElementById('shadow')?.value || 100);
    const whites = Number(document.getElementById('whites')?.value || 100);
    const blacks = Number(document.getElementById('blacks')?.value || 100);
    const illumination = Number(document.getElementById('illumination')?.value || 100);

    // Aproximación visual del color
    let tempFactor = Math.min(Math.max((temp - 1000) / 9000, 0), 1);
    let r = 65 + 190 * tempFactor;
    let g = 65 + 140 * tempFactor;
    let b = 65 + 90 * tempFactor;

    // Combina con hue y saturación
    let lightness = ((r + g + b) / 3 / 2) * (bright / 100);
    preview.style.background = `hsl(${hue}, ${sat}%, ${lightness}%)`;

    // Filtros aproximados para contraste e iluminación
    preview.style.filter = `contrast(${contrast}%) brightness(${illumination}%)`;
  }

  // Sincronizar sliders con sus inputs numéricos
  document.querySelectorAll('.slider-row').forEach(row => {
    const slider = row.querySelector('input[type="range"]');
    const numberInput = row.querySelector('input[type="number"]');

    if (!slider || !numberInput) return;

    // Slider -> input
    slider.addEventListener('input', () => {
      numberInput.value = slider.value;
      updatePreview();
    });

    // Input -> slider
    numberInput.addEventListener('input', () => {
      let val = Number(numberInput.value);
      if (val < Number(slider.min)) val = slider.min;
      if (val > Number(slider.max)) val = slider.max;
      slider.value = val;
      updatePreview();
    });
  });

  // Inicializa la previsualización al cargar
  updatePreview();
});