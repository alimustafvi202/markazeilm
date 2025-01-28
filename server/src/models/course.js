import mongoose from "mongoose";

const lectureSchema = mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String },
  tags: { type: [String] },
  images: { type: [String] },
  videos: { type: [String] },
});

const courseSchema = mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  title: { type: String, required: true },
  desc: { type: String },
  tags: { type: [String] },
  coverImage: { type: String },
  introVideo: { type: String },
  lectures: [lectureSchema]
});


let Course;
try {
  Course = mongoose.model("Course");
} catch (e) {
  Course = mongoose.model("Course", courseSchema);
}

export default Course;
