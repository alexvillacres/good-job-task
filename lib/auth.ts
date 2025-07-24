import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import verificationEmail from "@/components/emails/verification-email";
import passwordResetEmail from "@/components/emails/reset-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({ user, url }) => {
            await resend.emails.send({
                from: 'Good Job Agency <onboarding@resend.dev>',
                to: user.email,
                subject: "Reset your password",
                react: passwordResetEmail({ userEmail: user.email, resetUrl: url, requestTime: new Date().toLocaleString() }),
            });
          },
          onPasswordReset: async ({ user }) => {
            console.log(`Password for user ${user.email} has been reset.`);
          },
    },
    emailVerification: {
		sendVerificationEmail: async ({ user, url, token }) => {
			const { data, error } = await resend.emails.send({
                from: 'Good Job Agency <onboarding@resend.dev>',
                to: [user.email],
                subject: 'Hello world',
                react: verificationEmail({ userEmail: user.email, verificationUrl: url }),
              });
		},
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		expiresIn: 3600 // 1 hour
	},
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    plugins: [nextCookies()]
});