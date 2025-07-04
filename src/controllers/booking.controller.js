const mongoose = require("mongoose");
const Booking = require("../models/booking.model");
const User = require("../models/users.model");
const Garage = require("../models/garade.model");

// Get all bookings (admin/garage_owner use)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customerId", "fullName email phone")
      .populate("garageId", "name address phone")
      .lean();

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error });
  }
};

// Get all bookings of current logged-in user (customer)
exports.getAllBookingsOfUser = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bookings = await Booking.find({ customerId: userId })
      .populate("garageId", "name address phone")
      .lean();

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user bookings", error });
  }
};

//  Create a new booking ( be customer)
exports.createBooking = async (req, res) => {
  try {
    const {
      service,
      bookingDate, 
      garageId
    } = req.body;

    const user = req.user; 

    if (!user || user.role !== "customer") {
      return res.status(403).json({ message: "Only customers can create bookings" });
    }

    if (
      !garageId ||
      !service ||
      !Array.isArray(service) ||
      !bookingDate ||
      !bookingDate.date ||
      !bookingDate.timeSlot
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(garageId)) {
      return res.status(400).json({ message: "Invalid garage ID" });
    }

    const garage = await Garage.findById(garageId);
    if (!garage) {
      return res.status(404).json({ message: "Garage not found" });
    }

    const customerInfo = await User.findById(user.userId);
    if (!customerInfo) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const newBooking = new Booking({
      customerId: customerInfo._id,
      customerName: customerInfo.fullName,
      customerPhone: customerInfo.phone,
      customerEmail: customerInfo.email,
      service,
      bookingDate: {
        date: bookingDate.date,
        timeSlot: bookingDate.timeSlot
      },
      garageId: garage._id,
      status: "Pending"
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create booking", error });
  }
};

// Update a booking (status/cancel reason)
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cancelReason } = req.body;

    if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updateData = { status };
    if (status === "Cancelled" && cancelReason) {
      updateData.cancelReason = cancelReason;
    }

    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, {
      new: true
    });

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update booking", error });
  }
};
