import express, { Request, Response } from "express";
import { appRouter } from "./routes/route";

const app = express();

app.use(express.json());

app.use("/api/v1", appRouter);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).send({ message: "Server is up." });
  return;
});

app.listen(3000, () => console.log("Server running on port 3000"));
