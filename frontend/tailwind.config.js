/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#667eea",
          600: "#5568d3",
          700: "#4c5ab8",
          800: "#424a9a",
          900: "#3a407c",
        },
      },
    },
  },
  plugins: [],
};
