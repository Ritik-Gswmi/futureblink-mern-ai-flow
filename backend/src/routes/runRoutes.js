const express = require("express");
const { createRun, listRuns } = require("../controllers/runController");

const router = express.Router();

router.post("/runs", createRun);
router.get("/runs", listRuns);

module.exports = router;

