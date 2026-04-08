import { Server } from "socket.io";
import { ENV } from "./env.js";

let io = null;
const liveSessionState = new Map();

const getSessionId = (value) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const roomName = (sessionId) => `session:${sessionId}`;

const emitPresence = async (sessionId) => {
  if (!io || !sessionId) return;

  const sockets = await io.in(roomName(sessionId)).fetchSockets();
  io.to(roomName(sessionId)).emit("session:presence", {
    sessionId,
    connectedCount: sockets.length,
  });
};

export const initSocketServer = (httpServer) => {
  if (io) return io;

  io = new Server(httpServer, {
    cors: {
      origin: ENV.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("session:join-room", async (payload = {}) => {
      const sessionId = getSessionId(payload.sessionId);
      if (!sessionId) return;

      socket.join(roomName(sessionId));
      socket.data.sessionId = sessionId;
      socket.data.user = payload.user || null;

      const liveState = liveSessionState.get(sessionId);
      if (liveState) {
        socket.emit("session:live-state", liveState);
      }

      socket.to(roomName(sessionId)).emit("session:user-joined", {
        sessionId,
        user: payload.user || null,
      });

      await emitPresence(sessionId);
    });

    socket.on("session:leave-room", async (payload = {}) => {
      const sessionId = getSessionId(payload.sessionId);
      if (!sessionId) return;

      socket.leave(roomName(sessionId));
      await emitPresence(sessionId);
    });

    socket.on("editor:sync", (payload = {}) => {
      const sessionId = getSessionId(payload.sessionId);
      if (!sessionId || typeof payload.code !== "string") return;

      const nextState = {
        ...liveSessionState.get(sessionId),
        sessionId,
        code: payload.code,
        language: payload.language || "python",
        updatedBy: payload.updatedBy || null,
        updatedAt: Date.now(),
      };

      liveSessionState.set(sessionId, nextState);

      socket.to(roomName(sessionId)).emit("editor:sync", {
        sessionId,
        code: nextState.code,
        language: nextState.language,
        updatedBy: nextState.updatedBy,
      });
    });

    socket.on("execution:sync", (payload = {}) => {
      const sessionId = getSessionId(payload.sessionId);
      if (!sessionId || !Array.isArray(payload.results)) return;

      const nextState = {
        ...liveSessionState.get(sessionId),
        sessionId,
        results: payload.results,
        allPassed: Boolean(payload.allPassed),
        lastRunBy: payload.lastRunBy || null,
        lastRunAt: Date.now(),
      };

      liveSessionState.set(sessionId, nextState);

      io.to(roomName(sessionId)).emit("execution:sync", {
        sessionId,
        results: payload.results,
        allPassed: Boolean(payload.allPassed),
        lastRunBy: payload.lastRunBy || null,
      });
    });

    socket.on("disconnecting", () => {
      for (const room of socket.rooms) {
        if (!room.startsWith("session:")) continue;

        const sessionId = room.slice("session:".length);

        socket.to(room).emit("session:user-left", {
          sessionId,
          user: socket.data.user || null,
        });

        setTimeout(() => {
          void emitPresence(sessionId);
        }, 0);
      }
    });
  });

  return io;
};

export const emitSessionUpdated = (session) => {
  if (!io || !session?._id) return;

  const sessionId = String(session._id);
  io.to(roomName(sessionId)).emit("session:updated", { session });
};

export const emitSessionsChanged = (sessionId) => {
  if (!io) return;

  io.emit("sessions:changed", {
    sessionId: sessionId ? String(sessionId) : null,
    at: Date.now(),
  });
};

export const clearLiveSessionState = (sessionId) => {
  if (!sessionId) return;
  liveSessionState.delete(String(sessionId));
};
