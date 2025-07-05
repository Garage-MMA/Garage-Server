import mongoose from "mongoose";
const { Schema } = mongoose

const StatisticSchema = new Schema({
  garageId: { type: Schema.Types.ObjectId, ref: "Garage", required: true },
  totalCustomers: { type: Number, required: true },
  totalRevenue: { type: Number, required: true }
}, { timestamps: true })

const Statistic = mongoose.model("Statistic", StatisticSchema)
export default Statistic