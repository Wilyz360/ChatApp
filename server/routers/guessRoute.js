const express = require("express");
const router = express.Router();

// A simple guess route for demonstration
router.get("/", (req, res) => {
  res.status(200).send("Guess route is working!");
});

module.exports = router;
