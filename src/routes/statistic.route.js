import express from "express";
import statisticController from "../controllers/statistic.controller.js";

const statisticRouter = express.Router();

statisticRouter.get("/:garageId/daily", statisticController.getDailyStatistic);

statisticRouter.get("/:garageId/range", statisticController.getRangeStatistic);

export default statisticRouter;