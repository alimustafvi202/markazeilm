import { sendMail } from "./sendMail";

function generateOTP() {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function sendOTPCode(email) {
  try {
    const otp = generateOTP();
    const message = `
        <br>Your OTP code is: <b>${otp}</b>.
        <br>Use this code to verify your identity.
        <br>Regards,
        <br><b>Nigotis</b>`;

   await sendMail(
      email,
      "Email Verification Code | Nigotis",
      message
    );

    return otp;
  } catch (error) {
    console.error(error);
  }
}

export function sendCredentialsToUser(
  email,
  password,
  role,
  name,
  companyName
) {
  try {
    const message = `
        <br>Dear ${name},
        <br>You have been assigned the role of ${role} in ${companyName}.
        <br>Use following credentials to have access to the dashboard.
        <br>Email: <b>${email}</b>
        <br>Password: <b>${password}</b>
        <br><a href="${process.env.FRONTEND_URL}/auth/signin">Dashboard</a>
        <br>Regards,
        <br><b>${companyName}</b>`;

    sendMail(
      email,
      `Your have been assigned the role of ${role} in ${companyName}. | Nigotis`,
      message
    );
  } catch (error) {
    console.error(error);
  }
}
