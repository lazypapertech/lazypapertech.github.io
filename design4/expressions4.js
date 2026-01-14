 
/*
const tabButtonsSettings = document.querySelectorAll('.tab-button-active-settings, .tab-button-inactive-settings');
tabButtonsSettings.forEach(btn => {
  btn.addEventListener('click', () => {
    // Actualizar clases de botones
    tabButtonsSettings.forEach(b => b.classList.remove('tab-button-active-settings'));
    tabButtonsSettings.forEach(b => b.classList.add('tab-button-inactive-settings'));
    btn.classList.remove('tab-button-inactive-settings');
    btn.classList.add('tab-button-active-settings');
    
    // Obtener el panel visible actualmente
    const visiblePanel = Array.from(document.querySelectorAll('.script-panel-container')).find(panel => 
      panel.style.display === 'flex'
    );
    
    if (visiblePanel) { 
      const tabContentsSettings = visiblePanel.querySelectorAll('.tab-content-general-settings, .tab-content-advanced-settings, .tab-content-team-settings');
      tabContentsSettings.forEach(c => c.classList.remove('active'));
      
      // Mostrar el contenido correspondiente usando la clase
      const activeTab = visiblePanel.querySelector(`.${btn.dataset.tab}`);
      if (activeTab) {
        activeTab.classList.add('active');
      }
    }
  });
});
*/

