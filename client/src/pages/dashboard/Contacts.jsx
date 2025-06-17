import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../../api/api";
import User from "./User";
import "../../styles/list.css"; // Assuming you have a CSS file for styling

const Contacts = () => {
  const { handleShowDetail } = useOutletContext();
  const currentUser = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contactList, setContactList] = useState([]);

  const fetchContacts = async () => {
    try {
      const response = await API.get(`/user/contacts/${currentUser._id}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("Contacts fetched successfully:", response.data);
        setContactList(response.data);
      }
    } catch (error) {
      setError("An error occurred while fetching contacts");
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchContacts();
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="list-container">
      <h2>Contacts</h2>
      <ul className="list-list">
        {loading && <p>Loading contacts...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && contactList.length === 0 && (
          <p>No contacts found.</p>
        )}
        {!loading &&
          !error &&
          contactList.map((contact) => (
            <li
              onClick={() => handleShowDetail(<User user={contact} />)}
              key={contact._id}
              style={{ marginBottom: "10px" }}
              className="list-item"
            >
              <div className="list-name">
                <strong>
                  {contact.firstName} {contact.lastName}
                </strong>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Contacts;
