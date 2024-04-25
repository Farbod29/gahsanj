import React, { useState, useEffect } from "react";

const DigitalClock = ({ timeZone }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      setTime(
        new Date().toLocaleTimeString("en-GB", { hour12: false, timeZone })
      );
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, [timeZone]);

  return (
    <div className="bg-gray-200 text-black font-bold shadow rounded px-4 py-2">
      {time}
    </div>
  );
};

export default DigitalClock;
