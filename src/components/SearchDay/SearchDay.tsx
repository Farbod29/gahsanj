// components/SearchDay/SearchDay.js
'use client';
import React, { useEffect } from 'react';

export default function DatesPageSearch({ data, onPreviousDayFound }) {
  useEffect(() => {
    const months = {};

    data.forEach((item) => {
      const [day, month] = item.Georgian.split(',');
      const parsedDay = parseInt(day, 10);
      if (!months[month]) {
        months[month] = [];
      }
      months[month].push(parsedDay);
    });

    Object.keys(months).forEach((month) => {
      months[month].sort((a, b) => a - b);
    });

    console.log('Sorted Month Data:', months);

    const today = new Date();
    const thisMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    const thisDay = today.getDate();

    const datesArray = months[thisMonth] || [];
    let previousDay = null;
    for (let i = 0; i < datesArray.length; i++) {
      if (datesArray[i] >= thisDay) {
        previousDay = i > 0 ? datesArray[i - 1] : null;
        break;
      }
    }

    if (!previousDay && datesArray.length > 0) {
      previousDay = datesArray[datesArray.length - 1];
    }

    console.log(
      `Previous Day: ${previousDay},${thisMonth} => [${previousDay},${thisMonth}]`
    );

    if (onPreviousDayFound) {
      onPreviousDayFound(`${previousDay},${thisMonth}`);
    }
  }, [data, onPreviousDayFound]);

  return (
    <div>
      <h1>Dynamic Month Arrays and Previous Day Finder</h1>
    </div>
  );
}
