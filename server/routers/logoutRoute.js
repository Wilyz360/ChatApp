const express = require("express");
const router = express.Router();

// Example of an in-memory blacklist to store invalidated tokens
const blackListTokens = new Set();

router.post("/", (req, res) => {
  // Useing JWT tokens
  const token = req.headers.cookie;
  console.log(token);

  if (token) {
    // Add token to the blacklist
    blackListTokens.add(token);
    res.status(200).json({ accepted: true, message: "Logout successful" });
  } else {
    res.status(400).json({ error: "No token provided" });
  }
});

module.exports = router;
