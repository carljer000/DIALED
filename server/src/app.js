import cors from "cors";
import express from "express";
import checkinsRouter from "./routes/checkins.routes.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "32kb" }));
app.get("/api/health", (_request, response) => response.json({ status: "ok" }));
app.use("/api/checkins", checkinsRouter);
app.use("/api", (_request, response) => {
  response.status(404).json({ error: "API endpoint not found." });
});
app.use((error, _request, response, _next) => {
  console.error(error);
  const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 600
    ? error.status
    : 500;
  const message = error.type === "entity.parse.failed"
    ? "Request body must contain valid JSON."
    : status >= 500 && process.env.NODE_ENV === "production"
      ? "Something went wrong."
      : error.message || "Something went wrong.";
  response.status(status).json({ error: message });
});

export default app;
