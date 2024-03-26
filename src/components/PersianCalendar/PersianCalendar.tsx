import React, { useState } from 'react';
import jalaali from 'jalaali-js';

const PersianCalendar = () => {
  // Define the Jalaali month and week names
  const jalaaliMonths = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ];

  const persianWeekDays = [
    { day: 'اورمزد', dayShort: 'پ' },
    { day: 'آدینه', dayShort: 'ج' },
    { day: 'کیوان', dayShort: 'ش' },
    { day: 'مهر', dayShort: 'ی' },
    { day: 'ماه', dayShort: 'د' },
    { day: 'بهرام', dayShort: 'س' },
    { day: 'تیر', dayShort: 'چ' },
  ];

  // Helper function to convert numbers to Persian
  const toPersianDigits = (num: number): string => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num
      .toString()
      .split('')
      .map((digit) => persianNumbers[parseInt(digit, 10)])
      .join('');
  };

  // Initialize today's date
  const today = new Date();
  const jToday = jalaali.toJalaali(today);

  // Create a state for the current month and year in the Jalaali calendar
  const [currentMonth, setCurrentMonth] = useState(jToday.jm);
  const [currentYear, setCurrentYear] = useState(jToday.jy);
  const [selectedDay, setSelectedDay] = useState(jToday.jd);

  // Function to generate the days of the month
  const generateMonthDays = (year: number, month: number) => {
    const daysInMonth = jalaali.jalaaliMonthLength(year, month);
    let days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  // Get the first day of the month
  const firstDayOfTheMonth = new Date(jToday.jy, jToday.jm - 1, 1);
  const startDayOfWeek = firstDayOfTheMonth.getDay();

  // Rotate the `persianWeekDays` array according to the first day of the month
  const rotatedPersianWeekDays = persianWeekDays
    .slice(startDayOfWeek)
    .concat(persianWeekDays.slice(0, startDayOfWeek));

  // Days of the current month
  const days = generateMonthDays(currentYear, currentMonth);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg my-2">
      <div className="flex justify-between bg-red-500 text-white text-6xl">
        <button className="p-2 hover:bg-red-600">‹</button>
        <span className="p-2">{jalaaliMonths[currentMonth - 1]}</span>
        <button className="p-2 hover:bg-red-600">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 p-2">
        {/* Render the day names */}
        {rotatedPersianWeekDays.map((day, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center "
          >
            <span className="text-xl text-gray-500">{day.day}</span>
            <span className="text-xl text-gray-500">روز</span>
          </div>
        ))}
        {/* Render the days of the month */}
        {days.map((day) => {
          const isSelected = day === selectedDay;
          return (
            <div
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`border rounded text-center text-4xl  p-2 cursor-pointer ${
                isSelected ? 'bg-red-500 text-white' : 'text-gray-500'
              }`}
            >
              {toPersianDigits(day)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersianCalendar;
