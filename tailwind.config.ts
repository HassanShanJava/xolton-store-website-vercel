import { type Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      storeFont: ['inter', 'sans-serif'],
    },
    extend: {
      colors: {
        "ac-1": "#FB74B5",
        "ac-2": "#BF1065",
        "pm-3": "#A9A9A9",
        "pm-4": "#878787",
        "pm-6": "#3C3C3C",
        "pm-10": "#1E1E1E",
        "pm-11": "#DDD",
        "pm-12": "#777E90",
        "ct-1": "#090F1B",
        "ct-2": "#030607",
        "bg-1": "#f5f5f5",
        "bg-2": "#eee8e8",
        "bg-3": "#363033",
        "gt-1": "#A0AEC0",
        "tx-1":"rgba(0,0,0,0.48)",
        "tx-2":"rgba(0,0,0,0.24)",
        "tx-3":"#9CA3AF",
      },
      backgroundImage: {
        "gradient-24":
          "linear-gradient(104.64deg, #030607 0%, #090F1B 70.15%);",
        "accentLinear-1": "linear-gradient(90.68deg, #FB74B5 0%, #BF1065 100%)",
      },
    },
    screens: {
      xss: "300px",
      xs: "340px",
      sx:"580px",
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      mdx: "920px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }
      xlg:"1200px",
      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
} satisfies Config;
