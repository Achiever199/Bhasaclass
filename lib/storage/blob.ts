import { put } from "@vercel/blob";

export async function uploadLesson(file: File, pathname: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("Blob storage is not configured.");
  return put(pathname, file, { access: "public", addRandomSuffix: true });
}
