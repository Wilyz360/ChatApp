import { useEffect, useState } from "react";
import API from "../api/api";

const user = JSON.parse(localStorage.getItem("profile"));

function Contacts() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data: result } = await API.get(`/user/${user._id}/contacts`);

        setContacts(...contacts, result);
      } catch (error) {
        console.error(error);
      }
    };
    fetchContacts();
  });

  return (
    <div>
      {contacts.map((e) => {
        return <div>{e.firstname}</div>;
      })}
    </div>
  );
}

export default Contacts;
