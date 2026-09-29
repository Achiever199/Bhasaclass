import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");
  return session.user;
}
