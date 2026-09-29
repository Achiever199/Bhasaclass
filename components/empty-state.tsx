import Link from "next/link";
import { Button } from "@/components/ui/button";
export function EmptyState({ title, description, href = "/studio", action = "Create a resource" }: { title: string; description: string; href?: string; action?: string }) { return <div className="card border-dashed p-10 text-center"><p className="font-display text-2xl text-primary">{title}</p><p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p><Link href={href as never} className="mt-5 inline-block"><Button variant="ai">{action}</Button></Link></div>; }
