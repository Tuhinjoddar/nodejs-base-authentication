
import { Router } from "express";

import { signUp } from "../Controller/signUp.js";
import { getAllUsers } from "../Controller/allUsers.js";
import { getUserById } from "../Controller/userbyId.js";
import { login } from "../Controller/login.js";
import { updateUserProfile } from "../Controller/profileUpdate.js";
import { getUserProfile } from "../Controller/profileUser.js";
import { logout } from "../Controller/logout.js";
import { emailVerifyOtp } from "../Controller/sendEmailVerifyOtp.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyEmail } from "../Controller/verifyEmail.js";
import { isAuthenticated } from "../Controller/isEmailAuthenticated.js";
import { sendPasswordResetOtp } from "../Controller/emailpasswordResetOtp.js";
import { resetPassword } from "../Controller/emailResetPassword.js";
import { home } from "../Controller/home.js";



const router = Router();
// Home Routes
router.get("/", home);

// Auth Routes
router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", authMiddleware, logout)


// User Routes
router.get("/users", authMiddleware, getAllUsers);
router.get("/user/:id", authMiddleware, getUserById);
router.get("/profile/:id", authMiddleware, getUserProfile);
router.put("/update-profile/:id", authMiddleware, updateUserProfile);


// Email Verification & Authentication
router.post("/send-verify-otp", emailVerifyOtp)
router.post("/verify-account", authMiddleware, verifyEmail)
router.get("/is-auth", authMiddleware, isAuthenticated)


// password reset
router.post("/send-reset-otp", sendPasswordResetOtp)
router.post("/reset-password", resetPassword)



export { router };
