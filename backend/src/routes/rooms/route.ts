import { createRoomSchema } from "@kabir.26/binge-watch-common";
import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { generateRoomId } from "./utils";

const prisma = new PrismaClient();

const router = Router();

router.get("/rooms-health", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Rooms server is up",
  });
});

router.post("/create-room", async (req: Request, res: Response) => {
  try {
    const { success, data } = createRoomSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: "Invalid room data", error: data });
      return;
    }
    const { capacity, name } = data;
    const roomId = generateRoomId();
    const room = await prisma.roomDetails.create({
      data: {
        room_id: roomId,
        name,
        capacity,
      },
    });
    res.status(200).json({
      message: "Room created successfully",
      roomId: room.room_id,
    });
    return;
  } catch (error) {
    res.status(500).send("Internal error");
    return;
  }
});

export const roomsRouter = router;
