import connectDB from "@/lib/db";
import {
  subscriptionCheckGuard,
  userAdminGuard,
  userFinanceGuard,
} from "@/middleware/user";
import Asset from "@/models/asset";
import Expense from "@/models/expense";
import Income from "@/models/income";
import Invoice from "@/models/invoice";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

//
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userFinanceGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    if (!date) {
      return resError("Date is required.");
    }

    let dateQuery = {
      date: { $lte: new Date(date) },
    };

    const assets = await Asset.find({
      companyId: authData?.data?.companyId?._id,
      ...dateQuery,
    }).select(["title", "totalAmount"]);

    let total = 0.0;
    assets.forEach((asset) => {
      total += asset.totalAmount;
    });
    // Result object
    const assetsData = {
      date,
      assets,
      totalAssets: total.toFixed(2),
    };

    return NextResponse.json(
      { success: true, data: assetsData },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
