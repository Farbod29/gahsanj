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
      <div className='w-full max-w-md space-y-4 py-3 p-2'>
        <div
          className='bg-[#7F84B4] rounded-2xl p-9 text-white text-end block'
          onClick={() => handleOpenModal('تماس ')}
        >
          <Image
            src={'/assets/contact.png'}
            alt='گاه نامه'
            width={40}
            height={40}
          />
          تماس با گاه‌شمار
        </div>
        <Link
          href='https://www.instagram.com/gahshomar.iran/?igsh=MW52MHcwcWpnY2QyNA%3D%3D'
          legacyBehavior
          passHref
        >
          <a className='bg-[#7F84B4] rounded-2xl p-9 text-white text-end block'>
            <Image
              src={'/assets/insta.png'}
              alt='گاه نامه'
              width={40}
              height={40}
            />
            اینستاگرام
          </a>
        </Link>
        <div
          className='bg-[#7F84B4] rounded-2xl p-11 text-white text-end'
          onClick={() => handleOpenModal(<ClocksPageMobile />)}
        >
          <Image
            src={'/assets/clock.png'}
            alt='گاه نامه'
            width={40}
            height={40}
          />
          ساعت های جهانی
        </div>
        <Link href='/gahshomaranDark' legacyBehavior passHref>
          <a className='bg-[#7F84B4] rounded-2xl p-9 text-white text-end block'>
            <Image
              src={'/assets/clock.png'}
              alt='سرآغازها'
              width={40}
              height={40}
            />
            سرآغازها
          </a>
        </Link>
        <div
          className='bg-[#7F84B4] rounded-2xl p-9 text-white text-end'
          onClick={() => handleOpenModal('تبدیل تاریخ')}
        >
          <Image
            src={'/assets/Replay.png'}
            alt='تبدیل تاریخ'
            width={40}
            height={40}
          />
          تبدیل تاریخ
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
