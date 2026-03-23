require("dotenv").config();

const express = require("express");
const cors = require("cors");
const apiRoutes = require("./src/routes");
const { connectDb } = require("./src/config/db");

const app = express();

app.use(express.json({ limit: "1mb" }));

const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins,
  })
);

app.use("/api", apiRoutes);

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

// If MongoDB is down/misconfigured, the API can still serve /api/ask-ai.
connectDb().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[db] initial connect failed:", err?.message || err);
});
