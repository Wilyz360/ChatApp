const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, (req, res) => {
  return res.status(200).json({ accepted: true, message: "User Authorized" });
});

module.exports = router;
