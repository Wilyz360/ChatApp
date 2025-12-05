const express = require("express");
const router = express.Router();
const Chat = require("../models/chatModel");

// get all chats for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let chats = await Chat.find({ members: userId }).populate(
      "members",
      "firstName lastName"
    );

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// create a new chat
router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    // check if chat already exists
    let chat = await Chat.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (chat) {
      return res.status(200).json(chat);
    }
    chat = new Chat({
      members: [senderId, receiverId],
    });
    await chat.save();
    chat = await chat.populate("members", "firstName lastName");
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// firnd chat between two users
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  console.log("Finding chat between users:", req.params);
  if (!req.params.firstUserId || !req.params.secondUserId) {
    return res.status(400).json({ message: "Both user IDs must be provided" });
  }
  if (req.params.firstUserId === req.params.secondUserId) {
    return res
      .status(400)
      .json({ message: "Cannot find chat with the same user ID" });
  }
  try {
    const { firstUserId, secondUserId } = req.params;
    console.log(
      `Searching for chat between ${firstUserId} and ${secondUserId}`
    );
    const chat = await Chat.findOne({
      members: { $all: [firstUserId, secondUserId] },
    }).populate("members", "firstName lastName");
    if (!chat) {
      console.log(
        `No chat found between users ${firstUserId} and ${secondUserId}`
      );
      return res
        .status()
        .json({ message: "No chat found between the two users" }); // Return false if no chat found
    }
    console.log(
      `Chat found between users ${firstUserId} and ${secondUserId}:`,
      chat
    );
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delete a chat
router.delete("/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findByIdAndDelete(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
