import { WebSocket } from "ws";
import { rooms } from "..";

export const broadcastMessageToRoom = async (
  roomId: string,
  username: string,
  message: string,
  ws: WebSocket
) => {
  try {
    if (!rooms[roomId] || rooms[roomId].size === 0 || !rooms[roomId].has(ws)) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "You cannot send messages to a room you are not in",
        })
      );
      ws.close();
      return;
    }
    const usersInRoom = Array.from(rooms[roomId]);
    usersInRoom.forEach((userWs) => {
      if (userWs.readyState === WebSocket.OPEN) {
        userWs.send(
          JSON.stringify({
            type: "message",
            username,
            message,
          })
        );
      }
    });
    return;
  } catch (error) {
    ws.send(
      JSON.stringify({
        type: "error",
        message: "Error broadcasting message to the room",
      })
    );
  }
};
