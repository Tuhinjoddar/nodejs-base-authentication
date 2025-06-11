import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../authUser.ts";

export interface User {
  id: string;
  email: string;
  username?: string;
  isAccountVerified?: boolean;
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
  token: localStorage.getItem("token") ?? null,
  user: getUserFromStorage(),
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.token = action.payload.token || null;
        state.user = action.payload.user || null;

        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token); // ✅ Store token safely
          localStorage.setItem("user", JSON.stringify(action.payload.user)); // ✅ Store user
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage =
          (action.payload as string) || "Something went wrong";
      });
  },
});
export const { clearMessages } = loginSlice.actions;
export default loginSlice.reducer;
