import dotenv from "dotenv";
import helmet from "helmet";
import express from "express";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const HOST = process.env.HOST;


// Middleware protect your important details
app.use(helmet())

// ✅ Middleware
app.use(express.json());


// use cors origin backend and frontend.
app.use(
    cors({
        origin: process.env.ALLOWED_ORIGINS, // ✅ Convert string to array
        credentials: true, // ✅ Allows cookies if needed
    })
);



// docker compose.yaml first load backend then frontend start
// ✅ Health check (Docker)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' }); // ✅ Always returns 200 when backend is ready
});


// All routes......
import { router } from "./routes/All_Routes.js"

app.use(router);



// ✅ Start Express Server
app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});


