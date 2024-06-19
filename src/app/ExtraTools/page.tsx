'use client';
import { useState } from 'react';
import Link from 'next/link';
import GeneralModal from '@/components/GeneralModal/GeneralModal';
import Image from 'next/image';
import ClocksPageMobile from '../ClocksPageMobile/page';

const ExtraTools = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | string>('');

  const handleOpenModal = (content: JSX.Element | string) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  return (
    <main className='flex flex-col items-center min-h-screen px-2 py-3 bg-[#333863] md:px-8 pb-12'>
      <div className='w-full max-w-md space-y-3 py-3 p-2'>
        <div
          className='bg-[#7F84B4] rounded-2xl p-3 text-white flex items-center justify-between h-20'
          onClick={() => handleOpenModal('تماس ')}
        >
          <Image
            src={'/assets/contact.png'}
            alt='گاه نامه'
            width={40}
            height={40}
          />
          <span>تماس با گاه‌شمار</span>
        </div>
        <Link
          href='https://www.instagram.com/gahshomar.iran/?igsh=MW52MHcwcWpnY2QyNA%3D%3D'
          legacyBehavior
          passHref
        >
          <a className='bg-[#7F84B4] rounded-2xl p-3 text-white flex items-center justify-between h-20'>
            <Image
              src={'/assets/insta.png'}
              alt='گاه نامه'
              width={40}
              height={40}
            />
            <span>اینستاگرام</span>
          </a>
        </Link>
        <div
          className='bg-[#7F84B4] rounded-2xl p-3 text-white flex items-center justify-between h-20'
          onClick={() => handleOpenModal(<ClocksPageMobile />)}
        >
          <Image
            src={'/assets/clock.png'}
            alt='گاه نامه'
            width={40}
            height={40}
          />
          <span>ساعت های جهانی</span>
        </div>
        <Link href='/gahshomaranDark' legacyBehavior passHref>
          <a className='bg-[#7F84B4] rounded-2xl p-3 text-white flex items-center justify-between h-20'>
            <Image
              src={'/assets/calendaerIcon.png'}
              alt='سرآغازها'
              width={40}
              height={40}
            />
            <span>سرآغازها</span>
          </a>
        </Link>
        <div
          className='bg-[#7F84B4] rounded-2xl p-3 text-white flex items-center justify-between h-20'
          onClick={() => handleOpenModal('تبدیل تاریخ')}
        >
          <Image
            src={'/assets/Replay.png'}
            alt='تبدیل تاریخ'
            width={40}
            height={40}
          />
          <span>تبدیل تاریخ</span>
        </div>

        <div
          className='flex flex-col items-center justify-start flex-grow mt-16 min-w-40'
          onClick={() => handleOpenModal('گاه نامه')}
        >
          <Image
            src={'/assets/gahname.png'}
            alt='گاه نامه'
            width={370}
            height={150}
          />
        </div>
      </div>

      {isModalOpen && (
        <GeneralModal isOpen={isModalOpen} onClose={handleCloseModal}>
          {modalContent}
        </GeneralModal>
      )}
    </main>
  );
};

export default ExtraTools;
