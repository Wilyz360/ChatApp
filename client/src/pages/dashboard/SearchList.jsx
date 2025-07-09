import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useOutletContext, useParams } from "react-router-dom";
import { setUser } from "../../features/authSlice";
import User from "./User";
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
      if (response.status === 204) {
        setResults([]);
      }

      if (response.status === 200) {
        setResults(response.data);
      }
    } catch (err) {
      setError("Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }
  }, [query]);
  console.log("Search results:", results);

  const handleAddContact = async (user) => {
    try {
      const response = await API.post(
        `/user/contact/add`,
        { userId: currentUser._id, contactId: user._id },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert("Friend request sent successfully!");
        // Update the current user's contacts in the Redux store
        const updatedContacts = [...currentUser.contacts, user._id];
        dispatch(setUser({ ...currentUser, contacts: updatedContacts }));
        console.log("Contact added successfully:", response.data);
        // Optionally update the UI or state here
        setDetailComponent(<User user={user} />);
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      // Optionally set an error state here
    }
  };

  const handleShowUser = (user) => {
    const isContact = currentUser.contacts.includes(user._id);
    isContact
      ? setDetailComponent(<User user={user} />)
      : setDetailComponent(
          <div>
            <User user={user} setDetailComponent={setDetailComponent} />
            <button onClick={() => handleAddContact(user)}>Add</button>
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
