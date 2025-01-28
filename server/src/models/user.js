import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    personalInfo: { type: mongoose.Schema.Types.ObjectId, ref: "PersonalInfo" },
    professionalInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProfessionalInfo",
    },
    userType: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: true,
    },
    code: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    codeGeneratedAt: { type: Date },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  next();
});
userSchema.methods.generateJWT = async function () {
  return sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
userSchema.methods.comparePassword = async function (enteredPassword) {
  return compare(enteredPassword, this.password);
};

let User;
try {
  User = mongoose.model("User");
} catch (e) {
  User = mongoose.model("User", userSchema);
}

export default User;
