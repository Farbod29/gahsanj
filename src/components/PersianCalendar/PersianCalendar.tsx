import React, { useState, useEffect } from 'react';
import jalaali from 'jalaali-js';

interface PersianCalendarProps {
  IraniMelli: string;
  NameOfTheDay: string; // Define the type of NameOfTheDay here
}
const PersianCalendar: React.FC<PersianCalendarProps> = ({
  IraniMelli,
  NameOfTheDay,
}) => {
  const persianWeekDays = [
    { day: 'مهر', dayShort: 'ی' },
    { day: 'ماه', dayShort: 'د' },
    { day: 'بهرام', dayShort: 'س' },
    { day: 'تیر', dayShort: 'چ' },
    { day: 'اورمزد', dayShort: 'پ' },
    { day: 'آدینه', dayShort: 'ج' },
    { day: 'کیوان', dayShort: 'ش' },
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

  const [currentMonth, setCurrentMonth] = useState(jToday.jm);
  const [currentYear, setCurrentYear] = useState(jToday.jy);

  useEffect(() => {
    // Convert IraniMelli to a number before setting it to currentYear
    const yearAsNumber = Number(IraniMelli);
    if (!isNaN(yearAsNumber)) {
      setCurrentYear(yearAsNumber);
    }
  }, [IraniMelli]);

  // Function to generate the days of the month
  const generateMonthDays = (year: number, month: number): number[] => {
    const daysInMonth = jalaali.jalaaliMonthLength(year, month);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const days = generateMonthDays(currentYear, currentMonth);

  // Navigate to the previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth === 1 ? 12 : currentMonth - 1);
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
    }
  };

  // Navigate to the next month
  const goToNextMonth = () => {
    setCurrentMonth(currentMonth === 12 ? 1 : currentMonth + 1);
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
    }
  };

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

  return (
    <div
      dir="rtl"
      className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg my-2 text-xl sm:text-3xl w-full"
    >
      <div className="flex justify-between items-center bg-red-500 text-white">
        <button
          onClick={goToPreviousMonth}
          className="p-2 text-4xl sm:text-8xl"
        >
          ‹
        </button>
        <span className="p-3 ml-3 items-center pt-4 pb-4">
          <p className="text-4xl sm:text-6xl pb-1 pt-2">
            {jalaaliMonths[currentMonth - 1]}
          </p>
          <p className="text-sm sm:text-xl pt-3">
            {IraniMelli} {NameOfTheDay}
          </p>
        </span>
        <button onClick={goToNextMonth} className="p-2 text-4xl sm:text-8xl">
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 p-2">
        {persianWeekDays.map((day, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center"
          >
            <span className="text-sm sm:text-xl text-gray-500">{day.day}</span>
            <span className="text-sm sm:text-xl text-gray-500">روز</span>
          </div>
        ))}
        {days.map((day) => {
          // Parse the currentYear as Number to ensure type consistency in comparison
          const isToday =
            jToday.jd === day &&
            jToday.jm === currentMonth &&
            jToday.jy === Number(currentYear); // Make sure currentYear is a number

          return (
            <div
              key={day}
              className={`border rounded text-center p-2 ${
                isToday ? 'bg-red-500 text-white' : 'text-gray-500'
              } 
                        text-xs sm:text-sm md:text-4xl`} // Starts with 'text-xs' for smallest screens, 'sm:text-sm' for small screens, and 'md:text-4xl' for medium screens and up.
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
