import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Messages from "./Messages";
import API from "../../api/api";
import "../../styles/chats.css"; // Assuming you have a CSS file for styling
import "../../styles/list.css"; // Assuming you have a CSS file for styling

const Chats = () => {
  const navigate = useNavigate();
  const { setDetailComponent } = useOutletContext();
  const currentUser = useSelector((state) => state.auth.user);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNewChat = () => {
    // Navigate to contacts to start a new chat
    navigate("/dashboard/contacts");
  };

  const fetchChats = async () => {
    try {
      const response = await API.get(`/chats/${currentUser._id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("Chats fetched successfully:", response.data);
        setResults(response.data);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      setError("Failed to fetch chats.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchChats();
      setLoading(false);
    };

    fetchData();
  }, [currentUser]);

  const handleShowMessages = (chat) => {
    console.log("Selected chat ID:", chat);
    setDetailComponent(<Messages currentUser={currentUser} chatInfo={chat} />);
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
        {loading && !error && <p>Loading chats...</p>}
        {error && !loading && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && results.length === 0 && (
          <p>No chats found. Start a new chat!</p>
        )}
        {!loading &&
          !error &&
          results.map((chat) => (
            <li
              className="list-item"
              onClick={() => handleShowMessages(chat)}
              key={chat._id}
            >
              <div className="">
                <span className="chat-name">
                  <strong>
                    {currentUser._id === chat.members[0]._id
                      ? `${chat.members[1].firstName} ${chat.members[1].lastName}`
                      : `${chat.members[0].firstName} ${chat.members[0].lastName}`}
                    {": "}
                  </strong>
                </span>
                <span className="chat-last-message">{chat.lastMessage}</span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Chats;
