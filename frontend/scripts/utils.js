export function navigateTo(path) {
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
    }, 3000); // Remove after 3 seconds
}

export function clearFields(...fields) {
    fields.forEach(field => field = '');
}

export function areFieldsFilled(...fields) { // rest parameter that bundles all args into an array
    return fields.every(Boolean); // every checks that every field is truthy i.e. not empty :: if one is empyt it will return false
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
