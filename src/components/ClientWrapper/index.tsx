'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Head from 'next/head';
import Footer from '../Footer/Footer';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const footerRoutes = [
    '/',
    '/smallCalendarMobile',
    '/FarakhorMobileDark',
    '/gahshomaranDark',
    '/ExtraTools',
    '/AiGenerator',
    '/PhoneAppGahshomar',
    '/PhoneAppGahshomarNoAIJustModal',
  ];

  return (
    <>
      <Head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap'
          rel='stylesheet'
        />
      </Head>
      <main className='flex-grow' style={{ direction: 'rtl' }}>
        {children}
      </main>
      {pathname && footerRoutes.includes(pathname) && <Footer />}
    </>
  );
}
