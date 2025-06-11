
export const logout = async (req, res) => {
    try {

        res.status(200).json({
            success: true,
            message: "Logged out successfully!",
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "Logout failed. Try again later.",
        });
    }
};


