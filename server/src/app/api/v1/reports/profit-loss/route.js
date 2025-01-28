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

    let adjustedToDate = new Date(toDate); // Parse toDate
    adjustedToDate.setDate(adjustedToDate.getDate() + 1); // Add one day

    let dateQuery = {
      date: { $gte: new Date(fromDate), $lte: adjustedToDate },
    };

    const incomes = await Income.find({
      companyId: authData?.data?.companyId?._id,
      status: "paid",
      ...dateQuery,
    }).select(["type", "totalAmount"]);

    const expenses = await Expense.find({
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

    // Calculate total values
    const totalIncomesGrouped = calculateTotals(incomes);
    const totalExpensesGrouped = calculateTotals(expenses);

    // Convert grouped results to arrays
    const totalIncomesArray = Object.values(totalIncomesGrouped);
    const totalExpensesArray = Object.values(totalExpensesGrouped);

    // Compute total income and expenses
    const totalIncome = totalIncomesArray.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    const totalExpenses = totalExpensesArray.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    // Calculate net profit or loss
    const net = totalIncome - totalExpenses;

    // Result object
    const profitAndLossStatement = {
      from: fromDate,
      to: toDate,
      incomes: totalIncomesArray,
      expenses: totalExpensesArray,
      totalIncome: totalIncome.toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      net: net.toFixed(2),
    };

    return NextResponse.json(
      { success: true, data: profitAndLossStatement },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
