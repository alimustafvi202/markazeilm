import mongoose from "mongoose";

const incomeSchema = mongoose.Schema( 
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
    type: {
      type: String,
      enum: ["invoice", "asset", "others"],
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "pending"],
      required: true,
    },
    totalAmount: { type: Number, required: true },
    date: { type: Date },
  },
  { timestamps: true }
);

let Income;
try {
  Income = mongoose.model("Income");
} catch (e) {
  Income = mongoose.model("Income", incomeSchema);
}

export default Income;
