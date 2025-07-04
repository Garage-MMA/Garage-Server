import express from "express";
import {
  getAllBookings,
  getAllBookingsOfUser,
  createBooking,
  updateBooking,
} from "../controllers/booking.controller.js";
import { verifyToken, verifyRole } from "../middleware/auth.middleware.js";

const bookingRouter = express.Router();

// Admin or garage owner
bookingRouter.get("/", verifyToken, verifyRole(["admin", "garage_owner"]), getAllBookings);

// Logged-in customer
bookingRouter.get("/my", verifyToken, verifyRole(["customer"]), getAllBookingsOfUser);

// Customer creates booking
bookingRouter.post("/", verifyToken, verifyRole(["customer"]), createBooking);

// Update booking status/cancel reason 
bookingRouter.put("/:id", verifyToken, updateBooking);

export default bookingRouter;
