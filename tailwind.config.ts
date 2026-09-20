import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF8F5",
        surface: "#FFFFFF",
        brand: {
          50: "#FDF4F5",
          100: "#FBE8EA",
          200: "#F7D5D9",
          300: "#F0B2BC",
          400: "#E58293",
          500: "#D95670",
          600: "#C43B57",
          700: "#A52D45",
          800: "#8A283C",
          900: "#752637",
        },
        sage: {
          50: "#F4F7F4",
          100: "#E5ECE5",
          200: "#CDDACD",
          300: "#AAC1AB",
          400: "#81A283",
          500: "#628665",
          600: "#4D6B50",
          700: "#3E5540",
        },
      },
    },
  },
  plugins: [],
};
export default config;
