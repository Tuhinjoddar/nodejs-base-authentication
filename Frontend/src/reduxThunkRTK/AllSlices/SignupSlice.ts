import { createSlice } from "@reduxjs/toolkit";
import { signupUser } from "../authUser.ts";

//localStorage.setItem(key, value) ex: localStorage.setItem("name", "Alice") ex: name:"user" and value:JSON.stringify(action.payload.user)
//localStorage.getItem(key) ex: localStorage.getItem("name") → "Alice" ex: name:"user"

// JSON.stringify(obj) and Converts object to string, input:{ id: "123", email: "user@example.com" } output: "{"id":"123","email":"user@example.com"}"
// first ---- localStorage.setItem("user", JSON.stringify(action.payload.user)) and save localStorage to string format.

//JSON.parse(str) and Converts string to object, input: "{"id":"123","email":"user@example.com"}" output: { id: "123", email: "user@example.com" }
//second ----- data=localStorage.getItem("user")  and get data to localStorage and This data convert to object, JSON.parse(data)   output: { id: "123", email: "user@example.com" }

export interface User {
  id: string;
  email: string;
  username?: string;
  isAccountVerified?: boolean;
  verifyOtpExpireAt?: string; // ✅ Add this line
  resetOtpExpireAt?: string;
}

export interface AuthState {
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  token?: string | null;
  user?: User | null;
}

export const getUserFromStorage = (): User | null => {
  try {
    const user = localStorage.getItem("user");
    return user ? (JSON.parse(user) as User) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    return null;
  }
};

const initialState: AuthState = {
  loading: false,
  successMessage: null,
  errorMessage: null,
  token: localStorage.getItem("token") || null,
  user: getUserFromStorage(),
};

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.token = action.payload.token || null;
        state.user = action.payload.user || null;
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token); // ✅ Store token safely
          localStorage.setItem("user", JSON.stringify(action.payload.user)); // ✅ Store user
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage =
          (action.payload as string) || "Something went wrong";
      });
  },
});

export const { clearMessages } = signupSlice.actions;
export default signupSlice.reducer;
