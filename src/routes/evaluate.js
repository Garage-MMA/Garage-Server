import express from "express";
import { check } from "express-validator";
import { createEvaluate, getAllEvaluates,getEvaluatesByCustomer,updateEvaluate } from "../controllers/evaluateController.js";

const router = express.Router();

// 📌 Create new evaluation with validation
router.post(
    "/",
    [
    check("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be an integer between 1 and 5"),
    check("comment")
      .optional()
      .isString()
      .isLength({ max: 300 })
      .withMessage("Comment must not exceed 300 characters"),
    check("bookingId")
      .notEmpty()
      .withMessage("bookingId is required")
      .isMongoId()
      .withMessage("bookingId must be a valid MongoDB ObjectId"),
  ],
    createEvaluate
);

// 📌 Get all evaluations with pagination
router.get("/", getAllEvaluates);

router.get("/:customerId", getEvaluatesByCustomer);

router.put("/update/:id", updateEvaluate);

export default router;
