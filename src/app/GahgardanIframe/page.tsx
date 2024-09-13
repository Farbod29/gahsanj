'use client';
import Footer from '@/components/Footer/Footer';
import React from 'react';

const GahgardanIframe = () => {
  return (
    <div
      style={{
        backgroundColor: '#333863',
        minHeight: '100vh',
      }}
    >
      <div
        style={{ width: '100%', height: '600px', backgroundColor: '#333863' }}
        className='flex items-center justify-center' // Removed `-translate-x-4` and `fixed`
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