import apiRequest from "./api.js";
import { areFieldsFilled, clearFields, showToast, borderColor, navigateTo } from './utils.js';
import { renderAddSubscriptionDiv, updateSpendingOverview } from "./dom.js";
import { logout, signUp } from "./auth.js";


const SUBSCRIPTION_ENDPOINT = `/api/v1/subscriptions`;
const token = localStorage.getItem('authToken');
const subscriptionsContainer = document.querySelector('.js-subscriptions');
    

export let userId;

if (token) {
    const decoded = jwt_decode(token);
    userId = decoded.userId;

    try {
        const subscriptions = await getUserSubscriptions(userId);
        renderSubscriptions(subscriptions);
    } catch (error) {
        showToast('Error displaying subscriptions', 'error');
    }
}

export async function getUserSubscriptions(userId) {
    return await apiRequest(`${SUBSCRIPTION_ENDPOINT}/user/${userId}`);
}

async function renderSubscriptions(subscriptions) {
    let subscriptionHTML = '';

    if (subscriptions.length) {
        subscriptionsContainer.classList.remove('subscriptions-empty');
        subscriptionsContainer.classList.add('subscriptions')
        console.log()
        subscriptions.forEach(subscription => {
            subscriptionHTML += `
                <div class="js-subscription-item subscription-item" style="border-top: 5px solid ${borderColor(subscription) || '#D1D5DB'}">
                    <div>
                        <div>
                            <h3 style="font-size: 18px;">${subscription.name}</h3>
                            <p style="font-weight: bold; margin-top: 5px;" class="subscript">${subscription.category.toUpperCase()}</p>
                        </div>
                        <div>
                            <strong style="font-size: 18px;">$${subscription.price}</strong>
                            <p style="font-size: 12px;" class="subscript">${subscription.frequency}</p>
                        </div>
                    </div>
                    <p>Next billing: May 8, 2025</p>
                    <div class="icons">
                        <img src="images/edit.svg" alt="edit subscription" data-subscription-id=${subscription._id} class="js-edit-subscription edit-subs">
                        <img src="images/delete.svg" alt="delete subscription" data-subscription-id=${subscription._id} class="js-delete-subscription">
                    </div>
                </div>
            `;
        });
        await updateSpendingOverview();
    } else {
        subscriptionHTML += `
            <h3>No subscriptions yet</h3>
            <p>Add your first subscription to get started</p>
        `;
        subscriptionsContainer.classList.add('subscriptions-empty');
        subscriptionsContainer.classList.remove('subscriptions');
    }

    subscriptionsContainer.innerHTML = subscriptionHTML;
}


subscriptionsContainer.addEventListener('click', async event => {
    if (event.target.classList.contains('js-delete-subscription')) {
        const { subscriptionId } = event.target.dataset;

        try {
            await apiRequest(`${SUBSCRIPTION_ENDPOINT}/${subscriptionId}`, 'DELETE');
            const subscriptions = await getUserSubscriptions(userId);
            showToast('Subscription deleted', 'success');
            console.log('After deletion', subscriptions.length);
            renderSubscriptions(subscriptions);
        } catch (error) {
            showToast('Failed to delete subscription', 'error');
        }
    } else if (event.target.classList.contains('js-edit-subscription')) {
        const { subscriptionId } = event.target.dataset;

        try {
            const currentSubscription = await apiRequest(`${SUBSCRIPTION_ENDPOINT}/${subscriptionId}`);
            
            renderAddSubscriptionDiv(true, 'Edit Subscription');

            document.getElementById('name').value = currentSubscription.name;
            document.getElementById('price').value = currentSubscription.price;
            document.getElementById('billing').value = currentSubscription.frequency;
            document.getElementById('category').value = currentSubscription.category;
            document.getElementById('start-date').value = currentSubscription.startDate;
            document.getElementById('paymentMethod').value = currentSubscription.paymentMethod;

            const saveBtn = document.querySelector('.js-save-subscription');
            saveBtn.classList.add('js-edit-subscription');
            saveBtn.classList.remove('js-save-subscription');
            
            saveBtn.addEventListener('click', async () => {
                const name = document.getElementById('name').value || currentSubscription.name; 
                const price = document.getElementById('price').value || currentSubscription.price;
                const frequency = document.getElementById('billing').value || currentSubscription.frequency;
                const category = document.getElementById('category').value || currentSubscription.category;
                const startDate = document.getElementById('start-date').value || currentSubscription.startDate;
                const paymentMethod = document.getElementById('paymentMethod').value || currentSubscription.paymentMethod;

                try {
                    await apiRequest(`${SUBSCRIPTION_ENDPOINT}/${subscriptionId}`, 'PUT', {
                        name,
                        price,
                        frequency,
                        category,
                        startDate,
                        paymentMethod
                    });

                    renderAddSubscriptionDiv(false);
                    showToast('Subscription updated successfully', 'success');
                    const subscriptions = await getUserSubscriptions(userId);
                    renderSubscriptions(subscriptions);
                } catch (error) {
                    showToast('Failed to update subscription', 'error');
                }
            });

        } catch (error) {
            console.error(error);
            showToast('Failed to edit subcription', 'error');
        }
    }
});

