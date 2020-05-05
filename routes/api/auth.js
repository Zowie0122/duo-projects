const express = require("express");
const router = express.Router();

// api/auth
// public access
router.get("/", (req, res) => {
  res.send("Auths route");
});

module.exports = router;
