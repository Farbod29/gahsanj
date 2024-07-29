// src/app/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import ClocksPage from '@/components/ClocksPageMiniForMobile/ClocksPageMiniForMobile';
import JustDateWhiteApp from '@/components/JustDateWhiteApp/JustDateWhiteApp';
import ClocksModal from '@/components/ClocksModal/ClocksModal';
import Occasions from './Farakhor7Days/page';
import '../styles/globals.css'; // Ensure you import the global CSS

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const occasionsRef = useRef(null);

  const handleClockClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleScroll = () => {
    if (occasionsRef.current) {
      const scrollTop = occasionsRef.current.scrollTop;
      setIsScrolled(scrollTop > 0);
    }
  };

  useEffect(() => {
    const occasionsEl = occasionsRef.current;
    if (occasionsEl) {
      occasionsEl.addEventListener('scroll', handleScroll);
      return () => {
        occasionsEl.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <main className='p-4 bg-[#333863] min-h-screen relative overflow-hidden'>
      <div
        className={`absolute top-0 left-0 right-0 p-4 bg-[#333863] ${isScrolled ? 'scroll-shadow' : ''}`}
      >
        <h1 className='text-white text-[16px] mb-4 mr-3 mt-4' dir='rtl'>
          تاریخ امروز
        </h1>

        <div className='relative bg-[#51546C] rounded-lg p-0 flex items-center overflow-hidden'>
          <div
            className='relative flex space-x-1 z-10 ml-3'
            onClick={handleClockClick}
          >
            <ClocksPage />
          </div>
          <div className='absolute right-0 mr-4 z-20 text-right' dir='rtl'>
            <div className='flex flex-col items-end'>
              <JustDateWhiteApp />
              <div
                className='text-white text-[17px] mt-1 ml-[70px] fontXXX'
                dir='ltr'
              >
                {new Date().toLocaleDateString('en-GB', {
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
          <div className='relative ml-4 text-white z-10'></div>
        </div>

        <h1 className='text-white text-xl mt-4 mr-4 ' dir='rtl'>
          برجسته های پیش رو :
        </h1>
      </div>

      <ClocksModal isOpen={isModalOpen} onClose={handleCloseModal} />

      <div
        className={`absolute top-[280px] bottom-0 left-0 right-0 overflow-y-auto ${isScrolled ? 'scroll-shadow' : ''}`}
        ref={occasionsRef}
      >
        <Occasions />
      </div>
    </main>
  );
};

export default Home;
