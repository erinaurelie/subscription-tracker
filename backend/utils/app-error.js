class AppError extends Error {
    constructor(message, statusCode) {
        super(message); // Call the built-in Error constructor
        this.statusCode = statusCode;
        // this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        // this.isOperational = true; // To distinguish expected vs programming errors
        
        // Error.captureStackTrace(this, this.constructor);
    }
}

    
export default AppError;




/*
   We first extend the built-in error class to inherit its properties and methods
   so in our constructor we have message and statusCode that is what each instance of the 
   AppError class should pass in.
   the super(message) this invokes the constructor of the built in Error class because we know that each instance of this class takes as argument the message that is the description of what went wrong and that sets the message.

   now our custom proerties are statusCode 

    // a regular error object

    const err = new Error('Something went wrong');

    Error {
    name: "Error",
    message: "Something went wrong",
    stack: "Error: Something went wrong\n at Object.<anonymous> ..."
    }


*/

