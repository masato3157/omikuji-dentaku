/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#f99406",
        "background-light": "#f8f7f5",
        "background-dark": "#231b0f",
        "metal-light": "#e8e8e8",
        "metal-mid": "#d4d4d4",
        "metal-dark": "#9ca3af",
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"],
        "sans": ["Noto Sans", "sans-serif"]
      },
      borderRadius: {
        "lg": "2rem",
        "xl": "3rem",
      },
      boxShadow: {
        "button": "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255,255,255,0.15)",
        "button-pressed": "inset 0 4px 6px rgba(0, 0, 0, 0.4)",
        "screen": "inset 0 4px 8px rgba(0,0,0,0.5), 0 1px 2px rgba(255,255,255,0.1)",
        "chassis": "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.4)"
      },
      backgroundImage: {
        'brushed-metal': "repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.05) 1px, rgba(0,0,0,0.05) 2px), linear-gradient(180deg, #d8d8d8 0%, #b0b0b0 100%)",
        'button-num': "linear-gradient(180deg, #4a4a4a 0%, #2d2d2d 100%)",
        'button-func': "linear-gradient(180deg, #a0a0a0 0%, #808080 100%)",
        'button-orange': "linear-gradient(180deg, #fbbf24 0%, #f99406 100%)",
      }
    },
  },
  plugins: [],
}
