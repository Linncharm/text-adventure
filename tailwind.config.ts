import type {Config} from "tailwindcss";

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      transitionProperty: {
        'background-color': 'background-color',
        'color': 'color',
        'border-color': 'border-color',
        'box-shadow': 'box-shadow', // If you want to transition shadow too
      },
      transitionDuration: {
        500: '500ms',
      },
    },
  },
  plugins: [],
} satisfies Config;
