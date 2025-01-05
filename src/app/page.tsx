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
import Image from 'next/image';

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
  // const [isScrolled, setIsScrolled] = useState<boolean>(false);
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
    <main className='p-1 bg-[#333863] min-h-screen relative overflow-hidden'>
      <SpeedInsights />

      {/* Clock and date section */}
      <div className='relative bg-[#51546C] rounded-lg p-0 flex items-center overflow-hidden mb-1'>
        <div
          className='relative flex space-x-1 z-10'
          onClick={handleClockClick}
        >
          <ClocksPage />
        </div>
        <div className='flex flex-col items-center justify-center mt-1 absolute left-1/2 transform -translate-x-1/2'>
          <Image
            src='/assets/LogoMobile.png'
            alt='گاه شمار'
            width={120}
            height={120}
          />
        </div>
        <div className='absolute right-0 mr-4 z-20 text-right' dir='rtl'>
          <div
            className='flex flex-col items-end'
            onClick={handleCalendarClick}
          >
            <JustDateWhiteApp />
          </div>
        </div>
        <div className='bg-pattern'>
          <div className='w-[150px] h-[150px] custom-border ml-[-45px]'></div>
          <div className='w-[150px] h-[150px] custom-border ml-[290px]'></div>
        </div>
      </div>

      {/* Upcoming days title */}

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
