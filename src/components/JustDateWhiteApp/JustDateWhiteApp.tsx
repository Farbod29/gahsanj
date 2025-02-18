'use client';
import { useEffect, useState } from 'react';
import jalaali from 'jalaali-js';

function toPersianNums(numString: string) {
  const persianNums = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return numString.replace(/\d/g, (x) => persianNums[parseInt(x)]);
}

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
type WeekdayKey =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';
const persianWeekdays: { [key in WeekdayKey]: string } = {
  Sunday: 'مهر شید (یکشنبه)',
  Monday: 'مهشید (دوشنبه)',
  Tuesday: 'بهرام شید (سه شنبه)',
  Wednesday: 'تیر شید (چهار شنبه)',
  Thursday: 'اورمزد شید (پنج شنبه)',
  Friday: 'ناهید شید (آدینه)',
  Saturday: 'کیوان شید (شنبه)',
};

export default function JustDateWhiteApp() {
  const [dates, setDates] = useState({
    day: '',
    monthName: '',
    weekday: '',
  });

  useEffect(() => {
    const today = new Date();
    const { jd, jm } = jalaali.toJalaali(today);
    const weekdayKey: WeekdayKey = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
    }) as WeekdayKey;
    const weekday = persianWeekdays[weekdayKey];
    setDates({
      day: toPersianNums(`${jd}`),
      monthName: jalaaliMonths[jm - 1],
      weekday: weekday,
    });
  }, []);

  return (
    <main className='flex w-full flex-col items-center px-2 sm:px-4 md:px-8 z-10 ml-4'>
      <div className='w-full max-w-4xl mx-auto mt-1'>
        <div className='justify-center items-center text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#ffffff] flex flex-row-reverse'>
          <div>{dates.monthName}</div>
          <div className='p-1'>{dates.day}</div>
          <br />
        </div>
      </div>
      <div className='text-center p-0 -mt-2 mb-3 rounded-xl flex flex-col justify-center items-center'>
        <div className='text-center text-[#ffffff] text-lg sm:text-xl md:text-2xl lg:text-3xl justify-center items-center p-0'>
          {dates.weekday}
        </div>
        <div
          className='text-white text-sm sm:text-base md:text-lg mt-1'
          dir='ltr'
        >
          {new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>
    </main>
  );
}
