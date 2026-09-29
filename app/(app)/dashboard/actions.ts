"use server";
import { db } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/require-user";
export async function saveOnboardingStep(step: number, complete = false) { const user = await requireUser(); await db.user.update({ where: { id: user.id }, data: { onboardingStep: Math.max(1, Math.min(4, step)), hasOnboarded: complete } }); }
export async function deleteDraft(draftId: string) { const user = await requireUser(); await db.draft.deleteMany({ where: { id: draftId, userId: user.id } }); }
