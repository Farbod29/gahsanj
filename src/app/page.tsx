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
  const persianWeekdays = {
    Sunday: '(یکشنبه) خورشید (مهر) روز',
    Monday: '( دوشنبه) ماه روز',
    Tuesday: ' ( سه شنبه)بهرام روز',
    Wednesday: '( چهار شنبه) تیر روز ',
    Thursday: '( پنج شنبه)اورمزد روز',
    Friday: '(جمعه)آدینه', // or 'ناهید روز' depending on your preference
    Saturday: '(شنبه) کیوان روز',
  };

  const getTodayPersianName = () => {
    const gregorianWeekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const today = new Date();
    const todayName = gregorianWeekdays[today.getDay()];
    return persianWeekdays[todayName];
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-600">
      <div className="flex flex-col space-y-8 rounded-lg p-8 shadow-4xl bg-white w-full max-w-3xl md:max-w-4xl lg:max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between bg-[#92E6DF]">
          {/* Logo container */}
          <div className="relative w-full md:w-[400px] h-[200px] mb-5 md:mb-0">
            <Image
              src="/assets/logo-gahshomar-yellow.png"
              alt="Gahshomar Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>

          {/* Blue rectangle container */}
          <div className="hidden md:block bg-blue-500 w-[262px] h-[97px]"></div>
        </div>

        <div className="text-center">
          <div className="flex flex-wrap justify-around items-center w-full my-12">
            <div className="text-center mb-5 w-1/2 md:w-auto">
              <div className="text-black">Local Time</div>
              <ReactClock timeZone="Europe/Berlin" />
              <div className="text-black text-4xl">وقت محلی</div>
            </div>
            <div className="text-center mb-5 w-1/2 md:w-auto">
              <div className="text-black">Los Angeles</div>
              <ReactClock timeZone="America/Los_Angeles" />
              <div className="text-black text-4xl">لس آنجلس</div>
            </div>
            <div className="text-center mb-5 w-1/2 md:w-auto">
              <div className="text-black">New York</div>
              <ReactClock timeZone="America/New_York" />
              <div className="text-black text-4xl">نیویورک</div>
            </div>
            <div className="text-center mb-5 w-1/2 md:w-auto">
              <div className="text-black">London</div>
              <ReactClock timeZone="Europe/London" />
              <div className="text-black text-4xl">لندن</div>
            </div>
            <div className="text-center w-1/2 md:w-auto">
              <div className="text-black">Tehran</div>
              <ReactClock timeZone="Asia/Tehran" />
              <div className="text-black text-4xl">تهران</div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-[#92E6DF] pt-8 mt-30 rounded flex-col">
              <h2 className="text-6xl text-blue-900"> نوین فرهنگ </h2>
              <p className="text-5xl text-blue-700">{dates.IraniMelli}</p>
              <p className="text-5xl text-blue-700">{getTodayPersianName()}</p>
            </div>
            <div className="bg-[#92E6DF] p-1 rounded">
              <h2 className="text-7xl mt-8 mb-1 text-blue-900">کورش کبیر</h2>
              <p className="text-5xl text-blue-700">{dates.pahlaviYear}</p>
            </div>
            <div className="bg-[#92E6DF] p-4 rounded">
              <h2 className="text-6xl mt-8 text-blue-900">
                امپراطوری ماد دیاکو
              </h2>
              <p className="text-5xl text-blue-700">{dates.IranianDiako}</p>
            </div>
            <div className="bg-[#92E6DF] p-4 rounded">
              <h2 className="text-6xl text-blue-900">میلادی</h2>
              <p className="text-5xl text-blue-700">{dates.europeanDate}</p>
            </div>
            <div className="bg-[#92E6DF] pt-8 mt-30 rounded">
              <h2 className="text-6xl text-blue-900">شمسی</h2>
              <p className="text-5xl text-blue-700">{dates.jalaliDate}</p>
            </div>
            <div className="bg-[#92E6DF] pt-8 mt-30 rounded">
              <h2 className="text-6xl text-blue-900"> نوین فرهنگ </h2>
              <p className="text-5xl text-blue-700">{dates.IraniMelli}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-12">
            <PersianCalendar />
          </div>
          <div> فراخور های پیش رو</div>
        </div>
      </div>
    </main>
  );
}
