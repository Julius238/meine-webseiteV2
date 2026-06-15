"use client";

import { ScrollScene } from "@/components/visuals/ScrollScene";

export function Services() {
  return (
    <ScrollScene
      id="leistungen"
      slot="servicesScene"
      intro={{
        chip: "Leistungen",
        title: (
          <>
            Vier Module.<br />
            <span className="text-gradient-accent">Ein System.</span>
          </>
        ),
        description:
          "Jede Leistung steht für sich. Kombiniert entsteht ein System, das Ihr Unternehmen wirklich abbildet.",
      }}
      steps={[
        {
          number: "01",
          eyebrow: "Software",
          title: "Individuelle Softwareentwicklung",
          description:
            "Web-Apps, interne Tools, Dashboards und Schnittstellen — zugeschnitten auf Ihre Prozesse, nicht auf eine Standard-Schablone.",
          bullets: ["Web-Apps", "Interne Tools", "APIs", "Dashboards"],
        },
        {
          number: "02",
          eyebrow: "KI-Automation",
          title: "KI-gestützte Prozessautomatisierung",
          description:
            "Repetitive Arbeit übernimmt eine KI. Sortieren, klassifizieren, beantworten, extrahieren — zuverlässig und nachvollziehbar.",
          bullets: ["Dokumente", "Klassifikation", "Assistenten", "Workflows"],
        },
        {
          number: "03",
          eyebrow: "Web",
          title: "Websites & Landingpages",
          description:
            "Performante, moderne Websites mit klarer Botschaft. Optimiert auf Tempo, SEO und Conversion.",
          bullets: ["Next.js / React", "SEO", "Performance", "Animation"],
        },
        {
          number: "04",
          eyebrow: "CMS",
          title: "CMS-Systeme",
          description:
            "Inhalte ohne Entwickler:in pflegen. Headless oder klassisch — mit sauberer Struktur und Redakteurs-freundlicher UI.",
          bullets: ["Headless", "Redaktions-UI", "Workflows", "Mehrsprachig"],
        },
      ]}
    />
  );
}
