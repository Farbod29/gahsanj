// libraries
import localFont from 'next/font/local';

export const iranNastaliqFontFamily = localFont({
  variable: '--font-IranNastaliq',
  src: [
    {
      path: './IranNastaliq/naswoff.woff2',
      weight: '100',
      style: 'normal',
    },
  ],
});
