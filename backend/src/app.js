import express from "express";
import healthRouter from "./routes/health.routes.js";
import authRouter from "./routes/auth.routes.js";
import noteRouter from "./routes/note.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();
app.use(express.json()); // the middleware that helps parse incoming json requests
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/notes", noteRouter);
app.use(errorMiddleware);
export default app;
