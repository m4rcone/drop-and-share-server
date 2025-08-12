import { Readable } from "node:stream";
import z from "zod";
import { ValidationError } from "../infra/errors.js";
import { uploadImageToStorage } from "../storage/upload-image-to-storage.js";
import db from "../infra/database/database.js";
import { uploads } from "../infra/database/schemas/uploads.js";

const uploadImageSchema = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
});

type UploadImageSchema = z.input<typeof uploadImageSchema>;

const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

export async function UploadImage(input: UploadImageSchema) {
  const { fileName, contentType, contentStream } =
    uploadImageSchema.parse(input);

  if (!allowedMimeTypes.includes(contentType)) {
    throw new ValidationError({
      message:
        "Tipo de arquivo inválido. Tipos permitidos: jpeg, jpg, png e webp.",
      action: "Verifique o tipo de arquivo enviado.",
    });
  }

  let result;
  try {
    result = await uploadImageToStorage({
      fileName,
      contentType,
      contentStream,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error uploading image to storage.");
  }

  await db.insert(uploads).values({
    fileName,
    remoteKey: result.key,
    remoteUrl: result.url,
  });

  return {
    url: result.url,
  };
}
