import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { getUploadController } from "../controllers/get-upload.controller";

export const getUploadParamsSchema = z.object({
  id: z.string(),
});

export const getUploadRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/uploads/:id",
    {
      schema: {
        summary: "Get upload",
        consumes: ["application/json"],
        params: getUploadParamsSchema,
        response: {
          200: z.object({
            id: z.string(),
            file_name: z.string(),
            remote_key: z.string(),
            remote_url: z.string(),
            created_at: z.date(),
            expires_at: z.date(),
          }),
        },
      },
    },
    async (req, res) => {
      await getUploadController(req, res);
    },
  );
};
