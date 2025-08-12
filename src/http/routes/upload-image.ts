import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { ValidationError } from "../../infra/errors.js";

export const uploadImageRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/upload",
    {
      schema: {
        consumes: ["multipart/form-data"],
        response: {
          201: z.object({
            message: z.string(),
            url: z.string(),
            status_code: z.number(),
          }),
          400: z.object({
            name: z.string(),
            message: z.string(),
            action: z.string(),
            status_code: z.number(),
          }),
        },
      },
    },
    async (req, res) => {
      const maxFileSize = 1024 * 1024 * 2; // 2MB

      try {
        const uploadFile = await req.file({
          limits: {
            fileSize: maxFileSize,
          },
        });

        // upload da imagem

        const response = { message: "", url: "", status_code: 201 };

        return res.status(201).send(response);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.message?.includes("Boundary not found")) {
          throw new ValidationError({
            message: "Arquivo não enviado na requisição.",
          });
        }
      }
    }
  );
};
