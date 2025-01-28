import mongoose from "mongoose";

const companySchema = mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User_Subscription",
  },
  displayName: { type: String, required: true },
  legalName: { type: String, required: true },
  type: { type: String },
  ein: { type: String },
  ssn: { type: String },
  logo: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String, required: true },
  currencyCode: { type: String, required: true },
}, { timestamps: true });

let Company;
try {
  Company = mongoose.model("Company");
} catch (e) {
  Company = mongoose.model("Company", companySchema);
}

export default Company;
