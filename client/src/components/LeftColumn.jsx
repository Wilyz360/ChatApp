import { useState, useEffect } from "react";
import API from "../api/api";

import Profile from "./leftComponents/Profile";
import Settings from "./leftComponents/Settings";
//import Empty from "./leftComponents/Empty";

const LeftColumn = ({ show, searchedUser }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(currentUser);
    //console.log(user);
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const { data: result } = await API.put(`user/${searchedUser._id}/add`, {
        id: user._id,
      });

      if (result.accepted) {
        console.log(result.message);
        window.location.reload();
        window.alert(result.message);
      } else {
        console.log(result.message);
        window.alert("Something went wrong try again");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="col-6 col_3">
        {show === "profile" ? (
          <Profile user={user} />
        ) : show === "searchedUser" ? (
          <div>
            <Profile user={searchedUser} />
            {user.contact.includes(searchedUser._id) !== true &&
            searchedUser._id !== user._id ? (
              <button
                variant="outline-dark"
                className="btn btn-dark d-flex mx-auto align-items-center justify-content-center"
                type="button"
                onClick={handleAddUser}
              >
                Add
              </button>
            ) : null}
          </div>
        ) : show === "settings" ? (
          <Settings />
        ) : null}
      </div>
    </>
  );
};

export default LeftColumn;
