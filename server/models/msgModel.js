const moongose = require("mongoose");

const msgSchema = new moongose.Schema(
  {
    chatId: {
      type: moongose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    senderId: {
      type: moongose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const MsgModel = moongose.model("Message", msgSchema);
module.exports = MsgModel;
