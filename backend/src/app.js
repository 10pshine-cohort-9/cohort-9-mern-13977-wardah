import express from "express";
import healthRouter from "./routes/health.routes.js";

const app = express();
app.use(express.json()); // the middleware that helps parse incoming json requests
app.use("/api/health", healthRouter);

export default app;
