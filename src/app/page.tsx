'use client';
import { useEffect, useState } from 'react';
import jalaali from 'jalaali-js';
import ReactClock from '../components/react-clock/ReactClock';
import PersianCalendar from '../components/PersianCalendar/PersianCalendar';
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
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
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
  const [activeTab, setActiveTab] = useState('گاهشمار'); // State to track active tab
  const [dates, setDates] = useState({
    europeanDate: '',
    jalaliDate: '',
    pahlaviYear: '',
    IranianDiako: '',
    IraniMithra: '',
    IraniMelli: '',
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
  const persianWeekdays: { [key: string]: string } = {
    Sunday: '   مهر روز  / یکشنبه',
    Monday: '  ماه روز /دوشنبه',
    Tuesday: '   بهرام روز / سه شنبه ',
    Wednesday: ' چهار شنبه  تیر روز ',
    Thursday: ' پنج شنبه اورمزد روز',
    Friday: 'جمعه آدینه', // or 'ناهید روز' depending on your preference
    Saturday: 'شنبه  کیوان روز',
  };

  function getTodayPersianName(): string {
    const today = new Date();
    const gregorianWeekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const todayName = gregorianWeekdays[today.getDay()];
    return persianWeekdays[todayName]; // Now TypeScript knows that todayName is a valid key for persianWeekdays
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center  bg-[#1CD2D5] px-2 sm:px-4 md:px-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center bg-[#FFFFFF] p-4 rounded-2xl">
          <h2 className="text-2xl md:text-5xl lg:text-6xl text-[#32127A] md:pb-8">
            ایران نو
          </h2>
          <p className="text-md md:text-4xl lg:text-5xl text-[#1C39BB] pb-1 md:pb-3">
            {dates.IraniMelli}
          </p>
          <p className="text-md md:text-4xl lg:text-5xl text-[#1C39BB]">
            {getTodayPersianName()}
          </p>
        </div>
        <div className="bg-[#FFFFFF] p-4 rounded-2xl w-full md:flex-1 md:ml-2 mt-4 md:mt-0">
          <h3 className="text-lg sm:text-2xl lg:text-4xl text-[#32127A] text-center">
            هخامنشی
          </h3>
          <p className="text-sm sm:text-xl lg:text-3xl text-[#1C39BB] text-center">
            {dates.pahlaviYear}
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center md:space-x-4 w-full mt-4 md:mt-8">
          <div className="bg-[#FFFFFF] p-4 rounded-2xl w-full md:flex-1 md:mr-2">
            <h3 className="text-lg sm:text-2xl lg:text-4xl text-[#32127A] text-center">
              مادی
            </h3>
            <p className="text-sm sm:text-xl lg:text-3xl text-[#1C39BB] text-center">
              {dates.IranianDiako}
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center md:space-x-4 w-full mt-4">
          <div className="bg-[#FFFFFF] p-4 rounded-2xl w-full md:flex-1 md:mr-2">
            <h3 className="text-lg sm:text-2xl lg:text-4xl text-[#32127A] text-center">
              هجری
            </h3>
            <p className="text-sm sm:text-xl lg:text-3xl text-[#1C39BB] text-center">
              {dates.jalaliDate}
            </p>
          </div>
          <div className="bg-[#FFFFFF] p-4 rounded-2xl w-full md:flex-1 md:ml-2 mt-4 md:mt-0">
            <h3 className="text-lg sm:text-2xl lg:text-4xl text-[#32127A] text-center">
              میلادی
            </h3>
            <p className="text-sm sm:text-xl lg:text-3xl text-[#1C39BB] text-center">
              {dates.europeanDate}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
