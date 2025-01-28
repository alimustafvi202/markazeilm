import mongoose from "mongoose";

const saleGigSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalBalance: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: "USD" },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

let SaleGig;
try {
  SaleGig = mongoose.model("SaleGig");
} catch (e) {
  SaleGig = mongoose.model("SaleGig", saleGigSchema);
}

export default SaleGig;
