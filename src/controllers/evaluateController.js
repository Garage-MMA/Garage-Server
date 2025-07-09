import Evaluate from "../models/evaluate.js";
import { validationResult } from "express-validator";

// 📌 Create new evaluation
export const createEvaluate = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { rating, comment } = req.body;

  try {
    const newEvaluate = new Evaluate({ rating, comment });
    const saved = await newEvaluate.save();
    res.status(201).json({
      message: "Evaluation created successfully",
      data: saved,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create evaluation", error: err.message });
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
