'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import Footer from '../Footer/Footer';

export default function ClientLayout({ children }: { children: ReactNode }) {
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
    <div style={{ direction: 'ltr' }}>
      <main className='flex-grow' style={{ direction: 'ltr' }}>
        {children}
      </main>
      {pathname && footerRoutes.includes(pathname) && <Footer />}
    </div>
  );
}
