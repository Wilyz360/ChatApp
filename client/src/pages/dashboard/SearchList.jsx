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
      if (response.status !== 200) {
        throw new Error(response.data);
      }

      setResults(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data || "An error occurred");
    }
  };

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }
    setResults([]);
  }, [query, currentUser]);

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
        // Check for successful response
        console.log("Response data:", response.data);
        throw new Error(response.data || "Failed to send friend request");
      }

      // Update current user in Redux store
      const updatedUser = {
        ...currentUser,
        sentRequests: response.data.sentRequests,
      };
      dispatch(setUser(updatedUser)); // Update user in Redux store
      console.log("Friend request sent", response.data);

      // Optionally update UI or state here
      handleShowUser(user, updatedUser); // Clear detail component after sending request
    } catch (error) {
      // Handle error
      console.log(error.response?.data || "An error occurred");
      handleShowUser(
        user,
        null,
        error.response?.data || "An error occurred while sending request"
      ); // Show error message in detail component
    }
  };

  const handleChatButton = (user) => {
    setDetailComponent(<Messages currentUser={currentUser} user={user} />);
  };

  // Show user details and chat or add contact option

  const handleShowUser = (user, updatedUser = null, erroMessage = null) => {
    const isContact = currentUser.contacts.includes(user._id); // Check if user is already a contact
    const isRequested = updatedUser
      ? updatedUser
      : currentUser.sentRequests.includes(user._id); // Check if request is sent

    // Set detail component based on user's contact status
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
            <div>
              <button
                onClick={() => handleRequest(user)}
                disabled={isRequested}
              >
                {isRequested ? "Request Sent" : "Send Request"}
              </button>
              <div>
                {erroMessage && <p className="text-red-500">{erroMessage}</p>}
              </div>
            </div>
          </div>
        );
  };

  return (
    <div className="list-container">
      <h2 className="text-2xl font-bold mb-4">Search Results</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <ul className="list-list">
          {results.map((user) => (
            <li
              onClick={() => handleShowUser(user)}
              key={user._id}
              className="list-item"
            >
              <div className="list-name">
                <strong>
                  {user.firstName.charAt(0).toUpperCase(0) +
                    user.firstName.slice(1)}{" "}
                  {user.lastName.charAt(0).toUpperCase() +
                    user.lastName.slice(1)}
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
