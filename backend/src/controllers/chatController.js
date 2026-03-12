import { chatClient } from "../lib/stream.js";

export const getStreamToken = async (req, res) => {
    try {
        //use the clerkId for stream (not mongodb _id) => it should match the id have in the stream dashboard
        const token = chatClient.createToken(req.user.clerkId);

        res.status(200).json({ 
            token,
            userId: req.user.clerkId,
            userName: req.user.name,
            userImage: req.user.image
         });
    } catch (error) {
        console.log("Error generating stream token:", error);
        res.status(500).json({ error: "Failed to generate stream token" });
    }
}