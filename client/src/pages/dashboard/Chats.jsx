import React from "react";
import { useOutletContext } from "react-router";
import Messages from "./Messages";
import "../../styles/dashboard.css"; // Assuming you have a CSS file for styling

const Chats = () => {
  const { handleShowDetail } = useOutletContext();

  return (
    <div>
      <h2>Chats</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li
          className="list-item"
          onClick={() =>
            handleShowDetail(
              <Messages user={{ firstName: "Alice", lastName: "Smith" }} />
            )
          }
        >
          Alice
        </li>
      </ul>
    </div>
  );
};

export default Chats;
