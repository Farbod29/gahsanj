'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
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
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap'
          rel='stylesheet'
        />
      </head>
      <main className='flex-grow' style={{ direction: 'rtl' }}>
        {children}
      </main>
      {footerRoutes.includes(pathname) && <Footer />}
    </>
  );
}
