import express from "express";
import { monolithRoutes } from "./routes/monolith.health.routes";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../dist/swagger/swagger.json";

// app running
export const app = express();

// middleware
app.use(express.json());

//  testings swagger routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// routes
app.use("/", monolithRoutes);
