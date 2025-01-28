import connectDB from "@/lib/db";
import { subscriptionCheckGuard, userSalesGuard } from "@/middleware/user";
import Client from "@/models/client";
import PersonalInfo from "@/models/personalinfo";
import resError from "@/utils/resError";
import { NextResponse } from "next/server";

//
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

    const { clients } = await req.json();

    async function processClients(clients) {
      // Validate clients asynchronously using Promise.all and map
      await Promise.all(
        clients.map(async (client, index) => {
          const { email, firstName, joinDate } = client;

          if (!email || !joinDate || !firstName) {
            const missingFields = [];
            if (!email) missingFields.push("email");
            if (!joinDate) missingFields.push("joinDate");
            if (!firstName) missingFields.push("firstName");

            throw new Error(
              `The following required field(s) are missing from row #${
                index + 1
              }: ${missingFields.join(", ")}.`
            );
          }
        })
      );

      // Process clients asynchronously using Promise.all and map
      await Promise.all(
        clients.map(async (client) => {
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
          } = client;

          let createdClient = await Client.create({
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

          createdClient.personalInfo = personalInfo._id;
          await createdClient.save();
        })
      );
    }
    try {
      await processClients(clients);
      console.log("All clients processed successfully.");
    } catch (error) {
      return resError(error.message);
    }
    return NextResponse.json(
      {
        success: true,
        message: "Clients has been imported successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
