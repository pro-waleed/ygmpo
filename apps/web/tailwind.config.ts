import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sand: "#f5f1e8",
        ink: "#13222f",
        teal: "#0f766e",
        gold: "#b78a2c",
        mist: "#dfe7ea"
      },
      boxShadow: {
        soft: "0 20px 60px rgba(19, 34, 47, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
