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
    if (!chats) {
      console.log("No chats found for user:", userId);
      throw new Error("Some error occurred while fetching chats");
    }

    if (chats.length === 0) {
      console.log("No chats exist for user:", userId);
      throw new Error("No chats found for this user");
    }

    console.log(`Chats found for user ${userId}:`, chats);

    res.status(200).json(chats);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// create a new chat
router.post("/create", async (req, res) => {
  console.log("Creating chat with data:", req.body);
  try {
    const { senderId, receiverId } = req.body;
    // check if chat already exists
    let chat = await Chat.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (chat) {
      console.log("Chat already exists between users:", senderId, receiverId);
      throw new Error("Chat already exists between these users");
    }
    chat = new Chat({
      members: [senderId, receiverId],
    });
    await chat.save();
    chat = await chat.populate("members", "firstName lastName");
    res.status(200).json({ chat, message: "Chat created successfully" });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// firnd chat between two users
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  console.log("Finding chat between users:", req.params);
  try {
    if (!req.params.firstUserId || !req.params.secondUserId) {
      throw new Error("Both user IDs must be provided");
    }

    if (req.params.firstUserId === req.params.secondUserId) {
      throw new Error("Cannot find chat with the same user ID");
    }

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
      throw new Error("No chat found between the specified users");
    }
    console.log(
      `Chat found between users ${firstUserId} and ${secondUserId}:`,
      chat
    );
    res.status(200).json({ chat: chat, message: "Chat fetched successfully" });
  } catch (error) {
    res.status(400).send(error.message);
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
