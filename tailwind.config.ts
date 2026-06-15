import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05070A",
          900: "#0A0D12",
          800: "#0F141B",
          700: "#161C25",
          600: "#1E2531",
          500: "#2A3340",
        },
        accent: {
          DEFAULT: "#5EE7FF",
          glow: "#7BD7FF",
          deep: "#3A8BFF",
        },
        mute: {
          DEFAULT: "#9AA4B2",
          soft: "#6B7480",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightish: "-0.02em",
        tighter2: "-0.035em",
      },
      fontSize: {
        "display-1": ["clamp(3rem, 8vw, 7.5rem)", { lineHeight: "0.95", letterSpacing: "-0.035em" }],
        "display-2": ["clamp(2.25rem, 5.2vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.03em" }],
        "display-3": ["clamp(1.6rem, 3vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(ellipse at top, rgba(94,231,255,0.08), transparent 60%), linear-gradient(180deg, rgba(5,7,10,0) 0%, #05070A 80%)",
        "accent-grad":
          "linear-gradient(135deg, #5EE7FF 0%, #7BD7FF 40%, #3A8BFF 100%)",
      },
      animation: {
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 8s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
