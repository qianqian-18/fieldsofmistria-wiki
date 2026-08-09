import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Fields of Mistria Wiki — Guides, Farming, Romance",
  description:
    "Complete Fields of Mistria Wiki with farming guides, romance characters, quests, items, skills, crafting, mining and beginner tips for every player.",
  keywords:
    "Fields of Mistria, Wiki, farming guide, romance, NPC Studio, Steam RPG",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
