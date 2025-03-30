import { WebSocket } from "ws";
import { prisma, rooms, wss } from "..";

export const handleLeaveRoom = async (
  roomId: string,
  username: string,
  ws: WebSocket
) => {
  try {
    if (!rooms[roomId] || rooms[roomId].size === 0 || !rooms[roomId].has(ws)) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "You cannot leave a room you never joined",
        })
      );
      return;
    }

    await prisma.$transaction(async (tx) => {
      const user = await tx.users.findUnique({
        where: { username },
      });

      if (!user) {
        ws.send(JSON.stringify({ type: "error", message: "User not found" }));
        ws.close();
        throw new Error("User not found");
      }

      const room = await tx.room_details.findUnique({
        where: { room_id: roomId },
      });

      if (!room) {
        ws.send(JSON.stringify({ type: "error", message: "Room not found" }));
        ws.close();
        throw new Error("Room not found");
      }

      await tx.room_participant.delete({
        where: {
          room_id_user_id: {
            user_id: user.user_id,
            room_id: room.room_id,
          },
        },
      });

      const remainingCount = await tx.room_details.findUnique({
        where: { room_id: roomId },
        select: { curr_capacity: true },
      });

      if (!remainingCount) {
        ws.close();
        throw new Error("Room capacity check failed");
      }

      if (remainingCount.curr_capacity === 1) {
        await tx.room_details.delete({ where: { room_id: roomId } });
      } else {
        await tx.room_details.update({
          where: { room_id: roomId },
          data: { curr_capacity: { decrement: 1 } },
        });
      }
    });

    rooms[roomId].delete(ws);
    rooms[roomId].forEach((client) => {
      if (client.readyState === WebSocket.OPEN && ws !== client) {
        client.send(
          JSON.stringify({
            type: "USER_LEFT",
            message: `${username} left`,
          })
        );
      }
    });

    ws.send(
      JSON.stringify({
        type: "SUCCESS",
        message: "You have left the room",
      })
    );

    console.log(`👋 ${username} left room ${roomId}`);

    ws.close();
  } catch (error) {
    ws.send(
      JSON.stringify({ type: "error", message: "Error leaving the room" })
    );
    console.error("Error in handleLeaveRoom:", error);
  }
};
