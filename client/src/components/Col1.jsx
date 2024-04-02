import { useState, useReducer } from "react";
import Col2 from "./Col2";
import Col3 from "./Col3";

import ekko from "../images/ekko.jpg";

const initalState = { userProfile: null };

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER_PROFILE":
      return { userProfile: action.payload };
    default:
      return state;
  }
};

const Col_1 = () => {
  const [show, setShow] = useState("messages");

  const [state, dispatch] = useReducer(reducer, initalState);

  const handleSearchUser = (userSearched) => {
    dispatch({ type: "SET_USER_PROFILE", payload: userSearched });
  };

  return (
    <>
      <div className="col-2 border-end menu">
        <div className="profilePic">
          <img
            className=" align-items-center justify-content-center"
            style={{ marginLeft: 10, width: 100, height: 100 }}
            src={ekko}
            alt="ekko"
          />
        </div>
        <div>
          <div className="selector" onClick={() => setShow("profile")}>
            <h3>Profile</h3>
          </div>
          <div className="selector" onClick={() => setShow("messages")}>
            <h3>Messages</h3>
          </div>
          <div className="selector" onClick={() => setShow("contacts")}>
            <h3>Contacts</h3>
          </div>
          <div className="selector" onClick={() => setShow("settings")}>
            <h3>Settings</h3>
          </div>
        </div>
      </div>
      <Col2 show={show} handleSearchUser={handleSearchUser} setShow={setShow} />
      <Col3 show={show} userState={state.userProfile} />
    </>
  );
};

export default Col_1;
