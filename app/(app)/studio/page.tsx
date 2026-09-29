import { db } from "@/lib/db/prisma";
import { StudioClient } from "@/components/studio/studio-client";
export default async function Studio() { const lessons = await db.sourceLesson.findMany({ orderBy: { createdAt: "desc" }, take: 100, select: { id: true, title: true, grade: true, subject: true, sourceUrl: true, license: true } }); return <StudioClient lessons={lessons} />; }
