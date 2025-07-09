import mongoose from "mongoose";

const { Schema } = mongoose;

const TimeSlotSchema = new Schema({
  slot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Available", "Booked"],
    required: true,
    default: "Available",
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    default: null,
  },
});

const ScheduleSchema = new Schema(
  {
    garageId: {
      type: Schema.Types.ObjectId,
      ref: "Garage",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    timeSlots: [TimeSlotSchema],
  },
  { timestamps: true }
);

const Schedule = mongoose.model("Schedule", ScheduleSchema);
export default Schedule;
