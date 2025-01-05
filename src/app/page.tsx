// src/app/page.tsx

'use client';

import { useState, useRef } from 'react';
import ClocksPage from '@/components/ClocksPageMiniForMobile/ClocksPageMiniForMobile';
import JustDateWhiteApp from '@/components/JustDateWhiteApp/JustDateWhiteApp';
import ClocksModal from '@/components/ClocksModal/ClocksModal';
import Occasions from './Farakhor6Days/page';
import '../styles/globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { CalendarProvider } from '@/contexts/CalendarContext';
import jalaali from 'jalaali-js';

// Dynamic imports
const SmallCalendarIframe = dynamic(
  () => import('./smallCalendarIframe/page'),
  {
    ssr: false,
  }
);
const FarakhorMobileDarkIframe = dynamic(
  () => import('./FarakhorMobileDarkIframe/page'),
  { ssr: false }
);

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const occasionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const today = new Date();
  const jToday = jalaali.toJalaali(today);

  const handleCalendarClick = () => {
    router.push('/smallCalendarMobile');
  };

  const handleClockClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className='p-3 bg-[#333863] min-h-screen relative overflow-hidden'>
      <SpeedInsights />

      {/* Clock and date section */}
      <div className='relative bg-[#51546C] rounded-lg p-4 flex items-center overflow-hidden mb-8'>
        <div
          className='relative flex space-x-1 z-10'
          onClick={handleClockClick}
        >
          <ClocksPage />
        </div>
        <div className='absolute right-0 mr-4 z-20 text-right' dir='rtl'>
          <div
            className='flex flex-col items-end'
            onClick={handleCalendarClick}
          >
            <JustDateWhiteApp />
            <div
              className='text-white text-[17px] mt-1 ml-[30px] fontXXX'
              dir='ltr'
            >
              {today.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>
        <div className='bg-pattern'>
          <div className='w-[150px] h-[150px] custom-border ml-[-45px]'></div>
          <div className='w-[150px] h-[150px] custom-border ml-[290px]'></div>
        </div>
      </div>

      {/* Upcoming days title */}
      <h1 className='text-white text-xl mb-6' dir='rtl'>
        روزهای برجسته پیش رو :
      </h1>

      <ClocksModal isOpen={isModalOpen} onClose={handleCloseModal} />

      {/* Content section */}
      <div className='mt-4'>
        {/* Mobile view */}
        <div className='block lg:hidden'>
          <Occasions />
        </div>

        {/* Desktop view */}
        <CalendarProvider>
          <div className='hidden lg:flex w-full gap-6 px-4'>
            <div className='w-3/4'>
              <FarakhorMobileDarkIframe />
            </div>
            <div className='w-1/4'>
              <SmallCalendarIframe />
            </div>
          </div>
        </CalendarProvider>
      </div>
    </main>
  );
};

export default Home;
