import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// FormData come to signup.ts  type FormData
export const signupUser = createAsyncThunk(
  "signup",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log("Signup data", data);
      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Store JWT token in localStorage
      localStorage.setItem("token", data.token);

      return {
        message: data.message || "Signup successful!",
        token: data.token,
        user: data.user, // Assuming backend returns user details
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Something went wrong...");
    }
  }
);

//FromData come to login.ts
export const loginUser = createAsyncThunk(
  "login",
  async (formData: any, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      //console.log("Login data", data);

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      localStorage.setItem("token", data.token);

      return {
        message: data.message || "Login successfull",
        token: data.token,
        user: data.user,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Something went wrong...");
    }
  }
);

// send email OTP .
interface SendEmailOtpResponse {
  success: boolean;
  message: string;
  verifyOtpExpireAt: string;
}

export const sendEmailOtp = createAsyncThunk<SendEmailOtpResponse, string>(
  "sendOtpToEmail",
  async (email, { rejectWithValue }) => {
    console.log(email, "kkk");
    try {
      const response = await axios.post(`${BACKEND_URL}/send-verify-otp`, {
        email,
      });
      console.log("asdfghj", response);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to send OTP"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// verify User Email

interface VerifyEmailData {
  id: string;
  otp: string;
  token: string;
}

export const verifyUserEmail = createAsyncThunk(
  "verifyUserByEmail",
  async ({ id, otp, token }: VerifyEmailData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/verify-account`,
        { id, otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("oooooooooo", response);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Verification failed"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);
