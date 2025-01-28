import connectDB from "@/lib/db";
import Plan from "@/models/plan";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

//
export async function GET(req) {
  try {
    await connectDB();
    let data;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      data = await Plan.find({ type: { $ne: "custom" } });

      if (data.length == 0) {
        return resError(`No plan was found.`);
      }
    } else {
      data = await Plan.findById(id);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}
