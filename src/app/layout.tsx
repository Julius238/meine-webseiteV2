import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Julius Eggert — Software, KI-Automation & digitale Systeme",
    template: "%s · Julius Eggert",
  },
  description:
    "Individuelle Softwareentwicklung, KI-gestützte Prozessautomatisierung, Websites und CMS-Lösungen für Unternehmen. Aus manuellen Abläufen werden digitale Systeme.",
  keywords: [
    "Softwareentwicklung",
    "Web-Apps",
    "KI Automatisierung",
    "Prozessautomatisierung",
    "Dashboards",
    "interne Tools",
    "CMS",
    "Landingpages",
    "Anwendungsentwickler",
  ],
  authors: [{ name: "Julius Eggert" }],
  creator: "Julius Eggert",
  openGraph: {
    type: "website",
    locale: "de_DE",
    title: "Aus manuellen Abläufen werden digitale Systeme.",
    description:
      "Individuelle Software, KI-Automationen, Websites und CMS-Lösungen für Unternehmen, die effizienter arbeiten wollen.",
    siteName: "Julius Eggert",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aus manuellen Abläufen werden digitale Systeme.",
    description: "Software · KI-Automation · Websites · CMS",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="scroll-smooth">
      <body className="noise bg-ink-950 text-white antialiased overflow-x-hidden">
        <SmoothScroll />
        <Nav />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
