'use client';

import { useState } from 'react';
import ClocksPage from '@/components/ClocksPageMiniForMobile/ClocksPageMiniForMobile';
import JustDateWhiteApp from '@/components/JustDateWhiteApp/JustDateWhiteApp';
// import Barjaste from './Barjaste/page';
import ClocksModal from '@/components/ClocksModal/ClocksModal';
import Occasions from './Farakhor7Days/page';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClockClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className='p-4 bg-[#333863] min-h-screen'>
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
        <div className='absolute right-16 z-20 text-end' dir='rtl'>
          <JustDateWhiteApp />
        </div>
        <div className='bg-pattern'>
          <div className='w-[150px] h-[150px] custom-border ml-[-45px]'></div>
          <div className='w-[150px] h-[150px] custom-border ml-[290px]'></div>
        </div>
        <div className='relative ml-4 text-white z-10'></div>
      </div>

      <ClocksModal isOpen={isModalOpen} onClose={handleCloseModal} />

      <h1 className='text-white text-xl mt-4 ' dir='rtl'>
        برجسته های پیش رو :
      </h1>
      <Occasions />
    </main>
  );
};

export default Home;

// Add the following CSS styles to your global stylesheet or within a CSS module