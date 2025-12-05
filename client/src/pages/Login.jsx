import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../features/authSlice";
import API from "../api/api"; // Assuming you have an API utility for making requests
import "../styles/login.css";

const Login = () => {
  const dispatch = useDispatch(); // Redux dispatch function
  const { loading } = useSelector((state) => state.auth); // Access loading state from Redux store
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const response = await API.post("/login", { email, password });
      if (response.status == 200) {
        console.log("Login successful:", response.data);
        dispatch(loginSuccess(response.data.user));
        setEmail("");
        setPassword("");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Handle error, e.g., show a notification or alert
      dispatch(loginFailure());
      alert("Login failed. Please try again.");
      return;
    }
  };

  return (
    <div className="login-container">
      <h2>Login Page</h2>
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
