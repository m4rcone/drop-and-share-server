import z from "zod";
import db from "../../infra/database/database.js";
import { uploads } from "../../infra/database/schemas/uploads.js";
import { eq } from "drizzle-orm";
import { NotFoundError } from "../../infra/errors.js";

const getUploadServiceSchema = z.object({
  id: z.string(),
});

type GetUploadServiceSchema = z.input<typeof getUploadServiceSchema>;

export async function getUploadService(input: GetUploadServiceSchema) {
  const { id } = getUploadServiceSchema.parse(input);

  const result = await db.select().from(uploads).where(eq(uploads.id, id));

  if (!result[0]) {
    throw new NotFoundError({});
  }

  return result[0];
}
