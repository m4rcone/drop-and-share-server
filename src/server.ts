import Fastify from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifyCors } from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import { styleText } from "node:util";
import { uploadImageRoute } from "./app/routes/upload-image.js";
import { errorHandlerResponse } from "./infra/error-handler-response.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { runMigrationsRoute } from "./app/routes/run-migrations.js";

const port = Number(process.env.PORT) || 3000;
const maxFileSize = 1024 * 1024 * 2; // 2MB

const app = Fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.setErrorHandler(errorHandlerResponse);

app.register(fastifyCors, {
  origin: "*",
});

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Drop & Share API",
      description: "Image uploader.",
      version: "1.0.0",
    },
  },
  transform: (data) => {
    const { schema, url } = jsonSchemaTransform(data);

    if (schema.consumes?.includes("multipart/form-data")) {
      if (!schema.body) {
        schema.body = {
          type: "object",
          properties: {
            image: {
              type: "string",
              format: "binary",
              description: ".jpeg .jpg .png .gif .webp",
            },
          },
        };
      }
    }

    return { schema, url };
  },
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.register(fastifyMultipart, {
  limits: {
    fileSize: maxFileSize,
  },
});

app.get("/health", (_req, res) => {
  res.send({ message: "OK" }).status(200);
});

app.register(uploadImageRoute);
app.register(runMigrationsRoute);

app.listen({ port }, () => {
  console.log(styleText(["green"], `\nApp running on port ${port}...`));
});
