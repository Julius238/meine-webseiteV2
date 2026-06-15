"use client";

import { SystemDemoScene } from "@/components/visuals/SystemDemoScene";

export function Solutions() {
  return (
    <SystemDemoScene
      id="loesungen"
      bgSlot="servicesScene"
      intro={{
        chip: "Lösungen im Einsatz",
        title: (
          <>
            Ein System.<br />
            <span className="text-gradient-accent">Vier Module live.</span>
          </>
        ),
        description:
          "Ausschnitte aus realen Projektarten. Keine Galerie — Facetten desselben digitalen Systems.",
      }}
      modules={[
        {
          number: "01",
          eyebrow: "Dashboards",
          title: "Internes Dashboard",
          description:
            "Alle relevanten Zahlen, Engpässe und Aktivitäten auf einen Blick — in Echtzeit, ohne Excel-Exporte.",
          screen: "solutionDashboard",
        },
        {
          number: "02",
          eyebrow: "KI-Automation",
          title: "Automatisierte Angebotsbearbeitung",
          description:
            "Anfragen werden klassifiziert, Angebote vorbereitet und zur Freigabe vorgelegt — Stunden Arbeit pro Tag.",
          screen: "solutionAutomation",
        },
        {
          number: "03",
          eyebrow: "Website & CMS",
          title: "Website mit CMS",
          description:
            "Schnelle, moderne Website mit einem CMS, das das Team selbstständig pflegt — ohne Dev-Tickets.",
          screen: "solutionCms",
        },
        {
          number: "04",
          eyebrow: "KI-Assistent",
          title: "Assistent für repetitive Aufgaben",
          description:
            "Ein Assistent, der wiederkehrende Aufgaben übernimmt — eingebettet in Ihre Tools, abgestimmt auf Ihre Sprache.",
          screen: "solutionAssistant",
        },
      ]}
    />
  );
}
