import { Readable } from "node:stream";
import z from "zod";
import { ValidationError } from "../../infra/errors.js";
import { uploadImageToStorage } from "../storage/upload-image-to-storage.js";
import db from "../../infra/database/database.js";
import { uploads } from "../../infra/database/schemas/uploads.js";

const uploadImageServiceSchema = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
});

type UploadImageServiceSchema = z.input<typeof uploadImageServiceSchema>;

const EXPIRATION_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 1; // 1 DAY

const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export async function UploadImageService(input: UploadImageServiceSchema) {
  const { fileName, contentType, contentStream } =
    uploadImageServiceSchema.parse(input);

  if (!allowedMimeTypes.includes(contentType)) {
    throw new ValidationError({
      message: "Tipo de arquivo não permitido.",
    });
  }

  const resultStorage = await uploadImageToStorage({
    fileName,
    contentType,
    contentStream,
  });

  const result = await db
    .insert(uploads)
    .values({
      fileName,
      remoteKey: resultStorage.key,
      remoteUrl: resultStorage.url,
      expiresAt: new Date(Date.now() + EXPIRATION_IN_MILLISECONDS),
    })
    .returning();

  return result[0];
}
