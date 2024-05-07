import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "../styles/Dashboard.css";
import API from "../api/api";
import Header from "../components/Header";
import RightColumn from "../components/RightColumn";
import MiddleColumn from "../components/MiddleColumn";
import LeftColumn from "../components/LeftColumn";

const DashBoard = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const [show, setShow] = useState(false);
  const [searchedUser, setSearchedUser] = useState({});

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
      <Header />
      <div className="row">
        <RightColumn setShow={setShow} />
        <MiddleColumn
          setShow={setShow}
          show={show}
          setSearchedUser={setSearchedUser}
        />
        <LeftColumn show={show} searchedUser={searchedUser} />
      </div>
    </div>
  );
};

export default DashBoard;
