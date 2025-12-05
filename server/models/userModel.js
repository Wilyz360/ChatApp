const { request } = require("express");
const moongose = require("mongoose");

const userSchema = new moongose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    default: null,
  },
  gender: {
    type: String,
    default: null,
  },
  contacts: {
    type: [],
  },
  sentRequests: {
    type: [{ type: moongose.Schema.Types.ObjectId, ref: "User" }],
  },
  receivedRequests: {
    type: [{ type: moongose.Schema.Types.ObjectId, ref: "User" }],
  },
});

const UserModel = moongose.model("User", userSchema);
module.exports = UserModel;
