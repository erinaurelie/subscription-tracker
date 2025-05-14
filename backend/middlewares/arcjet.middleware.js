import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 1 }); 
        /*
            protect this request and tell me your decision should it be denied? or should we let it through.
            the requested means we are taking away one token from the bucket READ THE DOCS
        */

        // in each block make sure to return to ensure no further code is exectued after the response is sent else it could thron an error e.g. Cannot set headers after they are sent to the client from the arcjet middleware
        if (decision.isDenied()) {
            // we figure out the reason it was denied
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ // Too many requests
                    message: 'Rate limit exceeded'
                });
            } else if (decision.reason.isBot()) {
                return res.status(403).json({ // Forbidden
                    message: 'Bot detected'
                });
            }

            return res.status(403).json({ 
                error: 'Acess denied' 
            });
        }

        next(); // go to the next step mayber create a sub etc
    } catch (error) {
        console.error(`Arcjet Middleware Error: ${error}`);
        next(error); 
    }
}

export default arcjetMiddleware;