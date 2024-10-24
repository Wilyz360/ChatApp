import React, { useState, useEffect } from "react";
import API from "../../api/api";

const Contacts = ({ setShowLeftComponent, setSearchedUser, onlineUsers }) => {
  const [contacts, setContacts] = useState([]);
  console.log("online users: ", onlineUsers);

  useEffect(() => {
    const getAllContacts = async () => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      try {
        const { data: result } = await API.get(
          `/user/${currentUser._id}/contacts`
        );

        if (result.accepted) {
          const getContacts = result.contacts;

          setContacts(getContacts);
          console.log(getContacts);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getAllContacts();
  }, []);

  const handleContactUser = async (id) => {
    console.log(id);
    try {
      const { data: result } = await API.get(`/user/${id}/contact`);

      if (result.accepted === true) {
        const userContact = result.user;
        console.log(userContact);
        setSearchedUser(userContact);
      }
    } catch (error) {
      console.error(error);
    }
    setShowLeftComponent("contactInfo");
  };

  return (
    <div>
      {contacts.map(
        (contact) => {
          let isOnline = false;

          onlineUsers.forEach((user) => {
            if (user.userId === contact._id) {
              isOnline = true;
            }
          });
          return (
            <div
              key={contact._id}
              onClick={() => handleContactUser(contact._id)}
            >
              <p>
                {contact.firstname}
                {isOnline && <span> online </span>}
              </p>
              <hr />
            </div>
          );
        }
        // <div key={contact._id} onClick={() => handleContactUser(contact._id)}>
        //   <p>
        //     {contact.firstname} {contact.lastname}
        //     {onlineUsers.includes(contact._id) && <span> online </span>}
        //   </p>
        //   <hr />
        // </div>
      )}
    </div>
  );
};

export default Contacts;
