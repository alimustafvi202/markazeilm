import mongoose from "mongoose";

const payrollSchema = mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  salaryType: {
    type: String,
    enum: ["fixed", "hourly"],
    required: true,
  },
  salary: { type: Number },
  bonus: { type: Number },
  tax: { type: Number },
  hourlyRate: { type: Number },
  overtimeHours: { type: Number },
  overtimeHourlyRate: { type: Number },
});


let Payroll;
try {
  Payroll = mongoose.model("Payroll");
} catch (e) {
  Payroll = mongoose.model("Payroll", payrollSchema);
}

export default Payroll;
