import dayjs from 'dayjs';
import { createRequire } from 'module'
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js';


const REMINDERS = [7, 5, 2, 1]; // days before we gonna send reminders

const sendReminders = serve(async context => {
    const { subscriptionId } = context.requestPayload; 
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);
    const today = dayjs();

    if (renewalDate.isBefore(today)) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow`);
        return;
    }


    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');
        // lets say that the renewal date is 22 feb then the reminder day could be 15 feb which is 7 days before so the user is going to get reminded 4 different times

        if (reminderDate.isAfter(today)) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }

        if (today.isSame(reminderDate, 'day')) {
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
        }
       
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    });
}

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);
        // Send email (this could be an SMS or push notification...etc)
        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription
        });

    });
}

export default sendReminders;
/*
    When packages are written as esm modules we can use import but upstash workflow was written using commonJS we need to use require to import it BUT in our package.json we have "type":"module" so e can only use import/exports statements one way to go over that and still allow this single require statement is to add the 2 lines at the beginning of the file
        import { createRequire } from 'module'
        const require = createRequire(import.meta.url);

    The serve() function allows your function to be exposed as an HTTP endpoint that can be triggered by Upstash Workflow. Upstash workflow system, uses HTTP to trigger and manage tasks
*/