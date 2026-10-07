import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        corp: {
          primary: "#0A1B8F",
          purple: "#6B1FA0",
          accent: "#1AA3D9",
          bgSoft: "#EEF2F8",
          text: "#0B0B0F",
          muted: "#4B5563",
          footer: "#1C1C1C",
        },
        store: {
          primary: "#E01B47",
          primaryHover: "#C4153C",
          bg: "#FFF9F7",
          card: "#FFFFFF",
          text: "#141414",
          success: "#16A34A",
          successBg: "#ECFDF3",
          star: "#F59E0B",
          whatsapp: "#25D366",
        },
        admin: {
          sidebar: "#0F172A",
          canvas: "#F8FAFC",
          primary: "#0A1B8F",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        pill: "9999px",
        card: "16px",
      },
      boxShadow: {
        storeCard: "0 2px 8px rgba(0,0,0,0.08)",
        storeHover: "0 8px 24px rgba(224,27,71,0.12)",
        corpCard: "0 4px 20px rgba(10,27,143,0.08)",
      },
      scale: {
        "105": "1.05",
        "106": "1.06",
        "108": "1.08",
      },
    },
  },
  plugins: [],
};

export default config;
