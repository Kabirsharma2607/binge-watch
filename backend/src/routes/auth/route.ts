import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import {
  generateAuthToken,
  userHashedSignupDetails,
  validatePassword,
} from "./utils";

import { signUpSchema, loginSchema } from "@kabir.26/binge-watch-common";

const prisma = new PrismaClient();

const router = Router();

router.get("/auth-health", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Auth is up",
  });
});

router.post("/sign-up", async (req: Request, res: Response) => {
  try {
    const { success, data } = signUpSchema.safeParse(req.body);

    if (!success) {
      res.status(400).send("Invalid signup details");
      return;
    }

    const { name, email, password, username } = data;

    const user = await prisma.users.findUnique({
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
    const newUser = await prisma.users.create({
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
    const { success, data } = loginSchema.safeParse(req.body);

    if (!success) {
      res.status(400).send("Invalid login details");
      return;
    }

    const { username, password } = data;

    const user = await prisma.users.findUnique({
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
