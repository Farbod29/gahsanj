import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      hamishe: ['Hamishe', 'sans-serif'],
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontSize: {
        xxxxs: '0.4rem',
        verysmall: '0.5rem',
      },
      spacing: {
        '0.1': '1.3325rem',
        '3': '0.575rem',
      },
      screens: {
        xs: '430px',
        xm: '375px',
        se: '375px',
        'h-md': { raw: '(min-height: 667px)' },
        'h-lg': { raw: '(min-height: 844px)' },
        'h-xl': { raw: '(min-height: 896px)' },
        iphone14: '430px',
        ipad: '768px',
        ipadair: '820px',
      },
    },
  },
  plugins: [],
};

export default config;