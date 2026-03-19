import { Session } from "../models/Session.js";
import { streamClient,chatClient } from "../lib/stream.js";

export async function createSession(req, res) {
    try {
       const {problem, difficulty} = req.body;
       const userId = req.user._id;
       const clerkId = req.user.clerkId;

       if (!problem || !difficulty) {
        return res.status(400).json({ error: "Problem and difficulty are required" });
       }
       
       //generate a unique call id for stream video
       const callId = `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;

       const session = await Session.create({
        problem,
        difficulty,
        host: userId,
        callId,
       });

       //create a stream video call
       await streamClient.video.call('default', callId).getOrCreate({
        data: {
            created_by_id: clerkId,
            custom: { problem, difficulty ,sessionId: session._id.toString()},
        }
       })
       //chat messaing
       const channel = chatClient.channel('messaging', callId, {
        name: `${problem} Session`,
        created_by_id: clerkId,
        members: [clerkId],
       });

       await channel.create();

       res.status(201).json({ session });
    } catch (error) {
        console.error("Error creating session:", error);
        res.status(500).json({ error: "Failed to create session" });
    }
}

export async function getActiveSessions(req, res) {
    try {
        const sessions = await Session.find({ status: "active" }).populate("host", "name profileImage email clerkId").sort({ createdAt: -1 }).limit(20);

        res.status(200).json({ sessions });
    } catch (error) {
        console.log("Error fetching active sessions:", error);
        res.status(500).json({ error: "Failed to fetch active sessions" });
    }
}

export async function getMyRecentSessions(req, res) {
    try {
        //get the sessions where the user is either host or participant
        const userId = req.user._id;
        const sessions = await Session.find({
            status: "completed",
            $or: [ { host: userId }, { participant: userId } ]
        }).sort({ createdAt: -1 }).limit(20);

        res.status(200).json({ sessions });
    } catch (error) {
        console.log("Error fetching recent sessions:", error);
        res.status(500).json({ error: "Failed to fetch recent sessions" });
    }
}

export async function getSessionById(req, res) {
    try {
        const {id} = req.params;
        const session = await Session.findById(id).populate("host", "name profileImage email clerkId").populate("participant", "name profileImage email clerkId");

        if(!session){
            return res.status(404).json({ error: "Session not found" });
        }
        res.status(200).json({ session });
    } catch (error) {
        console.log("Error fetching session by id:", error);
        res.status(500).json({ error: "Failed to fetch session" });
    }
}

export async function joinSession(req, res) {
    try {
        const {id} = req.params;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        const session = await Session.findById(id);
        if(!session){
            return res.status(404).json({ error: "Session not found" });
        }
        if(session.status !== "active"){
            return res.status(400).json({ error: "Session is not active" });
        }
        if(session.host.toString() === userId.toString()){
            return res.status(400).json({ error: "Host cannot join as participant" });
        }

        //check if session is already full - has a participant
        if(session.participant){
            return res.status(400).json({ error: "already have a participant" });
        }

        //add participant to db
        session.participant = userId;
        await session.save();

        //add participant to stream video call
        const channel = chatClient.channel('messaging', session.callId);
        await channel.addMembers([clerkId]);

        res.status(200).json({ session });
    } catch (error) {
        console.log("Error joining session:", error);
        res.status(500).json({ error: "Failed to join session" });
    }
}

export async function endSession(req, res) {
    try {
        const {id} = req.params;
        const userId = req.user._id;
        const session = await Session.findById(id);
        if(!session){
            return res.status(404).json({ error: "Session not found" });
        }

        //check if user is host 
        if(session.host.toString() !== userId.toString()){
            return res.status(403).json({ error: "Only host can end the session" });
        }
        //check if session is already completed
        if(session.status === "completed"){
            return res.status(400).json({ error: "Session is already completed" });
        }

        //delete the stream video call
        const call = streamClient.video.call('default', session.callId);
        await call.delete({hard: true});

        //delete the chat channel
        const channel = chatClient.channel('messaging', session.callId);
        await channel.delete();

        //update session status to completed
        session.status = "completed";
        await session.save();

        res.status(200).json({ session });
    } catch (error) {
        console.log("Error ending session:", error);
        res.status(500).json({ error: "Failed to end session" });
    }
}