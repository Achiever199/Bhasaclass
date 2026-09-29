import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = { title: "BhashaClass Content Studio", description: "Create, localize, and share better learning resources." };
export const dynamic = "force-dynamic";
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}<Analytics /></body></html>; }
