import axios from "axios";
import { store } from "../store/store";
import { logout } from "../features/authSlice";

const API = axios.create({
  // Create an Axios instance
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

API.interceptors.response.use(
  // Handle successful responses
  (response) => response,

  // Handle errors
  (error) => {
    // Check for unauthorized error
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      console.log("Unauthorized! Redirecting to login...");

      // Clear user data from Redux store
      store.dispatch(logout());

      // Redirect to login page
      window.location.href = "/";
    }

    return Promise.reject(error); // Propagate other errors
  }
);

export default API;
