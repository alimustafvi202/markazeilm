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
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const overDue = searchParams.get("overDue");
    
    if (!fromDate || !toDate) {
      return resError("The 'fromDate' and 'toDate' are required.");
    }

    if (new Date(fromDate) > new Date(toDate)) {
      return resError("The 'fromDate' cannot be greater than 'toDate'.");
    }
    let adjustedToDate = new Date(toDate); // Parse toDate
    adjustedToDate.setDate(adjustedToDate.getDate() + 1); // Add one day

    let dateQuery = {
      createdAt: { $gte: new Date(fromDate), $lte: adjustedToDate }, // Use the adjusted date
    };
    if (overDue !== "null") {
      let overDueDate = new Date(toDate); // Parse toDate
      overDueDate.setDate(overDueDate.getDate() + 1);
      dateQuery = {
        ...dateQuery,
        dueDate: { $lt: overDueDate },
      };
    }


    const invoices = await Invoice.aggregate([
      {
        $match: {
          companyId: authData?.data?.companyId?._id,
          status: "pending",
          ...dateQuery,
        }, // Match by companyId
      },
      {
        $lookup: {
          from: "clients", // The collection where client data is stored
          localField: "clientId",
          foreignField: "_id",
          as: "clientData", // Field to store the matched client document
        },
      },
      {
        $unwind: { path: "$clientData", preserveNullAndEmptyArrays: true }, // Flatten clientData
      },
      {
        $lookup: {
          from: "personalinfos", // The collection where personalInfo data is stored
          localField: "clientData.personalInfo",
          foreignField: "_id",
          as: "personalInfo", // Field to store matched personalInfo document
        },
      },
      {
        $unwind: { path: "$personalInfo", preserveNullAndEmptyArrays: true }, // Flatten personalInfo
      },
      {
        $project: {
          _id: 1,
          invoiceNo: 1,
          totalAmount: 1,
          email: "$clientData.email", // Move email to root
          firstName: "$personalInfo.firstName", // Move firstName to root
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
      from: fromDate,
      to: toDate,
      invoices,
      totalAmount: total.toFixed(2),
    };

    return NextResponse.json({ success: true, data: invoicesData });
  } catch (error) {
    return resError(error?.message);
  }
}