const tabButtonsSettings0 = document.querySelectorAll('.tab-button-active-settings-0, .tab-button-inactive-settings-0');
tabButtonsSettings0.forEach(btn => {
  btn.addEventListener('click', () => {
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

// Llamar a la función al cargar y al redimensionar
window.addEventListener('load', adaptPlusSection);
window.addEventListener('resize', adaptPlusSection);



// ELIMINA ESTAS LÍNEAS GLOBALES:
// const editor = document.querySelector(".script-panel-editor");
// const consoleBox = document.querySelector(".script-panel-console");
// etc...

function printToConsole(msg, consoleBox) {
  if (!consoleBox) return;
  consoleBox.innerHTML += `<div>${msg}</div>`;
  consoleBox.scrollTop = consoleBox.scrollHeight;
}

function clearConsole(consoleBox) {
  if (!consoleBox) return;
  consoleBox.innerHTML = "";
}

function extractFunctions(code) {
  const regex = /function\s+(\w+)\s*\(/g;
  const list = [];
  let m;
  while ((m = regex.exec(code)) !== null) list.push(m[1]);
  return list;
}

function compilePanelCode(code) {
  const fnNames = extractFunctions(code);
  return new Function("alias", `
    with(alias) {
      ${code}
      return { ${fnNames.join(",")} };
    }
  `);
}

const realConsole = {
  log: console.log,
  error: console.error
};

function attachPanelConsole(consoleBox) {
  console.log = (...args) => {
    printToConsole(args.join(" "), consoleBox);
    realConsole.log(...args);
  };

  console.error = (...args) => {
    printToConsole("ERROR: " + args.join(" "), consoleBox);
    realConsole.error(...args);
  };
}

function restoreRealConsole() {
  console.log = realConsole.log;
  console.error = realConsole.error;
}

function show_error(panel) {
  if (!panel) return;
  
  // Activar automáticamente pestaña Advanced (console)
  const advancedBtn = document.querySelector('[data-tab="advanced-tab-content-settings"]');
  const tabButtonsSettings = document.querySelectorAll('.tab-button-active-settings, .tab-button-inactive-settings');
  const advancedTab = panel.querySelector('.advanced-tab-content-settings');
  const tabContentsSettings = panel.querySelectorAll('.tab-content-general-settings, .tab-content-advanced-settings');

  // Cambiar clases de los botones
  tabButtonsSettings.forEach(b => {
    b.classList.remove('tab-button-active-settings');
    b.classList.add('tab-button-inactive-settings');
  });
  if (advancedBtn) {
    advancedBtn.classList.remove('tab-button-inactive-settings');
    advancedBtn.classList.add('tab-button-active-settings');
  }

  // Cambiar visibilidad de tab-content
  tabContentsSettings.forEach(c => c.classList.remove('active'));
  if (advancedTab) advancedTab.classList.add('active');
}

function update_script(editor, consoleBox, panel) {
  if (!editor) return;
  
  const code = editor.innerText;
  console.log("code: ", code);

  try {
    const wrapper = compilePanelCode(code);
    const exported = wrapper(createAliasContext());
    window.__panelFunctions__ = {};

    for (const k in exported) {
      window.__panelFunctions__[k] = bindAliasToFunction(exported[k]);
    }
  } catch(e) {
    printToConsole("❌ unexpected error", consoleBox);
    printToConsole(e.message, consoleBox);
    show_error(panel);
  }
}

document.addEventListener("click", function (e) {
  // Botón Run Script 
  if (e.target.matches(".team-project")) {
	console.log("team-project");
	const plusModalOverlay = document.getElementById('plus-modal-overlay');
	if (plusModalOverlay){
		plusModalOverlay.style.display = "none";
	}
	abrirModalDinamicoSimple(html_login_required);
  }
  if (e.target.matches(".run-shortcut")) {
	console.log("run-shortcut");
	const plusModalOverlay = document.getElementById('plus-modal-overlay');
	if (plusModalOverlay){
		plusModalOverlay.style.display = "none";
	}
	abrirModalDinamicoSimple(html_login_required);
  }
  if (e.target.matches(".btn-run-script")) {
    const panel = e.target.closest('.script-panel-container');
    const editor = panel?.querySelector(".script-panel-editor");
    const consoleBox = panel?.querySelector(".script-panel-console");
    const code = editor?.innerText;
    if (!code || !consoleBox) return;
    
    try {
      attachPanelConsole(consoleBox);
      const alias = createAliasContext();
      const runTopLevel = new Function(
        "alias",
        `
          with (alias) {
            ${code}
          }
        `
      ); 
      runTopLevel(alias);
      restoreRealConsole();
      update_script(editor, consoleBox, panel); 
    } catch (e) {
      restoreRealConsole();
      printToConsole("❌ runtime error", consoleBox);
      printToConsole(e.message, consoleBox);
      show_error(panel);
    }
  }
  
  // Botón Create Button
  if (e.target.matches(".btn-create-button")) {
    const panel = e.target.closest('.script-panel-container');
    const fnSelect = panel?.querySelector(".function-select");
    const editor = panel?.querySelector(".script-panel-editor");
    const modalCreate = panel?.querySelector(".script-create-modal");
    
    if (!fnSelect || !editor) return;
    
    fnSelect.innerHTML = "";
    const fns = extractFunctions(editor.innerText);
    fns.forEach(fn => {
      const op = document.createElement("option");
      op.value = fn;
      op.textContent = fn;
      fnSelect.appendChild(op);
    });
    if (modalCreate) modalCreate.style.display = "flex";
  }
  
  // Botón Confirm Create
  if (e.target.matches(".confirm-create-button")) {
    const panel = e.target.closest('.script-panel-container');
    const fnSelect = panel?.querySelector(".function-select");
    const nameInput = panel?.querySelector(".button-name-input");
    const modalCreate = panel?.querySelector(".script-create-modal");
    const editor = panel?.querySelector(".script-panel-editor");
    const consoleBox = panel?.querySelector(".script-panel-console");
    
    if (!fnSelect || !nameInput || !editor) return;
    
    update_script(editor, consoleBox, panel); 
    const fn = fnSelect.value;
    const rawName = nameInput.value.trim();
    if (!fn || !rawName) return;
    
    const id = rawName.replace(/\s+/g,"_");
    if (lista_propiedades.includes(id)) return;
    
    lista_propiedades.push(id);
    const btn = document.createElement("button");
    btn.id = id;
    btn.textContent = rawName;
    btn.addEventListener("click", () => {
      if (!window.__panelFunctions__ || !window.__panelFunctions__[fn]) {
        alert("no se encontro ninguna funcion enlazada a esta funcion");
        return;
      }
      try {
        update_script(editor, consoleBox, panel);
        attachPanelConsole(consoleBox);
        window.__panelFunctions__[fn](); 	
        restoreRealConsole();
      } catch(e) {
        restoreRealConsole();
        alert("unespected error, check console for more details");
        printToConsole(e.message, consoleBox);
      }
    });
    
    const propiedadesRegla = document.getElementById("propiedades_regla");
    if (propiedadesRegla) propiedadesRegla.appendChild(btn);
    
    if (modalCreate) modalCreate.style.display = "none";
    nameInput.value = "";
  }
  
  // Botón Close Modal
  if (e.target.matches(".close-create-modal")) {
    const panel = e.target.closest('.script-panel-container');
    const modalCreate = panel?.querySelector(".script-create-modal");
    if (modalCreate) modalCreate.style.display = "none";
  }
  
  // Click fuera del modal
  if (e.target.matches(".script-create-modal")) {
    e.target.style.display = "none";
  }
});








/*ALIAS*/

const aliasMap = {
  array: "array_real",boxes:"unica_regla.rectangulos" 
};


//allows do key: "unica_regla.rectangulos"
function createAliasContext() {
  const ctx = {};
  
  for (const alias in aliasMap) {
    const realPath = aliasMap[alias];
    
    let realValue;
    try {
      realValue = eval(realPath);
    } catch(e) {
      realValue = window[realPath];
    }
    
    if (realValue === undefined) {
      console.warn(`⚠️ ${realPath} no está definido`);
      continue;
    }

    if (Array.isArray(realValue)) {
      ctx[alias] = new Proxy(realValue, {
        get(t, p) { return t[p]; },
        set(t, p, v) {
          t[p] = v;
          // ✅ Actualizar en el objeto original
          eval(`${realPath}[${JSON.stringify(p)}] = ${JSON.stringify(v)}`);
          return true;
        }
      });
    } else if (typeof realValue === "object" && realValue !== null) {
      ctx[alias] = new Proxy(realValue, {
        get(t, p) { return t[p]; },
        set(t, p, v) {
          t[p] = v;
          // ✅ Actualizar en el objeto original
          eval(`${realPath}.${p} = ${JSON.stringify(v)}`);
          return true;
        }
      });
    } else {
      ctx[alias] = realValue;
    }
  }
  
  return ctx;
}
 

 

function bindAliasToFunction(fn) {
  return function(...args) {
    attachPanelConsole();       // activa consola simulada
    const alias = createAliasContext();
    const result = (function() {
      with(alias) {
        return fn.apply(null, args);
      }
    })();
    restoreRealConsole();       // restaura consola real
    return result;
  };
}



const panel_rectangles = [];

function update_from_panel_rectangles() {

  if (!Array.isArray(panel_rectangles)) return;

  for (let i = 0; i < panel_rectangles.length; i++) {

    const src = panel_rectangles[i];
    if (!src) continue;

    // aseguramos objeto destino
    if (!rectangulos[i]) rectangulos[i] = {};

    if ("start" in src)        rectangulos[i].start        = src.start;
    if ("end" in src)          rectangulos[i].end          = src.end;
    if ("start_value" in src)  rectangulos[i].start_value  = src.start_value;
    if ("end_value" in src)    rectangulos[i].end_value    = src.end_value;
  }
}




/*undo y redo*/

 

function saveState() { 
console.log("saveState: ",saveState);
}
 