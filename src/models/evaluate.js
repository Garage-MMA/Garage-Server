import mongoose from "mongoose";

const evaluateSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 300,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Evaluate = mongoose.model("Evaluate", evaluateSchema);
export default Evaluate;
