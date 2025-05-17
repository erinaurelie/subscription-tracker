import User from "../models/user.model.js";
import AppError from "../utils/app-error.js";

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({ 
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const user = await User.findById(id).select('-password');

        if (!user) {
            const error = new AppError('User not found', 404);
            throw error;
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
}

export const createUser = async (req, res, next) => {
    try {
        if (!req.body) throw new AppError('Please provide new user data', 400);

        const user = await User.create({
            ...req.body
        });

        res.status(201).send({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
}

export const updateUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (req.user.id !== id) throw new AppError('You are not the owner of this account', 401);

        const user = await User.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!user) throw new AppError('User not found', 404);

        res.status(200).send({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) throw new AppError('Unauthorized: You can only delete your own account.', 401);

        const user = await User.findByIdAndDelete(req.user.id);

        if (user) throw new AppError('User not found', 404);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
}