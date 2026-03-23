const express = require("express");

const aiRoutes = require("./aiRoutes");
const runRoutes = require("./runRoutes");

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});

router.use(aiRoutes);
router.use(runRoutes);

module.exports = router;

