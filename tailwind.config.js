/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    "w-0", "w-1/5", "w-2/5", "w-3/5", "w-1/12", "w-10/12", "w-2/12", "w-8/12", "w-1/12", "w-5/12"
  ]
};
