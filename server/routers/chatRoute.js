const express = require("express");
const router = express.Router();
const Chat = require("../models/chatModel");

// get all chats for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let chats = await Chat.find({ members: userId }).populate(
      "members",
      "firstName lastName",
      "-password"
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
    chat = await chat.populate("members", "firstName lastName", "-password");
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// firnd chat between two users
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const { firstUserId, secondUserId } = req.params;
    const chat = await Chat.findOne({
      members: { $all: [firstUserId, secondUserId] },
    }).populate("members", "firstName lastName", "-password");
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
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
