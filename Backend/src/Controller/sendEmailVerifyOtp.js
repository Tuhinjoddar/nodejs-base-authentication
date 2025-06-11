import prisma from "../../database/prismaDB.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import sendEmail from "../email/emailAuth.js";

export const emailVerifyOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        // ✅ Find user in the database
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }


        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified" });
        }

        // ✅ Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        console.log("Generated OTP:", otp);

        // ✅ Hash the OTP
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        // ✅ Store OTP expiration time (2 minutes)
        const verifyOtpExpireAt = new Date(Date.now() + 2 * 60 * 1000);

        // ✅ Update user with OTP and expiry time (2 minutes)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                verifyOtp: hashedOtp,
                verifyOtpExpireAt
            },
        });

        // ✅ Send OTP via email
        const otpSent = await sendEmail(
            user.email,
            "Account Verification OTP",
            `Your OTP is ${otp}. Verify your account using this OTP.`
        );

        if (!otpSent) {
            return res.status(500).json({ success: false, message: "Failed to send OTP" });
        }

        return res.status(200).json({ success: true, message: "Verification OTP sent to email", verifyOtpExpireAt });
    } catch (error) {
        console.error("Email verification error:", error);
        return res.status(500).json({ success: false, message: "Internal server  hbjh error" });
    }
};
