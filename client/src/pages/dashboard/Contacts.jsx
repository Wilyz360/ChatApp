import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../../api/api";
import User from "./User";
import Messages from "./Messages";
import ShowRequests from "../../components/ShowRequests";
import { useSocket } from "../../socket/SocketProvider";
import "../../styles/list.css"; // Assuming you have a CSS file for styling

const Contacts = () => {
  const { setDetailComponent } = useOutletContext();
  const currentUser = useSelector((state) => state.auth.user);
  const socket = useSocket();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const [chatError, setChatError] = useState(null);
  const [contactList, setContactList] = useState([]);
  const [requests, setRequests] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // Fetch contacts from the server
  const fetchContacts = async () => {
    try {
      const response = await API.get(`/user/contacts/${currentUser._id}`, {
        withCredentials: true,
      });

      if (response.status !== 200) {
        // Check for successful response
        throw new Error(response.data);
      }

      console.log("Contacts fetched successfully:", response.data.message);
      setContactList(response.data.contacts); // Updated to match the new response structure
    } catch (error) {
      // Handle errors
      setError(
        error.response?.data || "An error occurred while fetching contacts"
      );
      console.error(
        "Error fetching contacts:",
        error.response?.data || "An error occurred while fetching contacts"
      );
    }
  };

  // Fetch friend requests from the server
  const fetchRequests = async () => {
    try {
      const response = await API.get(`/user/requests/${currentUser._id}`, {
        withCredentials: true,
      });
      if (response.status !== 200) {
        // Check for successful response
        throw new Error(response.data);
      }
      setRequests(response.data.receivedRequests || []);
      console.log(
        "Requests fetched successfully:",
        response.data.receivedRequests
      );
    } catch (error) {
      console.error(
        "Error fetching requests:",
        error.response?.data || "An error occurred while fetching requests"
      );
      setError(
        error.response?.data || "An error occurred while fetching requests"
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchRequests();
      await fetchContacts();
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Request the list of online users from the server
    socket.emit("get-online-users");

    // Listen for the list of online users from the server
    socket.on("online-users", (onlineUserIds) => {
      setOnlineUsers(new Set(onlineUserIds));
    });

    // Listen for user status changes
    socket.on("user-status-change", ({ userId, status }) => {
      setOnlineUsers((prevOnlineUsers) => {
        const updatedOnlineUsers = new Set(prevOnlineUsers);
        if (status === "online") {
          updatedOnlineUsers.add(userId);
        } else if (status === "offline") {
          updatedOnlineUsers.delete(userId);
        }
        return updatedOnlineUsers;
      });
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("online-users");
      socket.off("user-status-change");
    };
  }, [socket]);

  // Handle initiating chat with selected user
  const handleChatButton = async (user) => {
    setLoadingChat(true);
    setChatError(null);
    try {
      const response = await API.get(
        `/chats/find/${currentUser._id}/${user._id}`,
        {
          withCredentials: true,
        }
      );
      if (response.status !== 200) {
        console.error(
          "Error fetching chat:",
          response?.data || "Failed to fetch chat"
        );
        throw new Error(response?.data || "Failed to fetch chats");
      }

      console.log("Chats fetched successfully:", response.data.message);
      setDetailComponent(
        <Messages currentUser={currentUser} chat={response.data.chat} />
      );
      setLoadingChat(false);
    } catch (error) {
      setLoadingChat(false);
      console.error(
        error?.response?.data || "An error occurred while fetching chats"
      );
      setChatError(
        error?.response?.data || "An error occurred while fetching chats"
      );
    }
  };

  // Show user details and chat option
  const handleShowUser = (user) => {
    setDetailComponent(
      <div>
        <User user={user} setDetailComponent={setDetailComponent} />
        <button onClick={() => handleChatButton(user)}>
          {loadingChat ? "Working..." : "Chat"}
        </button>
        {chatError && <p style={{ color: "red" }}>{chatError}</p>}
      </div>
    );
  };

  const retrieveRequests = () => {
    setDetailComponent(
      <ShowRequests
        requests={requests}
        setDetailComponent={setDetailComponent}
      />
    );
  };

  return (
    <div className="list-container">
      <h2>Friends</h2>
      <div>
        <div>
          {loading && <p>Loading contacts...</p>}
          <button type="button" onClick={retrieveRequests}>
            Friend Requests ({requests.length})
          </button>
        </div>
      </div>
      <div>
        <ul className="list-list">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && contactList.length === 0 && (
            <p>No contacts found.</p>
          )}
          {!loading &&
            !error &&
            contactList.map((contact) => {
              const isOnline = onlineUsers.has(contact._id);

              return (
                <li
                  onClick={() => handleShowUser(contact)}
                  key={contact._id}
                  style={{ marginBottom: "10px" }}
                  className="list-item"
                >
                  <div className="list-name">
                    <span>{isOnline ? "online" : "offline"}</span>
                    <strong>
                      {contact.firstName.charAt(0).toUpperCase() +
                        contact.firstName.slice(1)}{" "}
                      {contact.lastName.charAt(0).toUpperCase() +
                        contact.lastName.slice(1)}
                    </strong>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Contacts;
