import mongoose from "mongoose";

const payrollRunsSchema = mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    runBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    salaryType: {
      type: String,
      enum: ["fixed", "hourly"],
      required: true,
    },
    from: { type: Date },
    to: { type: Date },
    hourlyRate: { type: Number },
    noOfWorkingHours: { type: Number },
    salary: { type: Number },
    bonus: { type: Number },
    tax: { type: Number },
    overtimeHours: { type: Number },
    overtimeHourlyRate: { type: Number },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "partially-paid", "paid"],
      required: true,
    },
    attachments: [{ type: String }],
    notes: { type: String },
  },
  { timestamps: true }
);

let PayrollRuns;
try {
  PayrollRuns = mongoose.model("PayrollRuns");
} catch (e) {
  PayrollRuns = mongoose.model("PayrollRuns", payrollRunsSchema);
}

export default PayrollRuns;
