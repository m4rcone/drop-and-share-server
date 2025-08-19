import { ValidationError } from "../../infra/errors.js";
import type { FastifyReply, FastifyRequest } from "fastify";
import { getUploadService } from "../services/get-upload.service.js";

export async function getUploadController(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const { id } = req.params as { id: string };

  if (!id) {
    throw new ValidationError({
      message: "Parâmetro não enviado na requisição.",
    });
  }

  const result = await getUploadService({
    id,
  });

  return res.status(200).send({
    id: result.id,
    file_name: result.fileName,
    remote_key: result.remoteKey,
    remote_url: result.remoteUrl,
    created_at: result.createdAt,
    expires_at: result.expiresAt,
  });
}
