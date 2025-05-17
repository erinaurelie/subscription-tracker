import { Router } from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/user.controller.js";
import { adminMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/auth.middleware.js";

const userRouter = Router();


userRouter.get('/', authorize, adminMiddleware, getUsers);
userRouter.get('/:id', authorize, getUser); 
userRouter.post('/', authorize, createUser);
userRouter.put('/:id', authorize, updateUser);
userRouter.delete('/:id', authorize, deleteUser);

export default userRouter;