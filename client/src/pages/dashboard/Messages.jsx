import React, { useState, useEffect, use } from "react";
import API from "../../api/api";

const Messages = ({ currentUser = null, user = null, chatInfo = null }) => {
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");
  const [listMessages, setListMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChat = async () => {
    if (!currentUser || !user) {
      console.error("Current user or selected user is missing.");
      return null;
    }

    try {
      const response = await API.get(
        `/chats/find/${currentUser._id}/${user._id}`,
        {
          withCredentials: true,
        }
      );
      if (response.status == 200) {
        console.log("Fetched chat response:", response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
      setError(error.message);
    }
    return null;
  };

  const fetchMessages = async () => {
    try {
      const response = await API.get(
        `/messages/${chat ? chat._id : chatInfo._id}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log("Fetched messages:", response.data);

        return response.data;
      }
      // Process messages if needed
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError(error.message);
    }
    return [];
  };

  useEffect(() => {
    const getChat = async () => {
      setLoading(true);
      const fetchedChat = await fetchChat();
      if (fetchedChat) {
        setChat(fetchedChat);
        setLoading(false);
      } // else create new chat on send message
      setLoading(false);
    };

    getChat();
  }, [currentUser, user]);

  useEffect(() => {
    if ((!chat || !chat._id) && !chatInfo) return; // wait for chat to be set
    const getMessages = async () => {
      setLoading(true);
      const fetchedMessages = await fetchMessages();
      if (fetchedMessages) {
        setListMessages(fetchedMessages);
      }
      setLoading(false);
    };
    getMessages();
  }, [chat, chatInfo]);

  const handleMessage = async (e) => {
    e.preventDefault();

    setError(null);

    let chatId = chat && chat.id;

    if (!chatId) {
      // create new chat
    }

    console.log("chat: " + chat._id);
    try {
      const response = await API.post(
        "/messages/",
        {
          chatId, // Replace with actual chat ID
          senderId: currentUser._id,
          text: message,
        },
        { withCredentials: true }
      );
      setMessage("");
      console.log("Message sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error.message);
    }
  };

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h2>
          {user
            ? `${user.firstName} ${user.lastName}`
            : `${chatInfo.members[1].firstName} ${chatInfo.members[1].lastName}`}
        </h2>
      </div>
      {loading ? (
        <div className="loading">Loading messages...</div>
      ) : error ? (
        <div className="no-messages">No messages yet.</div>
      ) : (
        <>
          {" "}
          <div className="messages-body">
            {listMessages.length > 0 ? (
              listMessages.map((message) => (
                <div key={message._id} className="message">
                  <p>
                    <strong>{message.senderId.firstName}:</strong>{" "}
                    {message.text}
                  </p>
                </div>
              ))
            ) : (
              <div className="no-messages">No messages yet.</div>
            )}
          </div>
        </>
      )}
      <div className="messages-footer">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleMessage}></button>
      </div>
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
