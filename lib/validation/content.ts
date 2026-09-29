import { z } from "zod";

export const localizedContentSchema = z.object({
  learningObjective: z.string(), explanation: z.string(), example: z.string(), activity: z.string(), worksheet: z.string(), quiz: z.array(z.object({ question: z.string(), answer: z.string() })).min(1),
});
export const qualityChecksSchema = z.object({ ageAppropriate: z.boolean(), curriculumAligned: z.boolean(), topicRelevant: z.boolean(), languageClarity: z.boolean(), harmContent: z.boolean(), flags: z.array(z.string()) });
export const studioInputSchema = z.object({ sourceLessonId: z.string().optional(), title: z.string().min(2), grade: z.coerce.number().int().min(1).max(12), subject: z.string().min(2), targetLanguage: z.string().min(2), resourceType: z.string().default("Full Learning Pack") });
export const draftStateSchema = z.object({
  step: z.number().int().min(1).max(5).default(1), sourceLessonId: z.string().optional(), sourceText: z.string().max(250_000).optional(), sourceTitle: z.string().max(200).optional(), sourceUrl: z.string().url().optional(), sourceLicense: z.string().max(500).optional(),
  title: z.string().max(200).default(""), grade: z.number().int().min(1).max(12).optional(), subject: z.string().max(120).default(""), targetLanguage: z.string().max(80).default("Hindi"), resourceType: z.string().max(100).default("Full Learning Pack"), learningObjective: z.string().max(2000).default(""), instructions: z.string().max(4000).default(""), culturalPreferences: z.string().max(4000).default(""), generationStatus: z.enum(["idle", "running", "failed", "complete"]).default("idle"), generationError: z.string().max(1000).nullable().optional(), generationStage: z.string().max(100).optional(), resourceId: z.string().optional(),
});
