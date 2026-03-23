const express = require("express");
const { askAi } = require("../controllers/aiController");

const router = express.Router();

router.post("/ask-ai", askAi);

module.exports = router;

