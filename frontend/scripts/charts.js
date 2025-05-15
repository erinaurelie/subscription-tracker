import { borderColor } from "./utils.js";


let myChart;

function chartJS(categories) { 
    // before rendering a new chart we need to destroy the existing one
    if (myChart) myChart.destroy();

    // get all the data from the catgories array
    const labels = Object.keys(categories);
    const values = Object.values(categories).map(value => value.total); // stores all the totals in each category
    const backgroundColor = labels.map(label => borderColor({ category: label })); // each label is a category and borderColor() returns the predefined color for each category is takes an objet that contains the category you want the color for.

    const ctx = document.getElementById('subscriptionChart').getContext('2d'); // this is the canvas tag
    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                label: 'Subscription Categories',
                data: values,
                backgroundColor,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false  // Allows custom width & height
        }
    });
}

export default chartJS;