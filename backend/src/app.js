import express from "express";
import path from "path";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import { clerkMiddleware } from "@clerk/express";
import { protectedRoute } from "./middleware/protectedRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";


const app = express();

const __dirname = path.resolve();

//middlewares
app.use(express.json());
app.use(cors({
    origin:ENV.FRONTEND_URL,
    credentials:true
}));
app.use(clerkMiddleware()); // this will add req.auth() to the request object.

//routes for inngest functions
app.use("/api/inngest", serve({client: inngest, functions}));

//routes
app.use('/api/chat',chatRoutes);
app.use("/api/session", sessionRoutes);

//its for deployment in production
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
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
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();