import React, { useState, useEffect } from "react";
import API from "../../api/api";
import { useSocket } from "../../socket/SocketProvider";

const Messages = ({ currentUser = null, user = null, chatInfo = null }) => {
  const socket = useSocket(); // Get socket instance from context
  console.log("Messages component rendered, socket:", socket);
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");
  const [listMessages, setListMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChat = async () => {
    if (!user) {
      // both are required to fetch or create chat
      console.error("Current user or selected user is missing.");
      setChat(chatInfo); // use chatInfo if provided
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
      const response = await API.get(`/messages/${chat._id}`, {
        withCredentials: true,
      });
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
    // reset when user or chatInfo changes
    setChat(null);
    setListMessages([]);
    setError(null);
  }, [user, chatInfo]); // reset when user or chatInfo changes

  useEffect(() => {
    // fetch or create chat when user or chatInfo changes
    const getChat = async () => {
      setLoading(true);
      const fetchedChat = await fetchChat();
      if (fetchedChat) {
        setChat(fetchedChat);
      } // else create new chat on send message
      setLoading(false);
    };

    getChat();
  }, [currentUser, user, chatInfo]); // refetch if currentUser, user or chatInfo changes

  useEffect(() => {
    // fetch messages when chat changes
    if (!chat || !chat._id) return; // wait for chat to be set
    const getMessages = async () => {
      setLoading(true);
      const fetchedMessages = await fetchMessages();
      if (fetchedMessages) {
        setListMessages(fetchedMessages);
      }
      setLoading(false);
    };
    getMessages();
  }, [chat]); // only refetch if chat changes

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

    setError(null);

    let chatId = chat && chat._id;

    if (!chatId) {
      // create new chat
      try {
        const response = await API.post(
          "/chats/",
          {
            senderId: currentUser._id,
            receiverId: user._id,
          },
          { withCredentials: true }
        );
        if (response.status === 201) {
          console.log("New chat created:", response.data);
          setChat(response.data);
          chatId = response.data._id;
        }
      } catch (error) {
        setError("Failed to create new chat.");
        console.error("Error creating new chat:", error);
        return; // Exit if chat creation fails
      }
    }

    console.log("chat: " + chatId);
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
      console.log("Message sent successfully:", response.data);
      socket.emit("message", response.data); // Emit message via socket
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error.message);
    }
    setMessage("");
  };

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h2>
          {user
            ? `${user.firstName} ${user.lastName}`
            : chatInfo &&
              chatInfo.members &&
              chatInfo.members[1] &&
              currentUser._id === chatInfo.members[0]._id
            ? `${chatInfo.members[1].firstName} ${chatInfo.members[1].lastName}`
            : `${chatInfo.members[0].firstName} ${chatInfo.members[0].lastName}`}
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
                    <strong>
                      {currentUser.firstName === message.senderId.firstName
                        ? "You"
                        : message.senderId.firstName.charAt(0).toUpperCase() +
                          message.senderId.firstName.slice(1)}
                      :
                    </strong>{" "}
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
        <button onClick={handleMessage} disabled={loading || !message.trim()}>
          Send
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
