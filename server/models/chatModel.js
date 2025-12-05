const moongose = require("mongoose");
const chatSchema = new moongose.Schema(
  {
    members: {
      type: [{ type: moongose.Schema.Types.ObjectId, ref: "User" }],
    },
    lastMessage: { type: String, default: "" },
  },
  { timestamps: true }
);
const ChatModel = moongose.model("Chat", chatSchema);
module.exports = ChatModel;
