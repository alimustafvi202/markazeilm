import connectDB from "@/lib/db";
import {
  subscriptionCheckGuard,
  userAdminGuard,
  userAuthGuard,
  userHRGuard,
  userSuperAdminGuard,
} from "@/middleware/user";
import JobInfo from "@/models/professionalinfo";
import PersonalInfo from "@/models/personalinfo";
import User from "@/models/user";
import resError from "@/utils/resError";
import { sendOTPCode } from "@/utils/sendOTPCode";
import { NextResponse } from "next/server";

// 21.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userHRGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }
    if (!authData?.data?.companyId) {
      return resError("First create the company then add employees.");
    }
    const data = await User.find({ companyId: authData?.data?.companyId?._id })
      .select("-password")
      .populate("personalInfo")
      .populate({
        path: "jobInfo",
        populate: {
          path: "payrollId",
        },
      });

    if (data.length == 0) {
      return resError(`Users not found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 4.
export async function POST(req) {
  try {
    await connectDB();

    let { email, password, name } = await req.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return resError("Invalid email format.");
    }
    if (password.length < 8) {
      return resError("Password must be at least 8 characters.");
    }

    if (!name) {
      return resError("Name cannot be empty.");
    }

    let user = await User.findOne({ email });
    if (user) {
      return resError("Email already registerd.");
    }

    let employeeId = 1001;

    const code = await sendOTPCode(email);
    console.log(code);

    user = await User.create({
      email,
      password,
      role: "admin",
      code,
      codeGeneratedAt: Date.now(),
      isBuyer: true,
    });
    const personalInfoData = await PersonalInfo.create({
      userId: user._id,
      firstName: name,
    });
    const jobInfoData = await JobInfo.create({
      employeeId: `${employeeId}`,
      payrollId: null,
      department: "",
      jobRole: "",
      userId: user._id,
    });
    user.personalInfo = personalInfoData._id;
    user.jobInfo = jobInfoData._id;
    await user.save();
    const updatedUser = await User.findById(user._id)
      .select("-password")
      .populate("personalInfo")
      .populate({
        path: "jobInfo",
        populate: {
          path: "payrollId",
        },
      });

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

// 5.
export async function PUT(req) {
  try {
    await connectDB();
    const { password, employeeId, email, userId } = await req.json();
    const authData = await userAuthGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (password && password.length < 8) {
      return resError("Password must be at least 8 characters.");
    }

    let user = await User.findById(userId);
    if (!user) {
      return resError("User was not found.");
    }

    user.password = password || user.password;
    user.email = email || user.email;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Updated.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

//
export async function DELETE(req) {
  try {
    await connectDB();
    const authData = await userHRGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const { employeeId } = await req.json(); //means _id

    let user = await User.findByIdAndDelete(employeeId);
    if (!user) {
      return resError(`User was not found against id: ` + employeeId);
    }
    await PersonalInfo.findOneAndDelete({
      userId: employeeId,
    });

    await JobInfo.findOneAndDelete({
      userId: employeeId,
    });

    return NextResponse.json({
      success: true,
      message: "Deleted.",
    });
  } catch (error) {
    return resError(error?.message);
  }
}
