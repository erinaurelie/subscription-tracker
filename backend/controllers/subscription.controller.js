import WorkflowClient from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";
import AppError from "../utils/app-error.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({ 
            ...req.body,
            user: req.user._id
        });

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
        const subscription = await Subscription.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { 
                new: true, 
                runValidators: true
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

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findByIdAndDelete(req.params.id);

        if (!subscription) throw new AppError('Subscription not found', 404);

        res.status(204).send();
    } catch (error) {
        next(error)
    }
}


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
