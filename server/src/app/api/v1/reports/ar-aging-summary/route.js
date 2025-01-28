import connectDB from "@/lib/db";
import { userFinanceGuard } from "@/middleware/user";
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
    
    const currentDate = new Date(date);
    const invoices = await Invoice.aggregate([
      {
        $match: {
          companyId: authData?.data?.companyId?._id,
          status: "pending",
        },
      },
      {
        $lookup: {
          from: "clients",
          localField: "clientId",
          foreignField: "_id",
          as: "clientData",
        },
      },
      {
        $unwind: { path: "$clientData", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "personalinfos",
          localField: "clientData.personalInfo",
          foreignField: "_id",
          as: "personalInfo",
        },
      },
      {
        $unwind: { path: "$personalInfo", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          daysPastDue: {
            $cond: [
              { $and: [{ $ifNull: ["$dueDate", false] }, { $gte: ["$dueDate", new Date("1970-01-01")] }] },
              {
                $ceil: {
                  $divide: [
                    { $subtract: [new Date(currentDate), "$dueDate"] },
                    1000 * 60 * 60 * 24, // Convert milliseconds to days
                  ],
                },
              },
              null,
            ],
          },
        },
      },
      {
        $match: {
          daysPastDue: { $ne: null }, // Exclude null values from grouping
        },
      },
      {
        $bucket: {
          groupBy: "$daysPastDue",
          boundaries: [0, 30, 60, 90, Infinity], // Use numeric boundaries only
          default: "Uncategorized",
          output: {
            invoices: {
              $push: {
                _id: "$_id",
                invoiceNo: "$invoiceNo",
                totalAmount: "$totalAmount",
                email: "$clientData.email",
                firstName: "$personalInfo.firstName",
                dueDate: "$dueDate",
                daysPastDue: "$daysPastDue",
              },
            },
            count: { $sum: 1 },
            totalAmount: { $sum: "$totalAmount" },
          },
        },
      },
      {
        $project: {
          category: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", Infinity] }, then: "Current" },
                { case: { $eq: ["$_id", 0] }, then: "1-30 days" },
                { case: { $eq: ["$_id", 30] }, then: "31-60 days" },
                { case: { $eq: ["$_id", 60] }, then: "61-90 days" },
                { case: { $eq: ["$_id", 90] }, then: "91+ days" },
              ],
              default: "Current",
            },
          },
          invoices: 1,
          count: 1,
          totalAmount: 1,
        },
      },
    ]);
    
    
    if (invoices.length == 0) {
      return resError(`No open invoice was found for this date range.`);
    }

    let total = 0.0;
    invoices.forEach((item) => {
      total += item.totalAmount;
    });

    const invoicesData = {
      date,
      invoices,
      netTotal: total.toFixed(2),
    };

    return NextResponse.json({ success: true, data: invoicesData });
  } catch (error) {
    return resError(error?.message);
  }
}
