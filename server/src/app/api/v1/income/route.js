import connectDB from "@/lib/db";
import {
  subscriptionCheckGuard,
  userAdminGuard,
  userFinanceGuard,
} from "@/middleware/user";
import Expense from "@/models/expense";
import Income from "@/models/income";
import Invoice from "@/models/invoice";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 58.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userFinanceGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }
    const { searchParams } = new URL(req.url);
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    let dateQuery = {};

    if (fromDate && toDate) {
      if (new Date(fromDate) > new Date(toDate)) {
        return resError("The 'fromDate' cannot be greater than 'toDate'.");
      }
      dateQuery = {
        date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
      };
    } else if (fromDate) {
      dateQuery = { date: { $gte: new Date(fromDate) } };
    } else if (toDate) {
      dateQuery = { date: { $lte: new Date(toDate) } };
    }

    const incomes = await Income.find({
      companyId: authData?.data?.companyId?._id,
      status: "paid",
      ...dateQuery,
    })
      .populate({
        path: "addedBy",
        select: "-password",
        populate: {
          path: "personalInfo",
        },
      })
      .populate({
        path: "invoiceId",
        populate: [
          {
            path: "items",
            model: "SaleProduct",
            populate: {
              path: "productId",
              model: "Product",
            },
          },
          {
            path: "clientId",
            model: "Client",
            populate: {
              path: "personalInfo",
              model: "PersonalInfo",
            },
          },
        ],
      });

    if (incomes.length == 0) {
      return resError(`No income was found.`);
    }
    
    return NextResponse.json({ success: true, data: incomes }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 55.
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
    console.log(subscriptionCheckData);

    const { notes, type, totalAmount, date } = await req.json();

    if (!totalAmount || !type || !date) {
      return resError("One or more required fields are missing.");
    }

    let income = await Income.create({
      notes,
      type,
      totalAmount,
      date,
      status: "paid",
      companyId: authData?.data?.companyId?._id,
      addedBy: authData?.data?._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Income has been added successfully.",
        data: income,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 56.
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
    console.log(subscriptionCheckData);

    const { incomeId, notes, type, totalAmount, date, status } =
      await req.json();

    let income = await Income.findById(incomeId);
    if (!income) {
      return resError(`Income was not found against id: `, incomeId);
    }

    income.totalAmount = totalAmount || income.totalAmount;
    income.type = type || income.type;
    income.date = date || income.date;
    income.notes = notes || income.notes;
    income.status = status || income.status;

    await income.save();

    return NextResponse.json(
      {
        success: true,
        message: "Income record has been updated successfully.",
        data: income,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 57.
export async function DELETE(req) {
  try {
    await connectDB();
    const authData = await userFinanceGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const { incomeId } = await req.json();

    let income = await Income.findByIdAndDelete(incomeId);
    if (!income) {
      return resError(`Income was not found against id: ` + incomeId);
    }

    return NextResponse.json({
      success: true,
      message: "Income has been deleted.",
    });
  } catch (error) {
    return resError(error?.message);
  }
}
