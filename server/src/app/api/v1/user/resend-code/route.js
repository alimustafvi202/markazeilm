import connectDB from "@/lib/db";
import User from "@/models/user";
import resError from "@/utils/resError";
import { sendOTPCode } from "@/utils/sendOTPCode";
import { NextResponse } from "next/server";

// .
export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();

    let user = await User.findOne({ email });
    if (!user) {
      return resError("User was not found.");
    }

    const code = await sendOTPCode(user.email);
    console.log(code);
    
    user.code = code;
    user.codeGeneratedAt = Date.now();
    await user.save();
    return NextResponse.json(
      {
        success: true,
        message: "Code sent.",
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
