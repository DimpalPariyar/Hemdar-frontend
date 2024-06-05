/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#1E2832",
        primaryBG: "#1e28320d",
      },

      fontFamily: {
        primary: ["Josefin Sans", "sans-serif"],
        inter: ["Inter"],
      },

      // height: {
      //   screen: "100dvh",
      // },
    },
  },
  plugins: [],
};

// // tailwind.config.js
// module.exports = {
//   // other configurations...
//   content: [
//     './src/**/*.html',
//     './src/**/*.js',
//     // Add other paths as needed
//   ],
// };
