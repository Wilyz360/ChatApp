import React from "react";
import { Link } from "react-router";
import Login from "./Login";
import Signup from "./Signup";

const Home = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
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
