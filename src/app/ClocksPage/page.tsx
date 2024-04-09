'use client';
import ReactClock from '@/components/react-clock/ReactClock';
import React from 'react';

function determineClockSize(): number {
  const screenWidth = window.innerWidth;

  if (screenWidth <= 480) {
    // Phone size
    return 70;
  } else if (screenWidth <= 768) {
    // iPad size
    return 90;
  } else {
    // Larger screens
    return 130;
  }
}

const ClocksPage = () => {
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
            <ReactClock timeZone="Europe/Berlin" size={determineClockSize()} />
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
            <ReactClock
              timeZone="America/Los_Angeles"
              size={determineClockSize()}
            />
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
            <ReactClock
              timeZone="America/New_York"
              size={determineClockSize()}
            />
            <div className="text-black text-lg md:text-3xl pt-1 pb-4 text-xxxxs ">
              نیویورک
            </div>
          </div>
          {/* CLOCKS */}
          {/* CLOCKS */}
          <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/6">
            <div className="text-black text-xxxxs md:text-2xl pb-1">London</div>
            <ReactClock timeZone="Europe/London" size={determineClockSize()} />
            <div className="text-black text-lg md:text-3xl pt-1 pb-4 text-xxxxs ">
              لندن
            </div>
          </div>
          <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/6">
            <div className="text-black text-xxxxs md:text-2xl pb-1">Tehran</div>
            <ReactClock timeZone="Asia/Tehran" size={determineClockSize()} />
            <div className="text-black text-lg md:text-3xl pt-1 pb-4 text-xxxxs ">
              تهران
            </div>
          </div>
          {/* CLOCKS */}
          {/* CLOCKS */}
          <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/6">
            <div className="text-black text-xxxxs md:text-2xl pb-1">Berlin</div>
            <ReactClock timeZone="Asia/Tehran" size={determineClockSize()} />
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
