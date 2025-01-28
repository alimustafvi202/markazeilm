import connectDB from "@/lib/db";
import { userAdminGuard, userSuperAdminGuard } from "@/middleware/user";
import Plan from "@/models/plan";
import User from "@/models/user";
import User_Subscription from "@/models/user_subscription";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 13.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userSuperAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }
    const data = await User_Subscription.find()
      .populate("planId")
      .populate({
        path: "userId",
        select: "-password",
        populate: {
          path: "personalInfo",
        },
      });

    if (data.length == 0) {
      return resError(`No plan was found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 12.
export async function POST(req) {
  try {
    await connectDB();
    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const {
      planId,
      startDate,
      endDate,
      noOfMonths,
      transactionId,
      totalScreens,
      totalFee,
    } = await req.json();

    if (!planId || !startDate || !endDate || !noOfMonths || !transactionId || !totalFee || !totalScreens) {
      console.log("One or more fields are missing or empty.");
    }

    const plan = await Plan.findById(planId);
    if(!plan){
      return resError("No plan was found against this id: ", planId);
    }

    let user = await User.findById(authData?.data?._id);

    const user_subscription = await User_Subscription.create({
      userId: user?._id,
      planId,
      noOfMonths,
      totalFee,
      startDate,
      endDate,
      screens: totalScreens,
      status: "active",
      planTrack: [
        {
          planId,
          startDate,
          endDate,
          totalFee,
          transactionId,
          noOfMonths,
          screens: totalScreens,
        },
      ],
    });

    user.subscriptionId = user_subscription?._id;
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "User subscription successfully has been created.",
        data: user_subscription,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 14.
export async function PUT(req) {
  try {
    await connectDB();
    const authData1 = await userAdminGuard(req);
    const authData2 = await userSuperAdminGuard(req);
    if (!authData1?.success && !authData2?.success) {
      return resError(
        authData1?.success ? authData2?.message : authData1?.message
      );
    }
    
    const {
      planId, // if plan id does not matches with existing plan id means that user upgraded or downgraded the plan.
      subscriptionId,
      startDate,
      endDate, // 
      noOfMonths,
      transactionId,
      totalScreens,
      totalFee,
    } = await req.json();

    if (!planId || !subscriptionId || !startDate || !endDate || !noOfMonths || !transactionId || !totalFee || !totalScreens) {
      console.log("One or more fields are missing or empty.");
    }


    const plan = await Plan.findById(planId);
    if(!plan){
      return resError("No plan was found against this id: ", planId);
    }

    const subscription = await User_Subscription.findById(subscriptionId);
    if(!subscription){
      return resError("No subscription was found against this id: ", subscriptionId);
    }

    subscription.noOfMonths = noOfMonths || subscription.noOfMonths;
    subscription.startDate = startDate || subscription.startDate;
    subscription.endDate = endDate || subscription.endDate;
    subscription.totalFee = totalFee || subscription.totalFee;
    subscription.screens = totalScreens || subscription.screens;
    subscription.status = "active",
    subscription.planTrack = [...subscription.planTrack,
      {
        planId,
        startDate,
        endDate,
        totalFee,
        transactionId,
        noOfMonths,
        screens: totalScreens,
      }
    ]

    if(planId !== subscription?.planId){
      // plan upgraded or downgraded      
      subscription.planId = planId || subscription.planId;
    }
    await subscription.save();
    

    return NextResponse.json(
      {
        success: true,
        message: "User subscription successfully has been updated.",
        data: subscription,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 15.
export async function DELETE(req) {
  try {
    await connectDB();
    const { _id } = await req.json();

    const authData1 = await userAdminGuard(req);
    const authData2 = await userSuperAdminGuard(req);
    if (!authData1?.success && !authData2?.success) {
      return resError(
        authData1?.success ? authData2?.message : authData1?.message
      );
    }

    const subscription = await User_Subscription.findByIdAndDelete(_id);
    if (!subscription) {
      return resError("Subscription was not found.");
    }
    let user = await User.findById(subscription?.userId);
    if (!user) {
      return resError("User was not found.");
    }
    user.subscriptionId = "";
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Subscription has been deleted.",
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
