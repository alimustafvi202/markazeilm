import connectDB from "@/lib/db";
import { userAdminGuard, userSuperAdminGuard } from "@/middleware/user";
import User_Subscription from "@/models/user_subscription";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 16.
export async function PUT(req) {
  try {
    await connectDB();
    const authData1 = await userAdminGuard(req);
    const authData2 = await userSuperAdminGuard(req);
    if (!authData1?.success && !authData2?.success) {
      return resError(
        authData1?.success ? authData2?.message : authData1?.message
      );
    }

    const { subscriptionId, additionalScreens, additionalFee, notes } =
      await req.json();

    if (!subscriptionId || !additionalFee || !additionalScreens) {
      console.log("One or more fields are missing or empty.");
    }

    const subscription = await User_Subscription.findById(subscriptionId);
    if (!subscription) {
      return resError(
        "No subscription was found against this id: ",
        subscriptionId
      );
    }

    subscription.screens =
      Number(subscription.screens) + Number(additionalScreens);
    subscription.totalFee =
      Number(subscription.totalFee) + Number(additionalFee);

    subscription.notes = notes || subscription.notes;
    let track = [];
    for (let index = 0; index < subscription.planTrack.length; index++) {
      const element = subscription.planTrack[index];
      if (index + 1 === subscription.planTrack.length) {
        track.push({
          ...element,
          notes,
          screens: Number(element.screens) + Number(additionalScreens),
          totalFee: Number(element.totalFee) + Number(additionalFee),
        });
      } else {
        track.push(element);
      }
    }
    subscription.planTrack = track;

    await subscription.save();

    return NextResponse.json(
      {
        success: true,
        message: "User subscription screens successfully updated.",
        data: subscription,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
