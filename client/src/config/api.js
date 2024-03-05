import axios from "axios";

// Set config defaults when creating the instance
const API = axios.create({
  baseURL: "http://localhost:4000",
});

export default API;
