import WebSocket, { WebSocketServer } from "ws";
import { handleRoomJoin } from "./join-room";

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
export const rooms: Record<string, Set<WebSocket>> = {}; // Global room storage
export const wss = new WebSocketServer({ port: 8080 });

console.log("Web socket server running on 8080");

wss.on("connection", (ws) => {
  ws.on("message", async (message) => {
    try {
      const parsedMessage = JSON.parse(message.toString());
      console.log(parsedMessage);
      switch (parsedMessage.type) {
        case "join-room":
          const { roomId, username } = parsedMessage.data;
          await handleRoomJoin(roomId, username, ws);
          break;
        default:
          break;
      }
    } catch (error) {
      ws.send(
        JSON.stringify({ type: "error", message: "Invalid JSON format" })
      );
    }
  });
  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});
