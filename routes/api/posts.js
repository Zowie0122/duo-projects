const express = require("express");
const router = express.Router();

// api/post
// public access
router.get("/", (req, res) => {
  res.send("Post route");
});

module.exports = router;
