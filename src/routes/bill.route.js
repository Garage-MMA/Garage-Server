import express from "express";
import {
  getAllBills,
  createBill,
  updateBill,
  getBillById,
  getBillsByDay,
  summarizeDailyBills
} from "../controllers/bill.controller.js";
import { verifyToken, verifyRole } from "../middleware/auth.middleware.js";

const billRouter = express.Router();

// Get all bills (admin or garage_owner)
billRouter.get("/", verifyToken, verifyRole(["admin", "garage_owner"]), getAllBills);

// Get bill by ID
billRouter.get("/:id", verifyToken, verifyRole(["admin", "garage_owner", "customer"]), getBillById);

// Create new bill (garage_owner)
billRouter.post("/", verifyToken, verifyRole(["garage_owner"]), createBill);

// Update bill by ID (garage_owner)
billRouter.put("/:id", verifyToken, verifyRole(["garage_owner"]), updateBill);

// Get bills by day (garage_owner)
billRouter.get("/by-day/:garageId", verifyToken, verifyRole(["garage_owner"]), getBillsByDay);

// Summarize daily bills and store statistics (garage_owner)
billRouter.post("/summary/:garageId", verifyToken, verifyRole(["garage_owner"]), summarizeDailyBills);

export default billRouter;
