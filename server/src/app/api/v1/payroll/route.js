import connectDB from "@/lib/db";
import { subscriptionCheckGuard, userAdminGuard, userHRGuard } from "@/middleware/user";
import JobInfo from "@/models/jobInfo";
import Payroll from "@/models/payroll";
import User from "@/models/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 24.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userHRGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const data = await Payroll.find({
      companyId: authData?.data?.companyId?._id,
    }).populate({
      path: "employeeId",
      select: "-password",
      populate: {
        path: "personalInfo",
      },
    });

    if (data.length == 0) {
      return resError(
        `No payrolls was found against company id: ${authData?.data?.companyId?._id}.`
      );
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 22.
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

    const {
      employeeId,
      salaryType,
      salary,
      bonus,
      tax,
      hourlyRate,
      overtimeHours,
      overtimeHourlyRate,
    } = await req.json();

    if (!employeeId || !salaryType) {
      return resError("Employee Id or Salary Type is missing.");
    }

    let payroll = await Payroll.findOne({ employeeId });
    if (payroll) {
      return resError("Payroll already exist for employee id: " + employeeId);
    }

    payroll = await Payroll.create({
      employeeId,
      salaryType,
      salary,
      bonus,
      tax,
      hourlyRate,
      overtimeHours,
      overtimeHourlyRate,
      companyId: authData?.data?.companyId?._id,
    });

    let jobInfo = await JobInfo.findOne({userId: employeeId});
    if (!jobInfo) {
      return resError("Job info for this employee was not found: " + employeeId);
    }
    jobInfo.payrollId = payroll?._id;
    await jobInfo.save();

    const updatedPayroll = await Payroll.findById(payroll?._id).populate({
      path: "employeeId",
      select: "-password",
      populate: {
        path: "personalInfo",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Payroll has been created successfully for " +
          updatedPayroll?.employeeId?.personalInfo?.firstName,
        data: updatedPayroll,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 23.
export async function PUT(req) {
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
    console.log(subscriptionCheckData);

    const {
      payrollId,
      salaryType,
      salary,
      bonus,
      tax,
      hourlyRate,
      overtimeHours,
      overtimeHourlyRate,
    } = await req.json();

    if (!payrollId) {
      return resError("Payroll ID is missing.");
    }

    let payroll = await Payroll.findById(payrollId);
    if (!payroll) {
      return resError("Payroll was not found.");
    }

    payroll.salaryType = salaryType || payroll.salaryType;
    payroll.salary = salary || payroll.salary;
    payroll.bonus = bonus || payroll.bonus;
    payroll.tax = tax || payroll.tax;
    payroll.hourlyRate = hourlyRate || payroll.hourlyRate;
    payroll.overtimeHours = overtimeHours || payroll.overtimeHours;
    payroll.overtimeHourlyRate =
      overtimeHourlyRate || payroll.overtimeHourlyRate;

    await payroll.save();

    const updatedPayroll = await Payroll.findById(payroll?._id);

    return NextResponse.json(
      {
        success: true,
        message: "Payroll has been updated successfully.",
        data: updatedPayroll,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
