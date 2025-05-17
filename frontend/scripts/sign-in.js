import apiRequest from "./api.js";
import { showToast, navigateTo, clearFields, areFieldsFilled, disableBtn, redirectIfLoggedIn } from "./utils.js";


redirectIfLoggedIn();

const signInBtn = document.querySelector('.js-login-btn');


signInBtn.addEventListener('click', async event => {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!areFieldsFilled(email, password)) {
        showToast('Please fill in all the fields', 'error');
        return;
    }
    
    disableBtn(signInBtn);

    const result = await apiRequest(`/api/v1/auth/sign-in`, 'POST', { email, password });

    console.log(result)

    if (result.error) {
        showToast(result.error, 'error');
        signInBtn.classList.remove('non-active');
        signInBtn.querySelector('div').style.visibility = 'hidden';
        clearFields(email, password);
        return;
    }
    
    const { token } = result.data;

    if (token) {
        localStorage.setItem('authToken', token);

        showToast(result.message || 'Signed in successfully', 'success');

        
        setTimeout(() => {
            navigateTo('dashboard');
        }, 1500);
    } else { 
        showToast(result.error || 'Sign in failed', 'error');
        signInBtn.classList.remove('non-active');
        signInBtn.querySelector('div').style.visibility = 'hidden';
        clearFields(email, password);
    }
});