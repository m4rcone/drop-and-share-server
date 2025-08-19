import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { uploadImageController } from "../controllers/upload-image.controller.js";
import z from "zod/v4";

export const uploadImageRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/uploads",
    {
      schema: {
        summary: "Upload a image",
        consumes: ["multipart/form-data"],
        response: {
          201: z.object({
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
      await uploadImageController(req, res);
    },
  );
};
