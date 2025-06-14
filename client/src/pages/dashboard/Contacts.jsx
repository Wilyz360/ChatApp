import React from "react";
import { useOutletContext } from "react-router";

const Contacts = () => {
  const { handleShowDetail } = useOutletContext();
  return (
    <div>
      <h2>Contacts</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li
          className="list-item"
          onClick={() => handleShowDetail(<div>See Alice</div>)}
        >
          Alice
        </li>
      </ul>
    </div>
  );
};

export default Contacts;
