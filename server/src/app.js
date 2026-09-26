import cors from "cors";
import express from "express";
import checkinsRouter from "./routes/checkins.routes.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.get("/api/health", (_request, response) => response.json({ status: "ok" }));
app.use("/api/checkins", checkinsRouter);
app.use((error, _request, response, _next) => {
  console.error(error);
  const message = process.env.NODE_ENV === "production" ? "Something went wrong." : error.message || "Something went wrong.";
  response.status(500).json({ error: message });
});

export default app;
