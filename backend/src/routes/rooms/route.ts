import { Request, Response, Router } from "express";

const router = Router();

router.use("/rooms-health", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Rooms server is up",
  });
});

export const roomsRouter = router;
