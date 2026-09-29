"use server";
import { db } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/require-user";
import { draftStateSchema } from "@/lib/validation/content";
export type StudioState = ReturnType<typeof draftStateSchema.parse>;
export async function createDraft(input: unknown) { const user = await requireUser(); const state = draftStateSchema.parse(input); const draft = await db.draft.create({ data: { userId: user.id, step: state.step, state } }); return draft.id; }
export async function saveDraft(draftId: string, input: unknown) { const user = await requireUser(); const draft = await db.draft.findFirst({ where: { id: draftId, userId: user.id } }); if (!draft) throw new Error("Draft not found."); const state = draftStateSchema.parse(input); await db.draft.update({ where: { id: draft.id }, data: { step: state.step, state } }); return { savedAt: new Date().toISOString() }; }
export async function updateDraftStatus(draftId: string, status: StudioState["generationStatus"], error?: string, stage?: string) { const user = await requireUser(); const draft = await db.draft.findFirst({ where: { id: draftId, userId: user.id } }); if (!draft) throw new Error("Draft not found."); const state = draftStateSchema.parse(draft.state); await db.draft.update({ where: { id: draft.id }, data: { state: { ...state, generationStatus: status, generationError: error ?? null, generationStage: stage } } }); }
export async function discardDraft(draftId: string) { const user = await requireUser(); await db.draft.deleteMany({ where: { id: draftId, userId: user.id } }); }
