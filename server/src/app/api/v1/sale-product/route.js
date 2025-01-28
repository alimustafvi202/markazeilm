import connectDB from "@/lib/db";
import { userSalesGuard } from "@/middleware/user";
import SaleProduct from "@/models/sale_product";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 59.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userSalesGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const data = await SaleProduct.find({
      companyId: authData?.data?.companyId?._id,
    }).populate({
      path: "productId",
      model: "Product",
    });

    if (data.length == 0) {
      return resError(
        `No sold product was found for: ${authData?.data?.companyId?.displayName}.`
      );
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}
