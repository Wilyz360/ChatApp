import { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import "../styles/Dashboard.css";
import API from "../api/api";
import Header from "../components/Header";
import LeftColumn from "../components/L_Column";
import MiddleColumn from "../components/MiddleColumn";
import RightColumn from "../components/R_Column";
import io from "socket.io-client";

// const socket = io.connect("http://localhost:4000");

const DashBoard = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const socket = useRef();

  const [show, setShow] = useState("");
  const [showLeftComponent, setShowLeftComponent] = useState("");
  const [searchedUser, setSearchedUser] = useState({});
  const [selectMessage, setSelectMessage] = useState("");

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

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io("ws://localhost:8800");
  });

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
        <LeftColumn setShow={setShow} />
        <MiddleColumn
          setShow={setShow}
          show={show}
          setShowLeftComponent={setShowLeftComponent}
          setSearchedUser={setSearchedUser}
          setSelectMessage={setSelectMessage}
        />
        <RightColumn
          show={show}
          showLeftComponent={showLeftComponent}
          searchedUser={searchedUser}
        />
      </div>
    </div>
  );
};

export default DashBoard;
