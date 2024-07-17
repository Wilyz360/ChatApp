import React from "react";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

const ChatBox = () => {
  return (
    <div className="w-50 d-flex mx-auto align-items-center m-5 justify-content-center">
      <ChatBody />
      <ChatFooter />
    </div>
  );
};

export default ChatBox;
