import express from "express";
import userRouter from "./users.route.js";
import bookingRouter from "./booking.route.js";
import serviceRouter from "./service.route.js";
const mainRouter = express.Router();
mainRouter.use('/users', userRouter);
mainRouter.use('/booking', bookingRouter);
mainRouter.use('/service', serviceRouter);
export default mainRouter;