document.querySelector('.js-add-subscription')
    .addEventListener('click', async event => {
        if (event.target.classList.contains('js-save-subscription')) {
            const name = document.getElementById('name').value; 
            const price = document.getElementById('price').value;
            const billingCycle = document.getElementById('billing').value;
            const category = document.getElementById('category').value;
            const startDate = document.getElementById('start-date').value;
            const paymentMethod = document.getElementById('paymentMethod').value;

            if (!areFieldsFilled(name, price, billingCycle, category, startDate, paymentMethod)) {
                showToast('Please fill in all your subscription details', 'error');
                return;
            }
            
            await addSubscription(name, price, billingCycle, category, startDate, paymentMethod);
            clearFields(name, price, billingCycle, category, startDate, paymentMethod);
        } else if (event.target.classList.contains('js-cancel-add-subscription')) {
            renderAddSubscriptionDiv(false);
        }
    });


document.querySelector('.js-add-subscription-btn').addEventListener('click', () => {
    renderAddSubscriptionDiv();
});


async function addSubscription(...subscriptionData) {
    try {
        const fields = ['name', 'price', 'frequency', 'category', 'startDate', 'paymentMethod'];

        const object = Object.fromEntries(fields.map((key, i) => [key, subscriptionData[i]]));
        
        await apiRequest(`${SUBSCRIPTION_ENDPOINT}`, 'POST', object);
        showToast('Subscription created successfully', 'success');

        const subscriptions = await getUserSubscriptions(userId);
        renderSubscriptions(subscriptions);
        renderAddSubscriptionDiv(false);
    } catch (error) {
        showToast('Failed to create subscription. Please try again', 'error');
        renderAddSubscriptionDiv();
        console.error(error);
        
    }
}

const modeBtn = document.querySelector('.js-theme');

modeBtn.addEventListener('click', () => {
    const existingLink = document.querySelector('link[href="styles/dark-mode.css"]');

    if (!modeBtn.classList.contains('js-theme-dark')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'styles/dark-mode.css';
        document.head.appendChild(link);

        modeBtn.setAttribute('src', 'images/dark-mode.svg');
        modeBtn.classList.remove('js-theme-light');
        modeBtn.classList.add('js-theme-dark');
    } else if (modeBtn.classList.contains('js-theme-dark')) {
        if (existingLink) existingLink.remove();

        modeBtn.setAttribute('src', 'images/light-mode.svg');
        modeBtn.classList.remove('js-theme-dark');
        modeBtn.classList.add('js-theme-light');
    }
}); 


document.addEventListener('click', event => {
    if (event.target.classList.contains('js-user-account')) {
        document.querySelector('.js-user-settings').style.visibility = 'visible';
    } else {
        document.querySelector('.js-user-settings').style.visibility = 'hidden';
    }
});


const userContainer = document.querySelector('.js-user-settings');
const previousHTML = userContainer.innerHTML;

userContainer.addEventListener('click', async event => {
    const currentTask = event.target.textContent.toLowerCase();
    const accountInfo = await apiRequest(`/api/v1/users/${userId}`);
    if (currentTask === 'create a new account') {
        if (!confirm('Creating a new account will log you out of the current session. Continue?')) {
            return;
        }
        logout('sign-up');
    } else if (currentTask === 'edit account info') {
        userContainer.innerHTML = `
            <div class="edit-info">
                <div class="js-previous previous"><img src="images/arrow-back.svg"> Edit account info</div>

                <div>
                    <label for="name">Username: </label>
                    <input type="text" id="name"placeholder=${accountInfo.name}>
                </div>
                
                <div>
                    <label for="email">Email:</label>
                    <input type="email" id="email" placeholder=${accountInfo.email}>
                </div>
                <button class="js-save-edit-info">Save</button>
            </div>
        `;
        
        document.querySelector('.js-previous').addEventListener('click', () => {
            userContainer.innerHTML = previousHTML;
        });

        const saveBtn = document.querySelector('.js-save-edit-info');

        saveBtn.addEventListener('click', async () => {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;

            if (!areFieldsFilled(name, email)) {
                showToast('Please fill all fields to update user', 'error');
                return;
            }

            await apiRequest(`/api/v1/users/${userId}`, 'PUT', { name, email });
            saveBtn.textContent = 'Saved';
            showToast('Account info updated succesfully', 'success');
        });
    } else if (currentTask === 'see account details') { 
        console.log(accountInfo)
        userContainer.innerHTML = `
            <div class="see-account">
                <div class="js-previous previous"><img src="images/arrow-back.svg"> See account details</div>
                <div><span>Username</span>: ${accountInfo.name}</div>
                <div><span>Email</span>: ${accountInfo.email}</div>
                <div><span>User since</span>: ${new Date(accountInfo.createdAt).toDateString()}</div>
            </div>
        `
        document.querySelector('.js-previous').addEventListener('click', () => {
            userContainer.innerHTML = previousHTML;
        });
    } else {
       if (!confirm('Are you sure you want to delete your account? This action is irreversible.')) {
            return;
       }
       await apiRequest(`/api/v1/users/${userId}`, 'DELETE');
       navigateTo('index');
       showToast('Account Deleted', 'success');
    }
});