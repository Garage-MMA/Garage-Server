import express from "express";
import userRouter from "./users.route.js";
import bookingRouter from "./booking.route.js";
import billRouter from "./bill.route.js";

import serviceRouter from "./service.route.js";
import statisticRouter from "./statistic.route.js";
import vehicleRouter from "./vehicle.route.js";
import scheduleRouter from "./scheduleRoutes.js";
import evaluateRouter from "./evaluate.js";

import garages from "./garages.js";
const mainRouter = express.Router();
mainRouter.use('/users', userRouter);
mainRouter.use('/booking', bookingRouter);
mainRouter.use('/bill', billRouter);

mainRouter.use('/service', serviceRouter);
mainRouter.use('/statistic', statisticRouter);
mainRouter.use('/vehicle', vehicleRouter);

mainRouter.use("/schedule", scheduleRouter)
mainRouter.use("/garages", garages);
mainRouter.use("/evaluate", evaluateRouter);

export default mainRouter;
