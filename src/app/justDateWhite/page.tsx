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
  Sunday: 'یکشنبه (مهر شید)',
  Monday: 'دوشنبه (مهشید)',
  Tuesday: 'سه شنبه (بهرام شید)',
  Wednesday: 'چهار شنبه (تیر شید)',
  Thursday: 'پنج شنبه (اورمزد شید)',
  Friday: '(آدینه) ناهید شید', // or just 'آدینه' depending on your preference
  Saturday: 'شنبه (کیوان شید)',
};

export default function Home() {
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
    <main className="flex min-h-screen w-full flex-col items-center px-2 sm:px-4 md:px-8">
      <div className="w-full max-w-4xl mx-auto mt-2">
        <div className="text-center p-4 rounded-xl flex justify-center items-center">
          <div className="text-center text-[#ffffff] text-xl justify-center items-center p-0">
            {dates.weekday}
          </div>
        </div>
        <div className="justify-center items-center text-center text-3xl md:text-2xl lg:text-2xl text-[#ffffff] flex flex-row-reverse -mt-4">
          <div className="p-1">{dates.day}</div>
          <div>{dates.monthName}</div>
          <br />
        </div>
      </div>
    </main>
  );
}
