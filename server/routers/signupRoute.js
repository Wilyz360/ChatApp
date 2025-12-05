const express = require("express");
const router = express.Router();
const UserMoel = require("../models/userModel");
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
  console.log("inputs: ", req.body);

  // check if any field is missing
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.email ||
    !req.body.password
  ) {
    return res.status(400).send("All input fields are required");
  }
  try {
    // check if user already exists
    const existingUser = await UserMoel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send("User already exists. Please login.");
    }
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log("hashed password: ", hashedPassword);
    // create new user
    const newUser = new UserMoel({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("Error during user registration: ", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
