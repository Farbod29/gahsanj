// src/app/page.tsx
'use client';

import ClocksPage from '@/components/ClocksPageMiniForMobile/ClocksPageMiniForMobile';
import JustDateWhite from '@/components/JustDateWhite/JustDateWhite';

import Barjaste from './Barjaste/page';

interface Occasion {
  DayNumber: number;
  PersianDayNumber: string;
  GeorgianDay: string;
  Month: string;
  EventTitle: string;
  ShortTitle: string;
  ModalStatus: boolean;
  Text: string;
  Logo: string;
  ModalImageLink: string;
  ExtraLinks: string[];
}

const Home = () => {
  return (
    <main className="p-4 bg-[#333863] min-h-screen">
      <h1 className="text-white text-3xl mb-4 mr-3 mt-4" dir="rtl">
        تاریخ امروز
      </h1>
      <div className="relative bg-[#51546C] rounded-lg p-4 flex items-center overflow-hidden">
        <div className="relative flex space-x-4 z-10">
          <ClocksPage />
        </div>
        <div className="ml-28 z-20 mb-6 mt-6">
          <JustDateWhite />
        </div>
        {/* Background Pattern */}
        <div className="bg-pattern">
          <div className="w-[150px] h-[150px] custom-border"></div>
          <div className="w-[150px] h-[150px] custom-border ml-[200px] "></div>
        </div>

        {/* Orange Circles */}

        {/* Text */}
        <div className="relative ml-4 text-white z-10">
          {/* <h1 className="text-2xl font-bold">۲۱ اردیبهشت</h1>
          <p className="text-lg">کیوان روز (آدینه)</p> */}
        </div>
      </div>
      <h1 className="text-white text-3xl mt-4" dir="rtl">
        برجسته های پبش رو
      </h1>
      <Barjaste />
    </main>
  );
};

export default Home;
