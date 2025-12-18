import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../features/authSlice";
import API from "../api/api"; // Assuming you have an API utility for making requests
import "../styles/login.css";

const Login = () => {
  const dispatch = useDispatch(); // Redux dispatch function
  const { loading, error } = useSelector((state) => state.auth); // Access loading state from Redux store
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response = await API.post("/login", { email, password });

      if (response.status !== 200) {
        // Check if the response status is not 200 (OK)
        throw new Error(response.data || "Login failed");
      }

      console.log("Login successful:", response.data.message);
      dispatch(loginSuccess(response.data.user)); // Dispatch success action with user data

      // Clear input fields
      setEmail("");
      setPassword("");

      // Navigate to the dashboard or another page after successful login
      navigate("/dashboard/chats");
    } catch (error) {
      // Handle login errors
      console.log("Error:", error.response?.data || "Login failed");
      dispatch(loginFailure(error.response?.data || "Login failed"));
      return;
    }
  };

  return (
    <div className="login-container">
      <h1>Chatteron</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{loading ? "Loading..." : "Log In"}</button>
        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
