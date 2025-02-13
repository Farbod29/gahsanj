// src/app/metadata.ts

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'گاه سنج',
  description: 'تقویم و ساعت ایران',
  icons: {
    icon: [
      { url: '/favicon/android-chrome-512x512.png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      {
        url: '/favicon/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [{ rel: 'manifest', url: '/favicon/site.webmanifest' }],
  },
};
