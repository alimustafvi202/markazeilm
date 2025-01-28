import mongoose from "mongoose";

// month by month 
const planTrackSchema = new mongoose.Schema({
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" }, // plan during following duration
  startDate: { type: Date },
  endDate: { type: Date },
  totalFee: {type: String, required: true }, // charged fee
  transactionId: { type: String, required: true},
  noOfMonths: {type: String, default: "1"},
  screens: {type: String},
  notes: {type: String}, 
});

const userSubscriptionSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" }, //current plan id
  noOfMonths: {type: String, default: "1"},
  totalFee: {type: String},
  screens: {type: String},
  notes: {type: String},
  startDate: { type: Date }, // recently buy date or renew date
  endDate: { type: Date }, // one month after above by default but canbe set to more months if user paid
  planTrack: [planTrackSchema], // track of subscription in sequence
  status: {
    type: String,
    enum: ["active", "unverified", "expired"], //unverified means transaction is not verified.
    required: true,
  },
}, { timestamps: true });

let User_Subscription;
try {
  User_Subscription = mongoose.model("User_Subscription");
} catch (e) {
  User_Subscription = mongoose.model("User_Subscription", userSubscriptionSchema);
}

export default User_Subscription;
