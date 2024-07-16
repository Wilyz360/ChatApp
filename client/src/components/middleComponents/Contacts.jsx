import React, { useState, useEffect } from "react";
import API from "../../api/api";

const Contacts = ({ setShowLeftComponent, setSearchedUser }) => {
  const [contacts, setContacts] = useState([]);

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
      {contacts.map((contact) => (
        <div key={contact._id} onClick={() => handleContactUser(contact._id)}>
          <p>
            {contact.firstname} {contact.lastname}
          </p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Contacts;
