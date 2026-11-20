import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

export const client = new MongoClient(process.env.MONGODB_URI);
export const db = client.db(process.env.DB_NAME);

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },
    user: {
        additionalFields: {
            role: {
                type: ["customer", "admin"],
                required: false,
                defaultValue: "customer",
                input: false,
            },
            isBlocked: {
                type: "boolean",
                required: false,
                defaultValue: false,
                input: false,
            },
        },
    },
    plugins: [
        jwt({
            jwt: {
                definePayload: ({ user }) => ({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                }),
            },
        }),
    ],
    socialProviders: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            },
        }
        : {},
});