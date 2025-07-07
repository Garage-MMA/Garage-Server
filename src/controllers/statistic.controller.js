import Statistic from "../models/statistic.model.js";
import mongoose from "mongoose";

const statisticController = {
  getDailyStatistic: async (req, res) => {
    try {
      const { garageId } = req.params;
      const { date } = req.query || new Date().toISOString().split("T")[0];
      const [year, month, day] = date.split("-").map(Number);
      const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

      const statistic = await Statistic.findOne({
        garageId: new mongoose.Types.ObjectId(garageId),
        createdAt: { $gte: start, $lte: end },
      }).lean();

      if (!statistic) {
        return res.status(404).json({ message: "No statistic found for this day" });
      }

      res.status(200).json(statistic);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving daily statistic", error: error.message });
    }
  },

  getRangeStatistic: async (req, res) => {
    try {
      const { garageId } = req.params;
      const { startDate, endDate } = req.query;

      const [startYear, startMonth, startDay] = startDate.split("-").map(Number);
      const [endYear, endMonth, endDay] = endDate.split("-").map(Number);
      const start = new Date(Date.UTC(startYear, startMonth - 1, startDay, 0, 0, 0, 0));
      const end = new Date(Date.UTC(endYear, endMonth - 1, endDay, 23, 59, 59, 999));

      const stats = await Statistic.aggregate([
        {
          $match: {
            garageId: new mongoose.Types.ObjectId(garageId),
            createdAt: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: "$totalCustomers" },
            totalRevenue: { $sum: "$totalRevenue" },
          },
        },
      ]);

      const summary = stats.length > 0 ? stats[0] : { totalCustomers: 0, totalRevenue: 0 };
      res.status(200).json({ ...summary, startDate, endDate });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving statistic for the time range", error: error.message });
    }
  },

  getMonthlyStatistic: async (req, res) => {
    try {
      const { garageId, year, month } = req.params;
      const yearNum = parseInt(year);
      const monthNum = parseInt(month);

      if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
        return res.status(400).json({ message: "Invalid year or month" });
      }

      const monthlyStats = await Statistic.aggregate([
        {
          $match: {
            garageId: new mongoose.Types.ObjectId(garageId),
            $expr: {
              $and: [
                { $eq: [{ $year: "$createdAt" }, yearNum] },
                { $eq: [{ $month: "$createdAt" }, monthNum] },
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: "$totalCustomers" },
            totalRevenue: { $sum: "$totalRevenue" },
          },
        },
      ]);

      const summary = monthlyStats.length > 0 ? monthlyStats[0] : { totalCustomers: 0, totalRevenue: 0 };
      res.status(200).json({ ...summary, year, month });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving monthly statistic", error: error.message });
    }
  },

  getWeeklyStatistic: async (req, res) => {
    try {
      const { garageId, year, week } = req.params;
      const yearNum = parseInt(year);
      const weekNum = parseInt(week);

      if (isNaN(yearNum) || isNaN(weekNum) || weekNum < 1 || weekNum > 53) {
        return res.status(400).json({ message: "Invalid year or week" });
      }

      const weeklyStats = await Statistic.aggregate([
        {
          $match: {
            garageId: new mongoose.Types.ObjectId(garageId),
            $expr: {
              $and: [
                { $eq: [{ $isoWeekYear: "$createdAt" }, yearNum] },
                { $eq: [{ $isoWeek: "$createdAt" }, weekNum] },
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: "$totalCustomers" },
            totalRevenue: { $sum: "$totalRevenue" },
          },
        },
      ]);

      const summary = weeklyStats.length > 0 ? weeklyStats[0] : { totalCustomers: 0, totalRevenue: 0 };
      res.status(200).json({ ...summary, year, week });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving weekly statistic", error: error.message });
    }
  },

  getYearlyStatistic: async (req, res) => {
    try {
      const { garageId, year } = req.params;
      const yearNum = parseInt(year);

      if (isNaN(yearNum)) {
        return res.status(400).json({ message: "Invalid year" });
      }

      const yearlyStats = await Statistic.aggregate([
        {
          $match: {
            garageId: new mongoose.Types.ObjectId(garageId),
            $expr: {
              $eq: [{ $year: "$createdAt" }, yearNum],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: "$totalCustomers" },
            totalRevenue: { $sum: "$totalRevenue" },
          },
        },
      ]);

      const summary = yearlyStats.length > 0 ? yearlyStats[0] : { totalCustomers: 0, totalRevenue: 0 };
      res.status(200).json({ ...summary, year });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving yearly statistic", error: error.message });
    }
  },
};

export default statisticController;