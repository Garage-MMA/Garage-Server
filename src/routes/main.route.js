import express from "express";
import userRouter from "./users.route.js";
import bookingRouter from "./booking.route.js";
import billRouter from "./bill.route.js";
import scheduleRouter from "./scheduleRoutes.js";
import garages from "./garages.js";

const mainRouter = express.Router();
mainRouter.use('/users', userRouter);
mainRouter.use('/booking', bookingRouter);
mainRouter.use('/bill', billRouter);
mainRouter.use("/schedule", scheduleRouter)
mainRouter.use("/garages", garages);

export default mainRouter;
