import express, { Request, Response } from "express";

export const app = express();

app.get("/", (_req: Request, res: Response) => {
  res.send("hello world");
});
