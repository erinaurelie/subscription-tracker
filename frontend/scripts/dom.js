import chartJS from "./charts.js";
import { getUserSubscriptions, userId } from "./dashboard.js";
import { borderColor } from "./utils.js";


export function renderAddSubscriptionDiv(display=true, header="Add Subscription") {
    const addSubscriptionDiv = document.querySelector('.js-add-subscription');
    addSubscriptionDiv.querySelector('h2').textContent = header;

    if (display) {
        addSubscriptionDiv.classList.add('position');
    } else {
        addSubscriptionDiv.classList.remove('position');
    }
}

export async function updateSpendingOverview() {
    const subscriptions = await getUserSubscriptions(userId);
    const pricesOfSubscriptions = subscriptions.map(sub => 
        sub.frequency === 'monthly' ? sub.price :
        sub.frequency === 'yearly' ? sub.price / 12 :
        sub.frequency === 'weekly' ? sub.price * 4 : 
        0
    ); 

    const monthlySpending = pricesOfSubscriptions.reduce((acc, elem) => acc + elem);
    document.querySelector('.js-monthly-spending').textContent = `$${monthlySpending.toFixed(2)}`;

    const yearlySpending = monthlySpending * 12;
    document.querySelector('.js-yearly-spending').textContent = `$${yearlySpending.toFixed(2)}`;
    updateCategoryBreakdown(subscriptions);
}


export async function updateCategoryBreakdown(subscriptions) { 
    const categories = subscriptions.reduce((acc, sub) => {
        if (!acc[sub.category]) {
            acc[sub.category] = { total: 0 }
        }

        acc[sub.category].total += sub.price;
        return acc;
    }, {});
    let categoriesHTML = '';
    for (const [key, value] of Object.entries(categories)) {
        categoriesHTML += `
            <div class="breakdown">
                <div>
                    <span style="background-color:${borderColor({ category: key })}"></span>
                    <span>${key}</span>
                </div>
                <span>${value.total}</span>
            </div>
        `;
    }

    document.querySelector('.js-category-breakdown')
        .innerHTML = categoriesHTML;
    
    chartJS(categories);
};
