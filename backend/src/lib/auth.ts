import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {db} from "../db/index.js"; // your drizzle instance
import * as schema from '../db/schema/index.js'
import { sendPasswordResetEmail, sendVerificationEmail } from "./email.js";


export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BASE_URL!,
    trustedOrigins: [process.env.FRONTEND_URL!],
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema
    }),
    advanced: {
  ipAddress: {
    ipAddressHeaders: ["x-real-ip"],
  },
},
    emailAndPassword:{
        enabled: true,
        requireEmailVerification: true,
        onExistingUserSignUp: async ({ user }) => {
    // Send a separate account guidance email using EmailJS.
    // Do not send a verification link here unless you explicitly
    // implement and test that flow.
  },
        sendResetPassword: async ({ user, url, token }) => {
			await sendPasswordResetEmail({
                to: user.email,
                userName: user.name || "there",
                link: url
            })
		},
    },
    emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async({user, url})=>{
            await sendVerificationEmail({
                to: user.email,
                userName: user.name || "there",
                link: url
            })
        },
    },
    user: {
        additionalFields: {
            role: {
                type: 'string', required: true, defaultValue: "user", input: true
            },
            imageCldPubId: {
                type: 'string', required: false, input: true
            }
        }
    }
});