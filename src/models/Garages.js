const mongoose = require("mongoose")

const GarageSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    services: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    phone: { type: String, required: true },
    openHours: { type: String, required: true },
    image: { type: String, default: "" }
  },
  { timestamps: true }
)

GarageSchema.index({ location: "2dsphere" }) // cần thiết cho $nearSphere

const Garage = mongoose.model("Garage", GarageSchema)
module.exports = Garage
