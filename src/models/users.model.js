import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "garage_owner", "admin"],
      required: true,
    },
    vehicles: [
      {
        licensePlate: { type: String, required: true },
        brand: String,
        model: String,
        year: Number,
        color: String,
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema, "users");

export default User;