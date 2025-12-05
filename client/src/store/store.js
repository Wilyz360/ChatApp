import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";

const userData = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const preloadedState = {
  auth: {
    user: userData,
    isAuthenticated: userData ? true : false,
    loading: false,
    error: null,
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
});
