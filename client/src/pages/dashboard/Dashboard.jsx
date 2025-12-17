import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import User from "./User";
import EditProfile from "../../components/EditProfile";
import "../../styles/dashboard.css"; // Assuming you have a CSS file for styling

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [detailComponent, setDetailComponent] = useState(null);

  const handleEditProfile = () => {
    setDetailComponent(
      <EditProfile user={user} setDetailComponent={setDetailComponent} />
    );
  };

  const handleShowUser = (user) => {
    setDetailComponent(
      <div>
        <User user={user} />
        <button type="button" onClick={handleEditProfile}>
          Edit Profile
        </button>
      </div>
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/dashboard/search/${encodeURIComponent(search.trim())}`);
      setSearch("");
      //setDetailComponent(null); // Clear detail view on new search
    }
  };

  return (
    <div className="dashboard-3col-container">
      <nav className="dashboard-nav">
        <h2>{`${user.firstName} ${user.lastName}`}</h2>

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
            <button type="button" onClick={() => handleShowUser(user)}>
              Profile
            </button>
          </li>
          <li className="nav-item">
            <NavLink to="/dashboard/chats">Chats</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/dashboard/contacts">Friends</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/dashboard/settings">Settings</NavLink>
          </li>
        </ul>
      </nav>

      {/* Render the child routes here */}
      <div className="dashboard-main">
        <Outlet context={{ setDetailComponent }} />
      </div>

      <div className="dashboard-detail">{detailComponent}</div>
    </div>
  );
};

export default Dashboard;
