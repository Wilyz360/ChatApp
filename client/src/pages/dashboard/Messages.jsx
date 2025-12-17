import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import API from "../../api/api";
import { useSocket } from "../../socket/SocketProvider";

const Messages = ({ chat }) => {
  const socket = useSocket(); // Get socket instance from context
  console.log("Messages component rendered, socket:", socket);
  const currentUser = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");
  const [listMessages, setListMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [errorSending, setErrorSending] = useState(null);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/messages/${chat._id}`, {
        withCredentials: true,
      });
      if (response.status !== 200) {
        throw new Error(response.data);
      }
      console.log("Fetched messages:", response.data.messages);
      setListMessages(response.data.messages);
      setLoading(false);
      // Process messages if needed
    } catch (error) {
      setLoading(false);
      console.error(
        "Error fetching messages:",
        error?.response?.data || "An error occurred"
      );
      setError(error?.response?.data || "An error occurred");
    }
  };

  useEffect(() => {
    setListMessages([]); // Clear previous messages
    if (chat && chat._id) {
      fetchMessages();
    }
  }, [chat]);

  useEffect(() => {
    if (!socket) return; // wait for socket to be set

    socket.on("message", (msg) => {
      // Listen for incoming messages
      setListMessages((prevMessages) => [...prevMessages, msg]);
    });
    return () => socket.off("message");
  });

  const handleMessage = async (e) => {
    e.preventDefault();
    setSendingMessage(true);
    setErrorSending(null);
    try {
      const response = await API.post(
        "/messages/",
        {
          chatId: chat._id, // Replace with actual chat ID
          senderId: currentUser._id,
          text: message,
        },
        { withCredentials: true }
      );
      if (response.status !== 200) {
        console.error("Error response:", response.data);
        throw new Error(response.data);
      }

      console.log("Message sent successfully:", response.data.message);
      setSendingMessage(false);
      socket.emit("message", response.data.message); // Emit message via socket
    } catch (error) {
      setSendingMessage(false);
      console.error(
        "Error sending message:",
        error.response?.data || "An error occurred"
      );
      setErrorSending(
        error.response?.data || "An error occurred while sending message"
      );
    }
    setMessage("");
  };

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h2>
          {chat.members[0]._id === currentUser._id
            ? `${chat.members[1].firstName} ${chat.members[1].lastName}`
            : `${chat.members[0].firstName} ${chat.members[0].lastName}`}
        </h2>
      </div>
      {loading ? (
        <div className="loading">Loading messages...</div>
      ) : error ? (
        <div className="no-messages">{error}</div>
      ) : (
        <>
          {" "}
          <div className="messages-body">
            {listMessages.length > 0 ? (
              listMessages.map((message) => (
                <div key={message._id} className="message">
                  <p>
                    <strong>
                      {currentUser.firstName === message.senderId.firstName
                        ? "You"
                        : message.senderId.firstName.charAt(0).toUpperCase() +
                          message.senderId.firstName.slice(1)}
                      :
                    </strong>{" "}
                    {message.text}
                    {errorSending && (
                      <span className="text-red-500"> - {"errorSending"}</span>
                    )}
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
        <button onClick={handleMessage} disabled={loading || !message.trim()}>
          {sendingMessage ? "Sending..." : "Send"}
        </button>
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
