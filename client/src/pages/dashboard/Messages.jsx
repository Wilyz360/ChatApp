import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Messages = ({ user }) => {
  console.log("Messages component rendered for user");
  return (
    <div>
      <h2>{`${user.firstName} ${user.lastName}`}</h2>
    </div>
  );
};

export default Messages;

// design header, body and footer for messages component
// -header should have user name and back button
// -body should have messages
// -footer should have input box and send button
/* 
  when user clicks chat button in contacts component, it should show messages component with user details
  if chats already exist, it should show the chat history
  if chats do not exist, it should show empty chat window with user details and create a new chat on send button click
*/
