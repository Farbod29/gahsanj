'use client';
import React, { useState, useEffect } from 'react';
import jalaali from 'jalaali-js';

interface PersianCalendarProps {
  IraniMelli: string;
  NameOfTheDay: string;
}

const PersianCalendar: React.FC<PersianCalendarProps> = ({
  IraniMelli,
  NameOfTheDay,
}) => {
  const persianWeekDays = [
    { day: 'مه', dayShort: 'د', HejriDay: 'دوشنبه' },
    { day: 'بهرام', dayShort: 'س', HejriDay: 'سه شنبه' },
    { day: 'تیر', dayShort: 'چ', HejriDay: 'چهارشنبه' },
    { day: 'مزد', dayShort: 'پ', HejriDay: 'پنجشنبه' },
    { day: 'آدینه', dayShort: 'ج', HejriDay: 'جمعه' },
    { day: 'کیوان', dayShort: 'ش', HejriDay: 'شنبه' },
    { day: 'مهر', dayShort: 'ی', HejriDay: 'یکشنبه' },
  ];

  const toPersianDigits = (num: number): string => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num
      .toString()
      .split('')
      .map((digit) => persianNumbers[parseInt(digit, 10)])
      .join('');
  };

  const today = new Date();
  const jToday = jalaali.toJalaali(today);

  const [currentMonth, setCurrentMonth] = useState(jToday.jm);
  const [currentYear, setCurrentYear] = useState(jToday.jy);

  useEffect(() => {
    const yearAsNumber = Number(IraniMelli);
    if (!isNaN(yearAsNumber)) {
      setCurrentYear(yearAsNumber);
    }
  }, [IraniMelli]);

  const generateMonthDays = (year: number, month: number): number[] => {
    const daysInMonth = jalaali.jalaaliMonthLength(year, month);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const days = generateMonthDays(currentYear, currentMonth);

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

  const convertToGregorianDay = (
    jalaaliYear: number,
    jalaaliMonth: number,
    jalaaliDay: number
  ): number => {
    const gregorianDate = jalaali.toGregorian(
      jalaaliYear,
      jalaaliMonth,
      jalaaliDay
    );
    return new Date(
      gregorianDate.gy,
      gregorianDate.gm - 1,
      gregorianDate.gd
    ).getDate();
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

  const firstDayOfJalaaliMonth = jalaali.toGregorian(
    currentYear,
    currentMonth,
    1
  );
  const firstDayDate = new Date(
    firstDayOfJalaaliMonth.gy,
    firstDayOfJalaaliMonth.gm - 1,
    firstDayOfJalaaliMonth.gd
  );
  const firstDayOfWeek = firstDayDate.getDay();

  const offset = (firstDayOfWeek + 1) % 7;

  const emptySlots = Array.from({ length: offset }, (_, index) => (
    <div
      key={`empty-${index}`}
      className="border rounded text-center p-3 text-gray-500 opacity-50"
    />
  ));

  return (
    <div
      dir="rtl"
      className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg my-2 text-xl sm:text-3xl w-full"
    >
      <div className="flex justify-between items-center bg-[#1C39BB] text-white">
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
            <p className="text-sm sm:text-xl pt-3">{IraniMelli}</p>
          </div>
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
            <span className="text-sm sm:text-xl text-gray-500">
              {day.dayShort}
            </span>
          </div>
        ))}
        {emptySlots}
        {days.map((day, index) => {
          const isToday =
            jToday.jd === day &&
            jToday.jm === currentMonth &&
            jToday.jy === Number(currentYear);
          const gregorianDay = convertToGregorianDay(
            currentYear,
            currentMonth,
            day
          );

          return (
            <div
              key={index}
              className={`border rounded text-center p-3 flex items-center justify-center relative ${
                isToday
                  ? ' border-red-500 bg-[#f7f7f7] text-black font-bold border-2 p-1 rounded'
                  : 'text-gray-500 '
              }`}
            >
              <span className="font-bold">{toPersianDigits(day)}</span>
              <span className="text-xxxxs absolute top-0 left-0 mt-6 ml-0.5">
                {gregorianDay}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersianCalendar;
