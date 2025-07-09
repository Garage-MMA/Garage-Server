import express from "express";
import { check } from "express-validator";
import { createEvaluate, getAllEvaluates } from "../controllers/evaluateController.js";

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
    ],
    createEvaluate
);

// 📌 Get all evaluations with pagination
router.get("/", getAllEvaluates);

export default router;
