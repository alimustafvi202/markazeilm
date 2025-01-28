import connectDB from "@/lib/db";
import { subscriptionCheckGuard, userSalesGuard } from "@/middleware/user";
import Asset from "@/models/asset";
import Income from "@/models/income";
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

    const { incomes } = await req.json();

    async function processData(incomes) {
      await Promise.all(
        incomes.map(async (item, index) => {
          let { type, totalAmount, date } = item;

          if (!type || !totalAmount || !date) {
            throw new Error(
              `At Row # ${index + 1}: One or more required fields are missing.`
            );
          }
        })
      );

      await Promise.all(
        incomes.map(async (item) => {
          let { notes, type, totalAmount, date } = item;

          await Income.create({
            notes,
            type,
            totalAmount,
            date,
            status: "paid",
            companyId,
            addedBy: authData?.data?._id,
          });
        })
      );
    }
    try {
      await processData(incomes);
      console.log("All incomes processed successfully.");
    } catch (error) {
      return resError(error.message);
    }
    return NextResponse.json(
      {
        success: true,
        message: "Incomes has been imported successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
