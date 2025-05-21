export function navigateTo(path) {
    if (!path) {
        const baseURL = 'http://127.0.0.1:5501/frontend';
        window.location.href = `${baseURL}/${404}.html`;
    }
    const baseURL = 'http://127.0.0.1:5501/frontend';
    window.location.href = `${baseURL}/${path}.html`;
}

export function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
  
    container.appendChild(toast);
  
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

export function clearFields(...fields) {
    fields.forEach(field => field = '');
}

export function areFieldsFilled(...fields) {
    return fields.every(Boolean);
}

export function disableBtn(button) {
    button.classList.add('non-active');
    button.querySelector('div').style.visibility = 'visible';
}


export function borderColor(subscription) {
    const categoryColors = {
        technology: 'rgb(126, 105, 171)',
        fitness: 'rgb(246, 173, 85)',
        news: 'rgb(220, 53, 69)',
        entertainment: 'rgb(252, 129, 129)',
        finance: 'rgb(104, 211, 145)',
        productivity: 'rgb(99, 179, 237)',
        other: 'rgb(246, 135, 179)'
    };

    for (const [key, value] of Object.entries(categoryColors)) {
        if (subscription.category === key) return value;
    }
}


export function redirectIfLoggedIn() {
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
        navigateTo('dashboard');
        return;
    }
}
