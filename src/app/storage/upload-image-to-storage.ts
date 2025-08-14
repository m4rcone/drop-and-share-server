import { Upload } from "@aws-sdk/lib-storage";
import { randomUUID } from "node:crypto";
import { basename, extname } from "node:path";
import { Readable } from "node:stream";
import z from "zod";
import r2Client from "./r2-client.ts";

const uploadImageToStorageSchema = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
});

type UploadImageToStorageSchema = z.input<typeof uploadImageToStorageSchema>;

export async function uploadImageToStorage(input: UploadImageToStorageSchema) {
  const { fileName, contentType, contentStream } =
    uploadImageToStorageSchema.parse(input);

  const fileExtension = extname(fileName);
  const fileNameWithoutExtension = basename(fileName, fileExtension);
  const cleanedFileName = fileNameWithoutExtension.replace(/[^a-zA-Z0-9]/g, "");
  const cleanedFileNameWithExtension = cleanedFileName.concat(fileExtension);
  const uniqueFileName = `${randomUUID()}-${cleanedFileNameWithExtension}`;

  const upload = new Upload({
    client: r2Client,
    params: {
      Bucket: process.env.CLOUDFLARE_BUCKET!,
      Key: uniqueFileName,
      Body: contentStream,
      ContentType: contentType,
    },
  });

  await upload.done();

  const result = {
    key: uniqueFileName,
    url: new URL(uniqueFileName, process.env.CLOUDFLARE_PUBLIC_URL).toString(),
  };

  return result;
}
