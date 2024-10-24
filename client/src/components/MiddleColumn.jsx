import React from "react";
import Search from "./middleComponents/Search";
import Messages from "./middleComponents/Messages";
import Contacts from "./middleComponents/Contacts";

const MiddleColumn = ({
  show,
  setShowLeftComponent,
  setSearchedUser,
  setSelectMessage,
  onlineUsers,
}) => {
  return (
    <>
      <div className="col-4 border-end col_2">
        <Search
          setShowLeftComponent={setShowLeftComponent}
          setSearchedUser={setSearchedUser}
        />
        {show === "contacts" ? (
          <Contacts
            setShowLeftComponent={setShowLeftComponent}
            setSearchedUser={setSearchedUser}
            onlineUsers={onlineUsers}
          />
        ) : (
          <Messages
            setShowLeftComponent={setShowLeftComponent}
            setSelectMessage={setSelectMessage}
          />
        )}
      </div>
    </>
  );
};

export default MiddleColumn;
