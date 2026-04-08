import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL.replace(/\/api\/?$/, "");

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
  }

  return socket;
};
