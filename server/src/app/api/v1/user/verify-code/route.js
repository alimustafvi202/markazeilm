import connectDB from "@/lib/db";
import User from "@/models/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// .
export async function PUT(req) {
  try {
    await connectDB();
    const { code, email } = await req.json();

    let user = await User.findOne({ email });
    if (!user) {
      return resError("Email was not found.");
    }
    const currentTime = Date.now();
    const codeGeneratedAt = new Date(user.codeGeneratedAt).getTime();

    const timeDifferenceInMinutes =
      (currentTime - codeGeneratedAt) / (1000 * 60);

    if (timeDifferenceInMinutes > 15) {
      return resError("The code has expired. Please request a new code.");
    }
    if (`${code}` !== `${user.code}`) {
      return resError("Wrong Code");
    }

    user.isVerified = true;
    user.code = 0;
    await user.save();
    return NextResponse.json(
      {
        success: true,
        message: "Email Verified.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
