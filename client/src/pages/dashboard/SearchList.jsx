import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useOutletContext, useParams } from "react-router-dom";
import { setUser } from "../../features/authSlice";
import User from "./User";
import Messages from "./Messages";
import API from "../../api/api";
import "../../styles/list.css"; // Assuming you have a CSS file for styling

const SearchList = () => {
  const { setDetailComponent } = useOutletContext();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const { query } = useParams();
  console.log("Search term:", query);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSearchResults = async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(
        `/user/search/${encodeURIComponent(searchTerm)}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setResults(response.data);
      }
    } catch (err) {
      setError("User not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }
    setResults([]);
  }, [query, currentUser]);
  console.log("Search results:", results);

  const handleRequest = async (user) => {
    try {
      const response = await API.post(
        "/user/request",
        {
          from: currentUser._id,
          to: user._id,
        },
        { withCredentials: true }
      );
      if (response.status !== 200) {
        throw new Error("Failed to send friend request.");
      }

      // Update currentUser in Redux store
      const updatedUser = {
        ...currentUser, // Copy existing user data
        sentRequests: [...currentUser.sentRequests, user._id], // Add new request
      };
      dispatch(setUser(updatedUser));
      console.log("Friend request sent", response.data);

      // Optionally update UI or state here
    } catch (error) {
      setError("Failed to send friend request.");
      console.error("Error sending friend request:", error);
    }
  };

  const handleChatButton = (user) => {
    setDetailComponent(<Messages currentUser={currentUser} user={user} />);
  };

  // Show user details and chat or add contact option

  const handleShowUser = (user) => {
    const isContact = currentUser.contacts.includes(user._id); // Check if user is already a contact
    const isRequested = currentUser.sentRequests.includes(user._id); // Check if request is sent
    isContact
      ? setDetailComponent(
          <div>
            <User user={user} />
            <button onClick={() => handleChatButton(user)}>Chat</button>
          </div>
        )
      : setDetailComponent(
          <div>
            <User user={user} />
            <button onClick={() => handleRequest(user)} disabled={isRequested}>
              {isRequested ? "Request Sent" : "Send Request"}
            </button>
          </div>
        );
  };

  return (
    <div className="list-container">
      <h2 className="text-2xl font-bold mb-4">Search Results</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && results.length === 0 && (
        <p>No results found for "{query}".</p>
      )}
      {!loading && !error && results.length > 0 && (
        <ul className="list-list">
          {results.map((user) => (
            <li
              onClick={() => handleShowUser(user)}
              key={user._id}
              className="list-item"
            >
              <div className="list-name">
                <strong>
                  {user.firstName} {user.lastName}
                </strong>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchList;
