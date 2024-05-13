'use client';
import { useEffect, useState } from 'react';
import jalaali from 'jalaali-js';
import Link from 'next/link';

//import logo from 'Users/farbodaprin/Desktop/iranian-gah-shomar2/public/assets/logo-gahshomar-yellow.png';
import Image from 'next/image';

function toPersianNums(numString: string) {
  const persianNums = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return numString.replace(/\d/g, (x) => persianNums[parseInt(x)]);
}

const handleBoxClick = (year: string, weekday: string) => {
  // Handle the click event here
  // You can perform any action you want, such as opening a modal or navigating to a different page
  // For now, let's log the clicked year and weekday
  console.log('Clicked Year:', year);
  console.log('Clicked Weekday:', weekday);
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
  const [PersianWeekday, setPersianWeekday] = useState('');
  const [hejriweekday, setHejriWeekday] = useState('');
  const [Georgianweekday, setGeorgianWeekday] = useState('');

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
    ilami: '',
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
  const persianWeekdays: { [key: string]: string } = {
    Sunday: '   مهر شید  / یکشنبه',
    Monday: '  مهشید /دوشنبه',
    Tuesday: '   بهرام شید / سه شنبه ',
    Wednesday: ' چهار شنبه  تیر شید ',
    Thursday: ' پنج شنبه اورمزد شید',
    Friday: ' (ناهید شید (آدینه', // or 'ناهید شید' depending on your preference
    Saturday: 'شنبه  کیوان شید',
  };

  const persianHejriDays: { [key: string]: string } = {
    Sunday: 'یکشنبه',
    Monday: 'دوشنبه',
    Tuesday: 'سه شنبه ',
    Wednesday: 'چهار شنبه',
    Thursday: 'پنج شنبه  ',
    Friday: 'آدینه', // or 'ناهید شید' depending on your preference
    Saturday: 'شنبه',
  };

  const handleBoxClick = (year: string, weekday: string) => {
    // Handle the click event here
    // You can perform any action you want, such as opening a modal or navigating to a different page
    // For now, let's log the clicked year and weekday
    console.log('Clicked Year:', year);
    console.log('Clicked Weekday:', weekday);
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

  function getTodayHejriName(): string {
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
    return persianHejriDays[todayName]; // Now TypeScript knows that todayName is a valid key for persianWeekdays
  }

  function getTodayGeorgianName(): string {
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
    return todayName; // Now TypeScript knows that todayName is a valid key for persianWeekdays
  }
  useEffect(() => {
    const setVariables = () => {
      setPersianWeekday(getTodayPersianName());
      setGeorgianWeekday(getTodayGeorgianName());
      setHejriWeekday(getTodayHejriName());
    };
    setVariables();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-[#1cd2d5] px-2 sm:px-4 md:px-8">
      <div className="w-full max-w-4xl mx-auto p-3 pb-2">
        <h1 className="text-center m-2 text-4xl text-white p-2 pb-2">
          تولید فرتور با گاهشماری انتخابی شما
        </h1>

        <Link
          href={{
            pathname: '/DownloadImage',
            query: {
              paramDates: dates.IraniMelli,
              paramName: 'ایران نو',
              PersianWeekday: PersianWeekday,
            },
          }}
        >
          <div className=" bg-[#FFFFFF] p-4 rounded-xl cursor: pointer hover:bg-[#dce4ff]">
            <p className="text-sm md:text-lg lg:text-2xl text-[#1C39BB] text-center">
              {dates.IraniMelli}
            </p>
            <p className="text-lg md:text-xl lg:text-4xl text-[#32127A] text-center mt-2">
              ایران نو
            </p>
            <p className="text-md md:text-4xl lg:text-5xl text-[#1C39BB]">
              {getTodayPersianName()}
            </p>
          </div>
        </Link>
        <div className="w-full flex flex-col md:flex-row mt-2 md:mt-8 space-y-3 md:space-y-0 md:space-x-4">
          <div
            className="bg-[#FFFFFF] p-4 rounded-xl flex-1"
            onClick={() => handleBoxClick(dates.ilami, getTodayPersianName())}
          >
            <p className="text-sm md:text-lg lg:text-2xl text-[#1C39BB] text-center">
              {dates.ilami}
            </p>
            <p className="text-lg md:text-xl lg:text-4xl text-[#32127A] text-center mt-2">
              عیلامی
            </p>
            <p className="text-md md:text-4xl lg:text-5xl text-[#1C39BB]">
              {getTodayPersianName()}
            </p>
          </div>
          <div className="bg-[#FFFFFF] p-4 rounded-xl flex-1">
            <p className="text-sm md:text-lg lg:text-2xl text-[#1C39BB] text-center">
              {dates.pahlaviYear}
            </p>
            <p className="text-lg md:text-xl lg:text-4xl text-[#32127A] text-center mt-2">
              هخامنشی
            </p>
            <p className="text-md md:text-4xl lg:text-5xl text-[#1C39BB]">
              {getTodayPersianName()}
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row mt-4 space-y-4 md:space-y-0 md:space-x-4">
          <div className="bg-[#FFFFFF] p-4 rounded-xl flex-1">
            <p className="text-sm md:text-lg lg:text-2xl text-[#1C39BB] text-center">
              {dates.IranianDiako}
            </p>
            <p className="text-lg md:text-xl lg:text-4xl text-[#32127A] text-center mt-2">
              مادی
            </p>
            <p className="text-md md:text-4xl lg:text-5xl text-[#1C39BB]">
              {getTodayPersianName()}
            </p>
          </div>
          <div className="bg-[#FFFFFF] p-4 rounded-xl flex-1">
            <p className="text-sm md:text-lg lg:text-2xl text-[#1C39BB] text-center">
              {dates.jalaliDate}
            </p>
            <p className="text-lg md:text-xl lg:text-4xl text-[#32127A] text-center mt-2">
              هجری
            </p>
            <p className="text-md md:text-4xl lg:text-5xl text-[#1C39BB]">
              {getTodayHejriName()}
            </p>
          </div>
          <div className="bg-[#FFFFFF] p-4 rounded-xl flex-1">
            <p className="text-sm md:text-lg lg:text-2xl text-[#1C39BB] text-center">
              {dates.europeanDate}
            </p>
            <p className="text-lg md:text-xl lg:text-4xl text-[#32127A] text-center mt-2">
              میلادی
            </p>
            <p className="text-md md:text-4xl lg:text-5xl text-[#1C39BB]">
              {getTodayGeorgianName()}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
