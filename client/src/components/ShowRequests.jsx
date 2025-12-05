import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import User from "../pages/dashboard/User";
import Messages from "../pages/dashboard/Messages";
import API from "../api/api";

function ShowRequests({ requests, setDetailComponent }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [isAccepted, setIsAccepted] = useState(false);
  const handleRequestClick = (request) => {
    setDetailComponent(
      <div>
        <User user={request} />
        {!isAccepted ? (
          <div>
            <button onClick={() => handleAccept(request._id)}>Accept</button>{" "}
            <button onClick={() => handleReject(request._id)}>Reject</button>
          </div>
        ) : (
          <div>
            <button>Chat</button>
          </div>
        )}
      </div>
    );
  };

  const handleAccept = async (requestId) => {
    console.log("Accepting request:", requestId);

    setDetailComponent(<div>Accepted! You can now chat.</div>);
  };

  const handleReject = async (requestId) => {
    console.log("Rejecting request:", requestId);
    setIsAccepted(false);
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
                  <button onClick={() => handleAccept(req._id)}>Accept</button>{" "}
                  <button onClick={() => handleReject(req._id)}>Reject</button>
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
