import connectDB from "@/lib/db";
import { subscriptionCheckGuard, userSalesGuard } from "@/middleware/user";
import Client from "@/models/client";
import Invoice from "@/models/invoice";
import PersonalInfo from "@/models/personalinfo";
import Product from "@/models/gig";
import SaleProduct from "@/models/sale_gig";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 40.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userSalesGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const data = await Client.find({
      companyId: authData?.data?.companyId?._id,
    }).populate({
      path: "personalInfo",
    });
    if (data.length == 0) {
      return resError(`No client was found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 41.
export async function POST(req) {
  try {
    await connectDB();
    const authData = await userSalesGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const subscriptionCheckData = await subscriptionCheckGuard(
      authData?.data?.companyId?.subscriptionId
    );
    if (!subscriptionCheckData?.success) {
      return resError(subscriptionCheckData?.message);
    }

    const {
      email,
      about,
      title,
      firstName,
      middleName,
      lastName,
      address,
      phone,
      avatar,
      joinDate,
    } = await req.json();

    if (!email || !joinDate || !firstName) {
      const missingFields = [];
      if (!email) missingFields.push("email");
      if (!joinDate) missingFields.push("joinDate");
      if (!firstName) missingFields.push("firstName");

      return resError(
        `The following required field(s) are missing: ${missingFields.join(
          ", "
        )}.`
      );
    }

    let client = await Client.create({
      email,
      about,
      companyId: authData?.data?.companyId?._id,
    });

    const personalInfo = await PersonalInfo.create({
      title,
      firstName,
      middleName,
      lastName,
      address,
      phone,
      avatar,
      joinDate,
    });
    client = await Client.findById(client?._id);
    client.personalInfo = personalInfo?._id;
    await client.save();

    const updatedClient = await Client.findById(client?._id).populate({
      path: "personalInfo",
    });

    return NextResponse.json(
      {
        success: true,
        message: "New Client has been added successfully.",
        data: updatedClient,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 42.
export async function PUT(req) {
  try {
    await connectDB();
    const authData = await userSalesGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const subscriptionCheckData = await subscriptionCheckGuard(
      authData?.data?.companyId?.subscriptionId
    );
    if (!subscriptionCheckData?.success) {
      return resError(subscriptionCheckData?.message);
    }

    const { clientId, email, about } = await req.json();

    let client = await Client.findById(clientId);
    if (!client) {
      return resError(`Client was not found against id: ` + clientId);
    }

    client.email = email || client.email;
    client.about = about || client.about;

    await client.save();

    return NextResponse.json(
      {
        success: true,
        message: "Client has been updated successfully.",
        data: client,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 43.
export async function DELETE(req) {
  try {
    await connectDB();
    const authData = await userSalesGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const subscriptionCheckData = await subscriptionCheckGuard(
      authData?.data?.companyId?.subscriptionId
    );
    if (!subscriptionCheckData?.success) {
      return resError(subscriptionCheckData?.message);
    }

    const { clientId } = await req.json();
    let invoices = await Invoice.find({ clientId });
    if (invoices.length > 0) {
      return resError(
        "Client has " + invoices.length + " invoice(s). It cannot be removed."
      );
    }
    let client = await Client.findByIdAndDelete(clientId);
    if (!client) {
      return resError(`Client was not found against id: ${clientId}`);
    }

    await PersonalInfo.findByIdAndDelete(client.personalInfo);

    return NextResponse.json({
      success: true,
      message: "Client and its all data has been deleted.",
    });
  } catch (error) {
    return resError(error?.message);
  }
}
