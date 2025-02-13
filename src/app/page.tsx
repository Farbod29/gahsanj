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
import SmallCalendarIframe from '../components/SmallCalendarIframe/page';
import FarakhorMobileDarkIframe from '../components/FarakhorMobileDarkIframe/page';

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
      <div className='relative bg-[#51546C] rounded-lg p-2 flex items-center justify-between overflow-hidden mb-1 min-h-[120px] sm:min-h-[140px] lg:min-h-[160px]'>
        <div
          className='relative flex space-x-1 z-10 cursor-pointer hover:opacity-90 transition-opacity'
          onClick={handleClockClick}
        >
          <ClocksPage />
        </div>
        <div className='flex flex-col items-center justify-center absolute left-1/2 transform -translate-x-1/2 w-[110px] sm:w-[140px] lg:w-[140px]'>
          <Image
            src='/assets/logo-gahshomar-yellow2.png'
            alt='گاه سنج'
            width={110}
            height={110}
            className='w-full h-auto'
            priority
          />
        </div>
        <div className='z-20 text-right' dir='rtl'>
          <div
            className='flex flex-col items-end cursor-pointer hover:opacity-90 transition-opacity'
            onClick={handleCalendarClick}
          >
            <JustDateWhiteApp />
          </div>
        </div>
        <div className='bg-pattern absolute inset-0'>
          <div className='w-[150px] h-[150px] custom-border left-[-45px] absolute'></div>
          <div className='w-[150px] h-[150px] custom-border right-[-45px] absolute'></div>
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

      {/* Dummy content for extra scrolling */}
      <div className='w-full flex flex-col items-center justify-center mt-10 mb-10 text-white/80 text-sm px-4'>
        <div className='max-w-2xl text-center space-y-2'>
          <h3 className='text-lg font-semibold mb-4'>درباره گاه سنج </h3>
          <p>
            گاه سنج یک تقویم هوشمند است که رویدادهای مهم و مناسبت‌های ایرانی را
            به شما یادآوری می‌کند.
          </p>
          <p>
            با استفاده از گاه سنج می‌توانید از تمامی مناسبت‌ها و رویدادهای مهم
            مطلع شوید.
          </p>
          <p>
            همچنین می‌توانید رویدادهای شخصی خود را ثبت کنید و در زمان مناسب
            یادآوری دریافت کنید.
          </p>
          <div className='h-20'></div>
          <p className='text-xs opacity-50'>
            تمامی حقوق برای گاه سنج محفوظ است © {new Date().getFullYear()}
          </p>
        </div>
      </div>
      <div className='w-full h-60'></div>
    </main>
  );
};

export default Home;
