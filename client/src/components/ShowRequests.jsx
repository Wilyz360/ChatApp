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
  const fromList = false;

  useEffect(() => {
    setRequests(initialRequests || []);
  }, [initialRequests]);

  const handleRequestClick = (request) => {
    setDetailComponent(
      <div>
        <User user={request} />
        <div>
          <button onClick={() => handleAccept(request)}>Accept</button>{" "}
          <button onClick={() => handleReject(request._id)}>Reject</button>
        </div>
      </div>
    );
  };

  const handleAccept = async (request, fromList = false) => {
    console.log("Accepting request:", request._id);
    try {
      const response = await API.post("/user/request/respond", {
        userId: currentUser._id,
        requestId: request._id,
        action: "accept",
      });

      if (response.status !== 200) {
        throw new Error("Failed to accept friend request.");
      }
      console.log("Response data:", response.data);
      const updatedUser = response.data.user;
      dispatch({ type: "auth/setUser", payload: updatedUser });
      fromList
        ? setRequests(requests.filter((req) => req._id !== request._id))
        : setDetailComponent(
            <>
              <User user={updatedUser} User />{" "}
              <div>
                <button onClick={() => handleChatButton(request)}>Chat</button>
              </div>
            </>
          );
      console.log("Friend request accepted:", response.data);
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleChatButton = (user) => {
    setDetailComponent(<Messages currentUser={currentUser} user={user} />);
  };

  const handleReject = async (request, fromList = false) => {
    console.log("Rejecting request:", request);
    try {
      const response = await API.post("/user/request/respond", {
        userId: currentUser._id,
        requestId: request._id,
        action: "reject",
      });

      if (response.status !== 200) {
        throw new Error("Failed to reject friend request.");
      }

      console.log("Response data:", response.data);
      const updatedUser = response.data.user;
      dispatch({ type: "auth/setUser", payload: updatedUser });
      fromList
        ? setRequests(requests.filter((req) => req._id !== request._id))
        : setDetailComponent(<User user={updatedUser} />);
    } catch (error) {
      console.error("Error rejecting friend request:", error);
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
                  {req.firstName} {req.lastName}
                </div>
                <div>
                  <button onClick={() => handleAccept(req, !fromList)}>
                    Accept
                  </button>{" "}
                  <button onClick={() => handleReject(req, !fromList)}>
                    Reject
                  </button>
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
