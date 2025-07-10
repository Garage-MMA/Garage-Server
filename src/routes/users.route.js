import express from "express";
import userController from "../controllers/users.controller.js"; 
import { verifyToken, verifyRole } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.put("/profile", verifyToken, userController.editProfile);

export default userRouter;
