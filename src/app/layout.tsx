import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Hamishe } from '../../public/fonts/fonts';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { metadata } from './metadata';
import ClientLayout from '../components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

// Export metadata
export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='fa' dir='rtl' className={`${Hamishe.variable}`}>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap'
          rel='stylesheet'
        />
      </head>
      <body className='Hamishe min-h-screen flex flex-col'>
        <ClientLayout>{children}</ClientLayout>
        <SpeedInsights />
      </body>
    </html>
  );
}
