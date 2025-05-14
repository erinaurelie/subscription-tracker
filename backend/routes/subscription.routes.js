import { Router } from "express";
import { authorize, adminMiddleware } from "../middlewares/auth.middleware.js";
import { createSubscription, getUserSubscriptions, getSubscriptions, getSubscriptionDetails, updateSubscription, deleteSubscription, cancelSubscription } from "../controllers/subscription.controller.js";


const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, adminMiddleware, getSubscriptions); // middleware chaining

subscriptionRouter.get('/:id', authorize, getSubscriptionDetails); // id refers to the subscription id

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', authorize ,updateSubscription);

subscriptionRouter.delete('/:id', authorize, deleteSubscription);

// get all the subscriptions belonging to a specific user :: in the route param is the userId
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

// cancel a user's subscription
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);


export default subscriptionRouter;

/*
    This route is protected by the authorize middleware, meaning the user must provide a valid JWT token in the Authorization header to access it.
*/