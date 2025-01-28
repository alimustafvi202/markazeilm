import connectDB from "@/lib/db";
import { subscriptionCheckGuard, userSalesGuard } from "@/middleware/user";
import Asset from "@/models/asset";
import Product from "@/models/gig";
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

    const { products } = await req.json();

    async function processData(products) {
      await Promise.all(
        products.map(async (item, index) => {
          let { name, desc, price } = item;

          if (!name || !price) {
            throw new Error(
              `At Row # ${index + 1}: One or more required fields are missing.`
            );
          }

          let existingProduct = await Product.find({
            name,
            companyId,
          });

          if (existingProduct.length > 0) {
            throw new Error(
              `At Row # ${index + 1}: A product with this name already exists.`
            );
          }
        })
      );

      await Promise.all(
        products.map(async (item) => {
          let { name, desc, price } = item;

          await Product.create({
            name,
            desc,
            price,
            companyId,
          });
        })
      );
    }
    try {
      await processData(products);
      console.log("All products processed successfully.");
    } catch (error) {
      return resError(error.message);
    }
    return NextResponse.json(
      {
        success: true,
        message: "Products has been imported successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
