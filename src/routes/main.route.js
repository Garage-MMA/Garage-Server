import express from "express";
import userRouter from "./users.route.js";
import bookingRouter from "./booking.route.js";

const mainRouter = express.Router();
mainRouter.use('/users', userRouter);
mainRouter.use('/booking', bookingRouter)
export default mainRouter;
