import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      // IranNastaliq: ['var(--font-IranNastaliq)'],
      hamishe: ['Hamishe', 'sans-serif'], // Existing font configuration
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontSize: {
        xxxxs: '0.6rem', // Custom extra extra extra small font size
        verysmall: '0.5rem', // Custom extra extra extra small font size
      },
      spacing: {
        '0.1': '1.3325rem', // for very fine adjustments
        '3': '0.575rem', // you can add more as needed
      },
      screens: {
        xs: '430px', // Custom breakpoint for 430px wide screens
        xm: '375px', // Custom breakpoint for iPhone SE and similar devices
        se: '375px', // targeting iPhone SE specifically
        iphone14: '430px', // targeting iPhone 14 specifically
      },
    },
  },
  plugins: [],
};

export default config;
