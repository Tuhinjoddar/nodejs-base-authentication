import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,  // Corrected host
    port: process.env.SMTP_PORT, // Use 465 for SSL or 587 for TLS
    secure: true, // Set to true for port 465, false for 587
    auth: {
        user: process.env.SMTP_USER, // Your Gmail email
        pass: process.env.SMTP_PASS, // Your Gmail app password
    },
});

// Verify the SMTP connection
transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Connection Error:", error);
    } else {
        console.log("SMTP Connected Successfully!");
    }
});

// Function to send an email
const sendEmail = async (email, subject, text) => {
    console.log("Sending email to:", email);
    try {
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject,
            text: `${text}`,
        });
        console.log("Email sent successfully!");
        return true
    } catch (error) {
        console.error("Error sending email:", error.message);
        return false
    }
};

export default sendEmail;
