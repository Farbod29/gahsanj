'use client';
import React, { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import html2canvas from 'html2canvas';

export default function Page() {
  const ref = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    console.log('Image has loaded');
    setLoaded(true);
  }, []);

  const downloadScreenshot = useCallback(() => {
    console.log('Attempting to take screenshot, ref:', ref.current);
    if (ref.current) {
      console.log('Ref is attached, taking screenshot');
      html2canvas(ref.current, { scale: 1 }).then((canvas) => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'screenshot.png'; // You can dynamically generate file names as well
        link.click();
      });
    } else {
      console.error('Ref is not attached or image not loaded');
    }
  }, []);

  return (
    <div>
      <button
        onClick={downloadScreenshot}
        disabled={!loaded}
        className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out zIndex: 2,"
      >
        دریافت فرتور به اندازه صفحه دستگاهتان
      </button>
      <div></div>
      <div
        ref={ref}
        style={{ position: 'relative', width: '1080', height: '1920px' }}
      >
        <Image
          // src="/assets/pexels-photo-1804035.jpg"
          src="https://irantasvir.com/wp-content/uploads/2024/05/museum-day.jpg"
          alt="Decorative background"
          layout="fill"
          objectFit="cover"
          onLoad={handleLoad}
        />
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '24px',
            zIndex: 2,
          }}
        >
          <div>ایران نو</div>
          ۷/۰۲/۲۳
          <div>مهر شید / یکشنبه</div>
        </div>
      </div>
    </div>
  );
}
