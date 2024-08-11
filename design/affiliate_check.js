
function AlphaNumeric(str) {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(str);
  }

function sendMessage() {
    
    var inputValor = document.getElementById("username").value.trim();
    if (inputValor !== "" && AlphaNumeric(inputValor)) {
      const websocketClient = new WebSocket("wss://"+url_websocket_2+"/"+inputValor);
      websocketClient.addEventListener('open', () => {
            websocketClient.send("code:"+inputValor);
            document.querySelector(".send_code").textContent = "Loading...";
      });
      websocketClient.addEventListener('message', (event) => {

        var message_result = event.data;
        console.log(message_result);
    
        if (typeof message_result==="string"){
    
            if (message_result.includes("affiliate_message:")){
                document.querySelector(".send_code").textContent = "Send";

                const aff_message=message_result.split(":")[1];
                const aff_code=message_result.split(":")[2];
                if (message_result.includes("20% discount applied")){
                    document.getElementById("confirmationMessage").innerHTML = aff_message;
                    document.getElementById("confirmationMessage").style.display = "block";
                    document.getElementById("username").disabled = true;
                    document.querySelector(".send_code").disabled = true;
                    localStorage.setItem('referralCode', aff_code);
                }
                if (message_result.includes("This discount code does not exist")){
                    document.getElementById("confirmationMessage").innerHTML = aff_message;
                    document.getElementById("confirmationMessage").style.display = "block";
                    localStorage.setItem('referralCode', '');
                    websocketClient.close(1000, 'Message sent');
                }
            }
            
    
        }
    
      });
        
    }
    
  }
