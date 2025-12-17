import React from "react";
import { Link } from "react-router";
import "../styles/home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Chatterom</h1>
      <p>An another way to chat!</p>
      <p>
        <Link to="/login">Login</Link>
      </p>
      <p>
        <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
};

export default Home;
