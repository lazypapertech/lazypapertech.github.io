// Tabs para el PRIMER bloque (bloque 0)
const tabButtonsSettings0 = document.querySelectorAll('.tab-button-active-settings-0, .tab-button-inactive-settings-0');
tabButtonsSettings0.forEach(btn => {
  btn.addEventListener('click', () => {
    // AGREGAR CONSOLE.LOG AQUÍ 
    console.log('Data-tab (bloque 0):', btn.dataset.tab);
    show_menu_option(btn.dataset.tab);
    
    // Actualizar clases de botones del bloque 0
    tabButtonsSettings0.forEach(b => b.classList.remove('tab-button-active-settings-0'));
    tabButtonsSettings0.forEach(b => b.classList.add('tab-button-inactive-settings-0'));
    btn.classList.remove('tab-button-inactive-settings-0');
    btn.classList.add('tab-button-active-settings-0');
    
    // Buscar el contenedor padre del bloque 0
    const parentContainer = btn.closest('.plus-modal-content-0');
    
    if (parentContainer) { 
      const tabContentsSettings = parentContainer.querySelectorAll('.tab-content-general-settings-0, .tab-content-advanced-settings-0, .tab-content-team-settings-0');
      tabContentsSettings.forEach(c => c.classList.remove('active'));
      
      // Mostrar el contenido correspondiente
      const activeTab = parentContainer.querySelector(`.${btn.dataset.tab}`);
      if (activeTab) {
        activeTab.classList.add('active');
      }
    }
  });
});

// Tabs para el SEGUNDO bloque (bloque 1)
const tabButtonsSettings1 = document.querySelectorAll('.tab-button-active-settings-1, .tab-button-inactive-settings-1');
tabButtonsSettings1.forEach(btn => {
  btn.addEventListener('click', () => {
    // AGREGAR CONSOLE.LOG AQUÍ 
    console.log('Data-tab (bloque 1):', btn.dataset.tab);
    show_menu_option(btn.dataset.tab);
    
    // Actualizar clases de botones del bloque 1
    tabButtonsSettings1.forEach(b => b.classList.remove('tab-button-active-settings-1'));
    tabButtonsSettings1.forEach(b => b.classList.add('tab-button-inactive-settings-1'));
    btn.classList.remove('tab-button-inactive-settings-1');
    btn.classList.add('tab-button-active-settings-1');
    
    // Buscar el contenedor padre del bloque 1
    const parentContainer = btn.closest('.plus-modal-content-1');
    
    if (parentContainer) { 
      const tabContentsSettings = parentContainer.querySelectorAll('.tab-content-general-settings-1, .tab-content-advanced-settings-1, .tab-content-team-settings-1');
      tabContentsSettings.forEach(c => c.classList.remove('active'));
      
      // Mostrar el contenido correspondiente
      const activeTab = parentContainer.querySelector(`.${btn.dataset.tab}`);
      if (activeTab) {
        activeTab.classList.add('active');
      }
    }
  });
});


/*
function show_menu_option(dataset_tab) {
  let html_string = '';
  let target_div_id = '';
  
  // IFs para el BLOQUE 0
  if (dataset_tab === "general-tab-content-settings-0") {
    html_string = '<div class="profile-content">Contenido de Profile</div>';
    target_div_id = 'different_tabs_0';
  }
  
  if (dataset_tab === "advanced-tab-content-settings-0") {
    html_string = '<div class="other-content">Contenido de Other</div>';
    target_div_id = 'different_tabs_0';
  }
  
  if (dataset_tab === "team-tab-content-settings-0") {
    html_string = '<div class="tutorials-content">Contenido de Tutorials</div>';
    target_div_id = 'different_tabs_0';
  }
  
  // IFs para el BLOQUE 1
  if (dataset_tab === "general-tab-content-settings-1") {
    html_string = '<div class="general-content">Contenido de General</div>';
    target_div_id = 'different_tabs_1';
  }
  
  if (dataset_tab === "advanced-tab-content-settings-1") {
    html_string = '<div class="comments-content">Contenido de Comments</div>';
    target_div_id = 'different_tabs_1';
  }
  
  if (dataset_tab === "team-tab-content-settings-1") {
    html_string = '<div class="teams-content">Contenido de Teams</div>';
    target_div_id = 'different_tabs_1';
  }
  
  // Insertar el HTML en el contenedor correspondiente
  const targetDiv = document.getElementById(target_div_id);
  if (targetDiv) {
    targetDiv.innerHTML = html_string;
  }
}
*/

