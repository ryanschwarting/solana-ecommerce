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
        "light-blue": "#2497f2",
        "royal-blue": "#4352ff",
        "custom-gray": "#7b7a7b",
        "dark-gray": "#18181d",
        "custom-black": "#000101",
        "kaktos-pink": "#f399af",
        "kaktos-purple": "#6c2987",
        "kaktos-navy": "#0f1a38",
        "kaktos-brown": "#583021",
        "kaktos-gray": "#c5cfcb",
        "kaktos-tan": "#d7ad84",
        "kaktos-white": "#ebede8",
        "kaktos-blue": "#44d1ff",
        "kaktos-lavender": "#d9c3ff",
      },
    },
  },
  plugins: [],
};
export default config;
