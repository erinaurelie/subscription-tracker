import { Router } from "express";
import { signUp, signIn } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);

export default authRouter;
// we export it so we can attach it to our main app
// authRouter is a router object and the following routes are defined on this router