import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = (targetUserId) =>
  io(new URL(BASE_URL, location.origin).origin, {
    path: "/api/socket.io",
    auth: { targetUserId },
    withCredentials: true,
    autoConnect: false,
  });
