function generateRandomUserId() {
    const digits = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let userId = "";
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      userId += digits[randomIndex];
    }
    return userId;
}

let userId = localStorage.getItem("useridManycaptions");
//userId = "0123456789";
  
  if (!userId) {
    userId = generateRandomUserId();
    localStorage.setItem("useridManycaptions", userId);
  }


let websocketClient;
let reconnectTimeout = null;
let isReconnecting = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 100;
 
 

function scheduleReconnect() {

  hide_loading_tab();
  crear_loading_tab();

  if (isReconnecting) return;
  isReconnecting = true;
 
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.warn("Límite de reconexiones alcanzado");
    return;
  }

  reconnectAttempts++; 

  frameIndex = 0;
  globalBuffer = new Uint8Array(0);
  ocultarBarras();
  n_seg = 0;

  console.log(`Reintentando conexión (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) en 5s...`);

  reconnectTimeout = setTimeout(() => {
    connect("reconnecting");
  }, 5000);
}


connect("initial_configuration");//connected


function safeSend(message) {
    if (websocketClient.readyState === WebSocket.OPEN) {
        websocketClient.send(message);
        return true;
    } else {
        console.warn("WebSocket no está listo, estado:", websocketClient.readyState);
        return false;
    }
}

function hide_loading_tab() { 
    const empty_block = document.querySelector(".empty-block-container");
            if (empty_block) {
                empty_block.style.display = "flex";
            }

	const item_loader = document.getElementById("item-loader");
            if (item_loader) {
		console.log("exists");
                item_loader.style.display = "none";
		const empty_block = document.querySelector(".empty-block-container");
                if (empty_block) {
                	empty_block.style.display = "flex";
                }
            }
}



