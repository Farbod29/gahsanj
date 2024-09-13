'use client';
import Footer from '@/components/Footer/Footer';
import React from 'react';

const GahgardanIframe = () => {
  return (
    <div
      style={{
        backgroundColor: '#333863',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <div
        style={{ width: '110%', height: '600px', backgroundColor: '#333863' }}
        className='flex items-center justify-center -translate-x-4  translate-y-22'
      >
        <iframe
          src='https://gahshomar.com/gahgardan/'
          width='100%'
          height='89%'
          style={{ border: 'none', display: 'block' }}
        ></iframe>
      </div>
      <Footer />
    </div>
  );
};

export default GahgardanIframe;
///Users/farbodaprin/Desktop/iranian-gah-shomar2/src/app/Gahgardan/page.tsx
