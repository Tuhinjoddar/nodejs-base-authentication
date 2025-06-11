import { createSlice } from "@reduxjs/toolkit";
import { getUserFromStorage, User } from "./SignupSlice";
import { sendEmailOtp } from "../authUser";

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
  name: "sendEmailOtp",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendEmailOtp.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(sendEmailOtp.fulfilled, (state, action) => {
        console.log("hbhj", action.payload);
        state.loading = false;
        if (state.user) {
          state.user.verifyOtpExpireAt = action.payload.verifyOtpExpireAt;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(sendEmailOtp.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = String(action.payload || "Failed to send OTP");
      });
  },
});

export default emailAuthSlice.reducer;
