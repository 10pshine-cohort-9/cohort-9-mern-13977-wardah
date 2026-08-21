import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.routes.js";
import authRouter from "./routes/auth.routes.js";
import noteRouter from "./routes/note.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., Postman, curl, or mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy: Origin not allowed"), false);
    },
    credentials: true,
  }),
);
app.use(express.json()); // the middleware that helps parse incoming json requests
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/notes", noteRouter);
app.use(errorMiddleware);
export default app;
