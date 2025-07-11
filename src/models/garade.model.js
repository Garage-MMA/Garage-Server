import mongoose from "mongoose";
const GarageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },

    services: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    phone: { type: String, required: true },
    openHours: { type: String, required: true },
    image: { type: String, default: "" },
    ownerId :{type: String, default: ""}
  },
  { timestamps: true }
)
GarageSchema.index({ location: "2dsphere" });
GarageSchema.statics.getGarageByOwnerId = function(ownerId) {
  return this.find({ ownerId });
};

const Garage = mongoose.models.Garage || mongoose.model("Garage", GarageSchema);
export default Garage
