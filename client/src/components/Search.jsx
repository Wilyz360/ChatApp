import { useState } from "react";
import API from "../api/api";

const Search = () => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState({});

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      // sending email as query. params == query
      const result = await API.get("/v1/search", {
        // indicates whether or not cross-site Access-Control requests should be
        // made using credentials such as cookies
        withCredentials: true,
        params: { email },
      });

      if (result.data.accepted === true) {
        console.log(result.data.message);
        setUser(result.data.user);
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
