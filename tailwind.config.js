/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      "dark-blue": "#312d6d",
      white: "#FFFFFF",
      turquoise: "#35d2e1",
      "turquoise-100": "#55aaee",
      "light-turquoise": "#85b9e4",
      "pale-turquoise": "#f1fbfd",
      "black": "#000000",
      "gery": "#808080"
    },
    fontFamily: {
      readexPro: ["Readex Pro", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
    },
  },
  plugins: [],
};
