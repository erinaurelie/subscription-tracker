import { Router } from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/user.controller.js";
import { adminMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/auth.middleware.js";

const userRouter = Router();

// route that gets all users :: static parameter
userRouter.get('/', authorize, adminMiddleware, getUsers);
// get a user :: dynamic route
userRouter.get('/:id', authorize, getUser); // authorize before getting the details
userRouter.post('/', createUser);
userRouter.put('/:id', authorize, updateUser);
userRouter.delete('/:id', authorize, deleteUser);

export default userRouter;