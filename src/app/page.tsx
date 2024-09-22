// src/app/page.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import ClocksPage from '@/components/ClocksPageMiniForMobile/ClocksPageMiniForMobile';
import JustDateWhiteApp from '@/components/JustDateWhiteApp/JustDateWhiteApp';
import ClocksModal from '@/components/ClocksModal/ClocksModal';
import Occasions from './Farakhor6Days/page';
import '../styles/globals.css'; // Ensure you import the global CSS
import { SpeedInsights } from '@vercel/speed-insights/next';

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
    }
  };

  useEffect(() => {
    const occasionsEl = occasionsRef.current;
    if (occasionsEl) {
      return () => {};
    }
  }, []);

  return (
    <main className='p-3 bg-[#333863] min-h-screen relative overflow-hidden'>
      <SpeedInsights />
      <div
        className={`absolute top-0 left-0 right-0 p-3 bg-[#333863] ${isScrolled ? 'scroll-shadow' : ''}`}
      >
        <div className='w-full flex justify-between items-center'>
          <h1 className='text-gray-300 text-[16px] mb-4 ml-3 mt-3' dir='ltr'>
            𐎥𐎠𐏃𐏁𐎢𐎷𐎠𐎼
          </h1>
          <h1 className='text-white text-[16px] mb-4 mr-3 mt-3' dir='rtl'>
            تاریخ امروز
          </h1>
        </div>

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
                className='text-white text-[17px] mt-1 ml-[30px] fontXXX'
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

        <h1
          className='text-white text-xl mt-8 mr-4 mb-12 z-50 relative pb-8'
          dir='rtl'
        >
          روزهای برجسته پیش رو :
        </h1>

        <style jsx>{`
          @media (min-width: 1024px) {
            h1 {
              display: block;
              margin-top: 20px;
              margin-right: 10px;
              margin-bottom: 20px;
            }
          }
        `}</style>
      </div>

      <ClocksModal isOpen={isModalOpen} onClose={handleCloseModal} />

      <div
        className={`absolute top-[265px] bottom-0 left-0 right-0 overflow-y-auto ${isScrolled ? 'scroll-shadow' : ''}`}
        ref={occasionsRef}
      >
        <Occasions />
      </div>
    </main>
  );
};

export default Home;
