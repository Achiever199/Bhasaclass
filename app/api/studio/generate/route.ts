import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/prisma";
import { draftStateSchema } from "@/lib/validation/content";
import { localizeLesson, type ProgressStage } from "@/lib/ai/provider";

export const maxDuration = 60;
function message(type: string, payload: Record<string, unknown>) { return `data: ${JSON.stringify({ type, ...payload })}\n\n`; }
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { draftId?: string };
  try { body = await request.json() as { draftId?: string }; } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (!body.draftId) return NextResponse.json({ error: "Draft ID is required" }, { status: 400 });
  const draft = await db.draft.findFirst({ where: { id: body.draftId, userId: session.user.id } });
  if (!draft) return NextResponse.json({ error: "Draft not found" }, { status: 404 });
  const state = draftStateSchema.parse(draft.state);
  if (state.resourceId && state.generationStatus === "complete") {
    return new Response([message("status", { stage: "Checking alignment", message: "This draft has already been generated." }), message("complete", { resourceId: state.resourceId })].join(""), { headers: { "content-type": "text/event-stream", "cache-control": "no-cache, no-transform" } });
  }
  const stream = new ReadableStream({
    async start(controller) {
      const send = (type: string, payload: Record<string, unknown> = {}) => controller.enqueue(new TextEncoder().encode(message(type, payload)));
      const setStatus = async (status: "running" | "failed" | "complete", error?: string, stage?: string) => { const next = { ...state, generationStatus: status, generationError: error ?? null, generationStage: stage }; await db.draft.update({ where: { id: draft.id }, data: { state: next, step: status === "complete" ? 4 : 3 } }); };
      try {
        await setStatus("running", undefined, "Analyzing");
        send("status", { stage: "Analyzing", message: "Reading the source lesson and checking its context." });
        const source = state.sourceLessonId ? await db.sourceLesson.findFirst({ where: { id: state.sourceLessonId } }) : null;
        const sourceText = source?.bodyText ?? state.sourceText;
        if (!sourceText) throw new Error("Choose a source lesson or upload a readable document before generating.");
        const result = await localizeLesson({ sourceText, grade: state.grade ?? 1, subject: state.subject, targetLanguage: state.targetLanguage, resourceType: state.resourceType, learningObjective: state.learningObjective, instructions: state.instructions, culturalPreferences: state.culturalPreferences }, async (stage: ProgressStage) => { await setStatus("running", undefined, stage); send("status", { stage, message: `Working on ${stage.toLowerCase()}.` }); });
        let sourceLessonId = source?.id;
        if (!sourceLessonId && state.sourceUrl) { const uploaded = await db.sourceLesson.create({ data: { title: state.sourceTitle || state.title || "Uploaded lesson", grade: state.grade ?? 1, subject: state.subject || "General", bodyText: sourceText, sourceUrl: state.sourceUrl, license: state.sourceLicense || "User-uploaded source; uploader is responsible for reuse rights." } }); sourceLessonId = uploaded.id; }
        if (!sourceLessonId) throw new Error("The source needs an attributable URL before it can be saved.");
        const resource = await db.resource.create({ data: { title: state.title || state.sourceTitle || "Untitled resource", grade: state.grade ?? 1, subject: state.subject, targetLanguage: state.targetLanguage, resourceType: state.resourceType, learningObjective: result.content.learningObjective, sourceLessonId, authorId: session.user.id, content: result.content, localizedNotes: [], qualityChecks: result.qualityChecks, published: false, verified: false } });
        await db.draft.update({ where: { id: draft.id }, data: { step: 4, state: { ...state, step: 4, generationStatus: "complete", generationStage: "Checking alignment", resourceId: resource.id, sourceLessonId } } });
        send("complete", { resourceId: resource.id });
      } catch (error) { const detail = error instanceof Error ? error.message : "Generation failed."; await setStatus("failed", detail, state.generationStage); send("error", { error: detail }); }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "content-type": "text/event-stream", "cache-control": "no-cache, no-transform", connection: "keep-alive" } });
}
