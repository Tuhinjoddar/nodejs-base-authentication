import { configureStore } from "@reduxjs/toolkit";
import sendOtpToEmailReducer from "./AllSlices/SendEmailOtpSlice.ts";
import signupReducer from "./AllSlices/SignupSlice.ts";
import loginReducer from "./AllSlices/LoginSlice.ts";
import emailverifyReducer from "./AllSlices/EmailVerifySlice.ts";
// Create the Redux store
const store = configureStore({
  reducer: {
    signup: signupReducer,
    login: loginReducer, // Add the profile reducer
    sendOtpToEmail: sendOtpToEmailReducer,
    emailverify: emailverifyReducer,
  },
});

// TypeScript types for Redux state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; // ✅ Default export of the store
