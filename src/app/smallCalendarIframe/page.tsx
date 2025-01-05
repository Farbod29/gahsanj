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
    '      مهر (یک‌شنبه)',
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
      <div className='flex justify-end'></div>
      <div className='mt-1' dir='rtl'>
        <div className='max-w-md mx-auto overflow-hidden bg-white text-xl sm:text-3xl w-full rounded-md h-full flex flex-col border-black'>
          <div className='flex justify-between items-center bg-[#373D70] text-white p-3 '>
            <div className='absolute top-4'></div>
            <button
              onClick={handlePrevMonth}
              className='p-2 text-4xl sm:text-8xl'
            >
              ‹
            </button>
            <span className='p-3 ml-3 items-center pt-4 pb-4'>
              <p className='text-4xl sm:text-6xl pb-1 pt-2'>
                {jalaaliMonths[currentMonth - 1]}
              </p>
              <div className='flex gap-1 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl'>
                <p className='pt-1'>{NameOfTheDay}</p>
                <p className='pt-1'>{padeshahi}</p>
                <p className='pt-1'>{'پادشاهی'}</p>
              </div>
            </span>
            <button
              onClick={handleNextMonth}
              className='p-2 text-4xl sm:text-8xl'
            >
              ›
            </button>
          </div>
          <div className='grid grid-cols-7 gap-1 p-4 flex-grow overflow-y-auto'>
            {persianWeekDays.map((day, index) => (
              <div
                key={index}
                className='flex flex-col items-center justify-center px-4'
              >
                <span className='text-sm sm:text-xl text-gray-500'>
                  {day.day}
                </span>
                <span className='text-sm sm:text-xl text-gray-500'>
                  {day.dayShort}
                </span>
                <span className='text-xs sm:text-xl text-gray-600'>
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
                day
              );
              return (
                <div
                  key={index}
                  className={`border rounded text-center px-3 p-3 flex items-center justify-center relative ${
                    isToday
                      ? 'border-[#FD821D] text-black font-bold border-2 p-1 rounded'
                      : 'text-gray-500'
                  }`}
                >
                  <span className='font-bold'>{toPersianDigits(day)}</span>
                  <span className='text-[12px] absolute top-0 left-0 mt-7 ml-1'>
                    {gregorianDay}
                  </span>
                </div>
              );
            })}
          </div>
          <ModalAlert
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            <p>{modalMessage}</p>
          </ModalAlert>
          <div className='flex justify-between items-end mt-3 mr-80'>
            <div className='flex justify-between items-center mt-4'>
              {/* <button
                onClick={resetToCurrentMonth}
                className={`p-2 text-sm sm:text-xl rounded transition-colors duration-300 ${
                  currentMonth === jalaali.toJalaali(today).jm &&
                  currentYear === jalaali.toJalaali(today).jy
                    ? 'bg-[#373D70] text-white'
                    : 'bg-[#333863] text-white hover:bg-white hover:text-[#333863] active:bg-gray-700 active:text-white'
                }`}
              >
                برو به امروز
              </button> */}
            </div>
          </div>
          <div
            className='flex justify-start items-start pl-4 sm:pl-6 md:pl-8 lg:pl-10'
            dir='ltr'
          >
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
              className='ml-3 p-2 text-xs sm:text-sm rounded transition-colors duration-300 bg-[#333863] text-white hover:bg-white hover:text-[#333863] active:bg-gray-700 active:text-white'
            >
              برو به امروز
            </button>
          </div>

          <div className='mr-4 flex-none'>
            <MyModal />
          </div>
        </div>
      </div>
    </main>
  );
}

export default PersianCalendar;
