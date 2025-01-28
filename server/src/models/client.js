import mongoose from "mongoose";

const clientSchema = mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  personalInfo: { type: mongoose.Schema.Types.ObjectId, ref: "PersonalInfo" },
  email: { type: String, required: true, unique: true },
  about: { type: String },
});

let Client;
try {
  Client = mongoose.model("Client");
} catch (e) {
  Client = mongoose.model("Client", clientSchema);
}

export default Client;
