import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate, NavLink } from "react-router-dom";
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
    // Fetch list of chats for the current user
    setLoading(true);
    try {
      const response = await API.get(`/chats/${currentUser._id}`, {
        withCredentials: true,
      });
      if (response.status !== 200) {
        throw new Error(response?.data || "Failed to fetch chats");
      }

      console.log("Chats fetched successfully:", response.data);
      setResults(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(
        error?.response?.data || "An error occurred while fetching chats"
      );
      setError(
        error?.response?.data || "An error occurred while fetching chats"
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchChats();
    };

    fetchData();
  }, [currentUser]);

  const handleShowMessages = (chat) => {
    console.log("Selected chat ID:", chat);
    setDetailComponent(<Messages chat={chat} />);
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
        {error && <p style={{ color: "red" }}>{error}</p>}
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
                      ? `${
                          chat.members[1].firstName.charAt(0).toUpperCase() +
                          chat.members[1].firstName.slice(1)
                        } ${
                          chat.members[1].lastName.charAt(0).toUpperCase() +
                          chat.members[1].lastName.slice(1)
                        }`
                      : `${
                          chat.members[0].firstName.charAt(0).toUpperCase() +
                          chat.members[0].firstName.slice(1)
                        } ${
                          chat.members[0].lastName.charAt(0).toUpperCase() +
                          chat.members[0].lastName.slice(1)
                        }`}
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
