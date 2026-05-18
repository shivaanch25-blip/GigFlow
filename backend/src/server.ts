import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { connectDB } from "./config/db";
import app from "./app";
import { User } from "./models/user.model";

dotenv.config();

const createDefaultAdmin = async () => {
  try {
    const email = "admin@gigflow.local";
    const existing = await User.findOne({ email });
    if (existing) return;

    const hashedPassword = await bcrypt.hash("Password123!", 10);
    await User.create({
      name: "Admin",
      email,
      password: hashedPassword
    });

    console.log("✅ Default admin user created:");
    console.log("   email: admin@gigflow.local");
    console.log("   password: Password123!");
  } catch (err) {
    console.error("❌ Failed to create default admin user", err);
  }
};

const startServer = async () => {
  await connectDB();
  await createDefaultAdmin();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();