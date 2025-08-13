import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod/v4";
import { ValidationError } from "../../infra/errors.js";
import { UploadImage } from "../../services/upload-image.js";
import { PassThrough } from "node:stream";

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
        },
      },
    },
    async (req, res) => {
      const file = await req.file();

      if (!file) {
        throw new ValidationError({
          message: "Arquivo não enviado na requisição.",
        });
      }

      // Interrompe o upload no R2 e lança um erro no processo (await upload.done()) caso exceda o tamanho de arquivo permitido.
      const src = file.file;
      const pass = new PassThrough();
      let tooLargeErr: Error | null = null;

      src.on("limit", () => {
        tooLargeErr = new ValidationError({
          message: "Tamanho do arquivo excedeu o limite permitido.",
        });

        pass.destroy(tooLargeErr);
      });

      src.pipe(pass);

      const result = await UploadImage({
        fileName: file.filename,
        contentType: file.mimetype,
        contentStream: pass,
      });

      const response = {
        message: "Upload concluído com sucesso.",
        url: result.url,
        status_code: 201,
      };

      return res.status(201).send(response);
    },
  );
};
