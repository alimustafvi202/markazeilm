import connectDB from "@/lib/db";
import { subscriptionCheckGuard, userHRGuard } from "@/middleware/user";
import JobInfo from "@/models/jobInfo";
import PersonalInfo from "@/models/personalinfo";
import User from "@/models/user";
import resError from "@/utils/resError";
import { sendCredentialsToUser } from "@/utils/sendOTPCode";
import { NextResponse } from "next/server";

//
export async function POST(req) {
  try {
    await connectDB();

    const authData = await userHRGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const subscriptionCheckData = await subscriptionCheckGuard(
      authData?.data?.companyId?.subscriptionId
    );
    if (!subscriptionCheckData?.success) {
      return resError(subscriptionCheckData?.message);
    }
    const companyId = authData?.data?.companyId?._id;

    let {
      email,
      password,
      role,
      personalInfo = {},
      jobInfo = {},
    } = await req.json();
    let employeeId = jobInfo?.employeeId;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return resError("Invalid email format.");
    }
    if (password && password.length < 8) {
      return resError("Password must be at least 8 characters.");
    }

    if (!personalInfo?.firstName) {
      return resError("First Name cannot be empty.");
    }

    if (!role) {
      return resError("Role cannot be empty.");
    }

    const roles = ["employee", "sales", "hr", "finance", "admin"];
    if (!roles.includes(role)) {
      return resError("Invalid role.");
    }

    let user = await User.findOne({ email });
    if (user) {
      return resError("Email already registerd.");
    }

    if (!employeeId) {
      const users = await User.find({ companyId });
      employeeId = 1000 + users.length;
      let idDup = await JobInfo.findOne({
        companyId,
        employeeId: `${employeeId}`,
      });
      do {
        idDup = await JobInfo.findOne({
          companyId,
          employeeId: `${++employeeId}`,
        });
      } while (idDup);
    } else {
      const user = await JobInfo.findOne({ companyId, employeeId });
      if (user) {
        return resError(
          "Employee ID already exists. Please use a unique Employee ID."
        );
      }
    }

    user = await User.create({
      email,
      password: password ? password : "12345678",
      role,
      isVerified: true,
      companyId,
    });
    const personalInfoData = await PersonalInfo.create({
      ...personalInfo,
      userId: user._id,
    });
    const jobInfoData = await JobInfo.create({
      ...jobInfo,
      companyId,
      employeeId: `${employeeId}`,
      userId: user._id,
    });
    user.personalInfo = personalInfoData._id;
    user.jobInfo = jobInfoData._id;
    await user.save();
    const updatedUser = await User.findById(user._id)
      .select("-password")
      .populate("personalInfo")
      .populate("jobInfo")
      .populate("companyId");

    if (role !== "employee") {
      sendCredentialsToUser(
        email,
        password,
        role,
        personalInfo?.firstName,
        updatedUser?.companyId?.displayName
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account Created Successfully.",
        data: {
          ...updatedUser?._doc,
          token: await user.generateJWT(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
