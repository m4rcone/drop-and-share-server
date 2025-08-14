import { Readable } from "node:stream";
import z from "zod";
import { ValidationError } from "../../infra/errors.ts";
import { uploadImageToStorage } from "../storage/upload-image-to-storage.ts";
import db from "../../infra/database/database.ts";
import { uploads } from "../../infra/database/schemas/uploads.ts";

const uploadImageServiceSchema = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
});

type UploadImageServiceSchema = z.input<typeof uploadImageServiceSchema>;

const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

export async function UploadImageService(input: UploadImageServiceSchema) {
  const { fileName, contentType, contentStream } =
    uploadImageServiceSchema.parse(input);

  if (!allowedMimeTypes.includes(contentType)) {
    throw new ValidationError({
      message: "Tipo de arquivo não permitido.",
    });
  }

  const result = await uploadImageToStorage({
    fileName,
    contentType,
    contentStream,
  });

  await db.insert(uploads).values({
    fileName,
    remoteKey: result.key,
    remoteUrl: result.url,
  });

  return {
    url: result.url,
  };
}
