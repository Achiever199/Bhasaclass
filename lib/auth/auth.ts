import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "database" },
  providers: [Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.id && account.providerAccountId) {
        await db.user.update({ where: { id: user.id }, data: { googleId: account.providerAccountId, avatarUrl: user.image ?? undefined } });
      }
      return true;
    },
    session({ session, user }) {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
  pages: { signIn: "/" },
});
