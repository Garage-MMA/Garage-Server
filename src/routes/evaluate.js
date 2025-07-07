const express = require("express");
const router = express.Router();
const evaluateController = require("../controllers/evaluateController");
const { check } = require("express-validator");

// Tạo đánh giá mới với validate
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
            .withMessage("Comment must not exceed 300 characters")
    ],
    evaluateController.createEvaluate
);

// Lấy danh sách đánh giá (có phân trang)
router.get("/", evaluateController.getAllEvaluates);

module.exports = router;
