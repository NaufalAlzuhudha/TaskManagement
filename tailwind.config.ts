import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "#E4E4E7",
        background: "#FFFFFF",
        foreground: "#18181B",
        muted: {
          DEFAULT: "#F8F9FA",
          foreground: "#71717A",
        },
        accent: {
          DEFAULT: "#52525B",
          foreground: "#FFFFFF",
        },
        sidebar: "#FAFAFA",
        primary: {
          DEFAULT: "#18181B",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F4F4F5",
          foreground: "#18181B",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        ring: "#18181B",
        input: "#E4E4E7",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#18181B",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#18181B",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["0.875rem", { lineHeight: "1.5rem" }],
        lg: ["1rem", { lineHeight: "1.5rem" }],
        xl: ["1.125rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "3xl": ["1.5rem", { lineHeight: "2rem" }],
      },
    },
  },
  plugins: [],
};

export default config;

