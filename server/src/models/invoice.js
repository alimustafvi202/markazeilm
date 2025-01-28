import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema( 
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
    invoiceBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "SaleProduct" }],
    invoiceNo: {type: Number, required: true, unique: true},
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "paid"],
      required: true,
    },
    notes: {
      type: String,
    },
    tax: { type: Number },
    discount: { type: Number },
    totalAmount: { type: Number },
    paidAmount: { type: Number },
  },
  { timestamps: true }
);

let Invoice;
try {
  Invoice = mongoose.model("Invoice");
} catch (e) {
  Invoice = mongoose.model("Invoice", invoiceSchema);
}

export default Invoice;
