'use client';
import { useEffect, useState } from 'react';
import jalaali from 'jalaali-js';
//import logo from 'Users/farbodaprin/Desktop/iranian-gah-shomar2/public/assets/logo-gahshomar-yellow.png';
import Image from 'next/image';

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

const persianWeekdays = [
  'مهر شید  / یکشنبه',
  'مه شید / دوشنبه',
  'بهرام شید / سه‌شنبه',
  'تیر شید / چهارشنبه',
  'اورمزد شید / پنج‌شنبه',
  'ناهید شید / جمعه',
  'کیوان شید / شنبه',
];

function determineClockSize(): number {
  const screenWidth = window.innerWidth;

  if (screenWidth <= 480) {
    // Phone size
    return 80;
  } else if (screenWidth <= 768) {
    // iPad size
    return 90;
  } else {
    // Larger screens
    return 120;
  }
}

export default function Home() {
  // Helper component for rendering tabs

  const Tab = ({ name }: { name: string }) => (
    <button
      className={`p-3 rounded-lg  hover:bg-[#32127A] ${
        activeTab === name ? 'bg-[#1C39BB] text-white' : 'bg-gray-200'
      }`}
      onClick={() => setActiveTab(name)}
    >
      {name}
    </button>
  );

  const [showClocks, setShowClocks] = useState(false);

  const today = new Date();
  const jToday = jalaali.toJalaali(today);
  const [currentMonth, setCurrentMonth] = useState(jToday.jm);
  const [activeTab, setActiveTab] = useState('گاه سنج'); // State to track active tab
  const [dates, setDates] = useState({
    europeanDate: '',
    jalaliDate: '',
    pahlaviYear: '',
    IranianDiako: '',
    IraniMithra: '',
    IraniMelli: '',
    ilami: '',
    zoroastrianYear: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowClocks(true);
    }, 1000); // Set the delay here

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const today = new Date();
    setDates({
      europeanDate: today.toLocaleDateString('en-GB'),
      jalaliDate: convertToJalali(today),
      pahlaviYear: convertToPahlavi(today),
      IranianDiako: convertToIranianDiako(today),
      IraniMithra: convertToIraniMithra(today),
      IraniMelli: convertToIraniMelli(today),
      ilami: convertToIlami(today),
      zoroastrianYear: convertToZoroastrian(today),
    });
  }, []);

  function convertToJalali(date: Date) {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    return toPersianNums(
      `${jy}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
    );
  }

  function convertToPahlavi(date: Date) {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    const pYear = jy + 1180;
    return toPersianNums(
      `${pYear}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
    );
  }

  function convertToIranianDiako(date: Date) {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    const IranianDiako = jy + 1321;
    return toPersianNums(
      `${IranianDiako}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
    );
  }

  function convertToIlami(date: Date) {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    const IranianDiako = jy + 3821;
    return toPersianNums(
      `${IranianDiako}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
    );
  }

  function convertToIraniMithra(date: Date) {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    const IraniMithraYear = jy + 6359;
    return toPersianNums(
      `${IraniMithraYear}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
    );
  }

  function convertToIraniMelli(date: Date) {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    const IraniMelli = jy - 1396;
    return toPersianNums(
      `${IraniMelli}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
    );
  }

  function convertToZoroastrian(date: Date) {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    const zoroastrianYear = jy + 2359;
    return toPersianNums(
      `${zoroastrianYear}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
    );
  }

  function getTodayPersianName(): string {
    const today = new Date();
    return persianWeekdays[today.getDay()];
  }

  return (
    <main className='flex min-h-screen w-full flex-col items-center px-2 sm:px-4 md:px-8 mt-4'>
      <div className='w-full max-w-4xl mx-auto mt-19 '>
        <div className='bg-[#ffffff] p-3 rounded-2xl w-full flex md:flex-1 md:ml-2 mt-4 md:mt-0 items-center justify-center'>
          <p className='text sm:text-xl lg:text-2xl text-[#000000] text-center'>
            {dates.IraniMelli}
          </p>
          {/* <h3 className='text-lg sm:text-2xl lg:text-4xl text-[#000000] text-center mr-2 ml-2'>
            ایران نو
          </h3> */}
        </div>
        <div className='bg-[#ffffff] p-4 rounded-2xl w-full flex md:flex-1 md:ml-2 mt-4 md:mt-0 items-center justify-center'>
          <p className='text sm:text-xl lg:text-2xl text-[#000000] text-center'>
            {dates.ilami}
          </p>
          <h3 className='text-lg sm:text-2xl lg:text-4xl text-[#000000] text-center mr-2 ml-2'>
            ایلامی
          </h3>
        </div>

        <div className='bg-[#ffffff] p-3 rounded-2xl w-full flex md:flex-1 md:ml-2 mt-4 md:mt-0 items-center justify-center'>
          <p className='text sm:text-xl lg:text-2xl text-[#000000] text-center'>
            {dates.zoroastrianYear}
          </p>
          <h3 className='text-lg sm:text-2xl lg:text-4xl text-[#000000] text-center mr-2 ml-2'>
            زرتشتی
          </h3>
        </div>
        <div className='bg-[#ffffff] p-3 rounded-2xl w-full flex md:flex-1 md:ml-2 mt-4 md:mt-0 items-center justify-center'>
          <p className='text sm:text-xl lg:text-2xl text-[#000000] text-center'>
            {dates.pahlaviYear}
          </p>
          <h3 className='text-lg sm:text-2xl lg:text-4xl text-[#000000] text-center mr-2 ml-2'>
            شاهنشاهی
          </h3>
        </div>
        <div className='flex flex-col md:flex-row justify-between items-center md:space-x-4 w-full  md:mt-8'>
          <div className='bg-[#ffffff] p-3 rounded-2xl w-full flex md:flex-1 md:ml-2 mt-4 md:mt-0 items-center justify-center'>
            <p className='text sm:text-xl lg:text-2xl text-[#000000] text-center'>
              {dates.IranianDiako}
            </p>
            <h3 className='text-lg sm:text-2xl lg:text-4xl text-[#000000] text-center mr-2 ml-2'>
              مادی / کردی
            </h3>
          </div>
        </div>
        <div className='flex flex-col md:flex-row justify-between items-center md:space-x-4 w-full '>
          <div className='bg-[#ffffff] p-3 rounded-2xl w-full flex md:flex-1 md:ml-2 mt-4 md:mt-0 items-center justify-center'>
            <p className='text sm:text-xl lg:text-2xl text-[#000000] text-center'>
              {dates.jalaliDate}
            </p>
            <h3 className='text-lg sm:text-2xl lg:text-4xl text-[#000000] text-center mr-2 ml-2'>
              هجری خورشیدی
            </h3>
          </div>
          <div className='bg-[#ffffff] p-3 rounded-2xl w-full flex md:flex-1 md:ml-2 mt-4 md:mt-0 items-center justify-center'>
            <p className='text sm:text-xl lg:text-2xl text-[#000000] text-center'>
              {dates.europeanDate}
            </p>
            <h3 className='text-lg sm:text-2xl lg:text-4xl text-[#000000] text-center mr-2 ml-2'>
              میلادی
            </h3>
          </div>
        </div>
      </div>
    </main>
  );
}
