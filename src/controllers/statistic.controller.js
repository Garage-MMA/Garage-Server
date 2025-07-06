import Statistic from "../models/statistic.model.js";
import mongoose from "mongoose";
const statisticController = {
  getDailyStatistic: async (req, res) => {
    try {
      const { garageId } = req.params;
      const { date } = req.query || new Date().toISOString().split("T")[0]; // Default to 2025-07-07
      const [year, month, day] = date.split("-").map(Number);
      const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
      const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

      const statistic = await Statistic.findOne({
        garageId: new mongoose.Types.ObjectId(garageId),
        createdAt: { $gte: start, $lte: end },
      }).lean();

      if (!statistic) {
        return res.status(404).json({ message: "Không tìm thấy thống kê cho ngày này" });
      }

      res.status(200).json(statistic);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy thống kê hàng ngày", error: error.message });
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
      res.status(500).json({ message: "Lỗi khi lấy thống kê theo khoảng thời gian", error: error.message });
    }
  },
};

export default statisticController; 