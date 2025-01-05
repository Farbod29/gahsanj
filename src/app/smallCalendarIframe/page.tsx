'use client';
import React, { useState } from 'react';
import jalaali from 'jalaali-js';
import MyModal from '@/components/modalInfoCalendar/modalInfoCalendar';
import ModalAlert from '@/components/ModalAlert/ModalAlert';
import { useCalendar } from '@/contexts/CalendarContext';

// Helper function to convert numbers to Persian
const toPersianDigits = (num) => {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num)
    .split('')
    .map((digit) => persianNumbers[+digit])
    .join('');
};

// Mapping Gregorian weekdays to Jalaali weekdays
const gregorianToJalaaliWeekDayMap = {
  0: 6,
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
};

function toPersianNums(numString) {
  const persianNums = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return numString.replace(/\d/g, (x) => persianNums[parseInt(x)]);
}

// Get the Persian name of today
const getTodayPersianName = () => {
  const persianWeekDays = [
    '      مه شید (دوشنبه)',
    '      بهرامشید (سه‌شنبه)',
    '      تیرشید (چهار‌شنبه)',
    '      اورمزدشید (پنج‌شنبه)',
    '      ناهیدشید (آدینه)',
    '      کیوان (شنبه)',
    '      مهر شید    (یک‌شنبه)',
  ];
  const today = new Date();
  const dayOfWeek = today.getDay();
  return persianWeekDays[gregorianToJalaaliWeekDayMap[dayOfWeek]];
};

// Convert to the Iranian year
function convertToIraniMelli(date) {
  const { jy, jm, jd } = jalaali.toJalaali(date);
  const iraniMelli = jy - 1396;
  return toPersianNums(
    `${iraniMelli}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
  );
}

function convertToPahlavi(date) {
  const { jy, jm, jd } = jalaali.toJalaali(date);
  const pYear = jy + 1180;
  return toPersianNums(
    `${pYear}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
  );
}

