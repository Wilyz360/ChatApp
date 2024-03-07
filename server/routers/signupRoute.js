const express = require("express");
const router = express.Router();
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  console.log(req.body);

  // check if any input field is missing
  if (
    !(
      req.body.firstname &&
      req.body.lastname &&
      req.body.email &&
      req.body.password
    )
  ) {
    console.log("All input fields are required");
    return res
      .status(400)
      .json({ accepted: false, message: "All input fields are required" });
  } else {
    // hash user password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashPassword;

    //const newUser = new UserModel(req.body); // check user from req.body meets the requirements
    const { firstname, lastname, email, password } = req.body;

    try {
      // check user by email
      const oldUser = await UserModel.findOne({ email });

      if (oldUser) {
        console.log("User already exist");
        return res
          .status(400)
          .json({ accepted: false, message: "User already exist" });
      }

      // save user in the DB
      const user = await UserModel.create({
        firstname,
        lastname,
        email: email.toLowerCase(),
        password,
      });

      user.password = undefined;

      console.log(user, "User created!");
      res
        .status(200)
        .json({ accepted: true, message: "User created!", user: user });
    } catch (error) {
      res.status(500).json({ accepted: false, message: error.message });
    }
  }
});

module.exports = router;
