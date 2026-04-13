import "dotenv/config";
import express from "express";
import swaggerUi from "swagger-ui-express";
import routes from "./routes/index";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());

const openApiDoc = {
  openapi: "3.0.3",
  info: {
    title: "RunX API",
    version: "0.1.0",
    description: "Base da API Fase 2"
  },
  servers: [{ url: `http://localhost:${port}` }],
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": {
            description: "API saudável"
          }
        }
      }
    }
  }
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));
app.use(routes);

app.listen(port, () => {
  console.log(`RunX API a correr em http://localhost:${port}`);
  console.log(`Swagger em http://localhost:${port}/api-docs`);
});
