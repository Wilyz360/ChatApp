const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  console.log(token);

  res
    .status(200)
    .json({ accepted: true, message: "User successfully logged out" });
});

module.exports = router;
