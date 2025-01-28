import connectDB from "@/lib/db";
import { userHRGuard } from "@/middleware/user";
import PayrollRuns from "@/models/payrollruns";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 27.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userHRGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const data = await PayrollRuns.find({
      companyId: authData?.data?.companyId?._id,
    })
      .populate({
        path: "employeeId",
        select: "-password",
        populate: [
          {
            path: "personalInfo",
            model: "PersonalInfo",
          },
          {
            path: "jobInfo",
            model: "JobInfo",
            populate: {
              path: "payrollId",
              model: "Payroll",
            },
          },
        ],
      })
      .populate({
        path: "runBy",
        select: "-password",
        populate: {
          path: "personalInfo",
          model: "PersonalInfo",
        },
      });

    if (data.length == 0) {
      return resError(`No payroll runs was found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}
