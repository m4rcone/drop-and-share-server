import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { uploadImageController } from "../controllers/upload-image.controller.ts";
import z from "zod/v4";

export const uploadImageRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/upload",
    {
      schema: {
        summary: "Upload a image",
        consumes: ["multipart/form-data"],
        response: {
          201: z.object({
            message: z.string(),
            url: z.string(),
            status_code: z.number(),
          }),
        },
      },
    },
    async (req, res) => {
      await uploadImageController(req, res);
    },
  );
};
