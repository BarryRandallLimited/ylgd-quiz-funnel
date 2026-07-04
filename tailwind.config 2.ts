import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1E3A2F",
          light: "#2A4D3E",
        },
        gold: {
          DEFAULT: "#C9A76A",
          light: "rgba(201,167,106,0.18)",
          border: "rgba(201,167,106,0.4)",
        },
        sage: {
          DEFAULT: "#F5F5F0",
        },
        warm: {
          cream: "#FFFBF1",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Nunito Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
