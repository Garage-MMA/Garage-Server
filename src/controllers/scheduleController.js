import Schedule from "../models/Schedule.js";

import mongoose from "mongoose";


// 📌 Lấy lịch theo garageId và ngày (hiển thị slot trống và đã đặt)
export async function getScheduleByGarage(req, res) {
  try {
    const { garageId } = req.params
    const { date } = req.query // Ngày cần lấy lịch

    if (!date) {
      return res.status(400).json({ message: "Please provide a date" })
    }

    const schedule = await Schedule.findOne({ garageId, date }).populate("timeSlots.bookingId")

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" })
    }

    res.status(200).json(schedule)
  } catch (error) {
    res.status(500).json({ message: "Error fetching schedule", error })
  }
}

// 📌 Cập nhật trạng thái của slot khi đặt lịch hoặc hủy lịch

export async function updateSchedulesSlot(req, res) {
  try {
    const { garageId } = req.params
    const { date, slot, status, bookingId } = req.body

    console.log("Received request:", { garageId, date, slot, status, bookingId })

    const schedule = await Schedule.findOne({ garageId, date })

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" })
    }

    const slotIndex = schedule.timeSlots.findIndex((s) => s.slot === slot)
    console.log("Slot index:", slotIndex)

    if (slotIndex === -1) {
      return res.status(400).json({ message: "Slot not found" })
    }

    console.log("Before update:", schedule.timeSlots[slotIndex])

    // Kiểm tra nếu `bookingId` là ObjectId hợp lệ, nếu không thì đặt null
    schedule.timeSlots[slotIndex].status = status
    schedule.timeSlots[slotIndex].bookingId = (status === "Booked" && mongoose.Types.ObjectId.isValid(bookingId))
      ? new mongoose.Types.ObjectId(bookingId)
      : null

    console.log("After update:", schedule.timeSlots[slotIndex])

    await schedule.save()
    console.log("Schedule saved successfully")

    res.status(200).json({ message: "Schedule updated successfully", schedule })
  } catch (error) {
    console.error("Error updating schedule:", error)
    res.status(500).json({ message: "Error updating schedule", error })
  }
}


