import React from "react";
import Search from "./middleComponents/Search";
import Messages from "./middleComponents/Messages";
import Contacts from "./middleComponents/Contacts";

const MiddleColumn = ({ setShow, show, setSearchedUser }) => {
  return (
    <>
      <div className="col-4 border-end col_2">
        <Search setShow={setShow} setSearchedUser={setSearchedUser} />
        {show === "contacts" ? <Contacts /> : <Messages />}
      </div>
    </>
  );
};

export default MiddleColumn;
