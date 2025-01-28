import connectDB from "@/lib/db";
import { userAuthGuard } from "@/middleware/user";
import Notification from "@/models/notification";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 30.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userAuthGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    let query;

    if (type === "all") {
      query = { sentTo: authData?.data?._id };
    } else if (type === "new") {
      query = { sentTo: authData?.data?._id, isViewed: false };
    } else if (type === "read") {
      query = { sentTo: authData?.data?._id, isViewed: true };
    }

    let notifications = await Notification.find(query);
    if (notifications.length === 0) {
      return resError("No notification was found.");
    }

    return NextResponse.json(
      {
        success: true,
        message: "List of all notification are: ",
        data: notifications,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 31.
export async function PUT(req) {
  try {
    await connectDB();
    const authData = await userAuthGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");

    if (!_id) {
      return resError("Notification ID is missing.");
    }

    let notification = await Notification.findById(_id);
    if (!notification) {
      return resError("Notification was not found against id: " + _id);
    }

    notification.isViewed = true;
    await notification.save();

    return NextResponse.json(
      {
        success: true,
        message: "Notification status has been updated.",
        data: notification,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
