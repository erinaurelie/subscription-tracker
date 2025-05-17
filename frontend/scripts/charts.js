import { borderColor } from "./utils.js";


let myChart;

function chartJS(categories) { 
    if (myChart) myChart.destroy();

    
    const labels = Object.keys(categories);
    const values = Object.values(categories).map(value => value.total); 
    const backgroundColor = labels.map(label => borderColor({ category: label })); 

    const ctx = document.getElementById('subscriptionChart').getContext('2d');
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
            maintainAspectRatio: false 
        }
    });
}

export default chartJS;