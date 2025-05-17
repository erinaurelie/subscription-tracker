import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const authorize = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) return res.status(401).json({
            message: 'Unauthorized'
        });

        const decoded = jwt.verify(token, JWT_SECRET);

       
        const user = await User.findById(decoded.userId);

        if (!user) return res.status(401).json({
            message: 'Unauthorized'
        }); 

        
        req.user = user;
        
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized',
            error: error.message
        });
    }
}


export const adminMiddleware = async (req, res, next) => {
    try {
        const user = req.user;

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
