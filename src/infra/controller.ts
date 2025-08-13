import type { FastifyError, FastifyRequest, FastifyReply } from "fastify";
import { InternalServerError, ValidationError } from "./errors.js";

async function errorHandlerResponse(
  error: FastifyError,
  _req: FastifyRequest,
  res: FastifyReply,
) {
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).send(error.toJSON());
  }

  if (error.message?.includes("Boundary not found")) {
    const validationError = new ValidationError({
      message: "Arquivo não enviado na requisição.",
    });

    return res
      .status(validationError.statusCode)
      .send(validationError.toJSON());
  }

  const publicErrorObject = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });

  console.error(publicErrorObject);

  return res
    .status(publicErrorObject.statusCode)
    .send(publicErrorObject.toJSON());
}

const controller = {
  errorHandlerResponse,
};

export default controller;
