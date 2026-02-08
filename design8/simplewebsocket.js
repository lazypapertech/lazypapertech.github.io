
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
 
  
  if (!userId) {
    userId = generateRandomUserId();
    localStorage.setItem("useridManycaptions", userId);
  }


let websocketClient;
let reconnectTimeout = null;
let isReconnecting = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 100;




function connect(type_connection) {


  if (websocketClient) {
    websocketClient.close();
    websocketClient = null;
  }

  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }

  isReconnecting = false; 


  const user_id = userId;
  const currentPath = "/path";
  const url_websocket = "rndomg84pbrg.onrender.com"; 
  websocketClient = new WebSocket("wss://" + url_websocket + "/" + user_id);
  websocketClient.binaryType = "arraybuffer";

  console.log("connecting..."); 

 
 

  websocketClient.addEventListener("open", () => {

    reconnectAttempts = 0;   // <-- AQUÍ SÍ
    isReconnecting = false;

    console.log("Client connected"); 
	 
     
    const send_type_connection =
      "type_connection==" +
      type_connection +
      "==" +
      currentPath +
      "==" +
      user_id;
    websocketClient.send(send_type_connection);

  

  });

  websocketClient.addEventListener("message", (event) => { 
 
console.log("mensaje recibido:",event.data);
      handleWebSocketMessage(event.data);
 

  });
 
  websocketClient.addEventListener("close", (event) => {  
 
        scheduleReconnect();
 
  });

  websocketClient.addEventListener("error", (error) => { 
        
	scheduleReconnect();
  });
}
 

function scheduleReconnect() {
 

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