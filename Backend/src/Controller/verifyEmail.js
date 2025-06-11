import bcrypt from "bcryptjs";
import prisma from "../../database/prismaDB.js";

export const verifyEmail = async (req, res) => {
    try {
        const { id, otp } = req.body;

        if (!id || !otp) {
            return res.status(400).json({ success: false, message: "Missing details" });
        }

        // ✅ Find the user in the database
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified" });
        }

        if (!user.verifyOtp || new Date() > user.verifyOtpExpireAt) {
            return res.status(400).json({ success: false, message: "OTP has expired" });
        }

        // ✅ Compare OTP
        const isOtpValid = await bcrypt.compare(otp, user.verifyOtp);
        if (!isOtpValid) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // ✅ Update user verification status
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isAccountVerified: true,
                verifyOtp: null,
                verifyOtpExpireAt: null,
            },
        });

        return res.status(200).json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        console.error("Email verification error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


