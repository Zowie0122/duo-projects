const express = require("express");
const router = express.Router();

// api/users
// public access
router.get("/", (req, res) => {
  res.send("Users route");
});

module.exports = router;
