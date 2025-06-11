
import prisma from "../../database/prismaDB.js"; // Import Prisma client

// Fetch user profile by ID
export const getUserProfile = async (req, res) => {
    let { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                username: true,
                email: true,
                phoneNumber: true,
                createdAt: true,
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                updateProfile: null
            });
        }

        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            updateProfile: user
        });

    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ success: false, message: "Failed to fetch user", updateProfile: null });
    }
};
