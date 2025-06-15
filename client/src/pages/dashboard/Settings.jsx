import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/authSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Settings;
