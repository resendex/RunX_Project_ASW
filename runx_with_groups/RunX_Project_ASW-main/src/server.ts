import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { openApiDoc } from "./config/openapi.js";
import {
  errorHandler,
  notFoundHandler
} from "./middlewares/error.middleware.js";
import routes from "./routes/index";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));
app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`RunX API a correr em http://localhost:${env.PORT}`);
  console.log(`Swagger em http://localhost:${env.PORT}/api-docs`);
});
