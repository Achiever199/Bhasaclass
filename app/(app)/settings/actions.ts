"use server";
import { db } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/require-user";
import { z } from "zod";
const languageSchema = z.enum(["en", "hi", "bn", "mr", "te", "ta", "kn", "gu", "ml", "pa"]);
export async function updatePreferredUiLanguage(formData: FormData) { const user = await requireUser(); const preferredUiLanguage = languageSchema.parse(formData.get("preferredUiLanguage")); await db.user.update({ where: { id: user.id }, data: { preferredUiLanguage } }); }
export async function replayOnboarding() { const user = await requireUser(); await db.user.update({ where: { id: user.id }, data: { hasOnboarded: false, onboardingStep: 1 } }); }
