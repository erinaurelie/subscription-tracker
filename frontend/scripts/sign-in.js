import { signIn } from "./auth.js";
import { showToast, navigateTo, clearFields, areFieldsFilled, disableBtn } from "./utils.js";

const signInBtn = document.querySelector('.js-login-btn');

/*
    After passing in the user credentials we disable the button
    and store the result of the attempt to sign in. we a get jwt token for the backend if and only the sign in attempt is succeful. then we proceedd to store it in localStorage to acces authorized pages then we show to the toast notification wait for 1.5 sec then access then acess the dashboard. If we dont get a token that means the sign in failed. in this case we show a toast error.

    if we dont get a result.error means the backend is not getting involved it might not be running etc so we have a default

*/
signInBtn.addEventListener('click', async event => {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!areFieldsFilled(email, password)) {
        showToast('Please fill in all the fields', 'error');
        return;
    }
    
    // disable button
    disableBtn(signInBtn);

    const result = await signIn({ email, password });
    
    const { token } = result.data;

    if (token) {
        localStorage.setItem('authToken', token);

        // show success toast
        showToast(result.message || 'Signed in successfully', 'success');

        // Redirect to dashboard after short delay
        setTimeout(() => {
            navigateTo('dashboard');
        }, 1500);
    } else {
        // show error toast 
        showToast(result.error || 'Sign in failed', 'error');
        signInBtn.classList.remove('non-active');
        signInBtn.querySelector('div').style.visibility = 'hidden';
        clearFields(email, password);
    }
});