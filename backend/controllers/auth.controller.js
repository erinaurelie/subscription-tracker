import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import AppError from "../utils/app-error.js";

export const signUp = async (req, res, next) => { 
    const session = await mongoose.startSession(); // session of a mongoose transaction
    /*
        It starts a session with MongoDB. A session lets us group multiple operations together (especially useful for transactions)
        use if If you want multiple database operations to either all succeed or all fail together, you use a session.
    */
    session.startTransaction();
    /*
        this begins a trasaction inside teh sessions from now onw, MongoDB will keep track of all the changes we make, 
        but won't actually save then to the DB untill we explictly commit the transaction. We use it so that if an operation fails, we can abort the transaction and undo everything that append during that session
    */

    try {
        // get user details
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email }); // if a user with the same email if found we assume the user exist already
        
        if (existingUser) {
            const error = new AppError('User already exists. Try loggin in', 409);
            throw error;
        }

        // Hash password for the user :: securing it NEVER store passwords in plaintext
        const salt = await bcrypt.genSalt(10); // this randomizes our hashed password 
        const hashedPassword = await bcrypt.hash(password, salt);

        // create the new user
        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });
        /*
            something could go wrong when creating this user so we attach a session to it meaning that if something goes wrong and we abort it the USER will NOT be created.

            BTW when you pass an array of documents you create it returns an array then in the token we get the first one which we created.
        */
       const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }); // we will get userId: id when we decode the token.

    
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
        /* 
            tells MongoD to cancel all operations done during the transaction. Use it if something goes wrong the result is no changes are saved to the database.
        */
        next(error);
    } finally {
        session.endSession();
        /*
            closes the session we started with startTransaction() this frees up resources on the server we always use it after you are done with a transaction, whether it succeeded (`commitTransaction`) or failed (`abortTransaction`). if we don't it waste DB resources
        
        */
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // checking if user exist
        const user = await User.findOne({ email });
        if (!user) {
            const error = new AppError('User not found', 404);
            throw error;
        }

        // if user exist validate ps by comparing the passwor entered by the password of the user with the matching email stored in the DB
        const isPasswordValid  = await bcrypt.compare(password, user.password); 
        if (!isPasswordValid) {
            const error = new AppError('Invalid password', 401); // unathorized
            throw error;
        }

        // if valide generate new token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }); // we would get userId: id when we decode using jwt-decode

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
        /*
            this is how you pass an error to the global error-handling middleware.

            "Hey Express, something went wrong here! Please skip all the normal stuff and go straight to the error handler."

            in our case it will pass it to the error.middleware.js 
        */
    }
}

/*
    SIGN OUT
    The JWT tokens are not stored on the server so we can't delete them directly. Insteas we rely on the client to remove it from local storage or cookies. So this does not do much server side
    So after signing out redirect the client to the login page 
*/


// THIS COMMENT WAS ADDED IN THE CLEAN VERSION