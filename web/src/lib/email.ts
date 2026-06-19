import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendOTPEmail(
  email: string,
  otp: string,
  type: "sign-in" | "email-verification" | "forget-password" | "change-email",
) {
  const subject =
    type === "sign-in"
      ? "Your sign-in code"
      : type === "email-verification"
        ? "Verify your email"
        : type === "forget-password"
          ? "Reset your password"
          : "Confirm your new email";

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    text: `Your verification code is: ${otp}. It expires in 5 minutes.`,
    html: `<p>Your verification code is: <strong>${otp}</strong></p><p>It expires in 5 minutes.</p>`,
  });
}
