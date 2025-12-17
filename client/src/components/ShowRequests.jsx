import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import User from "../pages/dashboard/User";
import Messages from "../pages/dashboard/Messages";
import API from "../api/api";

function ShowRequests({ requests: initialRequests, setDetailComponent }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [requests, setRequests] = useState(initialRequests || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setRequests(initialRequests || []);
  }, [initialRequests]);

  const handleRequestClick = (request) => {
    setDetailComponent(
      <div>
        <User user={request} />
        <div>
          <button onClick={() => handleAccept(request, false)}>
            {loading ? "Accepting" : "Accept"}
          </button>{" "}
          <button onClick={() => handleReject(request, false)}>
            {loading ? "Rejecting" : "Reject"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    );
  };

  const handleAccept = async (request, fromList = false) => {
    console.log("Accepting request:", request._id);
    setLoading(true);
    setError(null);
    try {
      // Send accept request to server
      const response = await API.post("/user/request/respond", {
        userId: currentUser._id,
        requestId: request._id,
        action: "accept",
      });

      // Check for successful response
      if (response.status !== 200) {
        console.log("Error:", response.data);
        throw new Error(response?.data || "Failed to accept friend request.");
      }
      console.log("Request message:", response.data.message);

      // Create a new chat upon accepting the friend request
      const newChatCreated = await API.post(
        "/chats/create",
        {
          senderId: currentUser._id,
          receiverId: request._id,
        },
        { withCredentials: true }
      );

      // Check for successful chat creation
      if (newChatCreated.status !== 200) {
        console.log("New chat creation failed:", newChatCreated.data);
        throw new Error(newChatCreated?.data || "Failed to create new chat.");
      }
      console.log("New chat created:", newChatCreated.data.message);

      const updatedUser = response.data.user;
      dispatch({ type: "auth/setUser", payload: updatedUser }); // update redux store
      setLoading(false);
      fromList
        ? setRequests(requests.filter((req) => req._id !== request._id)) // remove from list
        : setDetailComponent(
            <>
              <User user={updatedUser} User />{" "}
              <div>
                {/* <button onClick={() => handleChatButton(request)}>Chat</button> */}
              </div>
            </>
          );
    } catch (error) {
      setLoading(false);
      console.log(
        "Error accepting friend request:",
        error.response?.data || "An error occurred while accepting."
      );
      setError(error?.response?.data || "An error occurred while accepting.");
    }
  };

  // const handleChatButton = (request) => {
  //   setDetailComponent(<Messages currentUser={currentUser} user={request} />);
  // };

  const handleReject = async (request, fromList = false) => {
    console.log("Rejecting request:", request);
    setLoading(true);
    try {
      const response = await API.post("/user/request/respond", {
        userId: currentUser._id,
        requestId: request._id,
        action: "reject",
      });

      if (response.status !== 200) {
        throw new Error(response?.data || "Failed to reject friend request.");
      }

      console.log("Response data:", response.data.message);
      const updatedUser = response.data.user;
      dispatch({ type: "auth/setUser", payload: updatedUser });
      setLoading(false);
      fromList
        ? setRequests(requests.filter((req) => req._id !== request._id))
        : setDetailComponent(<User user={updatedUser} />);
    } catch (error) {
      console.error(
        "Error rejecting friend request:",
        error?.response?.data || "An error occurred while rejecting the request"
      );
      setLoading(false);
      setError(
        error?.response?.data || "An error occurred while rejecting the request"
      );
    }
  };

  return (
    <div>
      <h2>Friend Requests</h2>
      <div>
        {requests.length === 0 ? (
          <p>No friend requests.</p>
        ) : (
          <ul>
            {requests.map((req) => (
              <li key={req._id}>
                <div
                  onClick={handleRequestClick.bind(null, req)}
                  style={{ cursor: "pointer", marginBottom: "10px" }}
                >
                  {req.firstName.charAt(0).toUpperCase() +
                    req.firstName.slice(1)}{" "}
                  {req.lastName.charAt(0).toUpperCase() + req.lastName.slice(1)}
                </div>
                <div>
                  <button onClick={() => handleAccept(req, true)}>
                    {loading ? "Accepting" : "Accept"}
                  </button>{" "}
                  <button onClick={() => handleReject(req, true)}>
                    {loading ? "Rejecting" : "Reject"}
                  </button>
                  {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ShowRequests;

/*
    client: emit "friendRequest", { from: currentUser._id, to: user._id }
    server: on "friendRequest", save request to DB, emit "newFriendRequest" to 'to' user if online
    client (to user): on "newFriendRequest", show notification or update UI
*/
