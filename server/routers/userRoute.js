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
  const { _id } = req.query.user;
  console.log("email: ", email, "id: ", _id);

  try {
    // ===> find user by email
    const email_user = await UserModel.findOne({ email: email });
    if (!email_user) {
      return res
        .status(200)
        .json({ accepted: false, message: "User not found!" });
    }

    // ===> find main user by id
    const main_user = await UserModel.findById(_id);

    // ===> if user email is same as main user
    if (email_user._id == _id) {
      const { password, contact, ...otherDetails } = email_user._doc;
      return res
        .status(200)
        .json({ accepted: true, message: "User found", user: otherDetails });
    }

    // check if user is in his contact
    let isContact = false;
    const myContact = main_user.contact.filter((e) => e == email_user._id);

    if (myContact.length > 0) {
      isContact = true;
    }

    // ===> if exclude password and contacts from email_user
    let { password, contact, ...otherDetails } = email_user._doc;
    otherDetails.isContact = isContact;

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
  const newContactId = req.params.id;
  const { _id } = req.body; // my id

  console.log("new contact id: ", newContactId, "client id: ", _id);

  // if both ids are the same
  if (newContactId == _id) {
    console.log("Action Forbidden");
    return res
      .status(403)
      .json({ accepted: false, message: "Action Forbidden" });
  } else {
    try {
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
  console.log(id);

  try {
    let user = await UserModel.findById(id);
    console.log("myUser", user);
    let users = [];

    user.contact.map((e) => users.push(e));

    for (let i = 0; i < user.contact.length; i++) {
      let u = await UserModel.findById(user.contact[i]);
      console.log(u);
      let { password, ...otherDetails } = u._doc;
      users.push(otherDetails);
    }
    console.log(users);

    res.status.json({ accepted: true, message: "Contacts found!" });
  } catch (error) {
    res.status(500).json(error);
  }
});

// router.get("/:id", async (req, res) => {
//   const id = req.params.id;
//   console.log("id: ", id);

//   try {
//     let user = await UserModel.findById(id);
//     console.log("myUser", user);
//     if (user) {
//       const { password, ...otherDetails } = user._doc;

//       res.status(200).json(otherDetails);
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

module.exports = router;
