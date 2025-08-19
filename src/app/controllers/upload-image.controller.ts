import { PassThrough } from "node:stream";
import { ValidationError } from "../../infra/errors.js";
import { UploadImageService } from "../services/upload-image.service.js";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function uploadImageController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const file = await req.file();

  if (!file) {
    throw new ValidationError({
      message: "Arquivo não enviado na requisição.",
    });
  }

  // Interrompe o upload no R2 e lança um erro no processo (await upload.done()) caso exceda o tamanho de arquivo permitido.
  const src = file.file;
  const pass = new PassThrough();
  let tooLargeError: Error | null = null;

  src.on("limit", () => {
    tooLargeError = new ValidationError({
      message: "Tamanho do arquivo excedeu o limite permitido.",
    });

    pass.destroy(tooLargeError);
  });

  src.pipe(pass);

  const result = await UploadImageService({
    fileName: file.filename,
    contentType: file.mimetype,
    contentStream: pass,
  });

  return res.status(201).send({
    id: result.id,
    file_name: result.fileName,
    remote_key: result.remoteKey,
    remote_url: result.remoteUrl,
    created_at: result.createdAt,
    expires_at: result.expiresAt,
  });
}
