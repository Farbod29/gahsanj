// src/app/page.tsx
'use client';

import ClocksPage from '@/components/ClocksPageMiniForMobile/ClocksPageMiniForMobile';
import JustDateWhite from '@/components/JustDateWhite/JustDateWhite';

import Barjaste from './Barjaste/page';
import JustDateWhiteApp from '@/components/JustDateWhiteApp/JustDateWhiteApp';

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
      <h1 className="text-white text-[16px] mb-4 mr-3 mt-4" dir="rtl">
        تاریخ امروز
      </h1>

      {/* /////////////// */}
      <div className="relative bg-[#51546C] rounded-lg p-1 flex items-center overflow-hidden">
        <div className="relative flex space-x-1 z-10 ml-3">
          <ClocksPage />
        </div>
        <div className="ml-8 z-20 text-[31px]">
          <JustDateWhiteApp />
        </div>
        {/* Background Pattern */}
        <div className="bg-pattern">
          <div className="w-[150px] h-[150px] custom-border"></div>
          <div className="w-[150px] h-[150px] custom-border ml-[200px] "></div>
        </div>
        <div className="relative ml-4 text-white z-10"></div>
      </div>

      {/* /////////////// */}
      <h1 className="text-white text-3xl mt-4" dir="rtl">
        برجسته های پبش رو
      </h1>
      <Barjaste />
    </main>
  );
};

export default Home;
