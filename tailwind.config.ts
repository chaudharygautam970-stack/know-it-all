import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        surface: {
          subtle: "#f8fafc",
          base: "#ffffff",
          elevated: "#ffffff",
          darkSubtle: "#0f172a",
          darkBase: "#1e293b",
          darkElevated: "#334155",
        },
        status: {
          open: {
            bg: "#ecfdf5",
            text: "#065f46",
            border: "#a7f3d0",
            dot: "#10b981",
          },
          closingSoon: {
            bg: "#fffbeb",
            text: "#92400e",
            border: "#fde68a",
            dot: "#f59e0b",
          },
          closed: {
            bg: "#fef2f2",
            text: "#991b1b",
            border: "#fecaca",
            dot: "#ef4444",
          },
          unknown: {
            bg: "#f1f5f9",
            text: "#475569",
            border: "#cbd5e1",
            dot: "#94a3b8",
          },
        },
        verification: {
          verified: {
            bg: "#ecfdf5",
            text: "#047857",
            border: "#6ee7b7",
          },
          unverified: {
            bg: "#f8fafc",
            text: "#64748b",
            border: "#e2e8f0",
          },
          disputed: {
            bg: "#fff1f2",
            text: "#be123c",
            border: "#fda4af",
          },
          underReview: {
            bg: "#eff6ff",
            text: "#1d4ed8",
            border: "#bfdbfe",
          },
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Fira Sans",
          "Droid Sans",
          "Helvetica Neue",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
