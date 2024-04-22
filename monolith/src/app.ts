import express from "express";
import { monolithRoutes } from "./routes/monolith.health.routes";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../dist/swagger/swagger.json";

export const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", monolithRoutes);
