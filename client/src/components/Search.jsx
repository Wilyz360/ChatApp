import { useState } from "react";
import API from "../api/api";

const user = JSON.parse(localStorage.getItem("profile"));

const Search = ({ handleSearchUser, setShow }) => {
  const [email, setEmail] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      // sending email as query. params == query
      console.log(user);
      const result = await API.get(`/user/${email}/search`, {
        params: { user },
      });

      if (result.data.accepted === true) {
        console.log(result.data.message);
        handleSearchUser(result.data.user);
        setShow("searchUser");
      } else {
        console.log(result.data.message);
        window.alert(result.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-2 mt-2 mb-4 border-bottom">
      <form className="d-flex">
        <input
          className="form-control me-2"
          type="search"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Search"
          aria-label="Search"
        />
        <button
          variant="outline-dark"
          className="btn btn-dark"
          type="submit"
          onClick={handleSearch}
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default Search;
