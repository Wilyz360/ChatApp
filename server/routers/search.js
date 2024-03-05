const express = require("express");
const db = require("../database/db");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", auth.authenticateToken, (req, res) => {
  //console.log(req.query);
  // Use req.query when you sending data from client and it will no affect the database (POST request).
  // It is useful for GET request.
  // Check is email field is not empty
  if (!req.query.email) {
    console.log("Missing input field");
    res.status(400).json({ accepted: false, message: "Missing input field" });
  } else {
    // find new user by email
    const person = db.findUserByEmail(req.query.email);

    if (person) {
      // exclude user password
      const dissallowed = ["encPassword"];
      const allKeys = Object.keys(person);

      const user = allKeys.reduce((next, key) => {
        if (!dissallowed.includes(key)) {
          return { ...next, [key]: person[key] };
        } else {
          return next;
        }
      }, {});

      res.status(200).json({ accepted: true, message: "User found", user });
    } else {
      console.log("User no found");
      res.status(200).json({ accepted: false, message: "User no found" });
    }
  }
});

module.exports = router;
