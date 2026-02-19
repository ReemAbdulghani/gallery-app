/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,css,jsx}",  // ⬅ add css here
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#64748b",
        accent: "#fbbf24",
        dark: "#1e293b",
        light: "#f1f5f9",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
