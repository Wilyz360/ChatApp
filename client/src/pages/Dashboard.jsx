import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "../styles/Dashboard.css";
import API from "../api/api";
import Col1 from "../components/Col1";

const DashBoard = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const { data: result } = await API.get("/auth", {
          withCredentials: true,
        });

        if (result.accepted === true) {
          console.log(result.message);
          setAuthenticated(true);
        } else {
          console.log(result.message);
          setAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setAuthenticated(false);
      } finally {
        // first time using finally :D
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container">
      <div className="row">
        <Col1 />
      </div>
    </div>
  );
};

export default DashBoard;
