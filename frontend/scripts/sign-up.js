import { signUp } from "./auth.js";
import { areFieldsFilled, disableBtn, showToast, navigateTo } from "./utils.js";

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

    const result = await signUp({ name, email, password });

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

