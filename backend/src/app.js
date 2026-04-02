import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import { clerkMiddleware } from "@clerk/express";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import codeExecuteRoutes from "./routes/codeExecuteRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

const app = express();
const __dirname = path.resolve();

// middlewares
app.use(express.json());
app.use(cors({
    origin: ENV.FRONTEND_URL,
    credentials: true
}));
app.use(clerkMiddleware());

// routes for inngest functions
app.use("/api/inngest", serve({ client: inngest, functions }));


// ← DEBUG: open http://localhost:PORT/api/compilers in browser to see exact compiler strings
// app.get("/api/compilers", async (req, res) => { // this part is not needed, its to check available compilers and their ids
//   const response = await fetch("https://api.onlinecompiler.io/api/compilers/", {
//     headers: { "Authorization": ENV.ONLINE_COMPILER_API_KEY }
//   });
//   const data = await response.json();
//   res.json(data);
// });

app.use("/api", codeExecuteRoutes); // all code execution requests will go to this route
// ─────────────────────────────────────────────────────────────────────────────

// routes
app.use('/api/chat', chatRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/resume", resumeRoutes);

// production
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log(`Server is running on port ${ENV.PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();