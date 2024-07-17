const mongoose = require("mongoose");
const userModel = require("./UserModel");

const ChatSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model("Chat", ChatSchema);
module.exports = ChatModel;
