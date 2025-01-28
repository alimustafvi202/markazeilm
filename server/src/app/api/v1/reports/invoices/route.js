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
    let listAll;
    if (!fromDate && !toDate) {
      listAll = "all";
    }

    let adjustedToDate = new Date(toDate); // Parse toDate
    adjustedToDate.setDate(adjustedToDate.getDate() + 1); // Add one day

    const invoices = await Invoice.aggregate([
      // Step 1: Match companyId and optionally filter by date range
      {
        $match: {
          companyId: authData?.data?.companyId?._id,
          ...(listAll !== "all" && fromDate && toDate
            ? {
                issueDate: {
                  $gte: new Date(fromDate),
                  $lte: adjustedToDate,
                },
              }
            : {}),
        },
      },
      // Step 2: Add fields for overdue and current invoices
      {
        $addFields: {
          isOverdue: {
            $cond: {
              if: {
                $and: [
                  { $eq: ["$status", "pending"] },
                  { $lt: ["$dueDate", new Date()] },
                ],
              },
              then: true,
              else: false,
            },
          },
          isCurrent: {
            $cond: {
              if: {
                $and: [
                  { $eq: ["$status", "pending"] },
                  { $gte: ["$dueDate", new Date()] },
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      // Step 3: Group and calculate totals
      {
        $group: {
          _id: null, // Aggregate to a single object
          totalInvoices: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
          currentInvoices: {
            $sum: {
              $cond: [{ $eq: ["$isCurrent", true] }, 1, 0],
            },
          },
          currentAmount: {
            $sum: {
              $cond: [{ $eq: ["$isCurrent", true] }, "$totalAmount", 0],
            },
          },
          overDueInvoices: {
            $sum: {
              $cond: [{ $eq: ["$isOverdue", true] }, 1, 0],
            },
          },
          overDueAmount: {
            $sum: {
              $cond: [{ $eq: ["$isOverdue", true] }, "$totalAmount", 0],
            },
          },
          paidInvoices: {
            $sum: {
              $cond: [{ $eq: ["$status", "paid"] }, 1, 0],
            },
          },
          paidAmount: {
            $sum: {
              $cond: [{ $eq: ["$status", "paid"] }, "$totalAmount", 0],
            },
          },
        },
      },
      // Step 4: Add fromDate and toDate to the result
      {
        $addFields: {
          from: listAll !== "all" ? new Date(fromDate) : null,
          to: listAll !== "all" ? adjustedToDate : null,
        },
      },
      // Step 5: Project the final result
      {
        $project: {
          _id: 0, // Exclude MongoDB's default ID field
          totalInvoices: 1,
          totalAmount: 1,
          currentInvoices: 1,
          currentAmount: 1,
          overDueInvoices: 1,
          overDueAmount: 1,
          paidInvoices: 1,
          paidAmount: 1,
          from: 1,
          to: 1,
        },
      },
    ]);
    console.log(invoices);
    return NextResponse.json({ success: true, data: invoices[0] });
  } catch (error) {
    return resError(error?.message);
  }
}
