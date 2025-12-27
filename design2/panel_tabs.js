function create_panel_tab(tabId) { 
  if (document.getElementById(tabId)) {
  	return;
  }
  console.log("tabId: ",tabId);
  const differentTabs = document.getElementById('different_tabs');
  
  if (!differentTabs) {
    console.error('No se encontró #different_tabs');
    return;
  }
  
  const panelContainer = document.createElement('div');
  panelContainer.className = 'script-panel-container';
  panelContainer.id = tabId;
  panelContainer.style.display = 'none';
  panelContainer.style.flexDirection = 'column';
  panelContainer.style.flex = '1';
  panelContainer.style.overflow = 'hidden';

  const visible_name = underscoreToSpace(tabId);
  const visible_description = `Write an instruction that will be applied to the '${visible_name}' to define its value`;
  
/*
//poner
<button class="btn-run-script">Run script</button>
        <button class="btn-create-button">Create button</button>
*/
  panelContainer.innerHTML = `
  <div class="tab-content-general-settings general-tab-content-settings active">
    <div class="script-panel-wrapper">
      <div class="script-panel-editor-area">
        <div class="script-panel-editor" contenteditable="true" data-placeholder="${visible_description}"></div>
      </div>
      <div class="script-panel-menu">
        <button class="run-shortcut" translate="no">Run shortcut</button> 
      </div>
    </div>
     
    <div class="script-create-modal">
      <div class="script-create-modal-content">
        <button class="close-create-modal">×</button>
        <select class="function-select" name="function-select"></select>
        <input type="text" class="button-name-input" name="button-name" placeholder="button name" autocomplete="off">
        <button class="confirm-create-button">crear boton</button>
      </div>
    </div>
  </div>
  <div class="tab-content-advanced-settings advanced-tab-content-settings">
    <div class="script-panel-console">The AI comments will appear here.</div>  
  </div>

  <div class="tab-content-team-settings team-tab-content-settings"> 
        <div class="team-projects">
		<button class="team-project">Create team project</button>
	</div>
  </div>
`;
  
  differentTabs.appendChild(panelContainer);
}

function open_panel_tab(panelId) {
   
  const selectedPanel = document.getElementById(panelId);
  if (!selectedPanel || selectedPanel.style.display === 'flex') {
  	return;
  }
  console.log("panelId: ",panelId);
  const allPanels = document.querySelectorAll('.script-panel-container');
  allPanels.forEach(panel => panel.style.display = 'none');
  
  //const selectedPanel = document.getElementById(panelId);
  if (selectedPanel) {
    selectedPanel.style.display = 'flex';
    
    // Resetear los botones al estado inicial (General activo)
    const tabButtonsSettings = document.querySelectorAll('.tab-button-active-settings, .tab-button-inactive-settings');
    tabButtonsSettings.forEach(b => b.classList.remove('tab-button-active-settings'));
    tabButtonsSettings.forEach(b => b.classList.add('tab-button-inactive-settings'));
    
    // Activar el botón General
    const generalButton = document.querySelector('[data-tab="general-tab-content-settings"]');
    if (generalButton) {
      generalButton.classList.remove('tab-button-inactive-settings');
      generalButton.classList.add('tab-button-active-settings');
    }
    
    // Ocultar todos los contenidos del panel
    const allContents = selectedPanel.querySelectorAll('.tab-content-general-settings, .tab-content-advanced-settings');
    allContents.forEach(c => c.classList.remove('active'));
    
    // Mostrar solo el contenido General
    const generalContent = selectedPanel.querySelector('.general-tab-content-settings');
    if (generalContent) {
      generalContent.classList.add('active');
    }
  }
}
 
// Uso: 
//create_panel_tab("script-panel-container");
//create_panel_tab("script_final");
//open_panel_tab("script-panel-container");


function underscoreToSpace(str) {
  return str.replace(/_/g, ' ');
}