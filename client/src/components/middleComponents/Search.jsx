import { useState } from "react";
import API from "../../api/api";

const Search = ({ setShow, setSearchedUser }) => {
  const [email, setEmail] = useState("");
  const [isFriend, setIsFriend] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    try {
      const { data: result } = await API.get(`/user/${email}/search`);

      if (result.accepted === true) {
        console.log(result.message);

        // Assuming the server responds with user information
        const searchResult = result.user;

        // why it doesnt update immediately?
        setSearchedUser(searchResult);
        setShow("searchedUser");

        //console.log(currentUser.contact, searchedUser._id);

        // Compare if the searched user is a friend of the current user
        const isMyContact = currentUser.contact.includes(searchResult._id);

        setIsFriend(isMyContact);
        console.log("Is my contact? ", isMyContact);
      }
    } catch (error) {
      console.error(error);
    }

    setEmail("");
    setIsFriend(false);
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
