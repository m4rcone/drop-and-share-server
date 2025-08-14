import type { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../../infra/errors.js";
import { runMigrationsService } from "../services/run-migrations.service.js";

export async function runMigrationsController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const migrationSecretProvide = req.headers["migration-secret"];

  if (
    !migrationSecretProvide ||
    migrationSecretProvide !== process.env.MIGRATION_SECRET
  ) {
    throw new UnauthorizedError({});
  }

  await runMigrationsService();

  return res.status(201).send({});
}
