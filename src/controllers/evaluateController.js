import Evaluate from "../models/evaluate.js";
import Booking from "../models/booking.model.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import {getBookingByOwnerId} from "./booking.controller.js"; 
import Garage from "../models/garade.model.js";
// 📌 Create new evaluation
export const createEvaluate = async (req, res) => {
  console.log("📦 Received body:", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { rating, comment, bookingId, customerId } = req.body;

  if (!bookingId || !customerId) {
    return res.status(400).json({ message: "Thiếu bookingId hoặc customerId" });
  }

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking không tồn tại" });
    }

    if (booking.status !== "Billed") {
      return res.status(403).json({ message: "Chỉ có thể đánh giá khi booking đã được thanh toán" });
    }

    const newEvaluate = new Evaluate({ rating, comment, bookingId, customerId });
    const saved = await newEvaluate.save();

    res.status(201).json({
      message: "Đánh giá đã được tạo thành công",
      data: saved,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi tạo đánh giá",
      error: err.message,
    });
  }
};

// 📌 Get all evaluations (with pagination & sort)
export const getAllEvaluates = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const evaluations = await Evaluate.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Evaluate.countDocuments();

    res.status(200).json({
      total,
      page,
      limit,
      data: evaluations,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to retrieve evaluations",
      error: err.message,
    });
  }
};

export const getEvaluatesByCustomer = async (req, res) => {
  const { customerId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return res.status(400).json({ message: "customerId không hợp lệ" });
  }

  try {
    const evaluations = await Evaluate.find({ customerId })
      .sort({ createdAt: -1 })
      .populate("bookingId");

    res.status(200).json({
      total: evaluations.length,
      data: evaluations,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách đánh giá theo customerId",
      error: err.message,
    });
  }
};

export const updateEvaluate = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "evaluateId không hợp lệ" });
  }

  try {
    const updated = await Evaluate.findByIdAndUpdate(
      id,
      { rating, comment },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Evaluate không tồn tại" });
    }

    res.status(200).json({
      message: "Cập nhật đánh giá thành công",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi cập nhật đánh giá",
      error: err.message,
    });
  }
};
export const getEvaluateByOwnerId = async (req, res) => {
  const { ownerId } = req.params;
  console.log(ownerId )
    const garages = await Garage.find({ ownerId: ownerId });
    const garageIds = garages.map(g => g._id);
     console.log(garageIds )
    if (garageIds.length === 0) {
      return res.status(404).json({ message: "No garages found for this owner" });
    }
    // Tìm tất cả booking có garageId thuộc danh sách này
    const bookings = await Booking.find({ garageId: { $in: garageIds } });
      console.log(bookings )
  const evaluations = await Evaluate.find({ bookingId: { $in: bookings } });
  res.status(200).json(evaluations);
};
export const getEvaluateById = async (req, res) => {
  const { id } = req.params;
  const evaluation = await Evaluate.findById(id);
  res.status(200).json(evaluation);
};