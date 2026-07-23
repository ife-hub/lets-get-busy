import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0908",
        char: "#161311",
        smoke: "#4a453f",
        cream: "#f2ecdd",
        gold: "#c9a227",
        "gold-dim": "#8a7231",
        rust: "#7a3b2e",
      },
      fontFamily: {
        brush: ["var(--font-brush)"],
        hand: ["var(--font-hand)"],
        body: ["var(--font-body)"],
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(242,236,221,0.05) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
export default config;
