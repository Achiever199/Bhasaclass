import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/lib/auth/auth";
export function UserMenu({ user }: { user: { name?: string | null; image?: string | null } }) { return <div className="flex items-center gap-3"><Link href="/settings" className="flex items-center gap-2 text-sm font-medium">{user.image ? <Image src={user.image} alt="" width={32} height={32} className="rounded-full" /> : <span className="grid size-8 place-items-center rounded-full bg-primary text-xs text-white">{user.name?.[0] ?? "U"}</span>}<span className="hidden sm:inline">{user.name ?? "Account"}</span></Link><form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}><button className="text-xs text-slate-500 hover:text-primary">Sign out</button></form></div>; }
