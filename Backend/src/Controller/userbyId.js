
import prisma from "../../database/prismaDB.js"; // Import Prisma client


// Fetch user by ID
export const getUserById = async (req, res) => {
    let { id } = req.params;

    // Ensure correct data type
    if (!id) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Convert `id` to integer if necessary
    if (!isNaN(id)) {
        id = parseInt(id, 10);
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                phoneNumber: true,
                createdAt: true,
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            user
        });

    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ success: false, message: "Failed to fetch user" });
    }
};
