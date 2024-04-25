// src/app/ClocksPage/ClocksPage.tsx
"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import DigitalClock from "@/components/DigitalClocks/DigtalClocks"; // Ensure the correct path to DigitalClock component

// Dynamically import ReactClock with SSR disabled
const ReactClockNoSSR = dynamic(
  () => import("@/components/react-clock/ReactClock"),
  { ssr: false }
);

const ClocksPage = () => {
  const [clockSize, setClockSize] = useState<number>(120);

  useEffect(() => {
    const determineClockSize = (): number => {
      const screenWidth = window.innerWidth;
      if (screenWidth <= 768) {
        return 80; // Adjusted size for smaller screens
      }
      return 80; // Default size for larger screens
    };

    const handleResize = () => {
      setClockSize(determineClockSize());
    };

    handleResize(); // Set initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const clocks = [
    { timeZone: "Australia/Sydney", cityFA: "سیدنی" },
    { timeZone: "America/Toronto", cityFA: "تورنتو" },
    { timeZone: "Europe/London", cityFA: "لندن" },
    { timeZone: "Europe/Berlin", cityFA: "برلین" },
    { timeZone: "Asia/Tehran", cityFA: "تهران" },
    { timeZone: "Asia/Kuala_Lumpur", cityFA: "کوالالامپور" },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3 justify-items-center">
      {clocks.map((clock, index) => (
        <div className="flex flex-col items-center mb-4" key={index}>
          {/* Analog clock */}
          <div className="mb-2">
            <ReactClockNoSSR timeZone={clock.timeZone} size={clockSize} />
          </div>
          {/* Digital clock */}
          <div className="mb-2">
            <DigitalClock timeZone={clock.timeZone} />
          </div>
          {/* City name text */}
          <div className="text-center text-lg text-black">{clock.cityFA}</div>
        </div>
      ))}
    </div>
  );
};

export default ClocksPage;
