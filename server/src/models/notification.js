import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
  sentTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String},
  isViewed: { type: Boolean, default: false },
},
{ timestamps: true });

let Notification;
try {
  Notification = mongoose.model("Notification");
} catch (e) {
  Notification = mongoose.model("Notification", notificationSchema);
}

export default Notification;
