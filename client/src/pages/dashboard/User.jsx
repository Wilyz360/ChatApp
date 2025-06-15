import React, { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../../api/api";

const User = ({ user }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const [isAlreadyContact, setIsAlreadyContact] = useState(false);

  useEffect(() => {
    if (!currentUser || !user) return;
    const isContact = currentUser.contacts.some(
      (contact) =>
        (typeof contact === "object" && contact._id === user._id) ||
        (typeof contact === "string" && contact === user._id)
    );
    setIsAlreadyContact(isContact);
  }, [user, currentUser]);

  const handleButtton = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.post(
        "/user/contact/add",
        { userId: currentUser._id, contactId: user._id },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert("Friend request sent successfully!");
        setSent(true);
      }
    } catch (err) {
      setError("Failed to send friend request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{`${user.firstName} ${user.lastName}`}</h2>
      <div className="border p-4 rounded shadow">
        <p className="text-gray-600">Email: {user.email}</p>
        <p className="text-gray-600">Age: {user.age}</p>
        <p className="text-gray-600">Gender: {user.gender}</p>
        {/* if search button is cliked*/}
        {currentUser &&
          currentUser._id !== user._id &&
          !sent &&
          !isAlreadyContact && (
            <button
              onClick={handleButtton}
              disabled={loading}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {loading ? "Sending..." : "Add Friend"}
            </button>
          )}
      </div>
    </div>
  );
};

export default User;
