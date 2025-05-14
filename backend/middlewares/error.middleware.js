import AppError from "../utils/app-error.js";

const errorMiddleware = (err, req, res, next) => {
    try {
        // cloning the error object :: to ensure that we don't modify the original err object
        let error = { ...err }; 
        error.message = err.message;
        console.error(err);

        // For each common type we are updating the error object

        // Mongoose bad ObjectId
        if (err.name === 'CastError') {
            error = new AppError('Resource not found', 404); 
        }

        // Mongoose duplicate key
        if (err.code === 11000) {
            error = new AppError('Duplicate field value entered', 400);
        }

        // Mongoose validation error :: Occurs when validation rules (e.g., required fields, min/max values) are violated.
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message); // 
            error = new AppError(message.join(', '), 400);
        }

        // returning the response of this middleware
        res.status(error.statusCode || 500).json({ 
            success: false, 
            error: error.message || 'Server Error'
        });
    } catch (error) {
        next(error); 
    }
};

export default errorMiddleware;

/*
the next parameter is conceptually like the resolve function in promises
it is used signal that the middleware has completed its task and next step in the process( e.g. saving the document ) can proceed. If we don't call next, the operation ( e.g. saving the document ) will hang indefinitely becausse Mongoose is waiting for the middleware to finish

resolve in Promises: It signals that the asynchronous operation is complete and allows the .then() block to execute.
next in Mongoose Middleware: It signals that the middleware has finished its work and allows Mongoose to proceed with the next middleware or the database operation.

In Mongoose if you pass an error to the next function it will stop the operation and trigger an error. similar to how rejct works in promises
*/