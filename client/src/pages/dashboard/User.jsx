import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import Messages from "./Messages";
import API from "../../api/api";

const User = ({ user, setDetailComponent = null }) => {
  const { id } = useParams();
  console.log("User ID:", user._id);

  return (
    <div className="user-profile">
      {user ? (
        <>
          <h2>
            {user.firstName} {user.lastName}
          </h2>
          <p>Email: {user.email}</p>
          {/* Add more user details as needed */}
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default User;
