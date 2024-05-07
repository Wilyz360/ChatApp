const express = require("express");
const router = express.Router();

const UserModel = require("../models/UserModel");

// =====> Get all users
router.get("/", async (req, res) => {
  try {
    let users = await UserModel.find();
    users = users.map((user) => {
      console.log(user._doc);

      // exlude password and include other details. user._doc is where user unfo is located
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// =====> Get user by email
router.get("/:email/search", async (req, res) => {
  const email = req.params.email;
  console.log("email: ", email);

  try {
    // ===> find user by email
    const searchedUser = await UserModel.findOne({ email: email });
    if (!searchedUser) {
      return res
        .status(200)
        .json({ accepted: false, message: "User not found!" });
    }

    // ===> if exclude password
    const { password, ...otherDetails } = searchedUser._doc;
    console.log(otherDetails);

    //console.log(otherDetails);
    res.status(200).json({
      accepted: true,
      message: "User found",
      user: otherDetails,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id/add", async (req, res) => {
  // id must have 24 character to be found in data base
  const newContactId = req.params.id;
  const _id = req.body.id; // current user id

  console.log("new contact id: ", newContactId, "client id: ", _id);

  // if both ids are the same
  if (newContactId == _id) {
    console.log("Action Forbidden");
    return res
      .status(403)
      .json({ accepted: false, message: "Action Forbidden" });
  } else {
    try {
      // check if new contact id exist
      const newContactExist = await UserModel.findById(newContactId);
      if (!newContactExist) {
        console.log("Contact id not found!");
        return res.status(200).json({
          accepted: false,
          message: "Contact id not found!",
        });
      }

      // get main user by id
      const user = await UserModel.findById(_id);

      // if new contact id doenst not exist in main user add new contact
      if (!user.contact.includes(newContactId)) {
        await user.updateOne({ $push: { contact: newContactId } });

        console.log("New Contact Added!");
        return res
          .status(200)
          .json({ accepted: true, message: "New Contact Added!" });
      } else {
        console.log("Contact already added");
        res
          .status(403)
          .json({ accepted: false, message: "Contact already added" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
});

router.get("/:id/contacts", async (req, res) => {
  const id = req.params.id;
  console.log("current user id: ", id);

  try {
    let user = await UserModel.findById(id);
    //console.log("myUser", user);
    let users = [];

    // display only conatcts user ids
    //user.contact.map((e) => users.push(e));

    for (let i = 0; i < user.contact.length; i++) {
      let u = await UserModel.findById(user.contact[i]);
      //console.log(u);
      let { password, contact, ...otherDetails } = u._doc;
      users.push(otherDetails);
    }
    console.log(users);

    res.status(200).json({ accepted: true, contacts: users });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
