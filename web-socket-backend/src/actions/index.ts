import { VideoActions } from "@kabir.26/binge-watch-common";
import { WebSocket } from "ws";
import { rooms } from "..";

export const handleVideoActions = async (
  roomId: string,
  username: string,
  action: VideoActions,
  ws: WebSocket
) => {
  try {
    if (!rooms[roomId] || rooms[roomId].size === 0 || !rooms[roomId].has(ws)) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "You cannot do actions on this room",
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
            type: "video-actions",
            username,
            action,
          })
        );
      }
    });
    return;
  } catch (error) {}
};
