import { WebSocket } from "ws";
import { prisma, rooms, wss } from "..";

export const handleRoomJoin = async (
  roomId: string,
  username: string,
  ws: WebSocket
) => {
  const user = await prisma.users.findUnique({ where: { username } });
  if (!user) {
    ws.send(JSON.stringify({ type: "error", message: "User not found" }));
    return;
  }
  const room = await prisma.room_details.findUnique({
    where: {
      room_id: Number(roomId),
    },
  });
  if (!room) {
    ws.send(JSON.stringify({ type: "error", message: "Room not found" }));
    return;
  }
  await prisma.room_participant.create({
    data: {
      user_id: user.user_id,
      room_id: room.room_id,
    },
  });
  console.log("here 29");
  if (!rooms[roomId]) {
    rooms[roomId] = new Set();
  }
  rooms[roomId].add(ws);
  (ws as any).roomId = roomId;
  console.log(`✅ ${username} joined room ${roomId}`);

  rooms[roomId].forEach((client) => {
    if (client.readyState === WebSocket.OPEN && ws !== client) {
      client.send(
        JSON.stringify({ type: "user-joined", message: `${username} joined` })
      );
    }
  });
};
