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
    const search = req.params.search;
    console.log("Search term:", search);
    const [first, second] = search.toLowerCase().split(" "); // Split into first and last name and convert to lowercase

    let query = {};

    if (second) {
      query = {
        $or: [
          {
            firstName: new RegExp(`${first}$`, "i"),
            lastName: new RegExp(`${second}$`, "i"),
          },
          {
            firstName: new RegExp(`${second}$`, "i"),
            lastName: new RegExp(`${first}$`, "i"),
          },
        ],
      };
    } else {
      query = {
        $or: [
          { firstName: new RegExp(`${search}$`, "i") },
          { lastName: new RegExp(`${search}$`, "i") },
        ],
      };
    }

    let users = await User.find(query).select("-password -con");
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

// get user requests
router.get("/requests/:id", async (req, res) => {
  console.log("Fetching requests for user:", req.params.id);
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate(
      "receivedRequests",
      "firstName lastName email dob gender"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Received requests:", user.receivedRequests);
    res.status(200).json({ receivedRequests: user.receivedRequests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/request", async (req, res) => {
  console.log("Received friend request data:", req.body);
  const { from, to } = req.body;
  try {
    const fromUser = await User.findById(from);
    const toUser = await User.findById(to);
    if (!fromUser || !toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!toUser.receivedRequests.includes(from)) {
      toUser.receivedRequests.push(from);
      await toUser.save();
    }

    if (!fromUser.sentRequests.includes(to)) {
      fromUser.sentRequests.push(to);
      await fromUser.save();
    }

    // Here you would normally save the friend request to the database
    console.log(`Friend request from ${fromUser.email} to ${toUser.email}`);
    // For now, we just log the request

    res
      .status(200)
      .json({ message: "Friend request sent", requests: req.body });
  } catch (error) {
    console.error("Error handling friend request:", error);
    res.status(500).json({ message: error.message });
  }
});

// accept or reject request
router.post("/request/respond", async (req, res) => {
  console.log("Responding to friend request with data:", req.body);
  try {
    const { userId, requestId, action } = req.body;
    const user = await User.findById(userId);
    const requestUser = await User.findById(requestId);

    if (!user || !requestUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (action === "accept") {
      // Add each other to contacts
      if (!user.contacts.includes(requestId)) {
        user.contacts.push(requestId);
      }
      if (!requestUser.contacts.includes(userId)) {
        requestUser.contacts.push(userId);
      }
      // Remove from received and sent requests
      user.receivedRequests = user.receivedRequests.filter(
        (reqId) => reqId.toString() !== requestId
      );
      requestUser.sentRequests = requestUser.sentRequests.filter(
        (reqId) => reqId.toString() !== userId
      );
    }
    if (action === "reject") {
      // Remove from received and sent requests
      user.receivedRequests = user.receivedRequests.filter(
        (reqId) => reqId.toString() !== requestId
      );
      requestUser.sentRequests = requestUser.sentRequests.filter(
        (reqId) => reqId.toString() !== userId
      );
    }

    if (action !== "accept" && action !== "reject") {
      return res.status(400).json({ message: "Invalid action" });
    }

    await user.save();
    await requestUser.save();

    user.password = undefined;

    res
      .status(200)
      .json({ message: `Request ${action}ed successfully`, user: user });
  } catch (error) {
    console.error("Error responding to friend request:", error);
    res.status(500).json({ message: error.message });
  }
});

// update user by id
router.put("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, dob, gender } = req.body;
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    switch (true) {
      case firstName !== undefined:
        user.firstName = firstName;
      case lastName !== undefined:
        user.lastName = lastName;
      case dob !== undefined:
        user.dob = dob;
      case gender !== undefined:
        user.gender = gender;
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// get users contact list
router.get("/contacts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let contacts = await User.find({ _id: { $in: user.contacts } });
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
    if (user.contacts.includes(contactId)) {
      return res.status(400).json({ message: "Contact already exists" });
    }
    user.contacts.push(contactId);
    await user.save();
    res.status(200).json({ message: "Contact added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// remove user from contact list
router.post("/contact/:id", async (req, res) => {
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
    if (!user.contacts.includes(contactId)) {
      return res.status(400).json({ message: "Contact does not exist" });
    }
    user.contacts = user.contacts.filter(
      (contact) => contact.toString() !== contactId
    );
    await user.save();
    res.status(200).json({ message: "Contact removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