// Lista de IDs de botones para el perfil
const profile_options_buttons = ["saved_projects", "saved_videos"];
let user_saved_projects = ["project 1","project 2","project 3","project 4","project 5","project 6"];
let user_saved_videos = ["video 1","video 2","video 3","video 4","video 5"];

const tutorial_options_buttons = ["Standard", "Motion Graphics","Animation"];
let tutorial_videos = ["https://raw.githubusercontent.com/manyresources/resourcespage/main/videos/loading.mp4","https://raw.githubusercontent.com/manyresources/resourcespage/main/videos/loading.mp4"];
 
  
/*
user_saved_projects = [false];
user_saved_videos = [false];
*/
 
 
function show_menu_option(dataset_tab) {
  let html_string = '';
  let target_div_id = '';
  
  // IFs para el BLOQUE 0
  if (dataset_tab === "general-tab-content-settings-0") {
    // Crear los botones de opciones
    let buttons_html = '';
    profile_options_buttons.forEach(btn_id => {
      buttons_html += `<button class="profile-option-btn ${btn_id === 'saved_projects' ? 'active-profile-btn' : ''}" id="${btn_id}">${reemplazarGuionesPorEspacios(btn_id)}</button>`;
    });
    
    html_string = `
      <div class="profile-container">
        <div class="profile-options" id="profile-options-buttons">
          ${buttons_html}
        </div>
        <div class="profile-content-wrapper">
          <div class="profile-content" id="profile-content-display">
            <!-- Aquí se mostrará el contenido dinámico -->
          </div>
        </div>
      </div>
    `;
    target_div_id = 'different_tabs_0';
  }
  
  if (dataset_tab === "advanced-tab-content-settings-0") {
    html_string = '<div class="other-content">Empty list</div>';
    target_div_id = 'different_tabs_0';
  }
  
  if (dataset_tab === "team-tab-content-settings-0") {
    // Crear los botones de opciones para tutoriales
    let buttons_html = '';
    tutorial_options_buttons.forEach((btn_id, index) => {
      buttons_html += `<button class="profile-option-btn ${index === 0 ? 'active-profile-btn' : ''}" id="${btn_id}">${reemplazarGuionesPorEspacios(btn_id)}</button>`;
    });
    
    html_string = `
      <div class="profile-container">
        <div class="profile-options" id="tutorial-options-buttons">
          ${buttons_html}
        </div>
        <div class="profile-content-wrapper">
          <div class="profile-content" id="tutorial-content-display">
            <!-- Aquí se mostrará el contenido dinámico -->
          </div>
        </div>
      </div>
    `;
    target_div_id = 'different_tabs_0';
  }
  if (dataset_tab === "upgrade-tab-content-settings-0") {
    html_string = '<div class="upgradeplan-content">Upgrade plan</div>';
    target_div_id = 'different_tabs_0';
  }
  
  // IFs para el BLOQUE 1
  if (dataset_tab === "general-tab-content-settings-1") {
    //html_string = '<div class="general-content">General</div>';
    html_string = `<div class="general-content">
  <!-- Previsualización de la imagen -->
  <div id="preview" style="height:200px; border-radius:8px; border:1px solid rgba(255,255,255,0.2); background: rgb(65,65,65);"></div>

  <!-- Grupo 1: Color -->
  <div class="panel-group">
    <h3>Color</h3>
    <div class="slider-row">
      <label for="temp">Temperature</label>
      <input type="range" id="temp" min="1000" max="10000" value="6500">
      <input type="number" min="1000" max="10000" value="6500">
    </div>
    <div class="slider-row">
      <label for="hue">Hue</label>
      <input type="range" id="hue" min="0" max="360" value="0">
      <input type="number" min="0" max="360" value="0">
    </div>
    <div class="slider-row">
      <label for="saturation">Saturation</label>
      <input type="range" id="saturation" min="0" max="200" value="100">
      <input type="number" min="0" max="200" value="100">
    </div>
  </div>

  <!-- Grupo 2: Lightness -->
  <div class="panel-group">
    <h3>Lightness</h3>
    <div class="slider-row">
      <label for="brightness">Brightness</label>
      <input type="range" id="brightness" min="0" max="200" value="100">
      <input type="number" min="0" max="200" value="100">
    </div>
    <div class="slider-row">
      <label for="contrast">Contrast</label>
      <input type="range" id="contrast" min="0" max="200" value="100">
      <input type="number" min="0" max="200" value="100">
    </div>
    <div class="slider-row">
      <label for="highlight">Highlight</label>
      <input type="range" id="highlight" min="0" max="200" value="100">
      <input type="number" min="0" max="200" value="100">
    </div>
    <div class="slider-row">
      <label for="shadow">Shadow</label>
      <input type="range" id="shadow" min="0" max="200" value="100">
      <input type="number" min="0" max="200" value="100">
    </div>
    <div class="slider-row">
      <label for="whites">Whites</label>
      <input type="range" id="whites" min="0" max="200" value="100">
      <input type="number" min="0" max="200" value="100">
    </div>
    <div class="slider-row">
      <label for="blacks">Blacks</label>
      <input type="range" id="blacks" min="0" max="200" value="100">
      <input type="number" min="0" max="200" value="100">
    </div>
    <div class="slider-row">
      <label for="illumination">Illumination</label>
      <input type="range" id="illumination" min="0" max="200" value="100">
      <input type="number" min="0" max="200" value="100">
    </div>
  </div>
</div>`;
    target_div_id = 'different_tabs_1';
  }
  
  if (dataset_tab === "advanced-tab-content-settings-1") {
    //html_string = '<div class="comments-content">Comments</div>';
    html_string = `<div class="comments-content">
  <div class="upload-panel">
    <h2 class="upload-title">Advertising Videos</h2>
    <p class="upload-description">
      This section allows videos to be uploaded for showcasing services or products on the website. 
  Videos can be selected and configured to stand out to the audience.
    </p>

    <div class="video-preview-container">
      <div class="video-thumbnail">
        <p>Video preview</p>
      </div>
      <button class="select-video-btn">Select Video</button>
    </div>

    <div class="video-details">
      <label class="video-label">Título del video</label>
      <div class="video-info">Mi Video Genial</div>

      <label class="video-label">Categoría</label>
      <div class="video-info">Publicidad</div>

      <label class="video-label">Descripción</label>
      <div class="video-info">Breve descripción de tu video para que los usuarios la vean.</div>
    </div>

    <div class="action-buttons">
      <button class="publish-btn">Publicar Video</button>
      <button class="cancel-btn">Cancelar</button>
    </div>
  </div>
</div>`;
    target_div_id = 'different_tabs_1';
  }
  
  if (dataset_tab === "team-tab-content-settings-1") {
    //html_string = '<div class="teams-content">Teams</div>';
    html_string = `<div class="designer-panel">
  <!-- Sección de medición de trabajo -->
  <div class="panel-section">
    <h2>Creative Metrics</h2>
    <p>Activating this option allows work to be measured and evaluated to improve ranking.</p>
    <label class="switch">
      <input type="checkbox" id="measure-work-toggle">
      <span class="slider"></span>
    </label>
  </div>

  <!-- Sección de portfolio -->
  <div class="panel-section">
    <h2>Portfolio</h2>
    <p>Projects can be selected to be shown directly to customers.</p>
    <button class="select-portfolio-btn">Select project</button>

     
  </div>
</div>`;
    target_div_id = 'different_tabs_1';
  }
  
  // Insertar el HTML en el contenedor correspondiente
  const targetDiv = document.getElementById(target_div_id);
  if (targetDiv) {
    targetDiv.innerHTML = html_string;
    
    // Si es el perfil (general-tab-content-settings-0), mostrar saved_projects por defecto
    if (dataset_tab === "general-tab-content-settings-0") {
      showProfileContent('saved_projects');
    }
    
    // Si es tutorials (team-tab-content-settings-0), mostrar el primer botón por defecto
    if (dataset_tab === "team-tab-content-settings-0") {
      showTutorialContent(tutorial_options_buttons[0]);
    }
  }
}

