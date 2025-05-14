import WorkflowClient from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";
import AppError from "../utils/app-error.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({ 
            ...req.body, // spreading the entire request body
            user: req.user._id
            /*
                we have to know which user is creating the subscription. this user is coming from the auth middleware we set up before creating each subscription in that middle ware we attach the user that is making this request

                req.user is populated in the auth middle ware by the user that is currently logged in and if they are not logged in they would not be able to create a subscription
            */
        });

        // triggering the workflow after the subscription get created
        // To test the 2-day reminder workflow, set the startDate of a subscription so that the next billing date is 2 days from today.
        // For example, if today is February 7, and the subscription is billed monthly, then set the startDate to January 9. That way, the next billing cycle falls on February 9, and your reminder logic (which triggers 2 days before) will fire correctly.
        const { workflowRunId } = await WorkflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id
            },
            headers: {
                'content-type': 'application/json'
            },
            retries: 0
        });

        res.status(201).json({
            success: true,
            data: {
                subscription,
                workflowRunId
            }
        });
        
    } catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        // the req.user.id comes from the authorize middleware 
        // the req.params.id coms from the route parameter
        // check if the user is the same as the one is the token :: so if the current logged in user is trying to get its own subscriptions
        if (req.user.id !== req.params.id) { 
            const error = new AppError('Unauthorized: You need to be the owner of this account.', 401);
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id }); 

        res.status(200).json({
            success: true,
            data: subscriptions
        });
    } catch (error) {
        next(error);
    }
}

export const getSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find();

        if (!subscriptions) throw new AppError('No subscriptions found', 404)

        res.status(200).json({
            success: true,
            data: subscriptions
        });
    } catch (error) {
        next(error)
    }
}

export const getSubscriptionDetails = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) throw new AppError('Subscription not found', 404);

        res.status(200).json({
            success: true,
            data: subscription
        });

    } catch (error) {
        next(error);
    }

}

export const updateSubscription = async (req, res, next) => {
    try { 
        // new: true tells Mongoose to return the updated document instead of the original. without it subscription would store the old version of the document.
        const subscription = await Subscription.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { 
                new: true, // return the updated document
                runValidators: true // still enforce field validation on updated fields
            }
        );

        if (!subscription) throw new AppError('Subscription not found', 404);


        await subscription.save();

        

        res.status(200).send({
            success: true,
            data: subscription
        });
    } catch (error) {
        next(error);
    }
}

// after updating remove the div
// if any value was not changed keep it as is.

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findByIdAndDelete(req.params.id);

        if (!subscription) throw new AppError('Subscription not found', 404);

        res.status(204).send();
    } catch (error) {
        next(error)
    }
}

// maybe renewal date should be cleared
export const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) throw new AppError('Subscription not found', 404);

        const currentStatus = subscription.status;

        if (currentStatus === 'cancelled') {
            res.status(409).send({
                success: false,
                message: "Subscription is already cancelled"
            });

            throw new AppError("Subscription is already cancelled", 409);
        }

        subscription.status = 'cancelled';
        subscription.renewalDate = null;
        await subscription.save();

        res.status(200).send({
            success: true,
            data: subscription
        });
    } catch (error) {
        next(error);
    }
}

/*
notice that since we have a global middleware in all of our controllers we use try and catch block to forward errors to the global middleware.

*/