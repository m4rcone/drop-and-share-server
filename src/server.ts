import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifyCors } from "@fastify/cors";
import { styleText } from "node:util";

const port = Number(process.env.PORT) || 3000;

const app = Fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: "http://localhost:3001",
  methods: ["GET", "POST"],
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get("/hello", (_req, res) => {
  res.send({ message: "Hello World!" }).status(200);
});

app.listen({ port }, () => {
  console.log(styleText(["green"], `App running on port ${port}...`));
});
