import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../dist/swagger/swagger.json";
import express, { Request, Response, NextFunction } from "express";
import { userRouter } from "./routes/auth/auth-user.route";
import errorHandler from "./middlewares/error-handle";
import dotenv from "dotenv";
import { postRouter } from "./routes/post-question,route";
dotenv.config();
// app running
export const app = express();
app.use(express.json());

//  testings swagger routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// routes
app.use("/", userRouter);
app.use("/", postRouter);
// middleware
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new Error(`page could be not found!`));
});
app.use(errorHandler);
