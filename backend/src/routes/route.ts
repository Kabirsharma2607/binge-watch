import { Router } from "express";
import { authRouter } from "./auth/route";
import { roomsRouter } from "./rooms/route";

const router = Router();

router.use("/auth", authRouter);
router.use("/rooms", roomsRouter);

export const appRouter = router;
