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
  const [clockSize, setClockSize] = useState(130);

  useEffect(() => {
    // This function will determine the clock size and set it using the state
    function determineClockSize() {
      const screenWidth = window.innerWidth;

      if (screenWidth <= 480) {
        return 70;
      } else if (screenWidth <= 768) {
        return 90;
      } else {
        return 130;
      }
    }

    // Call the function and set the state when the component mounts in the browser
    setClockSize(determineClockSize());

    // Optional: Set up a resize listener if you want the size to be responsive
    const handleResize = () => {
      setClockSize(determineClockSize());
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-12">
        <div className="flex flex-wrap justify-center items-center md:pt-12 ">
          {/* CLOCKS */}
          {/* CLOCKS */}
          <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/6 lg:px-20">
            <div className="text-black text-xxxxs md:text-2xl pb-1">
              Local Time
            </div>
            <ReactClockNoSSR timeZone="Europe/Berlin" size={clockSize} />
            <div className="text-black text-lg md:text-3xl pt-1 pb-4 text-xxxxs ">
              وقت محلی
            </div>
          </div>
          {/* CLOCKS */}
          {/* CLOCKS */}
          <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/6">
            <div className="text-black text-xxxxs md:text-2xl pb-1">
              Los Angeles
            </div>
            <ReactClockNoSSR timeZone="America/Los_Angeles" size={clockSize} />
            <div className="text-black text-lg md:text-3xl pt-1 pb-4 text-xxxxs ">
              لس آنجلس
            </div>
          </div>
          {/* CLOCKS */}
          {/* CLOCKS */}
          <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/6">
            <div className="text-black text-xxxxs md:text-2xl pb-1">
              New York
            </div>
            <ReactClockNoSSR timeZone="America/New_York" size={clockSize} />
            <div className="text-black text-lg md:text-3xl pt-1 pb-4 text-xxxxs ">
              نیویورک
            </div>
          </div>
          {/* CLOCKS */}
          {/* CLOCKS */}
          <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/6">
            <div className="text-black text-xxxxs md:text-2xl pb-1">London</div>
            <ReactClockNoSSR timeZone="Europe/London" size={clockSize} />
            <div className="text-black text-lg md:text-3xl pt-1 pb-4 text-xxxxs ">
              لندن
            </div>
          </div>
          <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/6">
            <div className="text-black text-xxxxs md:text-2xl pb-1">Tehran</div>
            <ReactClockNoSSR timeZone="Asia/Tehran" size={clockSize} />
            <div className="text-black text-lg md:text-3xl pt-1 pb-4 text-xxxxs ">
              تهران
            </div>
          </div>
          {/* CLOCKS */}
          {/* CLOCKS */}
          <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/6">
            <div className="text-black text-xxxxs md:text-2xl pb-1">Berlin</div>
            <ReactClockNoSSR timeZone="Asia/Tehran" size={clockSize} />
            <div className="text-black text-lg md:text-3xl pt-1 pb-4 text-xxxxs ">
              برلین
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClocksPage;
