import mongoose from "mongoose";

const jobInfoSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    payrollId: { type: mongoose.Schema.Types.ObjectId, ref: "Payroll" },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    employeeId: { type: String, required: true },
    department: { type: String },
    jobRole: { type: String },
    joinDate: {type: Date},
  },
  { timestamps: true }
);

let JobInfo;
try {
  JobInfo = mongoose.model("JobInfo");
} catch (e) {
  JobInfo = mongoose.model("JobInfo", jobInfoSchema);
}

export default JobInfo;
