import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifyCors } from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import { styleText } from "node:util";
import { uploadImageRoute } from "./http/routes/upload-image.js";
import controller from "./infra/controller.js";

const port = Number(process.env.PORT) || 3000;

const app = Fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.setErrorHandler(controller.errorHandlerResponse);

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
  console.log(styleText(["green"], `App running on port ${port}...`));
});
