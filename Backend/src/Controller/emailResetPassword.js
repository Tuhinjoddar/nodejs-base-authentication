
import prisma from "../../database/prismaDB.js"; // Prisma client
import bcrypt from "bcryptjs";
import { resetPasswordSchema } from "../validation/authValidation.js";

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, otp } = req.body;

        // ✅ Validate input using Zod (optional)
        const validationResult = resetPasswordSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ success: false, message: validationResult.error.errors[0].message });
        }

        // ✅ Find user by email
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // ✅ Ensure OTP exists and hasn't expired
        if (!user.resetOtp || !user.resetOtpExpireAt || Date.now() > new Date(user.resetOtpExpireAt).getTime()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // ✅ Compare the hashed OTP
        const isOtpValid = await bcrypt.compare(otp, user.resetOtp);
        if (!isOtpValid) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // ✅ Prevent reusing the old password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ success: false, message: "New password must be different from the old password" });
        }

        // ✅ Hash new password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // ✅ Update user password and clear OTP fields
        await prisma.user.update({
            where: { email: user.email },
            data: {
                password: hashedPassword,
                resetOtp: null,
                resetOtpExpireAt: null,
            },
        });

        return res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
