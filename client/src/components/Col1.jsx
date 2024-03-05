import { useState } from "react";
import Col2 from "./Col2";

import ekko from "../images/ekko.jpg";

const Col_1 = () => {
  const [show, setShow] = useState("");
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
      <Col2 show={show} />
    </>
  );
};

export default Col_1;
