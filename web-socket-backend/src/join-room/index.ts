import { WebSocket } from "ws";
import { prisma, rooms, wss } from "..";

export const handleRoomJoin = async (
  roomId: string,
  username: string,
  ws: WebSocket
) => {
  try {
    const user = await prisma.users.findUnique({ where: { username } });
    if (!user) {
      ws.send(JSON.stringify({ type: "error", message: "User not found" }));
      ws.close();
      return;
    }
    console.log(typeof roomId);
    const room = await prisma.room_details.findUnique({
      where: {
        room_id: roomId,
      },
    });
    if (!room) {
      ws.send(JSON.stringify({ type: "error", message: "Room not found" }));
      ws.close();
      return;
    }
    if (room.curr_capacity === room.capacity) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "Room is already full",
        })
      );
      ws.close();
      return;
    }
    const userInAnotherRoom = await prisma.room_participant.findFirst({
      where: {
        user_id: user.user_id,
      },
    });
    if (userInAnotherRoom) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "User is already in another room",
        })
      );
      ws.close();
      return;
    }
    const alreadyJoinedRoom = await prisma.room_participant.findUnique({
      where: {
        room_id_user_id: {
          room_id: room.room_id,
          user_id: user.user_id,
        },
      },
    });
    if (alreadyJoinedRoom) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: "User already joined the room",
        })
      );
      ws.close();
      return;
    }
    await prisma.room_participant.create({
      data: {
        room_id: roomId,
        user_id: user.user_id,
      },
    });
    if (!rooms[roomId]) {
      rooms[roomId] = new Set();
    }
    rooms[roomId].add(ws);
    await prisma.room_details.update({
      where: {
        room_id: roomId,
      },
      data: {
        curr_capacity: {
          increment: 1,
        },
      },
      select: {
        curr_capacity: true,
      },
    });
    (ws as any).roomId = roomId;
    (ws as any).username = username;
    console.log(`✅ ${username} joined room ${roomId}`);

    rooms[roomId].forEach((client) => {
      if (client.readyState === WebSocket.OPEN && ws !== client) {
        client.send(
          JSON.stringify({ type: "user-joined", message: `${username} joined` })
        );
      }
    });
    ws.send(
      JSON.stringify({
        type: "current-users",
        users: Array.from(rooms[roomId]).map(
          (client) => (client as any).username
        ),
      })
    );
  } catch (error) {
    console.error(error);
    ws.send(JSON.stringify({ type: "error", message: "Internal error" }));
    ws.close();
  }
};
