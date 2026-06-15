"use client";

import { ScrollScene } from "@/components/visuals/ScrollScene";

export function Process() {
  return (
    <ScrollScene
      id="prozess"
      slot="processPath"
      intro={{
        chip: "Der Prozess",
        title: (
          <>
            Vier Stationen.<br />
            <span className="text-gradient-accent">Ein klarer Weg.</span>
          </>
        ),
        description:
          "Kein Buzzword-Bingo. Eine wiederholbare Methodik, die Risiko reduziert und Tempo macht.",
      }}
      steps={[
        {
          number: "01",
          eyebrow: "Verstehen",
          title: "Status quo ehrlich aufnehmen",
          description:
            "Wir analysieren Ihre Abläufe, Tools und Engpässe. Ziel: eine technische Sicht ohne Beschönigung.",
          bullets: ["Ist-Aufnahme", "Engpass-Karte"],
        },
        {
          number: "02",
          eyebrow: "Konzept",
          title: "Plan vor Code",
          description:
            "Klarer Plan: was gebaut wird, in welcher Reihenfolge — mit Fokus auf Hebel und Risiken.",
          bullets: ["Architektur", "Roadmap", "Estimate"],
        },
        {
          number: "03",
          eyebrow: "Umsetzung",
          title: "Iterativ, sichtbar, schnell",
          description:
            "Kurze Schleifen. Sie sehen früh echte Ergebnisse, nicht nur Konzepte und Mockups.",
          bullets: ["Live-Build", "Wöchentliche Demos"],
        },
        {
          number: "04",
          eyebrow: "Übergabe",
          title: "Sauber im Einsatz",
          description:
            "Übergabe, Dokumentation, Schulung — und auf Wunsch laufende Weiterentwicklung.",
          bullets: ["Dokumentation", "Support"],
        },
      ]}
    />
  );
}
