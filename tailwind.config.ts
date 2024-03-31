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
        xxxxs: '0.7rem', // Custom extra extra extra small font size
      },
      spacing: {
        '0.1': '1.3325rem', // for very fine adjustments
        '3': '0.575rem', // you can add more as needed
      },
    },
  },
  plugins: [],
};

export default config;
