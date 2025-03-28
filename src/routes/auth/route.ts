import { Request, Response, Router } from "express";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();

router.get("/auth-health", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Auth is up",
  });
});

router.post("/sign-up", async (req: Request, res: Response) => {
  console.log("here");
  const { body } = req;

  const { name, email, password, username } = body;

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (user) {
    console.log("user is there");
    res.status(400);
    return;
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      username,
      email,
      authDetails: {
        create: {
          password,
        },
      },
    },
  });
  res.status(200);
  return;
});

export const authRouter = router;
