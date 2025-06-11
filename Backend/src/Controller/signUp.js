import sendEmail from "../email/emailAuth.js";
import prisma from "../../database/prismaDB.js";
import { signupValidation } from "../validation/authValidation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const signUp = async (req, res) => {

    try {
        // ✅ Validate the request body using Zod
        const validation = signupValidation.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ errors: validation.error.errors });
        }

        const { username, email, phoneNumber, password } = validation.data;

        // ✅ Check if email already exists
        const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // ✅ Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Create new user with hashed password
        const signupData = await prisma.user.create({
            data: { username, email, phoneNumber, password: hashedPassword },

        });

        //This way,  never returns the password from the database in the first place.
        const { password: _, ...userWithoutPassword } = signupData;

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { id: signupData.id, email: signupData.email }, // Payload
            process.env.SECRET_KEY, // Secret key (must be stored in .env)
            { expiresIn: "7d" } // Token expiry time
        );

        // sendEmail called.
        await sendEmail(email, "Welcome to Our Platform", `Welcome to My Website. Your account has been created with email id: ${email}`);


        res.status(201).json({ success: true, message: "Signup successful!", user: userWithoutPassword, token });


    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Signup failed. Try again.",
            message: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
}












