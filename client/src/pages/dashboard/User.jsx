import React from "react";

const User = ({ user }) => {
  return (
    <div className="user-profile">
      {user ? (
        <>
          <h2>
            {user.firstName} {user.lastName}
          </h2>
          <p>Email: {user.email}</p>
          <p>Dob: {!user.dob ? "required" : user.dob}</p>
          <p>Gender: {!user.gender ? "required" : user.gender}</p>

          {/* Add more user details as needed */}
        </>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
};

export default User;
