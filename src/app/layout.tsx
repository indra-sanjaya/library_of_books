import type { Metadata } from "next";
import { Sora, Newsreader } from "next/font/google";
import "@/app/globals.css";
import AppProviders from "@/providers/app-providers";
import AppShell from "@/components/layout/app-shell";
import { SITE_NAME, SITE_TAGLINE } from "@/constants/site";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_TAGLINE,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${newsreader.variable}`}>
      <body className="font-sans">
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
