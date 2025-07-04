import express from "express";
const bookingController = require("../controllers/booking.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const bookingRouter = express.Router()
// Get all bookings (admin)
bookingRouter.get("/", verifyToken, bookingController.getAllBookings);

// Get current user's bookings (customer)
bookingRouter.get("/my", verifyToken, bookingController.getAllBookingsOfUser);

// Create new booking
bookingRouter.post("/", verifyToken, bookingController.createBooking);

// Update booking
bookingRouter.put("/:id", verifyToken, bookingController.updateBooking);

export default bookingRouter;