// Función para mostrar el contenido de cada opción del perfil
function showProfileContent(option_id) {
  const profileContentDisplay = document.getElementById('profile-content-display');
  const profileOptionsButtons = document.getElementById('profile-options-buttons');
  
  if (!profileContentDisplay) return;
  
  let content_html = '';
  
  if (option_id === "saved_projects") {
    // Caso especial: usuario no logueado
    if (user_saved_projects.length === 1 && user_saved_projects[0] === false) {
      // Ocultar botones de opciones
      if (profileOptionsButtons) {
        profileOptionsButtons.style.display = 'none';
      }
      
      content_html = `
        <div class="login-container"> 
          <button class="login-btn login-email">Login with Email</button>
          <button class="login-btn login-google">Login with Google</button>
        </div>
      `;
    } 
    // Usuario logueado con proyectos
    else {
      // Mostrar botones de opciones
      if (profileOptionsButtons) {
        profileOptionsButtons.style.display = 'flex';
      }
      
      if (user_saved_projects.length > 0) {
        content_html = '<div class="profile-grid">';
        user_saved_projects.forEach(project_name => {
          content_html += `
            <div class="grid-item project-item" data-project-name="${project_name}">
              <div class="grid-icon">
                <svg width="100%" height="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 6H9L11 9H21C21.5523 9 22 9.44772 22 10V18C22 18.5523 21.5523 19 21 19H3C2.44772 19 2 18.5523 2 18V7C2 6.44772 2.44772 6 3 6Z"
                    fill="#c4cdd0"
                    stroke="#c4cdd0"
                    stroke-width="1"
                  />
                </svg>
              </div>
              <div class="grid-label">${project_name}</div>
            </div>
          `;
        });
        content_html += '</div>';
      } else {
        content_html = '<div class="profile-grid"></div>';
      }
    }
  }
  
  if (option_id === "saved_videos") {
    // Mostrar botones de opciones
    if (profileOptionsButtons) {
      profileOptionsButtons.style.display = 'flex';
    }
    
    if (user_saved_videos.length > 0) {
      content_html = '<div class="profile-grid">';
      user_saved_videos.forEach((video_url, index) => {
        content_html += `
          <div class="grid-item video-item" data-video-url="${video_url}" data-video-index="${index}">
            <div class="grid-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9"
                  fill="none" stroke="white" stroke-width="2"/>
                <circle cx="10" cy="15" r="1.7" fill="white"/>
                <circle cx="14" cy="13.2" r="1.7" fill="white"/>
                <path d="M14 7v6" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M10 8.5v6.5" stroke="white" stroke-width="2" stroke-linecap="round"/>
                <path d="M10 8.5 L14 7.2"
                  stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="grid-label">Video ${index + 1}</div>
          </div>
        `;
      });
      content_html += '</div>';
    } else {
      content_html = '<div class="profile-grid"></div>';
    }
  }
  
  profileContentDisplay.innerHTML = content_html;
}

