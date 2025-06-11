import jwt from "jsonwebtoken";
import prisma from "../../database/prismaDB.js";

export const authMiddleware = async (req, res, next) => {
    try {
        // ✅ Extract the token
        const token = req.headers.authorization?.split(" ")[1];
        //console.log("token", token);

        if (!token) {
            return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
        }


        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({ success: false, message: "Server error: Missing secret key" });
        }

        //console.log("key", secretKey);

        // ✅ Verify JWT token
        const decoded = jwt.verify(token, secretKey);

        // console.log("decoded", decoded);

        if (!decoded.id) {
            return res.status(401).json({ success: false, message: "Invalid Token. Login Again" });
        }

        // ✅ Fetch user from database
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }


        // Attach user info to request 
        // middleware send to this data isEmailAuthenticated and which controller add middleware.
        req.user = { id: user.id, email: user.email, username: user.username, isAccountVerified: user.isAccountVerified };

        // Proceed to next middleware/controller
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ success: false, message: error.message });
    }
};

