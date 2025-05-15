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
    // pulls all the prices and bundles them into an array :: when you use {} you explicilty hv to return smth
    const pricesOfSubscriptions = subscriptions.map(sub => 
        sub.frequency === 'monthly' ? sub.price : // if its monthly return price
        sub.frequency === 'yearly' ? sub.price / 12 : // if yearly return price / 12 to figure out how much it is per month
        sub.frequency === 'weekly' ? sub.price * 4 : // if it is weekly return price * 4 weeks to figure out how much we pay per month
        0 // else return 0
    ); 

    const monthlySpending = pricesOfSubscriptions.reduce((acc, elem) => acc + elem);
    document.querySelector('.js-monthly-spending').textContent = `$${monthlySpending.toFixed(2)}`;

    // yearly
    const yearlySpending = monthlySpending * 12;
    document.querySelector('.js-yearly-spending').textContent = `$${yearlySpending.toFixed(2)}`;
    updateCategoryBreakdown(subscriptions);
}


export async function updateCategoryBreakdown(subscriptions) {
    // category breakdown 
    const categories = subscriptions.reduce((acc, sub) => {
        // if category doesn't exist yet create it
        if (!acc[sub.category]) {
            acc[sub.category] = { total: 0 }
        }

        acc[sub.category].total += sub.price;
        return acc;
    }, {}); // init accumulator as an empty object
    // display
    let categoriesHTML = '';
    for (const [key, value] of Object.entries(categories)) {
        // borderColor function takes a subscription which is an object and accesses its category property so to use it here we pass in an object with a category property that is the key so based on the category we pass in the predefined color.

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
}
