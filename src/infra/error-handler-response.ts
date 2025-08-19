import type { FastifyError, FastifyRequest, FastifyReply } from "fastify";
import {
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./errors.js";

export async function errorHandlerResponse(
  error: FastifyError,
  _req: FastifyRequest,
  res: FastifyReply,
) {
  if (
    error instanceof ValidationError ||
    error instanceof UnauthorizedError ||
    error instanceof NotFoundError
  ) {
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

  if (error.message?.includes("migration-secret")) {
    const unauthorizedError = new UnauthorizedError({});

    return res
      .status(unauthorizedError.statusCode)
      .send(unauthorizedError.toJSON());
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
