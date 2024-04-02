import Search from "./Search";
import Messages from "./Messages";
import Contacts from "./Contacts";

const Col2 = ({ show, handleSearchUser, setShow }) => {
  return (
    <>
      <div className="col-4 border-end col_2">
        <Search handleSearchUser={handleSearchUser} setShow={setShow} />
        {show === "messages" ? (
          <Messages />
        ) : show === "contacts" ? (
          <Contacts />
        ) : null}
      </div>
    </>
  );
};

export default Col2;
