import mongoose from "mongoose";

const educationSchema = mongoose.Schema({
  institutionName: { type: String, required: true },
  degreeName: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  percentage: { type: Number },
});

const experienceSchema = mongoose.Schema({
  organization: { type: String },
  department: { type: String },
  profession: { type: String },
  experience: { type: Number },
  joinDate: { type: Date },
  endDate: { type: Date },
});

const professionalInfoSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    experience: [experienceSchema],
    education: [educationSchema],
  },
  { timestamps: true }
);

let ProfessionalInfo;
try {
  ProfessionalInfo = mongoose.model("ProfessionalInfo");
} catch (e) {
  ProfessionalInfo = mongoose.model("ProfessionalInfo", professionalInfoSchema);
}

export default ProfessionalInfo;
