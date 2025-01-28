import connectDB from "@/lib/db";
import {
  subscriptionCheckGuard,
  userFinanceGuard,
} from "@/middleware/user";
import Asset from "@/models/asset";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 32.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userFinanceGuard(req);
    if (!authData?.success) {
      return resError(
        authData?.message
      );
    }

    const data = await Asset.find({
      companyId: authData?.data?.companyId?._id,
    }).populate({
      path: "addedBy",
      select: "-password",
      populate: {
        path: "personalInfo",
      },
    });

    if (data.length == 0) {
      return resError(`No company asset was found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 33.
export async function POST(req) {
  try {
    await connectDB();
    const authData = await userFinanceGuard(req);
    if (!authData?.success) {
      return resError(
        authData?.message
      );
    }

    const subscriptionCheckData = await subscriptionCheckGuard(authData?.data?.companyId?.subscriptionId);
    if (!subscriptionCheckData?.success) {
      return resError(subscriptionCheckData?.message);
    }

    const { title, desc, quantity, totalAmount, date } = await req.json();

    if (!title || !totalAmount || !quantity) {
      return resError("One or more required fields are missing.");
    }

    let asset = await Asset.create({
      title,
      desc,
      quantity,
      totalAmount,
      date,
      companyId: authData?.data?.companyId?._id,
      addedBy: authData?.data?._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Company Asset has been created successfully.",
        data: asset,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 34.
export async function PUT(req) {
  try {
    await connectDB();
    const authData = await userFinanceGuard(req);
    if (!authData?.success) {
      return resError(
        authData?.message
      );
    }

    const subscriptionCheckData = await subscriptionCheckGuard(authData?.data?.companyId?.subscriptionId);
    if (!subscriptionCheckData?.success) {
      return resError(subscriptionCheckData?.message);
    }

    const { assetId, title, desc, quantity, totalAmount, date } = await req.json();

    let asset = await Asset.findById(assetId);
    if (!asset) {
      return resError(`Asset was not found against id: `, assetId);
    }

    asset.title = title || asset.title;
    asset.desc = desc || asset.desc;
    asset.quantity = quantity || asset.quantity;
    asset.totalAmount = totalAmount || asset.totalAmount;
    asset.date = date || asset.date;

    await asset.save();

    return NextResponse.json(
      {
        success: true,
        message:
          
          "Company asset has been updated successfully.",
        data: asset,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 35.
export async function DELETE(req) {
  try {
    await connectDB();
    const authData = await userFinanceGuard(req);
    if (!authData?.success) {
      return resError(
        authData?.message
      );
    }

    const subscriptionCheckData = await subscriptionCheckGuard(authData?.data?.companyId?.subscriptionId);
    if (!subscriptionCheckData?.success) {
      return resError(subscriptionCheckData?.message);
    }

    const { assetId } = await req.json();

    let asset = await Asset.findByIdAndDelete(assetId);
    if (!asset) {
      return resError(`Asset was not found against id: `+ assetId);
    }

    return NextResponse.json({
      success: true,
      message:
        "Asset has been deleted.",
    });
  } catch (error) {
    return resError(error?.message);
  }
}
