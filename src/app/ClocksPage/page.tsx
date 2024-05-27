// src/app/ClocksPage/page.tsx
"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";

// Dynamically import ReactClock with SSR disab   led
const ReactClockNoSSR = dynamic(
  () => import("@/components/react-clock/ReactClock"),
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
        return 40;
      } else if (screenWidth <= 768) {
        return 60;
      } else if (screenWidth <= 1800) {
        return 73;
      }
      return 120; // Return default size if no condition is met
    }

    setClockSize(determineClockSize());
    const handleResize = () => {
      setClockSize(determineClockSize());
    };
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div>
      <div className="bg-white p-1 pt-2">
        {/* Assuming you have 6 clocks to display in a row */}
        <div className="grid grid-cols-6 gap-4 justify-items-center">
          {/* Clocks will be here */}
          {/* Repeat this block for each clock */}
          <div className="flex flex-col items-center mb-4">
            {/* <div className="text-black text-xxxxs md:text-xs ">Local</div> */}
            <ReactClockNoSSR timeZone="userTimeZone" size={clockSize} />
            <div className="text-black text-lg md:text-xs text-xxxxs ">
              محلی
            </div>
          </div>
          {/* CLOCKS */}
          {/* CLOCKS */}
          <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/6">
            {/* <div className="text-black text-xxxxs md:text-xs ">Los Angeles</div> */}
            <ReactClockNoSSR timeZone="America/Los_Angeles" size={clockSize} />
            <div className="text-black text-lg md:text-xs  text-verysmall ">
              کالیفرنیا
            </div>
          </div>
          {/* CLOCKS */}
          {/* CLOCKS */}
          <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/6">
            {/* <div className="text-black text-xxxxs md:text-xs ">New York</div> */}
            <ReactClockNoSSR timeZone="America/New_York" size={clockSize} />
            <div className="text-black text-lg md:text-xs  text-xxxxs ">
              نیویورک
            </div>
          </div>
          {/* CLOCKS */}
          {/* CLOCKS */}
          <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/6">
            {/* <div className="text-black text-xxxxs md:text-xs ">London</div> */}
            <ReactClockNoSSR timeZone="Europe/London" size={clockSize} />
            <div className="text-black text-lg md:text-xs  text-xxxxs ">
              لندن
            </div>
          </div>
          <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/6">
            {/* <div className="text-black text-xxxxs md:text-xs ">Tehran</div> */}
            <ReactClockNoSSR timeZone="Asia/Tehran" size={clockSize} />
            <div className="text-black text-lg md:text-xs  text-xxxxs ">
              تهران
            </div>
          </div>
          {/* CLOCKS */}
          <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/6">
            {/* <div className="text-black text-xxxxs md:text-xs ">Berlin</div> */}
            <ReactClockNoSSR timeZone="Europe/Berlin" size={clockSize} />
            <div className="text-black text-lg md:text-xs  text-xxxxs ">
              برلین
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClocksPage;
