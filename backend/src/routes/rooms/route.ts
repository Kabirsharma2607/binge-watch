import { createRoomSchema } from "@kabir.26/binge-watch-common";
import { PrismaClient } from "@prisma/client";
import { Request, Response, Router } from "express";

const prisma = new PrismaClient();

const router = Router();

router.get("/rooms-health", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Rooms server is up",
  });
});

router.post("/create-room", (req: Request, res: Response) => {
  try {
    const { success, data } = createRoomSchema.safeParse(req.body);
    if (!success) {
      res.status(400).json({ message: "Invalid room data", error: data });
      return;
    }
    const { capacity, name } = data;
    const room = prisma.roomDetails.create({
      data: {
        capacity,
        name,
      },
    });
  } catch (error) {}
});

export const roomsRouter = router;
