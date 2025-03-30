import WebSocket, { WebSocketServer } from "ws";
import { handleRoomJoin } from "./join-room";

import { PrismaClient } from "@prisma/client";

import {
  WebSocketActions,
  actionsSchema,
  joinRoomSchema,
  leaveRoomSchema,
  textMessageSchema,
} from "@kabir.26/binge-watch-common";
import { messageParsingError } from "./utils/utils";
import { handleLeaveRoom } from "./leave-room";
import { broadcastMessageToRoom } from "./text-message";
import { handleVideoActions } from "./actions";

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
        case WebSocketActions.TEXT_MESSAGE: {
          const { success, data } = textMessageSchema.safeParse(parsedMessage);
          if (!success) {
            messageParsingError(ws);
            return;
          }
          const {
            data: { roomId, message, username },
          } = data;
          await broadcastMessageToRoom(roomId, username, message, ws);
          break;
        }
        case WebSocketActions.ACTIONS: {
          const { success, data } = actionsSchema.safeParse(parsedMessage);
          if (!success) {
            messageParsingError(ws);
            return;
          }
          const {
            data: { action, roomId, username },
          } = data;
          await handleVideoActions(roomId, username, action, ws);
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
