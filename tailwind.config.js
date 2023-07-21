/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      fontFamily: {
        Arvo: "Arvo, sans-serif",
      },
      colors: {
        "off-white": "hsl(0, 0%, 94%)",
        "light-grey": "hsl(0, 0%, 86%)",
        "smokey-grey": "hsl(0, 1%, 44%)",
        "off-black": "hsl(0, 0%, 8%)",
      },
      gridRow: {
        "cont-row": "1 / span 1",
        "home-row": "1 / span 1",
      },
      gridColumn: {
        "cat-col": "2 / span 1",
        "score-col": "1 / span 1",
        "home-col": "3 / span 1",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
