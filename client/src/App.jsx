import { useState } from "react";
import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import User from "./pages/dashboard/User";
import Chats from "./pages/dashboard/Chats";
import Contacts from "./pages/dashboard/Contacts";
import Settings from "./pages/dashboard/Settings";

const isLoggedIn = true; // Simulating authentication status
const ProtectedRoute = ({ children }) => {
  return isLoggedIn ? children : <Login />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<User />} />
        <Route path="chats" element={<Chats />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
