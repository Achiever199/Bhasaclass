import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18213D",
        primary: "#2E3A6E",
        teal: "#0F6B63",
        marigold: "#E8944A",
        violet: "#6E4FA3",
        canvas: "#FAF8F4",
        line: "#E9E4DB",
      },
      fontFamily: { sans: ["var(--font-body)", "Arial", "sans-serif"], display: ["var(--font-display)", "Georgia", "serif"] },
      boxShadow: { soft: "0 18px 50px rgba(46, 58, 110, 0.10)" },
    },
  },
  plugins: [],
};
export default config;
