import prisma from "../../database/prismaDB.js";
import { updateProfileValidation } from "../validation/authValidation.js";

export const updateUserProfile = async (req, res) => {
    let { id } = req.params;  // Get user ID from request params
    console.log("Finding user by ID:", id);
    // Ensure correct data type
    if (!id) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Convert `id` to integer if necessary
    if (!isNaN(id)) {
        id = parseInt(id, 10);
    }

    try {
        // Validate input using Zod
        const validationResult = updateProfileValidation.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ success: false, message: validationResult.error.errors[0].message });
        }

        const { username, email, phoneNumber } = validationResult.data;

        // Find existing user by ID
        const existingUser = await prisma.user.findUnique({ where: { id: Number(id) } });
        console.log("Existing User:", existingUser);

        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if email is changing and already exists
        if (email && email !== existingUser.email) {
            console.log("Checking if email exists:", email);
            const emailExists = await prisma.user.findUnique({ where: { email } });
            if (emailExists) {
                return res.status(400).json({ success: false, message: "Email is already in use" });
            }
        }

        // Update user profile
        const updatedUserData = await prisma.user.update({
            where: { id: Number(id) },
            data: { username, email, phoneNumber },
        });

        console.log("Updated User:", updatedUserData);
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            updateProfile: updatedUserData,
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ success: false, message: "Failed to update profile" });
    }
};
