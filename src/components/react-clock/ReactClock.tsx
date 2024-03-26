import React, { useEffect, useState } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';

// Define a type for the props expected by ReactClock
interface ReactClockProps {
  timeZone?: string; // the timeZone prop is optional and can be a string
}

export default function ReactClock({ timeZone }: ReactClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      // The timeString will be in the format of the specified time zone
      const timeString = new Date().toLocaleString('en-US', { timeZone });
      // Parse the time string back into a Date object
      const dateInTimeZone = new Date(timeString);
      setCurrentTime(dateInTimeZone);
    }, 1000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, [timeZone]);

  return (
    <div style={{ display: 'inline-block', marginLeft: '20px' }}>
      <Clock
        value={currentTime}

        // size={100}
        //  renderNumbers={true}  />
      />
    </div>
  );
}
