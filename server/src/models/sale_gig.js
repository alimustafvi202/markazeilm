import mongoose from "mongoose";

const saleGigSchema = mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    gig: { type: mongoose.Schema.Types.ObjectId, ref: "Gig" },
    salePrice: { type: Number, required: true },
    transactionId: { type: String, required: true },
    transactionMethod: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
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
