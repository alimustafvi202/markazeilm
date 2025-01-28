import connectDB from "@/lib/db";
import {userSuperAdminGuard} from "@/middleware/user";
import User from "@/models/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 3.
export async function GET(req, { params }) {
  try {
    await connectDB();
    const authData = await userSuperAdminGuard(req);
    if (!authData?.success) {      
      return resError(authData?.message);
    }
    const { id } = params;
    const user = await User.findById(id)
      .select("-password")
      .populate("personalInfo")
      .populate("companyId")
      .populate("payrollId")
      .populate("subscriptionId");

    if (!user) {
      return resError(`No user was found in database.`);
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}
