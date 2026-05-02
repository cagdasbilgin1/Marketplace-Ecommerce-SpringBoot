import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff0fd",
          100: "#ffe0fb",
          200: "#ffc0f8",
          300: "#ff9cf4",
          400: "#ff72ee",
          500: "#ff44ef",
          600: "#e72ccf",
          700: "#bf1ea7",
          800: "#8f177d",
          900: "#611058",
        },
        ink: "#161127",
        mist: "#fff8fe",
        glow: "#ffd166",
      },
      boxShadow: {
        haze: "0 20px 50px rgba(255, 68, 239, 0.18)",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top, rgba(255, 68, 239, 0.24), transparent 32%), linear-gradient(135deg, rgba(255, 68, 239, 0.08), rgba(255, 209, 102, 0.12))",
      },
    },
  },
  plugins: [],
} satisfies Config;
