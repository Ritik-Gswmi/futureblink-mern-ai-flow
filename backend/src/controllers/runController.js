const Run = require("../models/Run");
const { connectDb } = require("../config/db");

async function createRun(req, res) {
  try {
    const prompt = (req.body?.prompt || "").toString().trim();
    const answer = (req.body?.answer || "").toString();
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });
    if (!answer) return res.status(400).json({ error: "Missing answer" });

    await connectDb();
    const run = await Run.create({ prompt, answer });
    res.status(201).json({ run });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Failed to save run" });
  }
}

async function listRuns(_req, res) {
  try {
    await connectDb();
    const runs = await Run.find().sort({ createdAt: -1 }).limit(50).lean();
    res.json({ runs });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Failed to load runs" });
  }
}

module.exports = { createRun, listRuns };

