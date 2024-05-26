'use client';
import React, { useState, useEffect } from 'react';
import jalaali from 'jalaali-js';
import MyModal from '@/components/modal/Modal';

// Helper function to convert numbers to Persian
const toPersianDigits = (num: number) => {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num)
    .split('')
    .map((digit) => persianNumbers[+digit])
    .join('');
};

// Mapping Gregorian weekdays to Jalaali weekdays
const gregorianToJalaaliWeekDayMap: { [key: number]: number } = {
  0: 6,
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
};
function toPersianNums(numString: string) {
  const persianNums = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return numString.replace(/\d/g, (x) => persianNums[parseInt(x)]);
}

// Get the Persian name of today
const getTodayPersianName = (): string => {
  const persianWeekDays: string[] = [
    '(دوشنبه) مهروز',
    '(سه‌شنبه)  بهرامروز',
    '(چهار‌شنبه) تیرروز',
    '(پنج‌شنبه) مزدروز',
    'ناهیدروز (آدینه) ',
    '(شنبه)  کیوان',
    '(یک‌شنبه) مهر',
  ];
  const today = new Date();
  type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;
  const dayOfWeek: WeekDay = today.getDay() as WeekDay;
  return persianWeekDays[gregorianToJalaaliWeekDayMap[dayOfWeek]];
};

// Convert to the Iranian year

function convertToIraniMelli(date: Date) {
  const { jy, jm, jd } = jalaali.toJalaali(date);
  const iraniMelli = jy - 1396;
  return toPersianNums(
    `${iraniMelli}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`,
  );
}

// The main component
function PersianCalendar() {
  const persianWeekDays = [
    { day: 'مه', dayShort: 'د', HejriDay: 'دوشنبه', dayLatinShort: 'Mo' },
    { day: 'بهرام', dayShort: 'س', HejriDay: 'سه‌شنبه', dayLatinShort: 'Tu' },
    { day: 'تیر', dayShort: 'چ', HejriDay: 'چهارشنبه', dayLatinShort: 'W' },
    { day: 'مزد', dayShort: 'پ', HejriDay: 'پنج‌شنبه', dayLatinShort: 'Th' },
    { day: 'ناهید', dayShort: 'آ', HejriDay: 'آدینه', dayLatinShort: 'Fr' },
    { day: 'کیوان', dayShort: 'ش', HejriDay: 'شنبه', dayLatinShort: 'Sa' },
    { day: 'مهر', dayShort: 'ی', HejriDay: 'یکشنبه', dayLatinShort: 'Su' },
  ];

  // Current date states
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(jalaali.toJalaali(today).jm);
  const [currentYear, setCurrentYear] = useState(jalaali.toJalaali(today).jy);
  const NameOfTheDay = getTodayPersianName();
  const IraniMelli = convertToIraniMelli(today);

  // Function to generate the days of the current month
  const generateMonthDays = (year: number, month: number) => {
    const daysInMonth = jalaali.jalaaliMonthLength(year, month);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  // Days of the current month
  const days = generateMonthDays(currentYear, currentMonth);

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth === 1 ? 12 : currentMonth - 1);
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1);
    }
  };

  const goToNextMonth = () => {
    setCurrentMonth(currentMonth === 12 ? 1 : currentMonth + 1);
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1);
    }
  };

  // Convert Jalaali date to Gregorian day
  const convertToGregorianDay = (
    jalaaliYear: number,
    jalaaliMonth: number,
    jalaaliDay: number,
  ) => {
    const gregorianDate = jalaali.toGregorian(
      jalaaliYear,
      jalaaliMonth,
      jalaaliDay,
    );
    return new Date(
      gregorianDate.gy,
      gregorianDate.gm - 1,
      gregorianDate.gd,
    ).getDate();
  };

  // List of Jalaali months
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

  // Determine the first day of the month
  const firstDayOfJalaaliMonth = jalaali.toGregorian(
    currentYear,
    currentMonth,
    1,
  );
  const firstDayDate = new Date(
    firstDayOfJalaaliMonth.gy,
    firstDayOfJalaaliMonth.gm - 1,
    firstDayOfJalaaliMonth.gd,
  );
  const firstDayOfWeek = firstDayDate.getDay() - 1;

  // Calculate offset; if firstDayOfWeek is -1 (Sunday), it should be treated as 6 (the last day of the week)
  const offset = firstDayOfWeek === -1 ? 6 : firstDayOfWeek;

  // Generate empty slots for the days before the first day of the month
  const emptySlots = Array.from({ length: offset }, (_, index) => (
    <div
      key={`empty-${index}`}
      className=" rounded text-center p-3 text-gray-500 opacity-50"
    ></div>
  ));

  // Render the component
  return (
    <main className="p-4 bg-[#333863] min-h-screen ">
      <div
        dir="rtl"
        className="max-w-md mx-auto overflow-hidden bg-white my-2 text-xl sm:text-3xl w-full rounded-md"
      >
        <h3 className="text-white bg-[#333863] border-4 border-[#333863] border-t-0">
          گاهشمار جدولی
        </h3>
        <div className="flex justify-between items-center bg-[#373D70]  text-white p-3 ">
          <div className="absolute top-4"></div>
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
            <div className="flex gap-12">
              <p className="text-sm sm:text-xl pt-3">{NameOfTheDay}</p>
              <p className="text-sm sm:text-xl pt-3">{IraniMelli}</p>{' '}
              {/* This will now show the correct date */}
            </div>
          </span>
          <button onClick={goToNextMonth} className="p-2 text-4xl sm:text-8xl">
            ›
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 p-4">
          {persianWeekDays.map((day, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center px-4"
            >
              <span className="text-sm sm:text-xl text-gray-500">
                {day.day}
              </span>
              {/* <span className="text-sm sm:text-xl text-gray-500">روز</span> */}
              <span className="text-sm sm:text-xl text-gray-500">
                {day.dayShort}
              </span>
              <span className="text-xs sm:text-xl text-gray-600">
                {day.dayLatinShort}
              </span>
            </div>
          ))}
          {emptySlots}
          {days.map((day, index) => {
            const isToday =
              jalaali.toJalaali(today).jd === day &&
              currentMonth === jalaali.toJalaali(today).jm &&
              currentYear === jalaali.toJalaali(today).jy;
            const gregorianDay = convertToGregorianDay(
              currentYear,
              currentMonth,
              day,
            );
            return (
              <div
                key={index}
                className={`rounded text-center px-3 p-3 flex items-center justify-center relative ${
                  isToday
                    ? 'border-[#FD821D]  text-black font-bold border-2 p-1 rounded'
                    : 'text-gray-500'
                }`}
              >
                <span className="font-bold">{toPersianDigits(day)}</span>
                <span className="text-[12px] absolute top-0 left-0 mt-6 ml-0.5">
                  {gregorianDay}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mr-4">
          <MyModal />
        </div>
      </div>
    </main>
  );
}

export default PersianCalendar;
