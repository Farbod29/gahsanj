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

export default function Home() {
  // Helper component for rendering tabs
  const Tab = ({ name }: { name: string }) => (
    <button
      className={`p-3 rounded-lg  hover:bg-blue-700 ${
        activeTab === name ? 'bg-blue-500 text-white' : 'bg-gray-200'
      }`}
      onClick={() => setActiveTab(name)}
    >
      {name}
    </button>
  );

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
    const today = new Date();
    setDates({
      europeanDate: toPersianNums(today.toLocaleDateString('en-GB')),
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
    Sunday: '(یکشنبه) خورشید (مهر) روز',
    Monday: '( دوشنبه) ماه روز',
    Tuesday: ' ( سه شنبه)بهرام روز',
    Wednesday: '( چهار شنبه) تیر روز ',
    Thursday: '( پنج شنبه)اورمزد روز',
    Friday: '(جمعه)آدینه', // or 'ناهید روز' depending on your preference
    Saturday: '(شنبه) کیوان روز',
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-600">
      <div className="w-full max-w-6xl flex flex-col items-center p-8 rounded-lg bg-white shadow-4xl h-[750px]">
        {/* Tab Headers */}
        <div className="flex w-full justify-around mb-4 text-2xl rounded-xl">
          <Tab name="ساعت شمار" />
          <Tab name="گاهشمار" />
          <Tab name="روزهای ماه" />
        </div>

        {/* Content based on activeTab */}
        {activeTab === 'ساعت شمار' && (
          <div className="flex flex-col justify-center items-center w-full my-12 h-full">
            {' '}
            {/* Use h-full or set a specific height */}
            {/* Clocks */}
            <div className="flex justify-around items-center w-full">
              <div className="flex flex-col items-center mb-5 w-full md:w-1/5">
                <div className="text-black text-xl pb-3">Local Time</div>
                <ReactClock timeZone="Europe/Berlin" />
                <div className="text-black text-4xl pt-5">وقت محلی</div>
              </div>
              <div className="flex flex-col items-center mb-5 w-full md:w-1/5">
                <div className="text-black text-xl pb-3">Los Angeles</div>
                <ReactClock timeZone="America/Los_Angeles" />
                <div className="text-black text-4xl pt-5">لس آنجلس</div>
              </div>
              <div className="flex flex-col items-center mb-5 w-full md:w-1/5">
                <div className="text-black text-xl pb-3">New York</div>
                <ReactClock timeZone="America/New_York" />
                <div className="text-black text-4xl pt-5">نیویورک</div>
              </div>
              <div className="flex flex-col items-center mb-5 w-full md:w-1/5">
                <div className="text-black text-xl pb-3">London</div>
                <ReactClock timeZone="Europe/London" />
                <div className="text-black text-4xl pt-5">لندن</div>
              </div>
              <div className="flex flex-col items-center mb-5 w-full md:w-1/5">
                <div className="text-black text-xl pb-3">Tehran</div>
                <ReactClock timeZone="Asia/Tehran" />
                <div className="text-black text-4xl pt-5">تهران</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'گاهشمار' && (
          <div className="space-y-6 ">
            <div className="text-center bg-[#92E6DF] py-8 rounded-2xl mt-24">
              <h2 className="text-6xl text-blue-900 pb-8">نوین فرهنگ</h2>
              <p className="text-5xl text-blue-700 pb-3">{dates.IraniMelli}</p>
              <p className="text-5xl text-blue-700">{getTodayPersianName()}</p>
            </div>

            <div className="flex justify-center items-center space-x-4">
              <div className="bg-[#92E6DF] p-4  rounded-2xl">
                <h3 className="text-4xl text-blue-900 pb-6">شمسی</h3>
                <p className="text-3xl text-blue-700">{dates.jalaliDate}</p>
              </div>
              <div className="bg-[#92E6DF] p-4 rounded-2xl items-center">
                <h3 className="text-4xl text-blue-900 pb-6 pl-6">میلادی</h3>
                <p className="text-3xl text-blue-700">{dates.europeanDate}</p>
              </div>

              <div className="bg-[#92E6DF] p-4 rounded-2xl">
                <h3 className="text-4xl text-blue-900 pb-6 text-center">
                  پادشاهی دیاکو ماد
                </h3>
                <p className="text-3xl text-blue-700 text-center">
                  {dates.IranianDiako}
                </p>
              </div>
              <div className="bg-[#92E6DF] p-4 rounded-2xl">
                <h3 className="text-4xl text-blue-900 pb-6 text-center">
                  کورش کبیر (منشور پادشاهی)
                </h3>
                <p className="text-3xl text-blue-700 text-center">
                  {dates.pahlaviYear}
                </p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'روزهای ماه' && (
          <div className="flex flex-col items-center justify-center mt-12">
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
