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
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-[#C6FAF7] px-2 sm:px-4 md:px-8">
      <div className="w-full flex flex-col items-center px-2 py-4 md:py-8 rounded-lg bg-white shadow-xl md:shadow-2xl lg:shadow-4xl min-h-screen">
        {/* Tab Headers */}
        <div className="flex w-full justify-around mb-2 md:mb-4 text-xs md:text-sm lg:text-base xl:text-lg">
          <Tab name="ساعت شمار" />
          <Tab name="گاهشمار" />
          <Tab name="روزهای ماه" />
        </div>

        {/* Content based on activeTab */}
        {activeTab === 'ساعت شمار' && (
          <div className="flex flex-col justify-center items-center w-full my-4 lg:my-12">
            {!showClocks ? (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 w-full">
                {/* Assuming you want the spinner to take full height */}
                <div className="spinner"> Wait for clocks</div>
                {/* Loading icon */}
              </div>
            ) : (
              <div className="flex flex-wrap justify-around items-center w-full">
                <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/5">
                  <div className="text-black text-sm md:text-xl pb-2">
                    Local Time
                  </div>
                  {/* <div className="w-[200px]"> */}
                  <ReactClock
                    timeZone="Europe/Berlin"
                    size={determineClockSize()}
                  />
                  {/* </div> */}
                  <div className="text-black text-lg md:text-4xl pt-3">
                    وقت محلی
                  </div>
                </div>
                <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/5">
                  <div className="text-black text-sm md:text-xl pb-2">
                    Los Angeles
                  </div>
                  <ReactClock
                    timeZone="America/Los_Angeles"
                    size={determineClockSize()}
                  />
                  <div className="text-black text-lg md:text-4xl pt-3">
                    لس آنجلس
                  </div>
                </div>
                <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/5">
                  <div className="text-black text-sm md:text-xl pb-2">
                    New York
                  </div>
                  <ReactClock
                    timeZone="America/New_York"
                    size={determineClockSize()}
                  />
                  <div className="text-black text-lg md:text-4xl pt-3">
                    نیویورک
                  </div>
                </div>
                <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/5">
                  <div className="text-black text-sm md:text-xl pb-2">
                    London
                  </div>
                  <ReactClock
                    timeZone="Europe/London"
                    size={determineClockSize()}
                  />
                  <div className="text-black text-lg md:text-4xl pt-3">
                    لندن
                  </div>
                </div>
                <div className="flex flex-col items-center mb-4 w-1/2 md:w-1/5">
                  <div className="text-black text-sm md:text-xl pb-2">
                    Tehran
                  </div>
                  <ReactClock
                    timeZone="Asia/Tehran"
                    size={determineClockSize()}
                  />
                  <div className="text-black text-lg md:text-4xl pt-3">
                    تهران
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'گاهشمار' && (
          <div className="space-y-2 md:space-y-4 w-full">
            <div className="text-center bg-[#92E6DF] py-4 md:py-8 rounded-2xl mt-6 md:mt-24">
              <h2 className="text-4xl md:text-5xl lg:text-6xl text-[#32127A] pb-4 md:pb-8">
                ایران نو
              </h2>
              <p className="text-3xl md:text-4xl lg:text-5xl text-[#1C39BB] pb-2 md:pb-3">
                {dates.IraniMelli}
              </p>
              <p className="text-3xl md:text-4xl lg:text-5xl text-[#1C39BB]">
                {getTodayPersianName()}
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4">
              <div className="bg-[#92E6DF] p-2 sm:p-4 rounded-2xl flex-1 flex flex-col items-center w-full">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl text-[#32127A] pb-3 sm:pb-4 lg:pb-6">
                  هجری
                </h3>
                <p className="text-xl sm:text-2xl lg:text-3xl text-[#1C39BB]">
                  {dates.jalaliDate}
                </p>
              </div>

              <div className="bg-[#92E6DF] p-2 sm:p-4 rounded-2xl flex-1 flex flex-col items-center w-full">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl text-[#32127A] pb-3 sm:pb-4 lg:pb-6">
                  میلادی
                </h3>
                <p className="text-xl sm:text-2xl lg:text-3xl text-[#1C39BB]">
                  {dates.europeanDate}
                </p>
              </div>

              <div className="bg-[#92E6DF] p-2 sm:p-4 rounded-2xl flex-1 text-center w-full">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl text-[#32127A] pb-3 sm:pb-4 lg:pb-6">
                  مادی
                </h3>
                <p className="text-xl sm:text-2xl lg:text-3xl text-[#1C39BB]">
                  {dates.IranianDiako}
                </p>
              </div>

              <div className="bg-[#92E6DF] p-2 sm:p-4 rounded-2xl flex-1 text-center w-full">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl text-[#32127A] pb-3 sm:pb-4 lg:pb-6">
                  هخامنشی
                </h3>
                <p className="text-xl sm:text-2xl lg:text-3xl text-[#1C39BB]">
                  {dates.pahlaviYear}
                </p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'روزهای ماه' && (
          <div className="flex flex-col items-center justify-center mt-4 lg:mt-12 w-full">
            <PersianCalendar
              IraniMelli={dates.IraniMelli}
              NameOfTheDay={getTodayPersianName()}
            />
          </div>
        )}
      </div>
    </main>
  );
}
