import WebSocket, { WebSocketServer } from "ws";
import { handleRoomJoin } from "./join-room";

import { PrismaClient } from "@prisma/client";

import {
  WebSocketActions,
  joinRoomSchema,
  leaveRoomSchema,
} from "@kabir.26/binge-watch-common";
import { messageParsingError } from "./utils/utils";
import { handleLeaveRoom } from "./leave-room";

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
        case WebSocketActions.JOIN_ROOM: {
          const { success, data } = joinRoomSchema.safeParse(parsedMessage);
          if (!success) {
            messageParsingError(ws);
            return;
          }
          const {
            data: { roomId, username },
          } = data;
          await handleRoomJoin(roomId, username, ws);
          break;
        }
        case WebSocketActions.LEAVE_ROOM: {
          const { success, data } = leaveRoomSchema.safeParse(parsedMessage);
          if (!success) {
            messageParsingError(ws);
            return;
          }
          const {
            data: { roomId, username },
          } = data;
          await handleLeaveRoom(roomId, username, ws);
          break;
        }
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
