import { createRoomSchema } from "@kabir.26/binge-watch-common";
import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";
import { generateRoomId } from "./utils";
import { authMiddleware } from "../middlewares/auth";

const prisma = new PrismaClient();

const router = Router();

router.use(authMiddleware);
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
    console.log("25");
    const { userId } = req;

    const user = await prisma.users.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid room data", error: data });
      return;
    }

    const { capacity, name } = data;
    const roomId = generateRoomId();
    const room = await prisma.room_details.create({
      data: {
        room_id: roomId,
        name,
        capacity,
      },
    });
    res.status(200).json({
      message: "Room created successfully",
      roomId: room.room_id,
      username: user.username,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal error");
    return;
  }
});

router.post("/join-room/:roomId", async (req, res) => {
  try {
    const { userId } = req;
    const user = await prisma.users.findUnique({
      where: {
        user_id: userId,
      },
    });
    const { roomId } = req.params;
    const room = await prisma.room_details.findUnique({
      where: {
        room_id: roomId,
      },
    });
    if (!room) {
      res.status(400).json({ message: "Room not found" });
      return;
    }
    if (!user) {
      res.status(400).json({ message: "Invalid user" });
      return;
    }
    res.status(200).json({ message: "Success" });
    return;
  } catch (error) {}
});

export const roomsRouter = router;
