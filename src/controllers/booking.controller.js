import mongoose, { Mongoose } from "mongoose";
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

        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch user bookings", error });
    }
};

// Create a new booking (customer only)
const createBooking = async (req, res) => {
    try {
        const { service, bookingDate, garageId, vehicleId } = req.body; 
        const user = req.user;

        if (!user || user.role !== "customer") {
            return res.status(403).json({ message: "Only customers can create bookings" });
        }

        if (
            !garageId ||
            !vehicleId || 
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
        if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
            return res.status(400).json({ message: "Invalid vehicle ID" });
        }

        const garage = await Garage.findById(garageId).lean();
        if (!garage) {
            return res.status(404).json({ message: "Garage not found" });
        }

        const customerInfo = await User.findById(user.userId);
        if (!customerInfo) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Kiểm tra vehicle thuộc customer
        const vehicle = customerInfo.vehicles?.find(v => v._id.toString() === vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        const newBooking = new Booking({
            customerId: customerInfo._id,
            customerName: customerInfo.fullName,
            customerPhone: customerInfo.phone,
            customerEmail: customerInfo.email,
            vehicleId: vehicle._id, 
            vehicleInfo: {
                licensePlate: vehicle.licensePlate,
                brand: vehicle.brand,
                model: vehicle.model,
                color: vehicle.color,
                year: vehicle.year,
            },
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
                vehicle: newBooking.vehicleInfo,
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
        console.log(updateData)
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
// Trả về danh sách ngày và khung giờ đã đặt của customer hiện tại
const getBookingDatesOfCustomer = async (req, res) => {
    try {
        const customerId = req.user?.userId;

        if (!customerId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const bookings = await Booking.find(
            {
                customerId,
                status: { $ne: "Cancelled" } 
            },
            "bookingDate"
        ).lean();
        const bookingDates = bookings.map((b) => b.bookingDate);

        res.status(200).json({ bookingDates });
    } catch (error) {
        console.error("Lỗi khi lấy lịch booking:", error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

const getConfirmedBookings = async (req, res) => {
  try {
    const customerId = req.user?.userId;
    if (!customerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bookings = await Booking.find({
        status: "Confirmed",
        customerId: customerId
      })
      .populate("customerId", "fullName email phone")
      .populate("garageId", "name address phone")
      .lean();

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Lỗi khi lấy các booking đã xác nhận:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const getLatestConfirmedBooking = async (req, res) => {
  try {
    const customerId = req.user?.userId;
    if (!customerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const booking = await Booking.findOne({
        status: "Confirmed",
        customerId: customerId
      })
      .sort({ updatedAt: -1 })
      .populate("customerId", "fullName email phone")
      .populate("garageId", "name address phone")
      .lean();

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy booking nào đã xác nhận cho khách hàng này" });
    }

    res.status(200).json({ booking });
  } catch (error) {
    console.error("Lỗi khi lấy booking gần nhất:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const cancelBooking = async (req, res) => {
  const { id } = req.params;
  const { cancelReason } = req.body;

  if (!cancelReason) {
    return res.status(400).json({ message: 'Cancel reason is required' });
  }

  try {
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'Pending') {
      return res.status(400).json({
        message: 'Only bookings with status Pending can be cancelled',
      });
    }

    const updateData = {
      status: 'Cancelled',
      cancelReason,
    };

    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
const getBookingByOwnerId = async (req, res) => {
  try {
    const { owner_id } = req.params;
    // Tìm tất cả garage của owner
    const garages = await Garage.find({ ownerId: owner_id });
    const garageIds = garages.map(g => g._id);
    if (garageIds.length === 0) {
      return res.status(404).json({ message: "No garages found for this owner" });
    }
    // Tìm tất cả booking có garageId thuộc danh sách này
    const bookings = await Booking.find({ garageId: { $in: garageIds } });
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this owner's garages" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error in getBookingByOwnerId:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {
    getAllBookings,
    getAllBookingsOfUser,
    createBooking,
    updateBooking,
    getBookingDatesOfCustomer,
    getConfirmedBookings,
    getLatestConfirmedBooking,
    cancelBooking,
    getBookingByOwnerId,
};
