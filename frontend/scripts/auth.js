import { API_BASE } from './api.js';
import { navigateTo, showToast } from './utils.js';

const AUTH_ENDPOINT = `${API_BASE}/api/v1/auth`;

// What do i expect this to do
// What does this actually do

// func signIn
export async function signIn(userData) {
    try {
        // make a request to the backend api & send data
        const response = await fetch(`${AUTH_ENDPOINT}/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        console.log(data);
        

        if (response.ok) {
            return data;
        } else {
            return { error: data.error || 'Sign in failed' };
        }

    } catch (error) {
        return { error: error.message || 'Something went wrong' };
    }
}
    

export async function signUp(userData) {
    try {
        const { name, email, password } = userData;

        const response = await fetch(`${AUTH_ENDPOINT}/sign-up`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();
        
        if (response.ok) {
            return data;
        } else {
            return { error: data.error || 'Sign up failed' };
        }
    } catch (error) {
        return { error: data.error || 'Something went wrong' };
    }
}

export function logout(page="index") {
    localStorage.removeItem('authToken');
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        navigateTo(page);
    }, 1500);
}


export function isAunthenticated() {
    return !!localStorage.getItem('authToken'); // returns a bool based on is there's a token stored in localStorage
}
