

document.querySelector('.send_code').innerHTML = 'Send';

function AlphaNumeric(str) {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(str);
  }

  

function sendMessage() {
    
    var inputValor = document.getElementById("username").value.trim();
    if (inputValor !== "" && AlphaNumeric(inputValor)) {
        O0OOO0OOO0OO00O0O0OO000O00OOO00OO0OO0OOOO0OO000OO0OO0O0OO0OO00O0O0OOO0O000O0000OO0OO0OO000OO0O00O0OO00O0O0OO0OOO00OOO0O00.send("code:"+inputValor);
    }
    
  }

  O0OOO0OOO0OO00O0O0OO000O00OOO00OO0OO0OOOO0OO000OO0OO0O0OO0OO00O0O0OOO0O000O0000OO0OO0OO000OO0O00O0OO00O0O0OO0OOO00OOO0O00.addEventListener('message', (event) => {

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
