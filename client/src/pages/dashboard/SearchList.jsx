import React, { useState, useEffect } from "react";
import { useParams, Link, useOutletContext } from "react-router-dom";
import User from "./User";
import API from "../../api/api";

const SearchList = () => {
  const { handleShowDetail } = useOutletContext();
  const { query } = useParams();
  console.log("Search term:", query);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSearchResults = async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(
        `/user/search/${encodeURIComponent(searchTerm)}`,
        { withCredentials: true }
      );
      if (response.status === 204) {
        setResults([]);
      }

      if (response.status === 200) {
        setResults(response.data);
      }
    } catch (err) {
      setError("Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }
  }, [query]);
  console.log("Search results:", results);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Search Results</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && results.length === 0 && (
        <p>No results found for "{query}".</p>
      )}
      {!loading && !error && results.length > 0 && (
        <ul className="space-y-4" style={{ listStyleType: "none", padding: 0 }}>
          {results.map((item) => (
            <li
              onClick={() => handleShowDetail(<User user={item} />)}
              key={item._id}
              className="border p-4 rounded shadow"
            >
              <h3 className="text-xl font-semibold">{`${item.firstName} ${item.lastName}`}</h3>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchList;
