import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Cursor } from "@/components/site/Fx";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://blastoise.netlify.app"),
  title: {
    default: "blastoise - know the blast radius before you migrate",
    template: "%s - blastoise",
  },
  description:
    "blastoise reads your Postgres migration and your live database, then tells you which lock it takes, whether it blocks reads or writes, for how long, and whether it can be undone. Other linters read the SQL and nothing else.",
  openGraph: {
    title: "blastoise - know the blast radius before you migrate",
    description:
      "The same ALTER TABLE is harmless on a small table and an outage on a big one. Only a tool that reads your database can tell them apart.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070d",
};

/* Without JavaScript, GSAP never runs - content is all in normal flow and
   fully readable. Only the custom cursor rule needs undoing. */
const NOSCRIPT_CSS = `
body,a,button{cursor:auto!important}
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <head>
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: NOSCRIPT_CSS }} />
        </noscript>
      </head>
      <body>
        <a className="skip-link" href="#main">
          skip to content
        </a>
        {children}
        <Cursor />
      </body>
    </html>
  );
}
