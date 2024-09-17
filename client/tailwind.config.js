/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#47ff9c",
        textColor: "#737374",
      },
    },
  },
  plugins: [],
};
