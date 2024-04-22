import express, { Request, Response, NextFunction } from "express";

export const monolithRoutes = express.Router();

monolithRoutes.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "ok" });
});
