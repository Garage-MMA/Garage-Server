import mongoose from "mongoose";

const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    customerName: {
      type: String,
      required: true
    },
    customerPhone: {
      type: String,
      required: true
    },
    customerEmail: {
      type: String,
      required: true
    },
    service: {
      type: [String],
      required: true
    },
    bookingDate: {
      date: {
        type: String,
        required: true
      },
      timeSlot: {
        type: String,
        required: true
      }
    },
    status: {
      type: String,
      enum: ["Confirmed", "Pending", "Cancelled"],
      default: "Pending"
    },
    garageId: {
      type: Schema.Types.ObjectId,
      ref: "Garage",
      required: true
    },
    cancelReason: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
