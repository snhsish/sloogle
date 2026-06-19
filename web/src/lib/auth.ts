import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { emailOTP } from "better-auth/plugins";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendOTPEmail } from "./email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      sendVerificationOTP: async ({ email, otp, type }) => {
        await sendOTPEmail(email, otp, type);
      },
    }),
  ],
});
