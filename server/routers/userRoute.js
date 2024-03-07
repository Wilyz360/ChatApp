const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("all users");
});

router.get("/:id", (req, res) => {
  res.send("id user");
});

module.exports = router;
