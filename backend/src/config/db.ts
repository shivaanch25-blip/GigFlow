import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI as string;
  console.log("Connecting to MongoDB...");

  try {
    // If Atlas TLS is causing issues you can temporarily enable
    // `tlsAllowInvalidCertificates: true` for debugging only.
    // Remove insecure flags for production.
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      // Secure defaults; uncomment the tls options below only for debugging:
      // tls: true,
      // tlsAllowInvalidCertificates: true, // DEBUG ONLY
    });

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.log("❌ DB Error", err);
    console.log(
      "Hints: verify `MONGO_URI` in .env, ensure your IP is whitelisted in Atlas (or use 0.0.0.0/0 for testing), and confirm TLS settings/driver compatibility."
    );
    process.exit(1);
  }
};