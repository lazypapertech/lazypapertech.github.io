
function AlphaNumeric(str) {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(str);
  }

  let xx1_check="s";
  let xx2_check="y";
  let xx3_check="m";
  let xx4_check="p";
  let xx5_check="h";
  let xx6_check="o";
  let xx7_check="n";
  let xx8_check="i";
  let xx9_check="o";
  let xx10_check="u";
  let xx11_check="s";
  let xx12_check=".";
  let xx13_check="gli";
  let xx14_check="tch";
  let xx15_check=".me";
  let url_websocket_check=xx1_check+xx2_check+xx3_check+xx4_check+xx5_check+xx6_check+xx7_check+xx8_check+xx9_check+xx10_check+xx11_check+"20"+xx12_check+xx13_check+xx14_check+xx15_check;

function sendMessage() {
    
    const inputValor_check = document.getElementById("username").value.trim();
    if (inputValor_check !== "" && AlphaNumeric(inputValor_check)) {
      const websocketClient = new WebSocket("wss://"+url_websocket_check+"/"+inputValor_check);
      websocketClient.addEventListener('open', () => {
            websocketClient.send("code:"+inputValor_check);
            document.querySelector(".send_code").textContent = "Loading...";
      });
      websocketClient.addEventListener('message', (event) => {

        var message_result_check = event.data;
    
        if (typeof message_result_check==="string"){
    
            if (message_result_check.includes("affiliate_message:")){
                document.querySelector(".send_code").textContent = "Send";

                const aff_message_check=message_result_check.split(":")[1];
                const aff_code_check=message_result_check.split(":")[2];
                if (message_result_check.includes("20% discount applied")){
                    document.getElementById("confirmationMessage").innerHTML = aff_message_check;
                    document.getElementById("confirmationMessage").style.display = "block";
                    document.getElementById("username").disabled = true;
                    document.querySelector(".send_code").disabled = true;
                    localStorage.setItem('referralCode', aff_code_check);
                }
                if (message_result_check.includes("This discount code does not exist")){
                    document.getElementById("confirmationMessage").innerHTML = aff_message_check;
                    document.getElementById("confirmationMessage").style.display = "block";
                    localStorage.setItem('referralCode', '');
                    websocketClient.close(1000, 'Message sent');
                }
            }
            
    
        }
    
      });
        
    }
    
  }
