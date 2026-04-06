const anchorState = {
    x: 0.5,
    y: 0.5,
    zoom: 1,
    dragging: false, 
    dragOffsetX : 0,
    dragOffsetY : 0
};

const POINT_RADIUS = 10; // ahora la mitad de 20px
 
 
function getBaseImageWidth() {
    const modal = document.getElementById('modal_box_dinamico');
    if (!modal) return window.innerWidth;

    const modalWidth = modal.clientWidth;
    return modalWidth > 540 ? modalWidth * 0.8 : modalWidth;
}
 
function updateImageLayout() {
    const modal = document.getElementById('modal_box_dinamico');
    const viewport = document.querySelector('.image-scroll');
    const img = document.getElementById('anchor-img');

    if (!modal || !img.naturalWidth) return;

    const modalWidth = modal.clientWidth;
    const baseWidth = modalWidth > 540 ? modalWidth * 0.8 : modalWidth;

    const ratio = img.naturalHeight / img.naturalWidth;
    const baseHeight = baseWidth * ratio;

    viewport.style.width = baseWidth + 'px';
    viewport.style.height = baseHeight + 'px';

    img.style.width = '100%';
    img.style.height = '100%';

    updateAnchorPoint();
}

function loadAnchorImage() {
    const filename = selected_rect.dataset.start_value; 
    const blobUrl = filename_url[filename]; 
    const img = document.getElementById('anchor-img');
    img.src = blobUrl;

    img.onload = () => {
        initAnchorPoint();
	updateImageLayout(); 
    };
}

 
function initAnchorPoint() {
    const inputX = document.getElementById('input_dynamic_box_0');
    const inputY = document.getElementById('input_dynamic_box_1');

    anchorState.x = inputX.value === '' ? 0.5 : parseFloat(inputX.value);
    anchorState.y = inputY.value === '' ? 0.5 : parseFloat(inputY.value);
}
 
function updateAnchorPoint() {
    const viewport = document.querySelector('.image-scroll');
    const point = document.getElementById('anchor-point');

    const rect = viewport.getBoundingClientRect();

    const px = anchorState.x * rect.width;
    const py = anchorState.y * rect.height;

    point.style.left = `${px}px`;
    point.style.top  = `${py}px`;
}
 
 









function initAnchorEvents() {
 
    ['input_dynamic_box_0', 'input_dynamic_box_1'].forEach((id, idx) => {
        const input = document.getElementById(id);
        if (!input) return;

        input.addEventListener('input', e => {
            let v = parseFloat(e.target.value);
            if (isNaN(v)) return;

            v = Math.min(1, Math.max(0, v));
            idx === 0 ? anchorState.x = v : anchorState.y = v;
            updateAnchorPoint();
        });
    });
 
    const point = document.getElementById('anchor-point');
    const wrapper = document.querySelector('.image-wrapper');
    const img = document.getElementById('anchor-img');

    if (!point || !wrapper || !img) return;

     
    window.addEventListener('mouseup', () => anchorState.dragging = false);
 

point.addEventListener('mousedown', e => {
    anchorState.dragging = true;

    const rect = point.getBoundingClientRect();

    // offset desde donde clickeaste al centro del punto
    anchorState.dragOffsetX = e.clientX - (rect.left + rect.width / 2);
    anchorState.dragOffsetY = e.clientY - (rect.top  + rect.height / 2);

    e.preventDefault();
});
wrapper.addEventListener('mousemove', e => {
    if (!anchorState.dragging) return;

    const imgRect = img.getBoundingClientRect();

    // corregimos por offset y por zoom
    const x =
        (e.clientX - imgRect.left - anchorState.dragOffsetX)
        / (imgRect.width);

    const y =
        (e.clientY - imgRect.top - anchorState.dragOffsetY)
        / (imgRect.height);

 
    anchorState.x = Math.min(1, Math.max(0, x));
    anchorState.y = Math.min(1, Math.max(0, y)); 

    document.getElementById('input_dynamic_box_0').value = anchorState.x.toFixed(3);
    document.getElementById('input_dynamic_box_1').value = anchorState.y.toFixed(3);

    updateAnchorPoint();
});
 

    window.addEventListener('resize', () => {
    	updateImageLayout();
    });
}