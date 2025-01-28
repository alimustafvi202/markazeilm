import mongoose from "mongoose";

const gigSchema = mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  title: { type: String, required: true },
  desc: { type: String },
  price: { type: Number, required: true },
  tags: { type: [String] },
  images: { type: [String] },
  videos: { type: [String] },
  courses: { type: [mongoose.Schema.Types.ObjectId], ref: "Courses" },
});


let Gig;
try {
  Gig = mongoose.model("Gig");
} catch (e) {
  Gig = mongoose.model("Gig", gigSchema);
}

export default Gig;
