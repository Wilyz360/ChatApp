const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

router.post("/", async (req, res) => {
  console.log(req.body);

  // check if any input field is missing
  if (!(req.body.email && req.body.password)) {
    console.log("Missing input fields");
    return res
      .status(400)
      .json({ accepted: false, message: "Missing input fields" });
  } else {
    const { email, password } = req.body;

    try {
      // find user by email in the DB
      const user = await UserModel.findOne({ email: email });

      // if user exist
      if (user) {
        // compare user input password with DB user password
        const validity = await bcrypt.compare(password, user.password);

        if (!validity) {
          // if password doesn't match
          console.log('"Wrong Password"');
          res.status(400).json({ accepted: false, message: "Wrong Password" });
        } else {
          // Generate token
          const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWTKEY,
            { expiresIn: "1h" }
          );

          // exclude password
          const { password, ...otherDetails } = user._doc;

          console.log(user, "Login succesfully!");
          res.status(200).cookie("token", token, { httpOnly: true }).json({
            accepted: true,
            message: "Login succesfully!",
            user: otherDetails,
          });
        }
      } else {
        console.log("User not found");
        res.status(200).json({ accepted: false, message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ accepted: false, message: error.message });
    }
  }
});

module.exports = router;
