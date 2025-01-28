import connectDB from "@/lib/db";
import { userAuthGuard } from "@/middleware/user";
import JobInfo from "@/models/professionalinfo";
import PersonalInfo from "@/models/personalinfo";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

//
export async function PUT(req) {
  try {
    await connectDB();

    const { jobInfoId, employeeId, department, jobRole, joinDate } =
      await req.json();
    const authData = await userAuthGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    let jobInfo = await JobInfo.findById(jobInfoId);
    if (!jobInfo) {
      return resError("Job Info was not found.");
    }

    jobInfo.department = department || jobInfo.department;
    jobInfo.joinDate = joinDate || jobInfo.joinDate;
    jobInfo.jobRole = jobRole || jobInfo.jobRole;

    if (employeeId) {
      const existingUserWithEmployeeId = await JobInfo.findOne({
        companyId: authData?.data?.companyId?._id, // Match the same companyId
        employeeId, // Check for the same employeeId
        _id: { $ne: jobInfoId }, // Exclude the current obj
      });

      if (existingUserWithEmployeeId) {
        return resError(
          `Employee ID "${employeeId}" is already taken by another employee in this company.`
        );
      }
    }

    jobInfo.employeeId = employeeId || jobInfo.employeeId;

    await jobInfo.save();

    return NextResponse.json(
      {
        success: true,
        message: "Job information has been updated.",
        data: jobInfo,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
