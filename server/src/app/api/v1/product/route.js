import connectDB from "@/lib/db";
import {
  subscriptionCheckGuard,
  userAdminGuard,
  userSalesGuard,
} from "@/middleware/user";
import Product from "@/models/gig";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 51.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userSalesGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const data = await Product.find({
      companyId: authData?.data?.companyId?._id,
    });

    if (data.length == 0) {
      return resError(
        `No product was found against company id: ${authData?.data?.companyId?._id}.`
      );
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 52.
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

    const { name, desc, price } = await req.json();

    if (!name || !price) {
      return resError("One or more required fields are missing.");
    }
    const companyId = authData?.data?.companyId?._id;
    let existingProduct = await Product.find({
      name,
      companyId,
    });

    // Check if the product exists
    if (existingProduct.length > 0) {
      return resError(
        "A product with this name already exists for the given company."
      );
    }

    let product = await Product.create({
      name,
      desc,
      price,
      companyId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product has been added successfully.",
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 53.
export async function PUT(req) {
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

    const { productId, name, desc, price } = await req.json();

    let product = await Product.findById(productId);
    if (!product) {
      return resError(`Product was not found against id: `, productId);
    }

    product.name = name || product.name;
    product.desc = desc || product.desc;
    // product.images = images || product.images;
    product.price = price || product.price;

    await product.save();

    return NextResponse.json(
      {
        success: true,
        message: "Product has been updated successfully.",
        data: product,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 54.
export async function DELETE(req) {
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

    const { productId } = await req.json();

    let product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return resError(`Product was not found against id: ` + productId);
    }

    return NextResponse.json({
      success: true,
      message: "Product has been deleted.",
    });
  } catch (error) {
    return resError(error?.message);
  }
}
