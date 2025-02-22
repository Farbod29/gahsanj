'use client';

import React, { useState, useEffect } from 'react';
import { toJalaali, toGregorian, isLeapJalaaliYear } from 'jalaali-js';

const persianMonths = {
  1: 'فروردین',
  2: 'اردیبهشت',
  3: 'خرداد',
  4: 'تیر',
  5: 'مرداد',
  6: 'شهریور',
  7: 'مهر',
  8: 'آبان',
  9: 'آذر',
  10: 'دی',
  11: 'بهمن',
  12: 'اسفند',
};

const persianMonthNameToNumber = {
  فروردین: 1,
  اردیبهشت: 2,
  خرداد: 3,
  تیر: 4,
  مرداد: 5,
  شهریور: 6,
  مهر: 7,
  آبان: 8,
  آذر: 9,
  دی: 10,
  بهمن: 11,
  اسفند: 12,
};

// Helper to convert English digits to Persian digits
const toPersianNum = (num) => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num
    .toString()
    .split('')
    .map((d) => (isNaN(parseInt(d)) ? d : persianDigits[parseInt(d)]))
    .join('');
};

const DateConverter = () => {
  // true: Gregorian → Persian; false: Persian → Gregorian
  const [isGregorianToPersian, setIsGregorianToPersian] = useState(true);
  const [inputDate, setInputDate] = useState('');
  const [convertedDate, setConvertedDate] = useState('');
  // This will hold the Persian year from conversion (either from toJalaali or parsed from input)
  const [persianYear, setPersianYear] = useState<number | null>(null);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // Set default input for Gregorian dates
  useEffect(() => {
    if (isGregorianToPersian) {
      const today = new Date();
      const formatted = today.toISOString().split('T')[0]; // YYYY-MM-DD
      setInputDate(formatted);
    } else {
      setInputDate('');
    }
    setConvertedDate('');
    setPersianYear(null);
  }, [isGregorianToPersian]);

  const convertDate = () => {
    if (isGregorianToPersian) {
      // Convert Gregorian to Persian
      const date = new Date(inputDate);
      if (isNaN(date.getTime())) {
        setConvertedDate('تاریخ نامعتبر');
        return;
      }
      const { jy, jm, jd } = toJalaali(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      );
      setConvertedDate(`${jd} ${persianMonths[jm]} ${jy}`);
      setPersianYear(jy);
    } else {
      // Convert Persian to Gregorian
      const parts = inputDate.trim().split(' ');
      if (parts.length !== 3) {
        setConvertedDate('فرمت تاریخ نادرست است');
        return;
      }
      const [dayStr, monthName, yearStr] = parts;
      const day = parseInt(dayStr, 10);
      let year = parseInt(yearStr, 10);
      const monthNumber = persianMonthNameToNumber[monthName];

      if (!monthNumber || isNaN(day) || isNaN(year) || day <= 0 || day > 31) {
        setConvertedDate('فرمت تاریخ یا نام ماه اشتباه است');
        return;
      }

      try {
        if (year < 0) {
          year = 1403 + Math.abs(year);
        }

        const { gy, gm, gd } = toGregorian(year, monthNumber, day);

        // فقط برای سال‌های قبل از میلاد واقعی
        if (gy <= 0) {
          setConvertedDate(`${gd}/${gm}/${Math.abs(gy)} قبل از میلاد`);
        } else {
          setConvertedDate(`${gd}/${gm}/${gy}`);
        }

        setPersianYear(year);
      } catch (error) {
        setConvertedDate('تاریخ نامعتبر است');
        return;
      }
    }
  };

  // Compute alternative calendar years based on the converted Persian year.
  const alternativeCalendars =
    persianYear !== null
      ? {
          // 'ایران نو': persianYear - 1396,
          هجرت: persianYear,
          شاهنشاهی: persianYear + 1180,
          ایلامی: persianYear + 3821,
          'مادی/کردی': persianYear + 1321,
          زرتشتی: persianYear + 2359,
        }
      : null;

  const handlePersianDateInput = (e) => {
    const value = e.target.value;
    setInputDate(value);
  };

  const handleYearInput = (e) => {
    const value = e.target.value;
    setYear(value);
    if (value.length === 4) {
      document.getElementById('month-input')?.focus();
    }
  };

  const handleMonthInput = (e) => {
    const value = e.target.value;
    // فقط اجازه ورود اعداد 1 تا 12
    if (value === '' || /^\d*$/.test(value)) {
      const numValue = parseInt(value);
      if (
        value === '' ||
        (numValue >= 0 && numValue <= 12 && value.length <= 2)
      ) {
        setMonth(value);
        // سوئیچ به فیلد روز اگر عدد 2 رقمی یا بزرگتر از 1 وارد شده
        if (value.length === 2 || (value.length === 1 && numValue > 1)) {
          document.getElementById('day-input')?.focus();
        }
      }
    }
  };

  const handleDayInput = (e) => {
    const value = e.target.value;
    // فقط اجازه ورود اعداد 1 تا 31
    if (value === '' || /^\d*$/.test(value)) {
      const numValue = parseInt(value);
      if (
        value === '' ||
        (numValue >= 0 && numValue <= 31 && value.length <= 2)
      ) {
        setDay(value);
      }
    }
  };

  return (
    <div className='min-h-screen bg-purple-50 flex items-center justify-center p-4'>
      <div className='bg-white shadow-lg rounded-lg p-6 max-w-lg w-full'>
        <h1 className='text-2xl font-bold text-center text-purple-700 mb-4'>
          تبدیل تاریخ
        </h1>

        <div className='flex items-center justify-center mb-4'>
          <span
            className={`mx-2 ${isGregorianToPersian ? 'text-purple-700 font-semibold' : 'text-gray-500'}`}
          >
            میلادی به خورشیدی
          </span>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type='checkbox'
              className='sr-only peer'
              checked={!isGregorianToPersian}
              onChange={() => setIsGregorianToPersian((prev) => !prev)}
            />
            <div className="w-11 h-6 bg-purple-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer dark:bg-gray-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
          <span
            className={`mx-2 ${!isGregorianToPersian ? 'text-purple-700 font-semibold' : 'text-gray-500'}`}
          >
            خورشیدی به میلادی
          </span>
        </div>

        <div className='mb-4'>
          <label className='block text-gray-700 mb-1'>
            {isGregorianToPersian
              ? 'تاریخ میلادی'
              : 'تاریخ خورشیدی (مثال: 29 تیر 1168)'}
          </label>
          {isGregorianToPersian ? (
            <div className='flex gap-2 rtl'>
              <input
                id='year-input'
                type='text'
                inputMode='numeric'
                value={year}
                onChange={handleYearInput}
                placeholder='سال'
                className='w-24 border border-gray-300 rounded p-2 text-center'
                maxLength={4}
              />
              <span className='text-white'>/</span>
              <input
                id='month-input'
                type='text'
                value={month}
                onChange={handleMonthInput}
                placeholder='ماه'
                className='w-20 border border-gray-300 rounded p-2 text-center'
                maxLength={2}
              />
              <span className='text-white'>/</span>
              <input
                id='day-input'
                type='text'
                value={day}
                onChange={handleDayInput}
                placeholder='روز'
                className='w-20 border border-gray-300 rounded p-2 text-center'
                maxLength={2}
              />
            </div>
          ) : (
            <input
              type='text'
              dir='rtl'
              placeholder='مثال: 29 تیر 1168'
              value={inputDate}
              onChange={handlePersianDateInput}
              className='w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500'
            />
          )}
        </div>

        <button
          onClick={convertDate}
          className='w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition-colors'
        >
          تبدیل تاریخ
        </button>

        {convertedDate && (
          <div className='mt-4 p-2 bg-purple-100 text-purple-700 rounded text-center'>
            <p>
              تاریخ تبدیل شده:{' '}
              <span className='font-semibold'>{convertedDate}</span>
            </p>
            {persianYear !== null && (
              <p className='mt-2 text-sm text-green-700'>
                {isLeapJalaaliYear(persianYear) ? 'این سال کبیسه است' : ''}
              </p>
            )}
          </div>
        )}

        {alternativeCalendars && (
          <div className='mt-6'>
            <h2 className='text-center text-purple-700 font-semibold mb-2'>
              سال‌های تقویمی جایگزین
            </h2>
            <div className='grid grid-cols-3 gap-4 text-sm'>
              <div className='flex flex-col space-y-2'>
                <div className='flex items-center justify-between'>
                  {/* <span className='text-gray-600'>ایران نو:</span> */}
                  <span className='text-purple-800 font-medium'>
                    {/* {toPersianNum(alternativeCalendars['ایران نو'])} */}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>هجرت:</span>
                  <span className='text-purple-800 font-medium'>
                    {toPersianNum(alternativeCalendars['هجرت'])}
                  </span>
                </div>
              </div>
              <div className='flex flex-col space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>شاهنشاهی:</span>
                  <span className='text-purple-800 font-medium'>
                    {toPersianNum(alternativeCalendars['شاهنشاهی'])}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>ایلامی:</span>
                  <span className='text-purple-800 font-medium'>
                    {toPersianNum(alternativeCalendars['ایلامی'])}
                  </span>
                </div>
              </div>
              <div className='flex flex-col space-y-2'>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>مادی/کردی:</span>
                  <span className='text-purple-800 font-medium'>
                    {toPersianNum(alternativeCalendars['مادی/کردی'])}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-600'>زرتشتی:</span>
                  <span className='text-purple-800 font-medium'>
                    {toPersianNum(alternativeCalendars['زرتشتی'])}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateConverter;
