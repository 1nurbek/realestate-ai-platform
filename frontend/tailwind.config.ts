import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f8ff',
          100: '#e8f0ff',
          500: '#2463eb',
          700: '#173ea5',
          900: '#102652',
        },
      },
    },
  },
  plugins: [forms],
};

export default config;