import connectDB from "@/lib/db";
import {
  subscriptionCheckGuard,
  userAdminGuard,
  userFinanceGuard,
} from "@/middleware/user";
import Expense from "@/models/expense";
import Income from "@/models/income";
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
    if (!fromDate || !toDate) {
      return resError("The 'fromDate' and 'toDate' are required.");
    }

    if (new Date(fromDate) > new Date(toDate)) {
      return resError("The 'fromDate' cannot be greater than 'toDate'.");
    }

    let dateQuery = {
      date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
    };

    const income = await Income.find({
      companyId: authData?.data?.companyId?._id,
      status: "paid",
      ...dateQuery,
    }).select(["type", "totalAmount"]);

    // Function to group and calculate totals
    function calculateTotals(data) {
      return data.reduce((acc, item) => {
        if (!acc[item.type]) {
          acc[item.type] = { type: item.type, amount: 0 };
        }
        acc[item.type].amount += item.totalAmount;
        return acc;
      }, {});
    }

    const totalGrouped = calculateTotals(income);

    // Convert grouped results to arrays
    const totalArray = Object.values(totalGrouped);

    const totalIncome = totalArray.reduce((sum, item) => sum + item.amount, 0);

    let chartData = {
      labels: ["Services", "Others"],
      datasets: [
        {
          data: [
            // Get percentage for each expense type
            ((totalArray.find((e) => e.type === "invoice")?.amount || 0) /
              totalIncome) *
              100,
            ((totalArray.find((e) => e.type === "others")?.amount || 0) /
              totalIncome) *
              100,
          ],
          backgroundColor: ["rgb(0, 51, 102)", "rgb(0, 128, 128)", ],
          borderWidth: 0,
        },
      ],
    };

    // Convert percentages to fixed decimal (optional)
    chartData.datasets[0].data = chartData.datasets[0].data.map((percentage) =>
      parseFloat(percentage.toFixed(2))
    );

    // Result object
    const incomeData = {
      from: fromDate,
      to: toDate,
      allIncome: income,
      income: totalArray,
      totalIncome: totalIncome.toFixed(2),
      chartData,
    };

    return NextResponse.json(
      { success: true, data: incomeData },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
