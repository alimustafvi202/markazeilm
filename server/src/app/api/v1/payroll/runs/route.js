import connectDB from "@/lib/db";
import { subscriptionCheckGuard, userHRGuard } from "@/middleware/user";
import Expense from "@/models/expense";
import Payroll from "@/models/payroll";
import PayrollRuns from "@/models/payrollruns";
import User from "@/models/user";
import { createNotification } from "@/utils/notification";
import resError from "@/utils/resError";
import { sendMail } from "@/utils/sendMail";
import { NextResponse } from "next/server";

const support_email = process.env.SUPPORT_EMAIL;

// 26.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userHRGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");
    if (!employeeId) {
      return resError("Employee Id is required.");
    }

    const data = await PayrollRuns.find({
      employeeId,
    })
      .populate({
        path: "runBy",
        select: "-password",
        populate: {
          path: "personalInfo",
        },
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
      });

    if (data.length == 0) {
      return resError(`No payroll runs for this employee.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 25.
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
    console.log(subscriptionCheckData);

    const {
      employeeId,
      overtimeHours,
      noOfWorkingHours,
      status,
      totalAmount,
      attachments,
      notes,
      from,
      to,
      date,
    } = await req.json();

    if (!employeeId || !totalAmount) {
      return resError("One or more feilds are missing.");
    }
    if (!from || !to) {
      return resError("from and to date are mandantory.");
    }

    const payroll = await Payroll.findOne({ employeeId });
    if (!payroll) {
      return resError("Employee does not have any payroll.");
    }

    let payroll_runs = await PayrollRuns.create({
      employeeId,
      runBy: authData?.data?._id,
      companyId: authData?.data?.companyId?._id,
      salaryType: payroll.salaryType,
      salary: payroll.salary,
      bonus: payroll.bonus,
      tax: payroll.tax,
      hourlyRate: payroll.hourlyRate,
      overtimeHourlyRate: payroll.overtimeHourlyRate,
      overtimeHours, // will be added on real time
      noOfWorkingHours,
      status,
      attachments,
      notes,
      totalAmount,
      from,
      to,
      date,
    });

    await Expense.create({
      addedBy: authData?.data?._id,
      companyId: authData?.data?.companyId?._id,
      payrollRunsId: payroll_runs._id,
      totalAmount,
      from,
      to,
      date,
      status,
      title: "From Payroll Runs",
      desc: "From Payroll Runs",
      type: "payroll",
    });

    // send a mail to employee informing about payroll has been run

    // & also send notification
    const notify = await createNotification({
      sentTo: employeeId,
      title: `Your new payroll has been run.`,
      message: `Your new payroll has been run. Rest msg goes here...`,
      link: `/payrollruns/${payroll_runs._id}`,
    });
    if (!notify.success) {
      console.log(notify.message);
    }
    const updatedData = await PayrollRuns.findById(payroll_runs?._id)
      .populate({
        path: "runBy",
        select: "-password",
        populate: {
          path: "personalInfo",
        },
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
      });

    let user = await User.findById(employeeId).populate("personalInfo");

    // const mailData = {
    //   email: user.email,
    //   name: user.personalInfo.firstName,
    //   subject: `Payroll Run`,
    //   message: `Payroll Run
    //   <br>If you need assistance, contact us at <a href="mailto:${support_email}">${support_email}</a>.
    //         `,
    // };

    return NextResponse.json(
      {
        success: true,
        message: "Payroll has been run.",
        data: updatedData,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 28.
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
      payrollRunsId,
      overtimeHours,
      noOfWorkingHours,
      status,
      totalAmount,
      attachments,
      notes,
      from,
      to,
    } = await req.json();

    if (!payrollRunsId) {
      return resError("Payroll_Runs ID is missing.");
    }

    let payroll_runs = await PayrollRuns.findById(payrollRunsId);
    if (!payroll_runs) {
      return resError(
        "Payroll Runs was not found against id: " + payrollRunsId
      );
    }

    const payroll = await Payroll.findOne({
      employeeId: payroll_runs.employeeId,
    });
    if (!payroll) {
      return resError("Employee does not have any payroll.");
    }

    payroll_runs.overtimeHours = overtimeHours || payroll_runs.overtimeHours;
    payroll_runs.noOfWorkingHours =
      noOfWorkingHours || payroll_runs.noOfWorkingHours;
    payroll_runs.totalAmount = totalAmount || payroll_runs.totalAmount;
    payroll_runs.attachments = attachments || payroll_runs.attachments;
    payroll_runs.notes = notes || payroll_runs.notes;
    payroll_runs.from = from || payroll_runs.from;
    payroll_runs.to = to || payroll_runs.to;
    payroll_runs.status = status || payroll_runs.status;

    let expense = await Expense.find({ payrollRunsId: payroll_runs?._id });
    if (status === "paid" && payroll_runs.status === "paid") {
      expense.status = payroll_runs.status;
    } else {
      expense.status = "pending";
    }
    expense.from = payroll_runs.from;
    expense.to = payroll_runs.to;
    expense.totalAmount = payroll_runs.totalAmount;

    await expense.save();
    await payroll_runs.save();

    // send a mail to employee informing about payroll run has been updated & notify
    const notify = await createNotification({
      sentTo: employeeId,
      title: `Your payroll run has been updated.`,
      message: `Your payroll run has been updated. Rest msg goes here...`,
      link: `/payrollruns/${payroll_runs._id}`,
    });
    if (!notify.success) {
      console.log(notify.message);
    }

    let user = await User.findById(payroll_runs.employeeId).populate(
      "personalInfo"
    );

    // const mailData = {
    //   email: user.email,
    //   name: user.personalInfo.firstName,
    //   subject: `Payroll Run`,
    //   message: `Payroll Run
    //   <br>If you need assistance, contact us at <a href="mailto:${support_email}">${support_email}</a>.
    //         `,
    // };

    return NextResponse.json(
      {
        success: true,
        message: "Payroll Run has been updated.",
        data: payroll_runs,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 29.
export async function DELETE(req) {
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

    const { searchParams } = new URL(req.url);
    const payrollRunsId = searchParams.get("payrollRunsId");

    if (!payrollRunsId) {
      return resError("Payroll Runs ID is missing.");
    }

    let payroll_runs = await PayrollRuns.findByIdAndDelete(payrollRunsId);
    if (!payroll_runs) {
      return resError("Payroll Run was not found.");
    }
    const deletedExpense = await Expense.findOneAndDelete({ payrollRunsId });
    if (deletedExpense) {
      console.log(
        `Expense with payrollRunsId ${payrollRunsId} was successfully deleted.`
      );
    } else {
      console.log(`No expense found with payrollRunsId ${payrollRunsId}.`);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payroll run has been deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

async function sendMailToCustomer(data) {
  try {
    const message = `
  <br>Hi <b>${data?.name}!</b>
  <br><br>${data?.message}
  <br><br>Best Regards, <br>Nigotis
`;

    const result = await sendMail(data?.email, data.subject, message);
    return result;
  } catch (error) {
    console.error(error);
  }
}
