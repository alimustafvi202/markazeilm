import connectDB from "@/lib/db";
import {
  subscriptionCheckGuard,
  userAdminGuard,
  userAuthGuard,
  userSuperAdminGuard, 
} from "@/middleware/user";
import Company from "@/models/company";
import User from "@/models/user";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

// 19.
export async function GET(req) {
  try {
    await connectDB();
    const authData = await userSuperAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const data = await Company.find()
      .populate({
        path: "subscriptionId",
        populate: {
          path: "planId",
        },
      })
      .populate({
        path: "adminId",
        select: "-password",
        populate: {
          path: "personalInfo",
        },
      });

    if (data.length == 0) {
      return resError(`No companies was found.`);
    }
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return resError(error?.message);
  }
}

// 17.
export async function POST(req) {
  try {
    await connectDB();
    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const subscriptionCheckData = await subscriptionCheckGuard(
      authData?.data?.subscriptionId
    );
    if (!subscriptionCheckData?.success) {
      return resError(subscriptionCheckData?.message);
    }

    const {
      displayName,
      legalName,
      type,
      ein,
      ssn,
      logo,
      address,
      phone,
      email,
      currencyCode
    } = await req.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return resError("Invalid email format.");
    }

    if (!displayName || !legalName || !currencyCode) {
      return resError("Display, legal name nd Currency Code are required.");
    }

    let company = await Company.findOne({ email });
    if (company) {
      return resError("Email already registerd with other company.");
    }

    company = await Company.create({
      displayName,
      legalName,
      type,
      ein,
      ssn,
      logo,
      address,
      phone,
      email,
      currencyCode,
      subscriptionId: authData?.data?.subscriptionId,
      adminId: authData?.data?._id,
    });

    let user = await User.findById(authData?.data?._id);
    user.companyId = company?._id;
    await user.save();

    const updatedCompany = await Company.findById(company?._id)
      .populate({
        path: "subscriptionId",
        populate: {
          path: "planId",
        },
      })
      .populate({
        path: "adminId",
        select: "-password",
        populate: {
          path: "personalInfo",
        },
      });

    return NextResponse.json(
      {
        success: true,
        message: "Company has been created successfully.",
        data: updatedCompany,
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 18.
export async function PUT(req) {
  try {
    await connectDB();
    const authData = await userAdminGuard(req);
    if (!authData?.success) {
      return resError(authData?.message);
    }

    const subscriptionCheckData = await subscriptionCheckGuard(
      authData?.data?.companyId?.subscriptionId
    );
    if (!subscriptionCheckData?.success) {
      return resError(subscriptionCheckData?.message);
    }
    console.log(subscriptionCheckData);

    const {
      displayName,
      legalName,
      type,
      ein,
      ssn,
      logo,
      address,
      phone,
      email,
      currencyCode,
    } = await req.json();

    let company = await Company.findById(authData?.data?.companyId?._id);
    if (!company) {
      return resError(
        `Company was not found against id: `,
        authData?.data?.companyId?._id
      );
    }

    company.displayName = displayName || company.displayName;
    company.legalName = legalName || company.legalName;
    company.type = type || company.type;
    company.ein = ein || company.ein;
    company.ssn = ssn || company.ssn;
    company.logo = logo;
    company.address = address || company.address;
    company.phone = phone || company.phone;
    company.email = email || company.email;
    company.currencyCode = currencyCode || company.currencyCode;

    await company.save();

    const updatedCompany = await Company.findById(company?._id)
      .populate({
        path: "subscriptionId",
        populate: {
          path: "planId",
        },
      })
      .populate({
        path: "adminId",
        select: "-password",
        populate: {
          path: "personalInfo",
        },
      });

    return NextResponse.json(
      {
        success: true,
        message:
          
          " Company has been updated successfully.",
        data: updatedCompany,
      },
      { status: 200 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

// 20.
export async function DELETE(req) {
  try {
    await connectDB();
    const authData1 = await userAdminGuard(req);
    const authData2 = await userSuperAdminGuard(req);
    if (!authData1?.success && !authData2?.success) {
      return resError(
        authData1?.success ? authData2?.message : authData1?.message
      );
    }

    const { companyId } = await req.json();

    let company = await Company.findById(companyId);
    if (!company) {
      return resError(`Company was not found against id: `, companyId);
    }

    // after finding copany we hace to delete it and it's all relative data, will implement this api later.

    return NextResponse.json({
      success: true,
      message:
        "after finding company we hace to delete it and it's all relative data, will implement this api later.",
    });
  } catch (error) {
    return resError(error?.message);
  }
}
