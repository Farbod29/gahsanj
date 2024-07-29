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
          <div className='justify-center items-center text-center text-[32px] md:text-xl lg:text-xl text-[#ffffff] flex flex-row-reverse'>
            <div>{dates.monthName}</div>
            <div className='p-1'>{dates.day}</div>
            <br />
          </div>
        </div>
        <div className='text-center p-0 -mt-2 mb-3 rounded-xl flex justify-center items-center'>
          <div className='text-center text-[#ffffff] text-[22px] justify-center items-center p-0 xm:text-[20px] lg:text-3xl'>
            {dates.weekday}
          </div>
        </div>
      </main>
    );
  }