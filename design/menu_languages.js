document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("click", function(event) {
        var dropdownContent = document.getElementById("dropdown-content");
        var dropdownBtn = document.getElementById("dropdown-btn");

        if (event.target !== dropdownContent && event.target !== dropdownBtn) {
            dropdownContent.style.display = "none";
        }
    });
});

function toggleDropdown(event) {
    var dropdownContent = document.getElementById("dropdown-content");
    if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
    } else {
        dropdownContent.style.display = "block";
    }

    if (event && event.stopPropagation) {
        event.stopPropagation();
    }
}

let output_language={"English":"en","Spanish":"es","Portuguese":"pt"};

function send_to_translate(lang){
    var text=getTextareaValue();
    const user_id=localStorage.getItem('userid');
    websocketClient.send("translate_client_"+user_id+"_client_"+text+"_client_"+lang);
    
};

function selectOption(option) {
    var dropdownBtn = document.getElementById("dropdown-btn");
    dropdownBtn.innerHTML =  option + " &#x025BE;";
    var dropdownContent = document.getElementById("dropdown-content");
    dropdownContent.style.display = "none";

    dropdownBtn.disabled = true;

    send_to_translate(output_language[option]);


    console.log("Language:", option);
}
