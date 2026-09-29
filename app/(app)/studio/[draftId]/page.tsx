import { notFound } from "next/navigation";
import { db } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/require-user";
import { draftStateSchema } from "@/lib/validation/content";
import { DraftStudioClient } from "@/components/studio/draft-studio-client";
export default async function DraftStudio({ params }: { params: Promise<{ draftId: string }> }) { const { draftId } = await params; const user = await requireUser(); const draft = await db.draft.findFirst({ where: { id: draftId, userId: user.id } }); if (!draft) notFound(); return <DraftStudioClient draftId={draft.id} initialState={draftStateSchema.parse(draft.state)} />; }
