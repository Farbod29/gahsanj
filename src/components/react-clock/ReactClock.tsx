// react clock.jsx

'use client';

import React, { useLayoutEffect, useState, useEffect } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

interface ReactClockProps {
  timeZone?: string;
}
interface ReactClockProps {
  timeZone?: string;
  size?: number; // add this line to include the size property
}
export default function ReactClock({ timeZone, size }: ReactClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [propsSize, setPropsSize] = useState(30); // Default size

  useLayoutEffect(() => {
    const updateSize = () => {
      const newSize = window.innerWidth < 320 ? 100 : 150;
      setPropsSize(newSize);
    };

    window.addEventListener('resize', updateSize);
    updateSize(); // Call immediately to set initial size

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeString = new Date().toLocaleString('en-US', { timeZone });
      const dateInTimeZone = new Date(timeString);
      setCurrentTime(dateInTimeZone);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeZone]);

  return (
    <div className='inline-block m-2'>
      <Clock value={currentTime} size={size} />
    </div>
  );
}
