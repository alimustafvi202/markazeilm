import mongoose from "mongoose";

const assetSchema = mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  desc: { type: String },
  quantity: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  date: { type: Date}
},
{ timestamps: true });


let Asset;
try {
  Asset = mongoose.model("Asset");
} catch (e) {
  Asset = mongoose.model("Asset", assetSchema);
}

export default Asset;
