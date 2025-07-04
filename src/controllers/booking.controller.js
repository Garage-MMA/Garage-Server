import mongoose from "mongoose";
import Booking from "../models/booking.model.js";
import User from "../models/users.model.js";
import Garage from "../models/garade.model.js";

// Get all bookings (admin/garage_owner use)
const getAllBookings = async (req, res) => {
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

// Get bookings of the current logged-in user (customer)
const getAllBookingsOfUser = async (req, res) => {
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

// Create a new booking (customer only)
const createBooking = async (req, res) => {
    try {
        const { service, bookingDate, garageId } = req.body;
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

        const garage = await Garage.findById(garageId).lean();
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
                timeSlot: bookingDate.timeSlot,
            },
            garageId: garage._id,
            status: "Pending",
        });

        await newBooking.save();

        res.status(201).json({
            message: "Booking created successfully",
            booking: {
                _id: newBooking._id,
                customer: {
                    _id: customerInfo._id,
                    fullName: customerInfo.fullName,
                    email: customerInfo.email,
                    phone: customerInfo.phone,
                },
                service: newBooking.service,
                bookingDate: newBooking.bookingDate,
                status: newBooking.status,
                garage: {
                    _id: garage._id,
                    name: garage.name,
                    address: garage.address,
                    latitude: garage.latitude,
                    longitude: garage.longitude,
                    services: garage.services,
                    rating: garage.rating,
                    phone: garage.phone,
                    openHours: garage.openHours,
                },
                createdAt: newBooking.createdAt,
                updatedAt: newBooking.updatedAt,
            },
        });
    } catch (error) {
        console.error("Create booking error:", error);
        res.status(500).json({ message: "Failed to create booking", error });
    }
};


// Update booking status or cancel reason
const updateBooking = async (req, res) => {
    try {
    const { id } = req.params
    const { status, cancelReason } = req.body
    const updateData = { status }
    if (status === "Cancelled" && cancelReason) {
      updateData.cancelReason = cancelReason
    }
    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, {
      new: true
    })
    if (!updatedBooking) {
      return res.status(404).json({ message: "Can not find booking" })
    }
    res.status(200).json(updatedBooking)
  } catch (error) {
    console.error("Error updating booking:", error)
    res.status(500).json({ message: "Error when update booking", error })
  }
};


export {
    getAllBookings,
    getAllBookingsOfUser,
    createBooking,
    updateBooking,
};