// The main component
function PersianCalendar() {
  const { currentMonth, currentYear, handleMonthChange } = useCalendar();
  const persianWeekDays = [
    { day: 'مه', dayShort: 'د', HejriDay: 'دوشنبه', dayLatinShort: 'Mo' },
    { day: 'بهرام', dayShort: 'س', HejriDay: 'سه‌شنبه', dayLatinShort: 'Tu' },
    { day: 'تیر', dayShort: 'چ', HejriDay: 'چهارشنبه', dayLatinShort: 'W' },
    { day: 'اورمزد', dayShort: 'پ', HejriDay: 'پنج‌شنبه', dayLatinShort: 'Th' },
    { day: 'ناهید', dayShort: 'آ', HejriDay: 'آدینه', dayLatinShort: 'Fr' },
    { day: 'کیوان', dayShort: 'ش', HejriDay: 'شنبه', dayLatinShort: 'Sa' },
    { day: 'مهر', dayShort: 'ی', HejriDay: 'یکشنبه', dayLatinShort: 'Su' },
  ];

  // Current date states
  const today = new Date();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const NameOfTheDay = getTodayPersianName();
  const IraniMelli = convertToIraniMelli(today);
  const padeshahi = convertToPahlavi(today);

  // Function to generate the days of the current month
  const generateMonthDays = (year, month) => {
    const daysInMonth = jalaali.jalaaliMonthLength(year, month);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  // Days of the current month
  const days = generateMonthDays(currentYear, currentMonth);

  // Navigation functions
  const handleNextMonth = () => handleMonthChange(1);
  const handlePrevMonth = () => handleMonthChange(-1);

  // Reset function
  const resetToCurrentMonth = () => {
    const today = new Date();
    handleMonthChange(jalaali.toJalaali(today).jm - currentMonth);
    handleMonthChange(jalaali.toJalaali(today).jy - currentYear);
  };

  // Convert Jalaali date to Gregorian day
  const convertToGregorianDay = (jalaaliYear, jalaaliMonth, jalaaliDay) => {
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

  // List of Jalaali months
  const jalaaliMonths = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'اَمُرداد',
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
    1
  );
  const firstDayDate = new Date(
    firstDayOfJalaaliMonth.gy,
    firstDayOfJalaaliMonth.gm - 1,
    firstDayOfJalaaliMonth.gd
  );
  const firstDayOfWeek = firstDayDate.getDay() - 1;

  // Calculate offset; if firstDayOfWeek is -1 (Sunday), it should be treated as 6 (the last day of the week)
  const offset = firstDayOfWeek === -1 ? 6 : firstDayOfWeek;

  // Generate empty slots for the days before the first day of the month
  const emptySlots = Array.from({ length: offset }, (_, index) => (
    <div
      key={`empty-${index}`}
      className=' rounded text-center p-3 text-gray-500 opacity-50'
    ></div>
  ));

  // Render the component
  // Render the component
  return (
    <main className='p-2 bg-transparent min-h-screen overflow-hidden flex flex-col justify-start'>
      <div className='mt-1' dir='rtl'>
        <div className='max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-lg border border-gray-200'>
          {/* Header Section */}
          <div className='flex justify-between items-center bg-[#373D70] text-white p-4'>
            <button
              onClick={handlePrevMonth}
              className='hover:bg-[#4c5494] p-2 rounded-full transition-colors'
            >
              ‹
            </button>
            <div className='text-center'>
              <p className='text-3xl sm:text-4xl font-bold mb-2'>
                {jalaaliMonths[currentMonth - 1]}
              </p>
              <div className='flex gap-2 text-sm sm:text-base justify-center items-center'>
                <p>&nbsp;&nbsp;{NameOfTheDay}&nbsp;&nbsp;</p>
                <span>|</span>
                <p>{padeshahi}</p>
                <p>{'پادشاهی'}</p>
              </div>
            </div>
            <button
              onClick={handleNextMonth}
              className='hover:bg-[#4c5494] p-2 rounded-full transition-colors'
            >
              ›
            </button>
          </div>

          {/* Calendar Grid */}
          <div className='p-4'>
            {/* Weekday Headers */}
            <div className='grid grid-cols-7 gap-1 mb-4'>
              {persianWeekDays.map((day, index) => (
                <div
                  key={index}
                  className='flex flex-col items-center justify-center'
                >
                  <span className='text-sm sm:text-base font-medium text-gray-600'>
                    {day.day}
                  </span>
                  <span className='text-xs sm:text-sm text-gray-500'>
                    {day.dayShort}
                  </span>
                  <span className='text-xs text-gray-400'>
                    {day.dayLatinShort}
                  </span>
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className='grid grid-cols-7 gap-2'>
              {emptySlots}
              {days.map((day, index) => {
                const isToday =
                  jalaali.toJalaali(today).jd === day &&
                  currentMonth === jalaali.toJalaali(today).jm &&
                  currentYear === jalaali.toJalaali(today).jy;
                const gregorianDay = convertToGregorianDay(
                  currentYear,
                  currentMonth,
                  day
                );
                return (
                  <div
                    key={index}
                    className={`relative h-12 flex items-center justify-center rounded-lg transition-colors
                      ${isToday ? 'bg-[#4c5494] text-white font-bold' : 'hover:bg-gray-50'}`}
                  >
                    <span className='text-lg'>{toPersianDigits(day)}</span>
                    <span
                      className={`absolute bottom-1 right-1 text-[10px] ${isToday ? 'text-white' : 'text-gray-500'}`}
                    >
                      {gregorianDay}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className='p-4 border-t border-gray-200'>
            <button
              onClick={() => {
                if (
                  currentMonth === jalaali.toJalaali(today).jm &&
                  currentYear === jalaali.toJalaali(today).jy
                ) {
                  setModalMessage(
                    `شما همینک نیز در ماه ${jalaaliMonths[currentMonth - 1]} ${jalaali.toJalaali(today).jy} هستید.`
                  );
                  setIsModalOpen(true);
                } else {
                  resetToCurrentMonth();
                }
              }}
              className='w-full py-2 px-4 bg-[#373D70] text-white rounded-lg hover:bg-[#4c5494] transition-colors'
            >
              برو به امروز
            </button>
          </div>
        </div>
      </div>

      <ModalAlert isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <p>{modalMessage}</p>
      </ModalAlert>

      <div className='mr-4 mt-4'>
        <MyModal />
      </div>
    </main>
  );
}

export default PersianCalendar;
