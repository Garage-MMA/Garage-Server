import express from "express";
import statisticController from "../controllers/statistic.controller.js";

const statisticRouter = express.Router();

statisticRouter.get("/:garageId/daily", statisticController.getDailyStatistic);

statisticRouter.get("/:garageId/range", statisticController.getRangeStatistic);

statisticRouter.get("/:garageId/weekly/:year/:week", statisticController.getWeeklyStatistic);

statisticRouter.get("/:garageId/monthly/:year/:month", statisticController.getMonthlyStatistic);

statisticRouter.get("/:garageId/yearly/:year", statisticController.getYearlyStatistic);

export default statisticRouter;