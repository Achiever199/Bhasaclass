import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { uploadLesson } from "@/lib/storage/blob";
import { extractLesson } from "@/lib/storage/extract";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.formData();
  const file = data.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "A file is required" }, { status: 400 });
  try {
    const extracted = await extractLesson(file);
    const blob = await uploadLesson(file, `lessons/${session.user.id}/${extracted.filename}`);
    return NextResponse.json({ url: blob.url, filename: extracted.filename, text: extracted.text, extension: extracted.extension });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The file could not be processed.";
    return NextResponse.json({ error: message }, { status: message.includes("storage") ? 503 : 400 });
  }
}
