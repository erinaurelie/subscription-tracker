import { Router } from "express";
import { authorize, adminMiddleware } from "../middlewares/auth.middleware.js";
import { createSubscription, getUserSubscriptions, getSubscriptions, getSubscriptionDetails, updateSubscription, deleteSubscription, cancelSubscription } from "../controllers/subscription.controller.js";


const subscriptionRouter = Router();

subscriptionRouter.get('/', authorize, adminMiddleware, getSubscriptions);

subscriptionRouter.get('/:id', authorize, getSubscriptionDetails);

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.put('/:id', authorize ,updateSubscription);

subscriptionRouter.delete('/:id', authorize, deleteSubscription);

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);


subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);


export default subscriptionRouter;