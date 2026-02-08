// Variables globales
const GLOBAL_DOMAIN = 'https://manycaptions.com/portuguese'; 
  
// Función para reintentar envío de mensaje
function sendWithRetry(message, maxRetries = 3, delay = 1000) {
    let retries = 0;
    //const message = JSON.stringify(message0);
    function attempt() {
        if (safeSend(message)) {
            console.log("Mensaje enviado exitosamente");
            return;
        }
        
        retries++;
        if (retries < maxRetries) {
            console.log(`Reintentando envío (${retries}/${maxRetries})...`);
            setTimeout(attempt, delay);
        } else {
            console.error("No se pudo enviar el mensaje después de", maxRetries, "intentos");
            alert("Error de conexión. Por favor, recarga la página e intenta nuevamente.");
        }
    }
    
    attempt();
}

function handleWebSocketMessage(data) {
console.log("RECIBIENDO CONFIRMACION");
    try {
        const message = JSON.parse(data);
        
        // Verificar que el mensaje sea del sistema de login
        if (message.type !== 'login_system') {
            return; // Ignorar mensajes que no son del login
        }
        
        // Si recibimos "login-password" o "create-account-password", redirigimos
        if (message.action === 'login-password') {
            const email = document.getElementById('emailInputLogin').value;
            sessionStorage.setItem('userEmail', email);
            window.location.href = GLOBAL_DOMAIN + '/login-password.html';
        } else if (message.action === 'create-account-password') {
            const email = document.getElementById('emailInputLogin').value;
            sessionStorage.setItem('userEmail', email);
            window.location.href = GLOBAL_DOMAIN + '/create-account-password.html';
        }
        
        // Si recibimos "login_exitoso", redirigimos al dashboard
        else if (message.action === 'login_exitoso') {
            window.location.href = GLOBAL_DOMAIN + '/responsive7_7.html?user=true';
        }
         
        // Si recibimos "login_error", mostramos el error
	else if (message.action === 'login_error') {
            const errorMessage = document.getElementById('errorMessage');
            const continueBtn = document.getElementById('continueBtn');
            const btnText = document.getElementById('btnText');
            const passwordInput = document.getElementById('passwordInput');

            if (errorMessage) {
                errorMessage.style.display = 'block';
                btnText.textContent = 'Continue';
                btnText.style.display = 'inline';
                document.querySelector('.spinner')?.remove();
                continueBtn.disabled = false;
                passwordInput.disabled = false;
            }
        }
/*
else if (message.action === 'login_error') {
    const errorMessage = document.getElementById('errorMessage');
    const continueBtn = document.getElementById('continueBtn');
    const btnText = document.getElementById('btnText');
    const passwordInput = document.getElementById('passwordInput');
    
    if (errorMessage) {
        errorMessage.textContent = message.error_message || 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
        btnText.textContent = 'Continue';
        btnText.style.display = 'inline';
        document.querySelector('.spinner')?.remove();
        continueBtn.disabled = false;
        passwordInput.disabled = false;
    }
}
*/
    } catch (error) {
        // Si no es JSON o no tiene el formato esperado, ignorar
        return;
    }
}
 
// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Lógica para página principal (modal con email)
    const emailInput = document.getElementById('emailInputLogin');
    const emailContinueBtn = document.getElementById('continueBtnLogin');
    
    if (emailInput && emailContinueBtn) {
        emailContinueBtn.addEventListener('click', function() {
            const email = emailInput.value.trim();
            if (email && validateEmail(email)) {
                const emailData = JSON.stringify({
                    type: 'login_system',
                    action: 'check_email',
                    user_email: email
                });
                sendWithRetry(emailData);
            }
        });
        
        emailInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                emailContinueBtn.click();
            }
        });
    }
    
    // Lógica para páginas de password
    const emailDisplay = document.getElementById('emailDisplay');
    const passwordInput = document.getElementById('passwordInput');
    const togglePassword = document.getElementById('togglePassword');
    const passwordContinueBtn = document.getElementById('continueBtn');
    
    if (emailDisplay && passwordInput && togglePassword && passwordContinueBtn) {
        // Mostrar email guardado
        const storedEmail = sessionStorage.getItem('userEmail');
        if (storedEmail) {
            emailDisplay.value = storedEmail;
        }
        
        // Toggle password visibility
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
        
        // Enviar password
        const btnText = document.getElementById('btnText');
        
        passwordContinueBtn.addEventListener('click', function() {
            const password = passwordInput.value.trim();
            if (password) {
                const errorMessage = document.getElementById('errorMessage');
                
                // Ocultar error si existe
                if (errorMessage) {
                    errorMessage.style.display = 'none';
                }
                
                // Deshabilitar input y mostrar spinner
                passwordInput.disabled = true;
                passwordContinueBtn.disabled = true;
                btnText.style.display = 'none';
                
                const spinner = document.createElement('div');
                spinner.className = 'spinner';
                passwordContinueBtn.appendChild(spinner);
                
                // Enviar password al servidor en formato JSON
                const passwordData = JSON.stringify({
                    type: 'login_system',
                    action: 'submit_password',
                    user_password: password
                });
                sendWithRetry(passwordData);
            }
        });
        
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                passwordContinueBtn.click();
            }
        });
    }
});

// Validación de email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}



 
function checkUserLogin() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('user') === 'true') {
    console.log("logueado");
    user_saved_projects = ['project 1','project 2','project 3'];
  }
}

// Ejecutar cuando se cargue la página
window.addEventListener('load', checkUserLogin);

 