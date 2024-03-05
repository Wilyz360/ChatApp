const express = require("express");
const db = require("../database/db");
const router = express.Router();
const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();

router.post("/", async (req, res) => {
  if (!(req.body.email && req.body.password)) {
    console.log("Missing input fields");
    res.status(400).json({ accepted: false, message: "Missing input fields" });
  } else {
    const user = req.body;
    db.authUser(user).then((result) => {
      if (result) {
        // create a token {email} optional (can be id or anything) but must be an info that belong to the user and is needed for the generation of token
        const token = jwt.sign(
          { email: user.email },
          process.env.TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );
        console.log("User authorized");
        res
          .status(200)
          .cookie("token", token, { httpOnly: true })
          .json({ accepted: true, message: "User authorized" });
      } else {
        res.status(200).json({
          accepted: false,
          message: "User name or passaword are incorrect",
        });
      }
    });
  }
});

module.exports = router;
