'use client';

import React, { useState, useEffect } from 'react';
import jalaali from 'jalaali-js';

interface Occasion {
  [key: string]: string;
}

interface Occasions {
  [key: string]: Occasion;
}

// Your occasions JSON data
const occasionsData: Occasions = {
  فروردین: {
    '۱': 'فروردین جشن نوروز/جشن سال نو',
    '۲': 'عیدنوروز',
    '۳': 'عیدنوروز',
    '۴': 'عیدنوروز',
    '۶': 'روز امید، روز شادباش نویسی',
    '۸': 'روز جهانی تئاتر [ 27 March ]',
    '۱۰': 'جشن آبانگاه',
    '۱۳': 'جشن سیزده به در',
    '۱۷': 'سروش روز،جشن سروشگان',
    '۱۹': 'روز جهانی بهداشت [ 7 April ]',
    '۲۳': 'روز دندانپزشک',
    '۲۵': 'روز بزرگداشت عطار نیشابوری',
    '۳۰': 'روز علوم آزمایشگاهی، زاد روز حکیم سید اسماعیل جرجانی',
  },
  اردیبهشت: {
    '۱': 'روز بزرگداشت سعدی',
    '۳': 'جشن گیاه آوری؛ روز زمین [ 22 April ]',
    '۸': 'روز جهانی طراحی و گرافیک [ 27 April ]',
    '۹': 'روز ملی روانشناس و مشاور',
    '۱۰': 'جشن چهلم نوروز؛ روز ملی خلیج فارس',
    '۱۲': 'روز معلم',
    '۱۵': 'جشن میانه بهار/جشن بهاربد؛ روز شیراز',
    '۱۶': 'روز جهانی ماما [ 5 May ]',
    '۱۹': 'روز جهانی صلیب سرخ و هلال احمر [ 8 May ]',
    '۲۲': 'زادروز مریم میرزاخانی ریاضیدان ایرانی، روز جهانی زن در ریاضیات',
    '۲۵': 'روز بزرگداشت فردوسی',
    '۲۷': 'روز ارتباطات و روابط عمومی',
    '۲۸': 'روز بزرگداشت حکیم عمر خیام',
    '۲۹': 'روز جهانی موزه و میراث فرهنگی [ 18 May ]',
  },
  خرداد: {},
  تیر: {},
  مرداد: {},
  شهریور: {},
  مهر: {},
  آبان: {},
  آذر: {},
  دی: {},
  بهمن: {},
  اسفند: {},
};

const Occasions: React.FC = () => {
  const [currentMonthEvents, setCurrentMonthEvents] = useState<Occasion>({});
  const [currentMonthName, setCurrentMonthName] = useState<string>('');
  const monthNames = [
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

  useEffect(() => {
    const today = new Date();
    const jToday = jalaali.toJalaali(today);
    updateMonth(jToday.jm - 1);
  }, []);

  const updateMonth = (monthIndex: number) => {
    const newName = monthNames[monthIndex];
    setCurrentMonthEvents(occasionsData[newName]);
    setCurrentMonthName(newName);
  };

  const handleNextMonth = () => {
    const currentMonthIndex = monthNames.indexOf(currentMonthName);
    const nextMonthIndex = (currentMonthIndex + 1) % monthNames.length;
    updateMonth(nextMonthIndex);
  };

  const handlePreviousMonth = () => {
    const currentMonthIndex = monthNames.indexOf(currentMonthName);
    const previousMonthIndex =
      (currentMonthIndex - 1 + monthNames.length) % monthNames.length;
    updateMonth(previousMonthIndex);
  };

  return (
    <div className="bg-[#1cd2d5] flex flex-col">
      <div className="bg-[#FF7F50] shadow rounded-lg p-12 w-full text-center text-2xl text-bold text-white fixed mr-8 flex justify-between items-center">
        <button onClick={handlePreviousMonth}>&lt;</button>
        <h1>{`فراخورهای ماه ${currentMonthName}`}</h1>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="flex flex-col items-center mt-36">
        {Object.entries(currentMonthEvents).map(([day, event]) => (
          <div
            key={day}
            className="bg-white shadow rounded-lg p-4 mb-4 w-full md:w-1/2 text-right"
          >
            <div className="text-gray-700">
              <div className="font-semibold">{day}</div>
              <div>{event}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Occasions;
