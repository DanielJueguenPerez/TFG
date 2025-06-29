/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
extend: {
      fontFamily: {
        // 'font-heading' para títulos, 'font-body' para texto
        heading: ["Poppins", "sans-serif"],
        body:    ["sans-serif"],
      },
    },
  },
  plugins: [],
}