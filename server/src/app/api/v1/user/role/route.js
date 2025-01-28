import connectDB from "@/lib/db";
import { userAdminGuard } from "@/middleware/user";
import Company from "@/models/company";
import User from "@/models/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 6.
export async function PUT(req) {
  try {
    await connectDB();
    const { userId, role } = await req.json();
    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    if (role === "super-admin") {
      return resError("Admin cannot make super admin.");
    }

    // also add the check that company Id is same or not, proceed if it is same.

    let user = await User.findById(userId);
    if (!user) {
      return resError("User was not found.");
    }

    const company1 = await Company.findById(user.companyId).select("_id");
    const company2 = await Company.findById(
      authData?.data?.companyId?._id
    ).select("_id");
    console.log(company1, company2);

    if (`${company1?._id}` !== `${company2?._id}`) {
      return resError(
        "Admin can only update the role of employee of same company."
      );
    }

    user.role = role || user.role;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "User role has been updated.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
