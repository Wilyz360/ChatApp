import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      (state.loading = false),
        (state.isAuthenticated = true),
        (state.user = action.payload),
        (state.error = null);

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      // Remove user data from localStorage
      localStorage.removeItem("user");
    },
    setUser: (state, action) => {
      state.user = action.payload;
      // Update user data in localStorage
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setUser } =
  authSlice.actions;
export default authSlice.reducer;
