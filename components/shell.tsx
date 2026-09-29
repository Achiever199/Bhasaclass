import { AppHeader } from "@/components/app-header";
import { Sidebar } from "@/components/sidebar";
export function Shell({ user, children }: { user: { name?: string | null; image?: string | null }; children: React.ReactNode }) { return <div className="min-h-screen"><AppHeader user={user} /><div className="flex"><Sidebar /><main className="min-w-0 flex-1 p-5 md:p-10">{children}</main></div></div>; }
