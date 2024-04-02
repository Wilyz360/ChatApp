import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import API from "../api/api";

//const user = JSON.parse(localStorage.getItem("profile"));

function Settings() {
  const [user, setUser] = useState("");

  const navigate = useNavigate();

  const handleLogOut = (e) => {
    e.preventDefault();
    try {
      console.log(user);
      const logout = async () => {
        const { data: result } = await API.post("/logout", {
          withCredentials: true,
        });

        if (result.accepted === true) {
          localStorage.removeItem("profile");
          window.alert(result.message);
          navigate("/");
        }
      };
      logout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-5">
      <Button
        className="d-flex mx-auto align-items-center justify-content-center"
        variant="dark"
        onClick={handleLogOut}
      >
        Log Out
      </Button>
    </div>
  );
}

export default Settings;
