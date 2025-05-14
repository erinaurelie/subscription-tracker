import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema({
    name: { // name of subcription
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    price: { // price of subscription
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Price must be greater than 0'],
        max: [1000, 'Price must be less than 1000']
    }, 
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP'],
        default: 'USD'
    },
    frequency: { // how often are you getting charged for said subscription
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly']
    },
    category: { 
        type: String,
        enum: ['technology', 'fitness', 'news', 'entertainment', 'finance', 'productivity', 'other'],
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true
    }, 
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true,
        validate: { // this contains a func that validates the date
            validator: value => value <= new Date(), // 
            message: 'Start date must be in the past'
        }
    },
    renewalDate: {
        type: Date,
        validate: { // this contains a func that validates the date
            validator: function (value) {
                return value < this.startDate
            },
            message: 'Renewal date must be after the start date'
        }
    },
    user: { // the user that subscribed to that subscription this is a reference pointing to the User model in the DB
        type: mongoose.Schema.Types.ObjectId, // The type of the field is ObjectId, which will store the unique identifier of the user
        ref: 'User', // This tells Mongoose that the ObjectId refers to the User model
        required: true, // This ensures that the user field is mandatory when creating a subscription
        index: true // This creates an index for this field to improve query performance
      }
}, { timestamp: true });



// this function will be called before the document is saved
// Auto-calculate the renewal date if missing
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        }

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    // Auto-update the status if the renewal date has passed
    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }
    console.log('Middleware task complete');
    next(); // proceed with the creation of that document in the DB
});

// create a subscription model based on the subscription schema
const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;

/*
    For the start date:
    - We verify that the start date is **in the past** (less than or equal to the current date).

    For the renewal date:
    - We check that the renewal date is **after** the start date, not before (so `renewalDate > startDate`).
    
    Important:
    - We use a **regular function expression** instead of an arrow function,
      because we need access to `this`, which refers to the current document.

    The validate option is a built-in feauture in Mongoose schemas which allows us to specify custom validation rules for specific fields in the model.

    The validator is the custom function that you define inside the validate option. This function is responsible for checking if a field's value satisfies the conditions you set. The function should return a boolean value.

    If we don't provide the renewal date the pre function is going to auto-calculate it based on the startDate and the renewabal period.

    so basically if our start date is Jan 1st and the frquency is monthly we add 30 days to the start date making the renewal date Jan 31st
*/
