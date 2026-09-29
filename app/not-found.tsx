import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() { return <main className="grid min-h-screen place-items-center bg-canvas p-6"><div className="card max-w-md p-8 text-center"><p className="eyebrow">404</p><h1 className="mt-3 font-display text-3xl text-primary">That resource is not available.</h1><p className="mt-3 text-sm text-slate-600">It may be private, unpublished, or no longer exists.</p><Link href="/explore" className="mt-6 inline-block"><Button variant="secondary">Explore library</Button></Link></div></main>; }
