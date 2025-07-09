import express from "express";
import {
  getAllBookings,
  getAllBookingsOfUser,
  createBooking,
  updateBooking,
  getBookingDatesOfCustomer,
  getConfirmedBookings,
  getLatestConfirmedBooking,
  cancelBooking,
} from "../controllers/booking.controller.js";
import { verifyToken, verifyRole } from "../middleware/auth.middleware.js";

const bookingRouter = express.Router();

// Admin or garage owner
bookingRouter.get("/", verifyToken, verifyRole(["admin", "garage_owner"]), getAllBookings);

// Logged-in customer
bookingRouter.get("/my", verifyToken, verifyRole(["customer"]), getAllBookingsOfUser);
bookingRouter.get("/my/dates", verifyToken, verifyRole(["customer"]), getBookingDatesOfCustomer);

// Customer creates booking
bookingRouter.post("/", verifyToken, verifyRole(["customer"]), createBooking);

// Update booking status/cancel reason 
bookingRouter.put("/:id", verifyToken, updateBooking);



// Get all booking confirmed
bookingRouter.get("/confirmed", verifyToken, getConfirmedBookings);

// Get latest booking confirmed\
bookingRouter.get("/confirmed/latest",verifyToken, getLatestConfirmedBooking);

bookingRouter.patch("/:id/cancel", verifyToken, cancelBooking);
export default bookingRouter;
