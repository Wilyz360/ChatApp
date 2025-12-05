import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/authSlice";
import User from "../pages/dashboard/User";
import API from "../api/api";
import "../styles/user-profile-edit.css"; // Assuming you have a CSS file for styling

const EditProfile = ({ user, setDetailComponent }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    dob: user.dob || "",
    gender: user.gender || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDetailComponent = (user) => {
    setDetailComponent(<User user={user} />); // Close the edit profile view
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading[true];
    try {
      const { data: response } = await API.put(`/user/edit/${user._id}`, form);
      dispatch(setUser(response));
      setLoading(false);
      console.log(response);
      handleDetailComponent(response);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      console.error("There was an error!", error);
    }

    console.log("Form submitted:", form);
    // Implement form submission logic here, e.g., API call to update profile
  };

  return (
    <div className="user-profile-edit">
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                required
                value={form.firstName}
                onChange={handleChange}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
              />
            </label>
            <label>
              Date of Birth:
              <input
                type="date"
                name="dob"
                required
                value={form.dob || ""}
                onChange={handleChange}
              />
            </label>
            <label>
              Gender:
              <select
                name="gender"
                required
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => handleDetailComponent(user)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default EditProfile;
