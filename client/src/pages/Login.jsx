import { useState } from "react";
import { useNavigate } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      // Handle error, e.g., show a notification or alert
      alert("Login failed. Please try again.");
      return;
    }

    // Here you would typically handle the login logic, such as calling an API
    console.log("Email:", email);
    console.log("Password:", password);
    // Reset form fields after submission
    setEmail("");
    setPassword("");
  };

  return (
    <div>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
