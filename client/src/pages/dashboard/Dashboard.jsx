import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import User from "./User";
import "../../styles/dashboard.css"; // Assuming you have a CSS file for styling

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [detailComponent, setDetailComponent] = useState(null);

  const handleShowDetail = (component) => {
    setDetailComponent(component);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/dashboard/search/${encodeURIComponent(search.trim())}`);
      setSearch("");
      setDetailComponent(null); // Clear detail view on new search
    }
  };

  return (
    <div className="dashboard-3col-container">
      <nav className="dashboard-nav">
        <h2>Dashboard</h2>

        <ul className="dashboard-nav-list">
          <li className="search-bar">
            <input
              className="search-text"
              type="text"
              name="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
            />
            <button
              onClick={handleSearch}
              type="button"
              className="search-button"
            >
              Search
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              onClick={() =>
                handleShowDetail(
                  <User user={user} handleShowDetail={handleShowDetail} />
                )
              }
            >
              Profile
            </button>
          </li>
          <li className="nav-item">
            <NavLink to="/dashboard/chats">Chats</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/dashboard/contacts">Contacts</NavLink>
          </li>
          <li className="nav-item">
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
