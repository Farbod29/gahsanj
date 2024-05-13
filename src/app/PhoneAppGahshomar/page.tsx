'use client';
import { useEffect, useState } from 'react';
import jalaali from 'jalaali-js';
import Link from 'next/link';

//import logo from 'Users/farbodaprin/Desktop/iranian-gah-shomar2/public/assets/logo-gahshomar-yellow.png';

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

const monthIndices: { [key: string]: string } = {
  '۰۱': 'فروردین',
  '۰۲': 'اردیبهشت',
  '۰۳': 'خرداد',
  '۰۴': 'تیر',
  '۰۵': 'مرداد',
  '۰۶': 'شهریور',
  '۰۷': 'مهر',
  '۰۸': 'آبان',
  '۰۹': 'آذر',
  '۱۰': 'دی',
  '۱۱': 'بهمن',
  '۱۲': 'اسفند',
};

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
  function getMonthName(monthNumber: string): string | null {
    const monthName = monthIndices[String(monthNumber)];
    return typeof monthName === 'string' ? monthName : null;
  }
  const [PersianWeekday, setPersianWeekday] = useState('');
  const [hejriweekday, setHejriWeekday] = useState('');
  const [Georgianweekday, setGeorgianWeekday] = useState('');

  const today = new Date();
  const jToday = jalaali.toJalaali(today);
  const [currentPersianMonth, setCurrentPersianMonth] = useState('');
  //const [currentPersianMonth, setCurrentPersianMonth] = useState<string | null>(
  const [currentLatinMonth, setCurrentLatinMonth] = useState('');
  const [activeTab, setActiveTab] = useState('گاهشمار'); // State to track active tab
  const [dates, setDates] = useState({
    europeanDate: '',
    Jdate: '',
    pahlaviYear: '',
    IranianDiako: '',
    IraniMithra: '',
    IraniMelli: '',
    ilami: '',
  });

  useEffect(() => {
    const today = new Date();
    setDates({
      europeanDate: today.toLocaleDateString('en-GB'),
      Jdate: convertToJalali(today),
      pahlaviYear: convertToPahlavi(today),
      IranianDiako: convertToIranianDiako(today),
      IraniMithra: convertToIraniMithra(today),
      IraniMelli: convertToIraniMelli(today),
      ilami: convertToIlami(today),
    });
  }, []);

  function getJanaliMonth(date: Date): string {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    const monthName = jalaaliMonths[jm - 1]; // Get the month name
    const JdateString = toPersianNums(
      `${jy}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
    );
    return monthName;
  }

  function convertToJalali(date: Date): string {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    const monthName = jalaaliMonths[jm - 1]; // Get the month name
    const JdateString = toPersianNums(
      `${jy}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
    );
    return JdateString;
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
    Sunday: ' مهر شید ',
    Monday: '  مهشید ',
    Tuesday: ' بهرام شید ',
    Wednesday: ' تیر شید ',
    Thursday: ' اورمزد شید',
    Friday: ' (ناهید شید (آدینه', // or 'ناهید شید' depending on your preference
    Saturday: '  کیوان شید',
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

  function extractMonth(dateString: string): string | null {
    // Split the date string by "/"
    const components = dateString.split('/');

    // Access the second element (index 1) of the components array
    const monthNumber = components[1];

    // Pass the month number to the getMonthName function
    return getMonthName(monthNumber);
  }

  useEffect(() => {
    // Extract the month name when the component mounts
    // const monthName = extractMonth(dates.IraniMelli) || '';
    // setCurrentPersianMonth(monthName);
    const today = new Date();
    const monthName = getJanaliMonth(today); // This will be an array e.g., ['اردیبهشت']
    // const monthName = monthArray[0];
    console.log(monthName);
    setCurrentPersianMonth(monthName);
  }, []);

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
  }); // Empty dependency array means this effect runs once on mount

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
              PersianMonth: currentPersianMonth,
            },
          }}
        >
          <div className=" bg-[#FFFFFF] p-3 rounded-xl cursor: pointer hover:bg-[#dce4ff]">
            <p className="text-sm md:text-lg lg:text-xl text-[#1C39BB] text-center">
              {dates.IraniMelli}
            </p>
            <p className="text-lg md:text-xl lg:text-2xl text-[#32127A] text-center mt-2">
              ایران نو
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl text-[#1C39BB]">
              {getTodayPersianName()}
            </p>
          </div>
        </Link>
        <div className="w-full flex flex-col md:flex-row mt-2 md:mt-8 space-y-3 md:space-y-0 md:space-x-4">
          <Link
            href={{
              pathname: '/DownloadImage',
              query: {
                paramDates: dates.ilami,
                paramName: 'عیلامی',
                PersianWeekday: PersianWeekday,
                PersianMonth: currentPersianMonth,
              },
            }}
          >
            <div
              className="bg-[#FFFFFF] p-3 rounded-xl flex-1 cursor-pointer hover:bg-[#dce4ff] mt-2 md:mt-0 md:ml-0"
              // onClick={() => handleBoxClick(dates.ilami, getTodayPersianName())}
            >
              <p className="text-sm md:text-lg lg:text-xl text-[#1C39BB] text-center">
                {dates.ilami}
              </p>
              <p className="text-lg md:text-xl lg:text-2xl text-[#32127A] text-center mt-2">
                عیلامی
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl text-[#1C39BB]">
                {getTodayPersianName()}
              </p>
            </div>
          </Link>
          <Link
            href={{
              pathname: '/DownloadImage',
              query: {
                paramDates: dates.pahlaviYear,
                paramName: 'هخامنشی',
                PersianWeekday: PersianWeekday,
                PersianMonth: currentPersianMonth,
              },
            }}
          >
            <div className="bg-[#FFFFFF] p-3 rounded-xl flex-1 cursor-pointer hover:bg-[#dce4ff] mt-2 md:mt-0">
              <p className="text-sm md:text-lg lg:text-xl text-[#1C39BB] text-center">
                {dates.pahlaviYear}
              </p>
              <p className="text-lg md:text-xl lg:text-2xl text-[#32127A] text-center mt-2">
                هخامنشی
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl text-[#1C39BB]">
                {getTodayPersianName()}
              </p>
            </div>
          </Link>
        </div>
        <div className="w-full flex flex-col md:flex-row mt-4 space-y-4 md:space-y-0 md:space-x-4">
          <Link
            href={{
              pathname: '/DownloadImage',
              query: {
                paramDates: dates.IranianDiako,
                paramName: 'مادی',
                PersianWeekday: PersianWeekday,
                PersianMonth: currentPersianMonth,
              },
            }}
          >
            <div className="bg-[#FFFFFF] p-3 rounded-xl flex-1 cursor-pointer hover:bg-[#dce4ff] mt-0 md:mt-0">
              <p className="text-sm md:text-lg lg:text-xl text-[#1C39BB] text-center">
                {dates.IranianDiako}
              </p>
              <p className="text-lg md:text-xl lg:text-2xl text-[#32127A] text-center mt-0">
                مادی
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl text-[#1C39BB]">
                {getTodayPersianName()}
              </p>
            </div>
          </Link>
          <Link
            href={{
              pathname: '/DownloadImage',
              query: {
                paramDates: dates.Jdate,
                paramName: 'هجری',
                PersianWeekday: PersianWeekday,
                PersianMonth: currentPersianMonth,
              },
            }}
          >
            <div className="bg-[#FFFFFF] p-3 rounded-xl flex-1 cursor-pointer hover:bg-[#dce4ff] mt-0 md:mt-0">
              <p className="text-sm md:text-lg lg:text-xl text-[#1C39BB] text-center">
                {dates.Jdate}
              </p>
              <p className="text-lg md:text-xl lg:text-2xl text-[#32127A] text-center mt-0">
                هجری
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl text-[#1C39BB]">
                {getTodayHejriName()}
              </p>
            </div>
          </Link>
          <Link
            href={{
              pathname: '/DownloadImage',
              query: {
                paramDates: dates.europeanDate,
                paramName: 'میلادی',
                PersianWeekday: PersianWeekday,
                PersianMonth: currentPersianMonth,
              },
            }}
          >
            <div className="bg-[#FFFFFF] p-3 rounded-xl flex-1 cursor-pointer hover:bg-[#dce4ff] mt-0 md:mt-0">
              <p className="text-sm md:text-lg lg:text-xl text-[#1C39BB] text-center">
                {dates.europeanDate}
              </p>
              <p className="text-lg md:text-xl lg:text-2xl text-[#32127A] text-center mt-0">
                میلادی
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl text-[#1C39BB]">
                {getTodayGeorgianName()}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
