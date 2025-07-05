import mongoose from "mongoose";

const { Schema } = mongoose;

const ServiceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  category: { type: String, enum: ["Sửa chữa", "Bảo dưỡng"], required: true },
  status: {
    type: String,
    enum: ["Hoạt động", "Ngừng hoạt động"],
    default: "Hoạt động",
  },
}, { timestamps: true });

export default mongoose.model("Service", ServiceSchema);
