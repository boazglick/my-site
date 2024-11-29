/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",  // Include all files in the `app` directory
    "./components/**/*.{js,ts,jsx,tsx}"  // Include a `components` folder if you have one
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
