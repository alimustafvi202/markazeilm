import connectDB from "@/lib/db";
import { userSuperAdminGuard } from "@/middleware/user";
import User from "@/models/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 1.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userSuperAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }
    const data = await User.find({
      role: "admin",
      subscriptionId: { $exists: true, $ne: null },
    })
      .select("-password")
      .populate("personalInfo")
      .populate({
        path: "subscriptionId",
        populate: {
          path: "planId",
          model: "Plan"
        }
      });

    if (data.length == 0) {
      return resError(`Users not found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}
