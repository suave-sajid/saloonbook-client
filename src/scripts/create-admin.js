
import { auth, client, db } from "../lib/auth.js";

const name = process.env.ADMIN_NAME;
const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
const password = process.env.ADMIN_PASSWORD;

async function createAdmin() {
  try {
    if (!name || !email || !password || !process.env.MONGODB_URI || !process.env.DB_NAME) {
      throw new Error("Admin and MongoDB environment variables are required.");
    }

    if (password.length < 12) {
      throw new Error("Admin password must be at least 12 characters.");
    }

    await client.connect();

    const users = db.collection("user");

    // Prevent duplicate Admin account creation.
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      throw new Error(
        "An account with this email already exists. No changes were made."
      );
    }

    // Create the account through Better Auth.
    // Better Auth handles password hashing.
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    // Assign Admin role directly from the trusted server script.
    const updateResult = await users.updateOne(
      { email },
      {
        $set: {
          role: "admin",
          isBlocked: false,
        },
      }
    );

    if (updateResult.matchedCount !== 1) {
      throw new Error("Admin role assignment failed.");
    }

    console.log("Admin account created successfully!");
    console.log("Admin email:", result.user.email);
    console.log("Role: admin");
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

createAdmin();
