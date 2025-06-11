import { createSlice } from "@reduxjs/toolkit";
import { getUserFromStorage, User } from "./SignupSlice";
import { verifyUserEmail } from "../authUser";

export interface AuthState {
  loading: boolean;
  successMessage: string | null;
  errorMessage: string | null;
  token?: string | null;
  user?: User | null;
}

const initialState: AuthState = {
  loading: false,
  successMessage: null,
  errorMessage: null,
  token: localStorage.getItem("token") || null,
  user: getUserFromStorage(),
};

const emailAuthSlice = createSlice({
  name: "emailVerify",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(verifyUserEmail.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
        state.successMessage = null;
      })
      .addCase(verifyUserEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(verifyUserEmail.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = String(action.payload || "Verification failed");
      });
  },
});

export default emailAuthSlice.reducer;
