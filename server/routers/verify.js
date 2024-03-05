const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth.authenticateToken, (req, res) => {
  return res
    .status(200)
    .json({ accepted: "accepted", message: "User Authorized" });
});

module.exports = router;
