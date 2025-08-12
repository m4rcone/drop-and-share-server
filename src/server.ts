import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifyCors } from "@fastify/cors";
import { fastifyMultipart } from "@fastify/multipart";
import { styleText } from "node:util";
import { uploadImageRoute } from "./http/routes/upload-image.js";
import { InternalServerError, ValidationError } from "./infra/errors.js";

const port = Number(process.env.PORT) || 3000;

const app = Fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
app.setErrorHandler((error, _req, res) => {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).send(error.toJSON());
  }

  const publicErrorObject = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });

  console.error(publicErrorObject);

  return res
    .status(publicErrorObject.statusCode)
    .send(publicErrorObject.toJSON());
});

app.register(fastifyCors, {
  origin: "*",
});

app.register(fastifyMultipart);

app.get("/health", (_req, res) => {
  res.send({ message: "OK" }).status(200);
});

app.register(uploadImageRoute);

app.listen({ port }, () => {
  console.log(styleText(["green"], `App running on port ${port}...`));
});
