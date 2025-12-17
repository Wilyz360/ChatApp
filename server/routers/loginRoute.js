const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

router.post("/", async (req, res) => {
  console.log("Login request body: ", req.body);

  const { email, password } = req.body;

  try {
    // Validate user input
    if (!email || !password) {
      throw new Error("Incorrect email or password");
    }

    // Check if user exists
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Incorrect password");
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    const { password: userPassword, ...userData } = user._doc;
    console.log("User data without password: ", userData);

    // Send token in response
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 1800000,
        sameSite: "Lax",
      })
      .json({ message: "Login successful", user: userData });
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
