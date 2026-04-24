/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#171612",
          800: "#37352f",
          600: "#6f6a60",
          400: "#a49d91",
        },
        paper: {
          50: "#fbfaf7",
          100: "#f7f4ee",
          200: "#eee8db",
        },
        moss: {
          500: "#6d8b74",
          600: "#54705c",
        },
        coral: {
          400: "#e78f75",
          500: "#d9755f",
        },
        sky: {
          500: "#5f8fa8",
        },
        saffron: {
          400: "#d9a441",
        },
      },
      boxShadow: {
        soft: "0 16px 40px rgba(55, 53, 47, 0.08)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

