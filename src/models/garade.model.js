const mongoose = require("mongoose")

const GarageSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    services: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    phone: { type: String, required: true },
    openHours: { type: String, required: true },
    image: { type: String, default: "" }
  },
  { timestamps: true }
)

const Garage = mongoose.model("Garage", GarageSchema)
module.exports = Garage
