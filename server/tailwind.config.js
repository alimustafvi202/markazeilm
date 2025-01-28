/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          navy: '#003366',
          teal: '#008080',
          softGrayLight: '#f4f4f4',
          softGrayDark: '#d3d3d3',
        },
        accent: {
          green: '#28a745',
          orange: '#ff8c00',
          lightBlue: '#00aaff',
        },
        neutral: {
          white: '#FFFFFF',
          darkGray: '#333333',
        },
        text: {
          black: '#000000',
          lightGray: '#888888',
        },
      },
    },
  },
  plugins: [],
};
