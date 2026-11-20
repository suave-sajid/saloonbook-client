import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME);

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
    //   socialProviders: { 
    //     github: { 
    //       clientId: process.env.GITHUB_CLIENT_ID, 
    //       clientSecret: process.env.GITHUB_CLIENT_SECRET, 
    //     }, 
    //   },
});