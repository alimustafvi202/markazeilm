import resError from "@/utils/resError";
import { sendMail } from "@/utils/sendMail";
import { NextResponse } from "next/server";
//
export async function POST(req) {
  try {
    const { firstName, lastName, email, message, phone } = await req.json();

    if (!email || !message || !firstName) {
      const missingFields = [];
      if (!email) missingFields.push("email");
      if (!message) missingFields.push("message");
      if (!firstName) missingFields.push("firstName");

      return resError(
        `The following required field(s) are missing: ${missingFields.join(
          ", "
        )}.`
      );
    }

    const body = `
    <br><b>Dear Admin,</b>
    <br>${message}
    <br>
    <br>Regards,
    <br>${firstName} ${lastName}
    <br>Email: ${email}`;

    await sendMail(
      process.env.CONTACT_EMAIL,
      `Hey! ${firstName} sent a message`,
      body
    );

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}

