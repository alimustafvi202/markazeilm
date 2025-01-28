import connectDB from "@/lib/db";
import { userAuthGuard } from "@/middleware/user";
import PersonalInfo from "@/models/personalinfo";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 7.
export async function PUT(req) {
  try {
    await connectDB();

    const {
      personalInfoId,
      title,
      firstName,
      middleName,
      lastName,
      address,
      phone,
      avatar,
    } = await req.json();
    const authData = await userAuthGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    let user = await PersonalInfo.findById(personalInfoId);
    if (!user) {
      return resError("User Personal Info was not found.");
    }

    user.title = title || user.title;
    user.firstName = firstName || user.firstName;
    user.middleName = middleName || user.middleName;
    user.lastName = lastName || user.lastName;
    user.address = address || user.address;
    user.phone = phone || user.phone;
    user.avatar = avatar;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Personal information has been updated.",
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
