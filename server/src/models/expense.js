import mongoose from "mongoose";

const expensesSchema = mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    payrollRunsId: { type: mongoose.Schema.Types.ObjectId, ref: "PayrollRuns" },
    title: { type: String, required: true },
    desc: { type: String },
    type: {
      type: String,
      enum: ["bill", "payroll", "others"],
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "pending"],
      required: true,
      default: "paid"
    },
    totalAmount: { type: Number, required: true },
    date: { type: Date },
    from: { type: Date },
    to: { type: Date },
  },
  { timestamps: true }
);

let Expense;
try {
  Expense = mongoose.model("Expense");
} catch (e) {
  Expense = mongoose.model("Expense", expensesSchema);
}

export default Expense;
