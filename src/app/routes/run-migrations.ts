import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { runMigrationsController } from "../controllers/run-migrations.controller.ts";
import z from "zod";

export const runMigrationsRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/migrations",
    {
      schema: {
        summary: "Run migrations",
        headers: z.object({
          "migration-secret": z.string(),
        }),
        response: {
          201: z.object({}),
        },
      },
    },
    async (req, res) => {
      await runMigrationsController(req, res);
    },
  );
};
