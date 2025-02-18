// src/app/ClocksPage/page.tsx
'use client';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';

// Dynamically import ReactClock with SSR disabled
const ReactClockNoSSR = dynamic(
  () => import('@/components/react-clock/ReactClock'),
  { ssr: false }
);

const ClocksPage = () => {
  // Initialize the clock size with a default value
  const [clockSize, setClockSize] = useState<number>(120);

  useEffect(() => {
    // This function will determine the clock size and set it using the state
    function determineClockSize(): number {
      const screenWidth = window.innerWidth;

      if (screenWidth <= 480) {
        return 140;
      } else if (screenWidth <= 768) {
        return 140;
      } else if (screenWidth <= 1800) {
        return 140;
      }
      return 120; // Return default size if no condition is met
    }

    setClockSize(determineClockSize());
    const handleResize = () => {
      setClockSize(determineClockSize());
    };
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className='p-3 bg-transparent'>
      <div className='flex flex-row items-center'>
        {/* Changed to flex row */}
        {/* Clock for Berlin */}
        <div className='flex flex-col items-center mr-4'>
          {/* Added margin for spacing between clocks */}
          <ReactClockNoSSR timeZone='userTimeZone' size={clockSize} />
          <div className='text-sm mt-2'>
            {/* Added margin-top for spacing between clock and text */}
            محلی
          </div>
        </div>
        {/* Clock for Tehran */}
        <div className='flex flex-col items-center'>
          {/* Directly following the first clock */}
          <ReactClockNoSSR timeZone='Asia/Tehran' size={clockSize} />
          <div className='text-sm mt-2'>
            {/* Text alignment and spacing */}
            تهران
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClocksPage;
