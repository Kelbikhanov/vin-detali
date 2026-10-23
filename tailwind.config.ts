import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: "#edf4ff",
          100: "#dce7fb",
          600: "#245fbd",
          700: "#1769e8",
          800: "#1055c4",
        },
        gray: {
          50: "#f5f7fa",
          200: "#e6eaf1",
          300: "#e4e8ef",
          400: "#dfe4ec",
          500: "#dce4f0",
          600: "#8992a2",
          700: "#596477",
          800: "#313b4f",
          900: "#172033",
        },
      },
      fontFamily: {
        sans: ["Mulish", "sans-serif"],
      },
      fontSize: {
        xs: ["10px", { lineHeight: "1.4" }],
        sm: ["11px", { lineHeight: "1.5" }],
        base: ["13px", { lineHeight: "1.5" }],
        lg: ["14px", { lineHeight: "1.6" }],
        xl: ["15px", { lineHeight: "1.7" }],
        "2xl": ["18px", { lineHeight: "1.4" }],
        "3xl": ["21px", { lineHeight: "1.2" }],
        "4xl": ["clamp(32px, 4.1vw, 48px)", { lineHeight: "1.13" }],
      },
      spacing: {
        "2.25": "0.5625rem",
        "3.5": "0.875rem",
        "4.5": "1.125rem",
        "4.75": "1.1875rem",
        "5.5": "1.375rem",
        "6.5": "1.625rem",
        "7.5": "1.875rem",
        "8.5": "2.125rem",
        "10.5": "2.625rem",
        "22": "5.5rem",
      },
      boxShadow: {
        card: "0 18px 55px rgba(22, 35, 61, 0.07)",
      },
      borderRadius: {
        lg: "22px",
        md: "13px",
      },
    },
  },
  plugins: [],
};
export default config;
