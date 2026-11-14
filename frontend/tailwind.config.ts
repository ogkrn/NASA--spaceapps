import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        space: {
          950: "#05070f",
          900: "#0a0d1a",
          850: "#0f1528",
          800: "#141c36",
          700: "#1e294b",
          600: "#2e3e6b",
        },
        lunar: {
          silver: "#e2e8f0",
          dust: "#94a3b8",
          glow: "#38bdf8",
        },
        mars: {
          rust: "#ea580c",
          glow: "#fb923c",
          dark: "#7c2d12",
        },
        cyan: {
          glow: "#06b6d4",
          bright: "#22d3ee",
        }
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "orbit": "spin 20s linear infinite",
      }
    },
  },
  plugins: [],
};
export default config;

