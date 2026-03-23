const mongoose = require("mongoose");

const runSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Run", runSchema);
