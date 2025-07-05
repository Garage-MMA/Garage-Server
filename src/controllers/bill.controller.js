import mongoose from "mongoose";
import Bill from "../models/bill.model.js";
import Statistic from "../models/statistic.model.js";

// Get all bills
export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().lean();
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bill list", error });
  }
};

// Create a new bill
export const createBill = async (req, res) => {
  try {
    const newBill = new Bill(req.body);
    const savedBill = await newBill.save();
    res.status(201).json(savedBill);
  } catch (error) {
    res.status(400).json({ message: "Failed to create bill", error });
  }
};

// Update a bill
export const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBill = await Bill.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedBill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json(updatedBill);
  } catch (error) {
    res.status(500).json({ message: "Failed to update bill", error });
  }
};

// 📌 Get bill detail by ID
export const getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await Bill.findById(id).lean();

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bill detail", error });
  }
};

// Get bills by specific day
export const getBillsByDay = async (req, res) => {
  try {
    const { garageId } = req.params;
    const { date } = req.query; // format: YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ message: "Please provide a valid date (YYYY-MM-DD)" });
    }

    const [year, month, day] = date.split("-").map(Number);
    const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const bills = await Bill.find({
      garageId: new mongoose.Types.ObjectId(garageId),
      createdAt: { $gte: start, $lte: end }
    }).lean();

    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bills by date", error: error.message });
  }
};

// Summarize daily bills and create statistics
export const summarizeDailyBills = async (req, res) => {
  try {
    const { garageId } = req.params;
    const { date } = req.query; // format: YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ message: "Please provide a valid date (YYYY-MM-DD)" });
    }

    const [year, month, day] = date.split("-").map(Number);
    const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const existingSummary = await Statistic.findOne({
      garageId: new mongoose.Types.ObjectId(garageId),
      createdAt: { $gte: start, $lte: end }
    });

    if (existingSummary) {
      return res.status(400).json({
        message: "This date has already been summarized",
        summary: existingSummary
      });
    }

    const dailyBillsSummary = await Bill.aggregate([
      {
        $match: {
          garageId: new mongoose.Types.ObjectId(garageId),
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const summaryData = dailyBillsSummary.length > 0
      ? dailyBillsSummary[0]
      : { totalCustomers: 0, totalRevenue: 0 };

    const newStatistic = new Statistic({
      garageId,
      totalCustomers: summaryData.totalCustomers,
      totalRevenue: summaryData.totalRevenue,
      createdAt: start
    });

    const savedStatistic = await newStatistic.save();

    res.status(200).json({
      billSummary: summaryData,
      statisticRecord: savedStatistic
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to summarize daily bills", error: error.message });
  }
};
