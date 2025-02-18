// src/components/Layout.tsx

import { ReactNode } from 'react';
import Footer from '../Footer/Footer';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-grow'>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
