import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import AppError from "../utils/app-error.js";

export const signUp = async (req, res, next) => { 
    // session of a mongoose transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email }); 

        if (existingUser) {
            const error = new AppError('User already exists. Try loggin in', 409);
            throw error;
        }

        // Hash password 
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });
       
        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }); 
    
        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: 'User created succesfully',
            data: {
                token,
                user: newUsers[0]
            }
        });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            const error = new AppError('User not found', 404);
            throw error;
        }

       
        const isPasswordValid  = await bcrypt.compare(password, user.password); 
        if (!isPasswordValid) {
            const error = new AppError('Invalid password', 401); // unathorized
            throw error;
        }

        
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }); 

        res.status(200).json({
            success: true,
            message: 'User signed in succesfully',
            data: {
                token,
                user
            }
        });

    } catch (error) {
        next(error);
    }
}
