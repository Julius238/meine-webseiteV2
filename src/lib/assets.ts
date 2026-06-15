/**
 * Asset slots for Higgsfield-generated visuals.
 *
 * Each slot: `src` (lokaler Pfad), `prompt` (für spätere Re-Generierung),
 * `aspect`. Solange `src` leer ist, rendert das jeweilige Visual seinen
 * Code-Fallback. Bilder liegen alle in /public/assets/.
 */

export type AssetSlot = {
  src?: string;
  poster?: string;
  prompt: string;
  aspect: string;
  notes?: string;
};

export type AssetKey =
  | "heroBackdrop"
  | "problemChaos"
  | "transitionBridge"
  | "transformationNetwork"
  | "servicesScene"
  | "processPath"
  | "solutionDashboard"
  | "solutionAutomation"
  | "solutionCms"
  | "solutionAssistant"
  | "aboutArchitecture"
  | "contactSystem";

export const assets: Record<AssetKey, AssetSlot> = {
  heroBackdrop: {
    src: "/assets/hero-backdrop.png",
    prompt:
      "Ultra cinematic abstract digital system, deep navy and electric cyan light streams flowing through space, glowing wireframe topography, particles, volumetric fog, premium tech editorial, no text, no people, 4K",
    aspect: "16:9",
  },
  problemChaos: {
    src: "/assets/problem-chaos.png",
    /* NOTE: key name kept for code stability — visually this slot is now the
       premium-MacBook hero still used as Act I's end frame. */
    prompt:
      "Premium MacBook-style laptop, lid open at 110°, alone on a clean dark navy stage, screen showing an abstract software interface (sparklines, automation flow nodes, layered UI modules) in soft cyan accents, side-lit studio lighting, brushed aluminum, no people, no logos, no readable text, Apple keynote product film aesthetic, 16:9, 4K",
    aspect: "16:9",
  },
  transitionBridge: {
    src: "/assets/transition-bridge.png",
    prompt:
      "Cinematic abstract transition: scattered digital fragments converging from chaos on the left into a single ordered cyan light line on the right, deep dark navy, volumetric fog, no text, no people, 4K",
    aspect: "21:9",
  },
  transformationNetwork: {
    src: "/assets/transformation-network.png",
    prompt:
      "Cinematic 3D digital workflow network, glowing cyan nodes connected by light edges, sense of clarity and order, dark navy background, no text, no people, 4K",
    aspect: "16:9",
  },
  servicesScene: {
    src: "/assets/services-scene.png",
    prompt:
      "Ultra cinematic wide shot of a dark digital business system: multiple translucent software module panels floating in 3D space at varying depths, connected by glowing cyan beams, one cohesive premium system, deep navy with bokeh, no people, 4K",
    aspect: "16:9",
  },
  processPath: {
    src: "/assets/process-path.png",
    prompt:
      "Ultra cinematic dark scene of a long horizontal blueprint path with four glowing cyan light stations marking milestones, perspective receding into atmospheric fog, no people, 4K",
    aspect: "16:9",
  },
  solutionDashboard: {
    src: "/assets/solution-dashboard.png",
    prompt:
      "Photorealistic premium analytics dashboard on a tablet, dark theme with cyan accents, KPI cards, area chart, sidebar, Apple-grade product render, no people, 4K",
    aspect: "4:3",
  },
  solutionAutomation: {
    src: "/assets/solution-automation.png",
    prompt:
      "Photorealistic premium automation workflow editor on a monitor, dark UI with cyan node graph, Apple-grade product render, no people, 4K",
    aspect: "4:3",
  },
  solutionCms: {
    src: "/assets/solution-cms.png",
    prompt:
      "Photorealistic premium CMS block editor on a monitor, dark sleek UI, page tree, block editor, properties panel, cyan accents, Apple-grade product render, no people, 4K",
    aspect: "4:3",
  },
  solutionAssistant: {
    src: "/assets/solution-assistant.png",
    prompt:
      "Photorealistic premium AI assistant UI on a monitor, dark conversation interface with action chips in cyan, sidebar of conversations, Apple-grade product render, no people, 4K",
    aspect: "4:3",
  },
  aboutArchitecture: {
    src: "/assets/about-architecture.png",
    prompt:
      "Cinematic dark technical scene of a layered software system architecture, glowing translucent isometric blueprint planes stacked vertically, cyan connector beams, fog, no text, no people, vertical, 4K",
    aspect: "4:5",
  },
  contactSystem: {
    src: "/assets/contact-system.png",
    prompt:
      "Cinematic dark serene final scene of a complete digital system at rest, a single elegant interconnected network glowing softly in cyan, calm sense of completion, ultra wide, no text, no people, 4K",
    aspect: "21:9",
  },
};
