const express = require("express");
const router = express.Router();
const MsgModel = require("../models/msgModel");
const ChatModel = require("../models/chatModel");

// get all messages for a chat
router.get("/:chatId", async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await MsgModel.find({ chatId }).populate(
      "senderId",
      "firstName lastName"
    );

    if (!messages) {
      console.log("No messages found for chatId:", chatId);
      throw new Error("No messages found for this chat");
    }

    console.log("Messages fetched for chatId:", chatId, messages);
    res
      .status(200)
      .json({ messages, message: "Messages fetched successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// create a new message
router.post("/", async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body;

    if (!chatId || !senderId || !text) {
      throw new Error("chatId, senderId and text are required");
    }

    const findChat = await ChatModel.findById(chatId);
    if (!findChat) {
      throw new Error("Chat not found");
    }

    const message = new MsgModel({
      chatId,
      senderId,
      text,
    });
    await message.save();
    await ChatModel.findByIdAndUpdate(chatId, { lastMessage: text });
    // populate senderId field

    const populatedMessage = await message.populate(
      "senderId",
      "firstName lastName"
    );
    res.status(200).json({ message: populatedMessage });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// delete a message
router.delete("/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await MsgModel.findByIdAndDelete(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
