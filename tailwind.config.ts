import type {Config} from "tailwindcss";

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        blink: 'dot-blink 1.5s steps(1, end) infinite',
        'slideIn': 'slideIn 0.3s ease-out forwards',
      },
      keyframes: {
        'dot-blink': {
          '0%, 20%': { content: "''" },
          '40%': { content: "'.'" },
          '60%': { content: "'..'" },
          '80%, 100%': { content: "'...'" },
        },
        slideIn: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(1rem)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'background-dark-0': 'rgba(0, 0, 0, 0)',
        'background-dark-1': 'rgb(0, 0, 0)',
        'background-dark': '#1f2937', // bg-gray-800
        'background-light': '#f7fafc', // bg-gray-100
        'background-color-light': '#edf2f7', // bg-gray-200
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
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
} satisfies Config;
