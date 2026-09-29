import Link from "next/link";
import { UserMenu } from "@/components/user-menu";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
export function AppHeader({ user }: { user: { name?: string | null; image?: string | null } }) { return <header className="flex min-h-16 items-center justify-between border-b bg-white/80 px-4 backdrop-blur sm:px-5 md:px-8"><div className="flex items-center gap-3"><MobileNav /><Link href="/dashboard" className="font-display text-xl font-semibold text-primary">Bhasha<span className="text-teal">Class</span></Link></div><div className="flex items-center gap-3 sm:gap-4"><Link href="/studio" className="hidden sm:block"><Button variant="ai">+ Create with AI</Button></Link><UserMenu user={user} /></div></header>; }