// Función para mostrar el contenido de tutorials
function showTutorialContent(option_id) {
  const tutorialContentDisplay = document.getElementById('tutorial-content-display');
  
  if (!tutorialContentDisplay) return;
  
  let content_html = '';
  
  // Aquí puedes agregar IFs específicos si cada botón muestra diferentes videos
  // Por ahora muestro todos los tutorial_videos
  if (tutorial_videos.length > 0) {
    content_html = '<div class="profile-grid">';
    tutorial_videos.forEach((video_url, index) => {
      content_html += `
        <div class="grid-item tutorial-video-item" data-tutorial-url="${video_url}" data-tutorial-index="${index}">
          <div class="grid-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24">
              <rect x="4" y="5" width="16" height="14"
                fill="none" stroke="white" stroke-width="2"/>
              <polygon points="10,9 16,12 10,15" fill="white"/>
            </svg>
          </div>
          <div class="grid-label">Tutorial ${index + 1}</div>
        </div>
      `;
    });
    content_html += '</div>';
  } else {
    content_html = '<div class="profile-grid"></div>';
  }
  
  tutorialContentDisplay.innerHTML = content_html;
}

// Event listener para los clicks
document.addEventListener("click", function (e) {
  // Click en botones de opciones del perfil
  if (e.target.matches('.profile-option-btn')) {
    // Remover clase activa de todos los botones
    document.querySelectorAll('.profile-option-btn').forEach(btn => {
      btn.classList.remove('active-profile-btn');
    });
    
    // Agregar clase activa al botón presionado
    e.target.classList.add('active-profile-btn');
    
    // Verificar si es del perfil o tutorial
    if (document.getElementById('profile-content-display')) {
      showProfileContent(e.target.id);
    } else if (document.getElementById('tutorial-content-display')) {
      showTutorialContent(e.target.id);
    }
  }
  
  // Click en proyecto
  if (e.target.closest('.project-item')) {
    const projectItem = e.target.closest('.project-item');
    const projectName = projectItem.dataset.projectName;
    console.log('Proyecto seleccionado:', projectName);
  }
  
  // Click en video
  if (e.target.closest('.video-item')) {
    const videoItem = e.target.closest('.video-item');
    const videoUrl = videoItem.dataset.videoUrl;
    const videoIndex = videoItem.dataset.videoIndex;
    console.log('Video seleccionado:', videoUrl, 'Index:', videoIndex);
  }
  
  // Click en tutorial video - abrir modal
  if (e.target.closest('.tutorial-video-item')) {
    const tutorialItem = e.target.closest('.tutorial-video-item');
    const tutorialUrl = tutorialItem.dataset.tutorialUrl;
    const tutorialIndex = tutorialItem.dataset.tutorialIndex;
    openTutorialModal(tutorialUrl);
  }
  
  // Click en botón cerrar modal tutorial
  if (e.target.closest('.tutorial-btn-close')) {
    closeTutorialModal();
  }
  
  // Click en botones de login
  if (e.target.matches('.login-email')) {
    console.log('Login con Email');
  }
  
  if (e.target.matches('.login-google')) {
    console.log('Login con Google');
  }
});

// Función para abrir modal de tutorial
function openTutorialModal(videoUrl) {
  const modalHtml = `
    <div class="tutorial-modal-overlay" id="tutorial-modal-overlay">
      <div class="tutorial-modal-content">
        <button class="tutorial-btn-close">
          <svg width="100%" height="100%" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <line x1="6" y1="6" x2="18" y2="18" stroke="black" stroke-width="2" stroke-linecap="round"/>
            <line x1="18" y1="6" x2="6" y2="18" stroke="black" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <div class="tutorial-video-wrapper">
          <video controls autoplay class="tutorial-video">
            <source src="${videoUrl}" type="video/mp4">
            Tu navegador no soporta el elemento de video.
          </video>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.body.style.overflow = 'hidden';
}

// Función para cerrar modal de tutorial
function closeTutorialModal() {
  const modal = document.getElementById('tutorial-modal-overlay');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
  }
}

// Cargar contenido inicial al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  show_menu_option('general-tab-content-settings-0');
  show_menu_option('general-tab-content-settings-1');  
   
});










 


// Llamar a la función al cargar y al redimensionar
window.addEventListener('load', adaptPlusSection);
window.addEventListener('resize', adaptPlusSection);

 