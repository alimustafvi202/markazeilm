import connectDB from "@/lib/db";
import { subscriptionCheckGuard, userSalesGuard } from "@/middleware/user";
import Asset from "@/models/asset";
import Expense from "@/models/expense";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

//
export async function POST(req) {
  try {
    await connectDB();
    const authData = await userSalesGuard(req);
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

    const { expenses } = await req.json();

    async function processData(expenses) {
      await Promise.all(
        expenses.map(async (item, index) => {
          let { title, type, totalAmount, fromDate, toDate } = item;

          if (!title || !totalAmount || !type || !fromDate || !toDate) {
            throw new Error(
              `At Row # ${index + 1}: One or more required fields are missing.`
            );
          }
        })
      );

      await Promise.all(
        expenses.map(async (item) => {
          let { title, desc, type, totalAmount, date, fromDate, toDate } = item;

          await Expense.create({
            title,
            desc,
            type,
            totalAmount,
            date,
            from: fromDate,
            to: toDate,
            companyId,
            addedBy: authData?.data?._id,
          });
        })
      );
    }
    try {
      await processData(expenses);
      console.log("All expenses processed successfully.");
    } catch (error) {
      return resError(error.message);
    }
    return NextResponse.json(
      {
        success: true,
        message: "Expenses has been imported successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
