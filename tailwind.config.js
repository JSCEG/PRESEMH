/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gobmx: {
          guinda: "#9B2247",
          verde: "#1E5B4F",
          dorado: "#A57F2C",
          gris: "#98989A",
          "gris-claro": "#E5E5E5",
          "guinda-light": "rgba(155, 34, 71, 0.05)",
          "verde-light": "rgba(30, 91, 79, 0.05)",
          "dorado-light": "rgba(165, 127, 44, 0.05)",
        },
      },
      fontFamily: {
        headings: ["Patria", "Merriweather", "serif"],
        body: ["Noto Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}
