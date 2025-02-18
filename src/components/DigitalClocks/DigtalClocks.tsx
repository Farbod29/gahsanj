import React, { useState, useEffect } from 'react';

// Define a type for the props expected by the DigitalClock component
type DigitalClockProps = {
  timeZone: string; // This sets the type for timeZone as string
};

const DigitalClock: React.FC<DigitalClockProps> = ({ timeZone }) => {
  const [time, setTime] = useState<string>(''); // The type of state is also explicitly set as string

  useEffect(() => {
    const updateClock = () => {
      setTime(
        new Date().toLocaleTimeString('en-GB', { hour12: false, timeZone })
      );
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [timeZone]);

  return (
    <div className='bg-gray-200 text-black font-bold shadow rounded px-4 py-2'>
      {time}
    </div>
  );
};

export default DigitalClock;
