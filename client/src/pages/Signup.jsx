import { useState } from "react";
import { useNavigate } from "react-router";
import API from "../api/api"; // Assuming you have an API utility for making requests
import "../styles/signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    setError(null);

    console.log("Form Data:", formData);

    try {
      const response = await API.post("/signup", formData);

      if (response.status !== 201) {
        console.log("User already exists:", response.data);
        throw new Error(response.data.message);
      }
      console.log("Signup successful:", response.data);

      //alert("Signup successful! Please log in.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      // Redirect to login page or show success message
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      console.error("Signup failed:", error.message);
      setError(error.message || "Signup failed. Please try again.");
      //alert("Signup failed. Please try again.");
      return;
    }
  };

  return (
    <div className="signup-container">
      <h1>Chatteron</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
          name="firstName"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
          name="lastName"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          name="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          name="password"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          name="confirmPassword"
        />
        <button type="submit">{loading ? "Working" : "Signup"}</button>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
        <p>
          By signing up, you agree to our <a href="/terms">Terms of Service</a>{" "}
          and <a href="/privacy">Privacy Policy</a>.
        </p>
        <p>
          <a href="/forgot-password">Forgot Password?</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
