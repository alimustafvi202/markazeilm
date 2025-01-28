import connectDB from "@/lib/db";
import { subscriptionCheckGuard, userSalesGuard } from "@/middleware/user";
import Asset from "@/models/asset";
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

    const { assets } = await req.json();

    async function processData(assets) {
      await Promise.all(
        assets.map(async (item, index) => {
          let { title, quantity, totalAmount } = item;

          if (!title || !totalAmount || !quantity) {
            throw new Error(
              `At Row # ${index + 1}: One or more required fields are missing.`
            );
          }
        })
      );

      await Promise.all(
        assets.map(async (item) => {
          let { title, desc, quantity, totalAmount, date } = item;

          await Asset.create({
            title,
            desc,
            quantity,
            totalAmount,
            date,
            companyId,
            addedBy: authData?.data?._id,
          });
        })
      );
    }
    try {
      await processData(assets);
      console.log("All assets processed successfully.");
    } catch (error) {
      return resError(error.message);
    }
    return NextResponse.json(
      {
        success: true,
        message: "Assets has been imported successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
