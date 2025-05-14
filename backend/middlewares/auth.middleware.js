import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// attaches user object to the request after validating JWT token
export const authorize = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) return res.status(401).json({
            message: 'Unauthorized'
        });

        //  if token verify it
        const decoded = jwt.verify(token, JWT_SECRET);

        // now we have to check if the user still exists
        const user = await User.findById(decoded.userId);

        if (!user) return res.status(401).json({
            message: 'Unauthorized'
        }); 

        
        req.user = user;
        /*
            but the user does exist we attach the user to the request that is being made and then forward it over to the second part of the flow that is the <create subscription > controller This way, when the subscription is created, the user who created it is included in the subscription object

            We should always validate before creating a document in our DB
        
        */
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized',
            error: error.message
        });
    }
}

// check if user is an admin
export const adminMiddleware = async (req, res, next) => {
    try {
        const user = req.user; // this comes from the authorize middle ware

        if (!user.isAdmin) {
            return res.status(403).json({
                message: "Access denied. Admins only"
            });
        }
        next();
    } catch (error) {
        console.log(`Error in adminMiddleware ${error}`);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}


/*
    w/o token the user cannot create a subscription

    typically when the client pass a token throug the req.headers it starts with the word 'Bearer' it's just a protocol. it looks like this
    Bearer <token>
    
    so up there for the token we are splitting it into 2 parts by the space and returning the second part which will be the token. remember computers count like this 0, 1...

    basically this middleware is trying to find the user based off the token of the user that is trying to mkae the request. It looks if it's there it decodes it, verifies that it is the user that is trying to log in. Then it attached it to the request so later on we can know who exactly is making that request.

    1. someone is making a request to get user details 
    2. we call the authorize middle ware
    3. we verfiy who is trying to do it and if they have the permissions
    4. then we go to the next step and give access to the user details

    basically we are authorizing a user that wants to see their details by asking them the token they were given when the signed in



*/