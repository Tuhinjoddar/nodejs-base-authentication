

import prisma from "../../database/prismaDB.js";
import bcrypt from "bcryptjs";
import { loginValidation } from "../validation/authValidation.js"; // Import Zod schema
import jwt from "jsonwebtoken";


export const login = async (req, res) => {
    try {
        // ✅ Validate request body
        const validation = loginValidation.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors.map(err => err.message) });
        }

        const { email, password } = validation.data; // Use validated data

        // ✅ Check if user exists
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ error: "User not found" });

        // ✅ Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });


        // ✅ Remove password before returning user
        const { password: _, ...userWithoutPassword } = user;


        // ✅ Generate JWT token
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({ success: false, error: "Server configuration error: Missing secret key" });
        }

        // ✅ Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email }, // Payload
            secretKey, // Secret key
            { expiresIn: "7d" } // Token expiry time
        );

        res.json({ success: true, message: "Login successfull", user: userWithoutPassword, token });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
