import connectDB from "@/lib/db";
import {
  subscriptionCheckGuard,
  userAdminGuard,
  userFinanceGuard,
} from "@/middleware/user";
import Expense from "@/models/expense";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 36.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userFinanceGuard(req);
    if (!authData?.success) {
      return resError(
        authData?.message
      );
    }

    const data = await Expense.find({
      companyId: authData?.data?.companyId?._id,
    }).populate({
      path: "addedBy",
      select: "-password",
      populate: {
        path: "personalInfo",
      },
    });

    if (data.length == 0) {
      return resError(`No company expense was found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 37.
export async function POST(req) {
  try {
    await connectDB();
    const authData = await userFinanceGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const subscriptionCheckData = await subscriptionCheckGuard(
      authData?.data?.companyId?.subscriptionId
    );
    if (!subscriptionCheckData?.success) {
      return resError(subscriptionCheckData?.message);
    }

    const { title, desc, type, totalAmount, date, from, to } = await req.json();

    if (!title || !totalAmount || !type || !from || !to) {
      return resError("One or more required fields are missing.");
    }

    let expense = await Expense.create({
      title,
      desc,
      type,
      totalAmount,
      date,
      from,
      to,
      companyId: authData?.data?.companyId?._id,
      addedBy: authData?.data?._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Company Expense has been created successfully.",
        data: expense,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 38.
export async function PUT(req) {
  try {
    await connectDB();
    const authData = await userFinanceGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const subscriptionCheckData = await subscriptionCheckGuard(
      authData?.data?.companyId?.subscriptionId
    );
    if (!subscriptionCheckData?.success) {
      return resError(subscriptionCheckData?.message);
    }

    const { expenseId, title, desc, type, totalAmount, date, from, to  } = await req.json();

    let expense = await Expense.findById(expenseId);
    if (!expense) {
      return resError(`Expense was not found against id: `, expenseId);
    }

    expense.totalAmount = totalAmount || expense.totalAmount;
    expense.title = title || expense.title;
    expense.desc = desc || expense.desc;
    expense.type = type || expense.type;
    expense.date = date || expense.date;
    expense.from = from || expense.from;
    expense.to = to || expense.to;

    await expense.save();

    return NextResponse.json(
      {
        success: true,
        message:
          
          "Company expense has been updated successfully.",
        data: expense,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 39.
export async function DELETE(req) {
  try {
    await connectDB();
    const authData = await userFinanceGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }
    
    const { expenseId } = await req.json();

    let expense = await Expense.findByIdAndDelete(expenseId);
    if (!expense) {
      return resError(`Expense was not found against id: `+ expenseId);
    }

    return NextResponse.json({
      success: true,
      message:
        "Expense has been deleted.",
    });
  } catch (error) {
    return resError(error?.message);
  }
}
