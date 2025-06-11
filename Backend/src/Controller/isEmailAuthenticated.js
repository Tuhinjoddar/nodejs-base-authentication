

export const isAuthenticated = async (req, res) => {
    try {
        if (!req.user) { // ✅ Get user from `authMiddleware`
            return res.status(401).json({ success: false, message: "User is not authenticated" });
        }

        //console.log("qqqqqq", req.user)


        // Ensure user is verified
        if (!req.user.isAccountVerified) {
            return res.status(403).json({ success: false, message: "Account is not verified" });
        }

        return res.status(200).json({
            success: true,
            message: "User is authenticated",
            user: req.user
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
