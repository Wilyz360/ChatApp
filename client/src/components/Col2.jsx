import React from "react";
import Search from "./Search";
import Messages from "./Messages";
import Contacts from "./Contacts";
import Settings from "./Settings";
import Profile from "./Profile";

const Col2 = ({ show }) => {
  console.log(show);
  return (
    <div className="col-4 border-end col_2">
      <Search />
      {show === "profile" ? (
        <Profile />
      ) : show === "messages" ? (
        <Messages />
      ) : show === "contacts" ? (
        <Contacts />
      ) : show === "settings" ? (
        <Settings />
      ) : null}
    </div>
  );
};

export default Col2;
