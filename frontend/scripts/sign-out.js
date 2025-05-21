import { navigateTo, showToast } from "./utils.js";

export function logout(page="index") {
    localStorage.removeItem('authToken');
    showToast('Logged out successfully', 'success');
    setTimeout(() => navigateTo('index'), 1500);
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.querySelector('.js-logout-btn');
    logoutBtn && logoutBtn.addEventListener('click', logout);
});

