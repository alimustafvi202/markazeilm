import resError from "@/utils/resError";
import { sendMail } from "@/utils/sendMail";
import { NextResponse } from "next/server";
//
export async function POST(req) {
  try {
    const { name, email, message, position, cv } = await req.json();

    if (!email || !message || !name) {
      const missingFields = [];
      if (!email) missingFields.push("email");
      if (!message) missingFields.push("message");
      if (!name) missingFields.push("name");

      return resError(
        `The following required field(s) are missing: ${missingFields.join(
          ", "
        )}.`
      );
    }

    const body = `
    <br><b>Dear Admin,</b>
    <br>${name} applied for ${position}
    <br>${message}
    <br>CV/Resume: <a href="${cv}" download="${cv}">Download CV/Resume</a>
    <br>
    <br>Regards,
    <br>${name}
    <br>Email: ${email}`;

    await sendMail(
      process.env.CONTACT_EMAIL,
      `Hey! ${name} applied for ${position}.`,
      body
    );

    return NextResponse.json(
      {
        success: true,
        message: "Application Received.",
      },
      { status: 201 }
    );
  } catch (error) {
    return resError(error?.message);
  }
}
