import apiRequest from "./api.js";
import { areFieldsFilled, clearFields, showToast, borderColor } from './utils.js';
import { renderAddSubscriptionDiv, updateSpendingOverview, updateCategoryBreakdown } from "./dom.js";


const SUBSCRIPTION_ENDPOINT = `/api/v1/subscriptions`;
const token = localStorage.getItem('authToken');
const subscriptionsContainer = document.querySelector('.js-subscriptions');
    

// const userId = token && jwt_decode(token)?.userId; :: short circuit evaluation
export let userId;

if (token) {
    const decoded = jwt_decode(token); // decodes the payload of the JWT token
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

// event delegation
subscriptionsContainer.addEventListener('click', async event => {
    if (event.target.classList.contains('js-delete-subscription')) {
        const { subscriptionId } = event.target.dataset;

        try {
            await apiRequest(`${SUBSCRIPTION_ENDPOINT}/${subscriptionId}`, 'DELETE');
            // Re-fetch subscriptions from the database
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
            // Fetch current subscription data
            const currentSubscription = await apiRequest(`${SUBSCRIPTION_ENDPOINT}/${subscriptionId}`);
            
            renderAddSubscriptionDiv(true, 'Edit Subscription');

            // Pre-fill the form with current values
            document.getElementById('name').value = currentSubscription.name;
            document.getElementById('price').value = currentSubscription.price;
            document.getElementById('billing').value = currentSubscription.frequency;
            document.getElementById('category').value = currentSubscription.category;
            document.getElementById('start-date').value = currentSubscription.startDate; // .split('T')[0]
            document.getElementById('paymentMethod').value = currentSubscription.paymentMethod;

            const saveBtn = document.querySelector('.js-save-subscription');
            saveBtn.classList.add('js-edit-subscription');
            saveBtn.classList.remove('js-save-subscription');
            
            saveBtn.addEventListener('click', async () => {
                // get user inputs and based on the current subscription, if the user didn't change the value, use the current value.
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
           
            // console.log('Object to be sent to the backend', object);

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
        // this fields array needs to match the order in which the fields are passed in the addSubscription() function.
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


document.querySelector('.js-user-account')
    .addEventListener('click', () => {
        console.log('Show settings');
        document.querySelector('.js-user-settings').style.visibility = 'visible';
        console.log(document.querySelector('.js-user-settings'))
    });

/*
    We return selected color from the borderColor() where it is extracted from the data-color attribute and we use it when rendering the HTML subscription.color that is because id add subscription i get the selected color and push it into the subscriptionData.

    To group subscriptions by category and sum their total prices. we are using the reduce method of arrays. 
    acc object start at {}
    sub is the current subscription object in the loop
    so first we check if the category exist if not we init to total: 0 then we add the current subscription's price to the total for that category. after all subscriptions are processed we return the accumulator object.

*/