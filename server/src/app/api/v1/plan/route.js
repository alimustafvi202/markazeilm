import connectDB from "@/lib/db";
import { userSuperAdminGuard } from "@/middleware/user";
import Plan from "@/models/plan";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 8.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userSuperAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const data = await Plan.find();

    if (data.length == 0) {
      return resError(`No plan was found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 9.
export async function POST(req) {
  try {
    await connectDB();
    const authData = await userSuperAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const {
      type,
      name,
      screens,
      pricePerMonth,
      pricePerScreen,
      oldPricePerMonth,
      tagline,
      includes,
    } = await req.json();

    if (
      !type ||
      !name ||
      !screens ||
      !pricePerMonth ||
      !pricePerScreen ||
      !oldPricePerMonth
    ) {
      console.log("One or more fields are missing or empty.");
    }

    const plan = await Plan.create({
      type,
      name,
      screens,
      pricePerMonth,
      pricePerScreen,
      oldPricePerMonth,
      tagline,
      includes,
    });

    return NextResponse.json(
      {
        success: true,
        message: "New Plan has been created.",
        data: plan,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 10.
export async function PUT(req) {
  try {
    await connectDB();
    const {
      planId,
      type,
      name,
      screens,
      pricePerMonth,
      pricePerScreen,
      oldPricePerMonth,
      tagline,
      includes,
    } = await req.json();
    const authData = await userSuperAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    let plan = await Plan.findById(planId);
    if (!plan) {
      return resError("Plan was not found.");
    }

    plan.includes = includes;
    plan.type = type || plan.type;
    plan.tagline = tagline || plan.tagline;
    plan.name = name || plan.name;
    plan.screens = screens || plan.screens;
    plan.pricePerMonth = pricePerMonth || plan.pricePerMonth;
    plan.pricePerScreen = pricePerScreen || plan.pricePerScreen;
    plan.oldPricePerMonth = oldPricePerMonth || plan.oldPricePerMonth;

    await plan.save();

    return NextResponse.json(
      {
        success: true,
        data: plan,
        message: "Plan has been updated.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 11.
export async function DELETE(req) {
  try {
    await connectDB();
    const { planId } = await req.json();
    const authData = await userSuperAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const plan = await Plan.findByIdAndDelete(planId);
    if (!plan) {
      return resError("Plan was not found.");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Plan has been deleted.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
