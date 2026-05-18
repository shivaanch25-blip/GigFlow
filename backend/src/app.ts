import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import leadRoutes from "./routes/lead.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: corsOrigin,
    credentials: true
  })
);
app.use(express.json());

app.get("/api", (_req, res) => {
  res.json({
    success: true,
    message: "GigFlow API is running",
    routes: ["/api/auth/register", "/api/auth/login", "/api/leads"]
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ success: true, status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use(errorHandler);

export default app;