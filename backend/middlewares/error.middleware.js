import AppError from "../utils/app-error.js";

const errorMiddleware = (err, req, res, next) => {
    try {
        let error = { ...err }; 
        error.message = err.message;

        
        if (err.name === 'CastError') {
            error = new AppError('Resource not found', 404); 
        }

        
        if (err.code === 11000) {
            error = new AppError('Duplicate field value entered', 400);
        }

        
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message); 
            error = new AppError(message.join(', '), 400);
        }

        
        res.status(error.statusCode || 500).json({ 
            success: false, 
            error: error.message || 'Server Error'
        });
    } catch (error) {
        next(error); 
    }
};

export default errorMiddleware;