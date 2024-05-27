'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import DigitalClock from '@/components/DigitalClocks/DigtalClocks'; // Ensure the correct path to DigitalClock component

// Dynamically import ReactClock with SSR disabled
const ReactClockNoSSR = dynamic(
  () => import('@/components/react-clock/ReactClock'),
  { ssr: false }
);

const ClocksPage = () => {
  const [clockSize, setClockSize] = useState<number>(90);
  const [containerSize, setContainerSize] = useState<number>(110); // Initialize container size
  const [localTimeZone, setLocalTimeZone] = useState<string>('');

  useEffect(() => {
    const determineClockSize = (): number => {
      const screenWidth = window.innerWidth;

      if (screenWidth <= 480) {
        return 80;
      } else if (screenWidth <= 768) {
        return 100;
      } else if (screenWidth <= 1800) {
        return 120;
      }
      return 140; // Default size for larger screens
    };

    const determineContainerSize = (clockSize: number): number => {
      return clockSize + 16; // Add 16 to the clock size for the container size
    };

    const newClockSize = determineClockSize();
    setClockSize(newClockSize);
    setContainerSize(determineContainerSize(newClockSize));

    const handleResize = () => {
      const resizedClockSize = determineClockSize();
      setClockSize(resizedClockSize);
      setContainerSize(determineContainerSize(resizedClockSize));
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setLocalTimeZone(userTimeZone);
    } catch (error) {
      console.error('Failed to get local time zone:', error);
    }
  }, []);

  const clocks = [
    { timeZone: localTimeZone || 'UTC', cityFA: 'محلی' }, // Default to 'UTC' if localTimeZone is not available
    { timeZone: 'America/Los_Angeles', cityFA: 'لس آنجلس' },
    { timeZone: 'America/Toronto', cityFA: 'تورنتو' },
    { timeZone: 'Europe/Berlin', cityFA: 'برلین' },
    { timeZone: 'Europe/London', cityFA: 'لندن' },
    { timeZone: 'Australia/Sydney', cityFA: 'سیدنی' },
    { timeZone: 'Asia/Kuala_Lumpur', cityFA: 'کوالالامپور' },
    { timeZone: 'Asia/Dubai', cityFA: 'دبی' },
    { timeZone: 'America/New_York', cityFA: 'واشنگتن' },
    { timeZone: 'Europe/Istanbul', cityFA: 'استانبول' },
    { timeZone: 'Europe/Stockholm', cityFA: 'استکهلم' },
    { timeZone: 'Asia/Baghdad', cityFA: 'بغداد' },
    { timeZone: 'Asia/Jerusalem', cityFA: 'اورشلیم' },
    { timeZone: 'Asia/Kolkata', cityFA: 'مومبای' },
    { timeZone: 'Europe/Moscow', cityFA: 'مسکو' },
    { timeZone: 'Asia/Baku', cityFA: 'باکو' },
  ];

  return (
    <div className='p-4 bg-[#7F84B4] min-h-screen rounded-lg'>
      <div className='grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3 justify-items-center'>
        {clocks.map((clock, index) => (
          <div className='flex flex-col items-center mb-4' key={index}>
            {/* Analog clock */}
            <div
              className='flex items-center justify-center rounded-full border-8 border-[#FD821D] bg-white mb-2'
              style={{
                width: `${containerSize}px`,
                height: `${containerSize}px`,
              }}
            >
              <ReactClockNoSSR timeZone={clock.timeZone} size={clockSize} />
            </div>
            {/* Digital clock */}
            <div className='mb-2'>
              <DigitalClock timeZone={clock.timeZone} />
            </div>
            {/* City name text */}
            <div className='text-center text-lg text-white'>{clock.cityFA}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClocksPage;
