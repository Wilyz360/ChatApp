import React, { useState } from "react";

const ChatFooter = () => {
  const [message, setMessage] = useState("");

  const handleMessage = () => {
    console.log("text area");
  };

  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="sendBtn">Send</button>
      </form>
    </div>
  );
};

export default ChatFooter;
