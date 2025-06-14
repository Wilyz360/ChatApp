import React, { useState } from "react";
import { NavLink, Outlet } from "react-router";
import "../../style/dashboard.css"; // Assuming you have a CSS file for styling

const Dashboard = () => {
  const [detailComponent, setDetailComponent] = useState(null);

  const handleShowDetail = (component) => {
    setDetailComponent(component);
  };
  return (
    <div className="dashboard-3col-container">
      <nav className="dashboard-nav">
        <h1>Dashboard</h1>

        <div className="search-bar">
          <input className="search-text" type="text" />
          <button className="search-button" type="button">
            Search
          </button>
        </div>

        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <NavLink to="/dashboard">Profile</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/chats">Chats</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/contacts">Contacts</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/settings">Settings</NavLink>
          </li>
        </ul>
      </nav>

      {/* Render the child routes here */}
      <div className="dashboard-main">
        <Outlet context={{ handleShowDetail }} />
      </div>

      {/* This will render the component for the child route */}
      {/* For example, if the URL is /dashboard/user, it will render the User component */}
      {/* If the URL is /dashboard/chats, it will render the Chats component */}
      {/* And so on for contacts and settings */}
      <div className="dashboard-detail">{detailComponent}</div>
    </div>
  );
};

export default Dashboard;
