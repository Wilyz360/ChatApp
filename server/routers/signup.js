const express = require("express");

const router = express.Router();
const db = require("../database/db");

router.post("/", (req, res) => {
  const user = req.body;
  console.log(user);

  // check if any input field is missing
  if (!(user.firstname && user.lastname && user.email && user.password)) {
    console.log("All input fields are required");
    res
      .status(400)
      .json({ accepted: false, message: "All input fields are required" });
  } else {
    // check if user already exist
    if (!db.findUserByEmail(user.email)) {
      // if retun null it create a new user
      db.registerNewUser(user);
      console.log("User created");
      res.status(201).json({ accepted: true, message: "User Created!" });
    } else {
      console.log("User already exist");
      res.status(401).json({ accepted: false, message: "User already exist" });
    }
  }
});

module.exports = router;
