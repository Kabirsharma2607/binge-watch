import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import {
  generateAuthToken,
  userHashedSignupDetails,
  validatePassword,
} from "./utils";
const prisma = new PrismaClient();

const router = Router();

router.get("/auth-health", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Auth is up",
  });
});

router.post("/sign-up", async (req: Request, res: Response) => {
  try {
    const { body } = req;

    const { name, email, password, username } = body;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      res.status(400).send("User already exists");
      return;
    }
    const { hashedName, hashedEmail, hashedPassword } =
      await userHashedSignupDetails(name, email, password);
    const newUser = await prisma.user.create({
      data: {
        name: hashedName,
        username,
        email: hashedEmail,
        authDetails: {
          create: {
            password: hashedPassword,
          },
        },
      },
    });
    if (newUser) {
      const authToken = generateAuthToken(newUser.user_id);
      res.status(201).json({
        message: "User created",
        token: authToken,
      });
    } else {
      res.status(400).send("User not created");
    }
    return;
  } catch (error) {
    res.status(500).send("Internal error");
    return;
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const { username, password } = body;
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        user_id: true,
        authDetails: {
          select: {
            password: true,
          },
        },
      },
    });
    if (!user) {
      res.status(401).send("Invalid credentials");
      return;
    }
    const isPasswordValid = await validatePassword(
      password,
      user.authDetails?.password!
    );
    if (isPasswordValid) {
      const authToken = generateAuthToken(user.user_id);
      res.status(200).json({
        message: "Logged in",
        token: authToken,
      });
    } else {
      res.status(401).send("Invalid credentials");
    }
    return;
  } catch (error) {
    res.status(500).send("Internal error");
    return;
  }
});

export const authRouter = router;
