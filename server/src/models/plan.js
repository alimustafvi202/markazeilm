import mongoose from "mongoose";

const includeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tagline: { type: String },
  points: { type: [String] },
});

const planSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["basic", "pro", "premium", "custom"],
      required: true,
    },
    screens: { type: String, required: true },
    pricePerScreen: { type: String, required: true },
    oldPricePerMonth: { type: String, required: true },
    pricePerMonth: { type: String, required: true },
    name: { type: String, required: true },
    tagline: { type: String },
    includes: { type: [includeSchema] },
  },
  { timestamps: true }
);

let Plan;
try {
  Plan = mongoose.model("Plan");
} catch (e) {
  Plan = mongoose.model("Plan", planSchema);
}

export default Plan;
