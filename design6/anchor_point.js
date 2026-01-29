 
function loadAnchorImage() {
    const filename = selected_rect.dataset.start_value; 
    const blobUrl = filename_url[filename]; 
    const img = document.getElementById('anchor-img');
    img.src = blobUrl;

    img.onload = () => {
        initAnchorPoint();
        updateAnchorPoint();
    };
}
 
const anchorState = {
    x: 0.5,
    y: 0.5,
    zoom: 1,
    dragging: false, 
    dragOffsetX: 0,
    dragOffsetY: 0
};

const POINT_RADIUS = 10;
const STEP_VALUE = 0.01;

 

function snapToGrid(value) {
    return Math.round(value / STEP_VALUE) * STEP_VALUE;
}

function initAnchorPoint() {
    const inputX = document.getElementById('input_dynamic_box_0');
    const inputY = document.getElementById('input_dynamic_box_1');

    anchorState.x = inputX.value === '' ? 0.5 : parseFloat(inputX.value);
    anchorState.y = inputY.value === '' ? 0.5 : parseFloat(inputY.value);
}

function updateAnchorPoint_0() {
    const viewport = document.querySelector('.image-scroll');
    const point = document.getElementById('anchor-point');

    if (!viewport || !point) return;

    const rect = viewport.getBoundingClientRect();
    const px = anchorState.x * rect.width;
    const py = anchorState.y * rect.height;

    point.style.left = `${px}px`;
    point.style.top = `${py}px`;
}
function updateAnchorPoint() {
    const viewport = document.querySelector('.image-scroll');
    const point = document.getElementById('anchor-point');
    const img = document.getElementById('anchor-img');

    if (!viewport || !point || !img) return;

    const imgRect = img.getBoundingClientRect(); // Usar la imagen, no el viewport

    const px = anchorState.x * imgRect.width;
    const py = anchorState.y * imgRect.height;

    // Posicionar relativo a la imagen
    point.style.left = `${px + (imgRect.left - viewport.getBoundingClientRect().left)}px`;
    point.style.top = `${py + (imgRect.top - viewport.getBoundingClientRect().top)}px`;
}

function initAnchorEvents() {
    const point = document.getElementById('anchor-point');
    const wrapper = document.querySelector('.image-wrapper');
    const img = document.getElementById('anchor-img');

    if (!point || !wrapper || !img) return;

    window.addEventListener('mouseup', () => {
        if (anchorState.dragging) {
            anchorState.x = snapToGrid(anchorState.x);
            anchorState.y = snapToGrid(anchorState.y);
            
            document.getElementById('input_dynamic_box_0').value = anchorState.x.toFixed(2);
            document.getElementById('input_dynamic_box_1').value = anchorState.y.toFixed(2);
            
            updateAnchorPoint();
        }
        anchorState.dragging = false;
    });

    point.addEventListener('mousedown', e => {
        anchorState.dragging = true;
        const rect = point.getBoundingClientRect();
        anchorState.dragOffsetX = e.clientX - (rect.left + rect.width / 2);
        anchorState.dragOffsetY = e.clientY - (rect.top + rect.height / 2);
        e.preventDefault();
    });

    wrapper.addEventListener('mousemove', e => {
        if (!anchorState.dragging) return;

        const imgRect = img.getBoundingClientRect();
        const x = (e.clientX - imgRect.left - anchorState.dragOffsetX) / imgRect.width;
        const y = (e.clientY - imgRect.top - anchorState.dragOffsetY) / imgRect.height;

        anchorState.x = Math.min(1, Math.max(0, x));
        anchorState.y = Math.min(1, Math.max(0, y)); 

        document.getElementById('input_dynamic_box_0').value = anchorState.x.toFixed(2);
        document.getElementById('input_dynamic_box_1').value = anchorState.y.toFixed(2);

        updateAnchorPoint();
    });

    window.addEventListener('resize', () => {
        updateAnchorPoint();
    });
}
  