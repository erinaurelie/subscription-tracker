import apiRequest from "./api.js";
import { areFieldsFilled, disableBtn, showToast, navigateTo, redirectIfLoggedIn } from "./utils.js";


redirectIfLoggedIn();

const signUpBtn = document.querySelector('.js-sign-up-btn');

signUpBtn.addEventListener('click', async event => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!areFieldsFilled(name, email, password)) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    disableBtn(signUpBtn);

    // const result = await signUp({ name, email, password });

    const result = await apiRequest('/api/v1/auth/sign-up', 'POST', { name, email, password });

    if (result.error) {
        showToast(result.error, 'error');
        signUpBtn.classList.remove('non-active');
        signUpBtn.querySelector('div').style.visibility = 'hidden';
        clearFields(email, password);
        return;
    }

    const { token } = result.data;

    if (token) {
        localStorage.setItem('authToken', token);

        // show success toast
        showToast(result.message || 'Signed up successfully', 'success');

        // Redirect to dashboard after short delay
        setTimeout(() => {
            navigateTo('dashboard');
        }, 1500);
    } else {
        // show error toast 
        showToast(result.error || 'Sign up failed', 'error');
        signInBtn.classList.remove('non-active');
        signInBtn.querySelector('div').style.visibility = 'hidden';
        clearFields(email, password);
    }
});

