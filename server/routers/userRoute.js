const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

// get all users
router.get("/", async (req, res) => {
  try {
    let users = await User.find({});
    users = users.map((user) => {
      user.password = undefined;
      return user;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get user by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = undefined;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get user by email
router.get("/email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = undefined;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get user by name
router.get("/search/:search", async (req, res) => {
  try {
    const { name } = req.params;
    let users = await User.find({ name: new RegExp(name, "i") });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    users = users.map((user) => {
      user.password = undefined;
      return user;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update user by id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password, avatar, age, gender } =
      req.body;
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    switch (true) {
      case firstName !== undefined:
        user.firstName = firstName;
      case lastName !== undefined:
        user.lastName = lastName;
      case email !== undefined:
        user.email = email;
      case password !== undefined:
        user.password = password;
      case avatar !== undefined:
        user.avatar = avatar;
      case age !== undefined:
        user.age = age;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// get users contact list
router.get("/contact/list/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let contacts = await User.find({ _id: { $in: user.contact } });
    contacts = contacts.map((contact) => {
      contact.password = undefined;
      return contact;
    });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// add user to contact list
router.post("/contact/add", async (req, res) => {
  try {
    const { userId, contactId } = req.body;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let contact = await User.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    if (user.contact.includes(contactId)) {
      return res.status(400).json({ message: "Contact already exists" });
    }
    user.contact.push(contactId);
    await user.save();
    res.status(200).json({ message: "Contact added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// remove user from contact list
router.post("/contact/remove", async (req, res) => {
  try {
    const { userId, contactId } = req.body;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let contact = await User.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    if (!user.contact.includes(contactId)) {
      return res.status(400).json({ message: "Contact does not exist" });
    }
    user.contact = user.contact.filter(
      (contact) => contact.toString() !== contactId
    );
    await user.save();
    res.status(200).json({ message: "Contact removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
