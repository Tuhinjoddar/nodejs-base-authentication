

import prisma from "../../database/prismaDB.js";
import sendEmail from "../email/emailAuth.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export const sendPasswordResetOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // ✅ Find user in the database
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // ✅ Generate a 6-digit OTP
        const resetOtp = crypto.randomInt(100000, 999999).toString();
        console.log("Generated OTP:", resetOtp);

        // ✅ Hash the OTP before saving
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(resetOtp, salt);

        // ✅ Update user with OTP and expiry time (10 minutes)
        await prisma.user.update({
            where: { email: user.email },
            data: {
                resetOtp: hashedOtp,
                resetOtpExpireAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });

        // ✅ Send OTP via email
        await sendEmail(
            user.email,
            "Password Reset OTP",
            `Your OTP for resetting your password is ${resetOtp}. It expires in 10 minutes.`
        );

        return res.status(200).json({ success: true, message: "Password reset OTP sent to email" });
    } catch (error) {
        console.error("Error sending password reset OTP:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
