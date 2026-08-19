/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lime: {
          400: "#abf34d",
          500: "#8ae032",
          600: "#75cc1f",
        },
        fintech: {
          bg: "#0c120a",
          card: "#141d11",
          border: "#23321f",
          muted: "#84967c",
          accent: "#abf34d",
          accentDark: "#1a2b0e",
          text: "#f1f7ed",
          subtext: "#9bb093",
        },
      },
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      animation: {
        "pulse-glow": "pulseGlow 3s infinite alternate",
        "float-slow": "floatSlow 6s ease-in-out infinite alternate",
      },
      keyframes: {
        pulseGlow: {
          "0%": { boxShadow: "0 0 20px rgba(171, 243, 77, 0.15)" },
          "100%": { boxShadow: "0 0 35px rgba(171, 243, 77, 0.4)" },
        },
        floatSlow: {
          "0%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
