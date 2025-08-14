import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifyCors } from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import { styleText } from "node:util";
import { uploadImageRoute } from "./app/routes/upload-image.ts";
import { errorHandlerResponse } from "./infra/error-handler-response.ts";

const port = Number(process.env.PORT) || 3000;

const app = Fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.setErrorHandler(errorHandlerResponse);

app.register(fastifyCors, {
  origin: "*",
});

app.register(fastifyMultipart, {
  limits: {
    fileSize: 1024 * 1024 * 2, // 2MB
  },
});

app.get("/health", (_req, res) => {
  res.send({ message: "OK" }).status(200);
});

app.register(uploadImageRoute);

app.listen({ port }, () => {
  console.log(styleText(["green"], `\nApp running on port ${port}...`));
});
