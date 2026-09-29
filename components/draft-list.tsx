"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteDraft } from "@/app/(app)/dashboard/actions";
type DraftItem = { id: string; step: number; title: string; updatedAt: string };
export function DraftList({ drafts }: { drafts: DraftItem[] }) { const router = useRouter(); const [pending, startTransition] = useTransition(); return <div className="card divide-y">{drafts.map(draft => <div key={draft.id} className="flex items-center justify-between gap-4 p-4"><Link href={`/studio/${draft.id}`} className="min-w-0 flex-1 hover:text-teal"><span className="block truncate text-sm font-semibold text-primary">{draft.title || "Untitled resource"}</span><span className="mt-1 block text-xs text-slate-500">Step {draft.step} · Updated {new Date(draft.updatedAt).toLocaleDateString()}</span></Link><Button type="button" variant="ghost" className="text-xs text-red-600" disabled={pending} onClick={() => { if (window.confirm("Delete this draft? This cannot be undone.")) startTransition(() => { void deleteDraft(draft.id).then(() => router.refresh()); }); }}>Delete</Button></div>)}</div>; }
