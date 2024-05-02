import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../dist/swagger/swagger.json";
import express, { Request, Response, NextFunction } from "express";
import errorHandler from "./middlewares/error-handle";
// import { postRouter } from "./routes/post-question,route";
import getConfig from "./utils/config";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import loggerMiddleware from "./middlewares/logger-handle";
import { RegisterRoutes } from "./routes/routes";

// app running
export const app = express();
// Security Middlewares
app.use(express.json());

app.set("trust proxy", 1);
// // app.use(ipWhitelist([]))
app.use(hpp());
app.use(helmet());
app.use(
  cors({
    origin: getConfig().apiGateway,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
app.use(express.static("public"));

//  testings swagger routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// routes
RegisterRoutes(app);
// app.use("/", userRouter);
// app.use("/", postRouter);
// middleware
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new Error(`page could be not found!`));
});
app.use(loggerMiddleware);

app.use(errorHandler);
