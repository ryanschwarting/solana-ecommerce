import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        custom: "1400px", // Custom maximum width
      },
      colors: {
        "sol-purple": "#9945FF",
        "sol-green": "#14F195",
      },
    },
  },
  plugins: [],
};
export default config;
