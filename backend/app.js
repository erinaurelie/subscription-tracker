import express from "express";
import cors from 'cors';
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";

const app = express();

// middleware
app.use(express.json());
app.use(cors({ origin: 'http://127.0.0.1:5501' }));
app.use(arcjetMiddleware);

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);


app.use(errorMiddleware); // Express only uses this middleware for unhandled errors if it’s declared last.

app.get('/', (req, res) => {
    res.status(200).send({
        success: true,
        message: 'Test succeeded!'
    });
});

app.post('/hello', (req, res) => {
    res.status(200).send({
        success: true,
        message: `Hello ${req.body.name}`
    });
});


export default app;