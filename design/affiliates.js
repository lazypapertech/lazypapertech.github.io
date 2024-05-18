

document.querySelector('.send_code').innerHTML = 'Send';

function AlphaNumeric(str) {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(str);
  }

  

function sendMessage() {
    
    var inputValor = document.getElementById("username").value.trim();
    if (inputValor !== "" && AlphaNumeric(inputValor)) {
        websocketClient.send("code:"+inputValor);
    }
    
  }

  websocketClient.addEventListener('message', (event) => {

    var message_result = event.data;

    if (typeof message_result==="string"){

        if (message_result.includes("Affiliate")){
            document.getElementById("confirmationMessage").innerHTML = message_result;
            document.getElementById("confirmationMessage").style.display = "block";
            document.getElementById("username").disabled = true;
            document.querySelector(".send_code").disabled = true;
        }
        if (message_result.includes("not exist")){
            document.getElementById("confirmationMessage").innerHTML = message_result;
            document.getElementById("confirmationMessage").style.display = "block";
        }

    }

  });