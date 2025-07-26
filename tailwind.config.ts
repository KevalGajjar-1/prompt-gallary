// TypeScript configuration for Tailwind with DaisyUI
import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

// Create a simple configuration object with type assertion
const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark"],
  },
} as const;

// Export with type assertion to satisfy TypeScript
export default config as unknown as Config;
