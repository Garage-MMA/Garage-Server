import express from "express";
import userController from "../controllers/users.controller.js"; 

const userRouter = express.Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);

export default userRouter;
