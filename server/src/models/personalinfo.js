import mongoose from "mongoose";

const personalInfoSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String },
    avatar: { type: String },
    department: { type: String },
    jobRole: { type: String },
    joinDate: {type: Date},

  },
  { timestamps: true }
);

let PersonalInfo;
try {
  PersonalInfo = mongoose.model("PersonalInfo");
} catch (e) {
  PersonalInfo = mongoose.model("PersonalInfo", personalInfoSchema);
}

export default PersonalInfo;
