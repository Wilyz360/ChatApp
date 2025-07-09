import React from "react";
import { useOutletContext } from "react-router";
import Messages from "./Messages";
import "../../styles/chats.css"; // Assuming you have a CSS file for styling
import "../../styles/list.css"; // Assuming you have a CSS file for styling

const Chats = () => {
  const { handleShowDetail } = useOutletContext();

  const handleNewChat = () => {
    return <div style={{ position: "absolute" }}>list of messages</div>;
  };

  return (
    <div className="list-container">
      <h2 className="chat-title">Messages</h2>
      <div className="new-chat-button ">
        <button onClick={handleNewChat}>
          <span className="material-icons">Create New Chat</span>
        </button>
      </div>
      <ul className="list-list">
        <li
          className="list-item"
          onClick={() => handleShowDetail(<Messages />)}
        >
          <div className="">
            <span className="chat-name">
              <strong>Alice Smith: </strong>
            </span>
            <span className="chat-last-message">Hey, how are you?</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Chats;
